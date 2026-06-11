/**
 * product service
 */

import { factories } from '@strapi/strapi';
import slugify from 'slugify';

export default factories.createCoreService('api::product.product', ({ strapi }) => ({
  async scrapeAndSaveProduct(msn: string, options = { scrapeVariants: true }, processed = new Set<string>()) {
    const msnLower = msn.trim().toLowerCase();
    if (processed.has(msnLower)) {
      return { success: true, message: 'Already processed in this session', alreadyProcessed: true, msn: msnLower };
    }
    processed.add(msnLower);

    // Check if the product already exists in the database
    const existingProduct = (await strapi.documents('api::product.product').findFirst({
      filters: {
        $or: [
          { externalId: msnLower },
          { externalId: msnLower.toUpperCase() }
        ]
      }
    })) as any;

    if (existingProduct) {
      console.log(`[Scraper] Product with SKU "${msnLower}" already exists in DB. Skipping...`);
      return {
        success: true,
        productId: existingProduct.id,
        documentId: existingProduct.documentId,
        name: existingProduct.name,
        msn: msnLower,
        status: 'skipped',
        message: 'Product already exists in database'
      };
    }

    console.log(`[Scraper] Starting scrape for SKU/MSN: ${msnLower}`);

    try {
      const response = await fetch(`https://api-gt.moglix.com/api/aggregate/pdpDetailsV2?msn=${msnLower.toUpperCase()}`, {
        headers: {
          'Accept-Encoding': 'identity',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const json = (await response.json()) as any;
      if (!json || !json.status || !json.data) {
        throw new Error(json.message || 'Product details not found in API response');
      }

      const details = json.data;
      const productGroup = details.productGroup;
      if (!productGroup) {
        throw new Error('Product group details not found in API response data');
      }

      // Helper to clean price
      const cleanPrice = (val: any): number => {
        if (typeof val === 'number') return val;
        if (!val) return 0;
        return parseFloat(String(val).replace(/[^0-9.]/g, '')) || 0;
      };

      // 1. Create or link Category Tree
      const breadcrumb = details.breadcrumb || [];
      const categoriesToCreate = breadcrumb.slice(0, -1); // Exclude the product page itself
      const categoryDocIds: string[] = [];
      let parentDocId: string | null = null;

      for (const cat of categoriesToCreate) {
        const catName = cat.categoryName;
        const rawLinkSlug = cat.categoryLink ? cat.categoryLink.split('/').filter(Boolean).pop() : null;
        const slug = rawLinkSlug || slugify(catName, { lower: true, strict: true });

        // Check if category exists
        let category = (await strapi.documents('api::category.category').findFirst({
          filters: {
            $or: [
              { slug: slug },
              { name: catName }
            ]
          },
          populate: ['parent']
        })) as any;

        if (!category) {
          category = (await strapi.documents('api::category.category').create({
            data: {
              name: catName,
              slug: slug,
              parent: parentDocId,
              publishedAt: new Date()
            },
            status: 'published'
          })) as any;
          console.log(`[Scraper] Created Category: "${catName}" (slug: ${slug})`);
        } else if (parentDocId && (!category.parent || category.parent.documentId !== parentDocId)) {
          // Sync parent hierarchy if mismatched
          category = (await strapi.documents('api::category.category').update({
            documentId: category.documentId,
            data: { parent: parentDocId },
            status: 'published'
          })) as any;
        }

        parentDocId = category.documentId;
        categoryDocIds.push(category.documentId);
      }

      // 2. Create or link Brand
      let brandDocId: string | null = null;
      const brandDetails = productGroup.productBrandDetails;
      if (brandDetails && brandDetails.brandName) {
        const brandName = brandDetails.brandName.trim();
        const brandSlug = brandDetails.friendlyUrl || slugify(brandName, { lower: true, strict: true });

        let brand = (await strapi.documents('api::brand.brand').findFirst({
          filters: { name: brandName }
        })) as any;

        if (!brand) {
          brand = (await strapi.documents('api::brand.brand').create({
            data: {
              name: brandName,
              slug: brandSlug,
              publishedAt: new Date()
            },
            status: 'published'
          })) as any;
          console.log(`[Scraper] Created Brand: "${brandName}"`);
        }
        brandDocId = brand.documentId;
      }

      // 3. Map values
      const price = cleanPrice(productGroup.priceQuantityCountry?.sellingPrice || details.productPrice);
      const mrp = cleanPrice(productGroup.priceQuantityCountry?.mrp || details.productMrp);
      const discount = parseInt(String(productGroup.priceQuantityCountry?.discount || details.productDiscount || 0)) ||
        (mrp ? Math.round(((mrp - price) / mrp) * 100) : 0);

      const rating = parseFloat(details.productReviews?.summaryData?.finalAverageRating) ||
        parseFloat(productGroup.productRating) || 0;
      const reviewCount = parseInt(details.productReviews?.summaryData?.reviewCount) || 0;

      // Image mapping
      let mainImageUrl = '';
      if (productGroup.productAllImages && productGroup.productAllImages.length > 0) {
        const firstImg = productGroup.productAllImages[0];
        const imgPath = firstImg.links?.xxlarge || firstImg.links?.default || firstImg.moglixImageNumber;
        if (imgPath) {
          mainImageUrl = imgPath.startsWith('http') ? imgPath : `https://cdn.moglix.com/${imgPath}`;
        }
      }

      const productAllImagesMapped = (productGroup.productAllImages || []).map((img: any) => {
        const links = img.links || {};
        const mappedLinks: any = {};
        for (const key in links) {
          const path = links[key];
          mappedLinks[key] = path && !path.startsWith('http') ? `https://cdn.moglix.com/${path}` : path;
        }
        return {
          ...img,
          links: mappedLinks,
          moglixImageNumber: img.moglixImageNumber && !img.moglixImageNumber.startsWith('http') 
            ? `https://cdn.moglix.com/${img.moglixImageNumber}` 
            : img.moglixImageNumber
        };
      });

      // Specifications
      const specifications: Array<{ key: string; value: string }> = [];
      if (productGroup.productAttributes) {
        for (const key in productGroup.productAttributes) {
          const values = productGroup.productAttributes[key];
          if (Array.isArray(values) && values.length > 0) {
            specifications.push({
              key: key.trim(),
              value: values.join(', ').trim()
            });
          }
        }
      }

      // Features
      let featuresHtml = '';
      if (productGroup.productKeyFeatures && Array.isArray(productGroup.productKeyFeatures)) {
        const activeFeatures = productGroup.productKeyFeatures.filter(Boolean);
        if (activeFeatures.length > 0) {
          featuresHtml = `<ul>${activeFeatures.map(f => `<li>${f}</li>`).join('')}</ul>`;
        }
      }

      // Datasheet PDF
      let pdfUrl = '';
      if (productGroup.productDocumentInfo && productGroup.productDocumentInfo.length > 0) {
        const docUrl = productGroup.productDocumentInfo[0].documentUrl;
        if (docUrl) {
          pdfUrl = docUrl.startsWith('http') ? docUrl : `https://cdn.moglix.com/${docUrl}`;
        }
      }

      // Product variants component list
      const variants: any[] = [];
      const filterAttributes = productGroup.productFilterAttributesList || [];
      for (const attr of filterAttributes) {
        for (const item of attr.items) {
          variants.push({
            name: `${attr.name}: ${item.value}`,
            price: price,
            mrp: mrp,
            discount: discount,
            url: `/product/${slugify(productGroup.productName, { lower: true, strict: true })}-${(item.msn || '').toLowerCase()}`
          });
        }
      }

      // Clean/Unique Slug
      const baseSlug = slugify(productGroup.productName, { lower: true, strict: true });
      const productSlug = `${baseSlug}-${msnLower}`;

      const productData = {
        name: productGroup.productName,
        slug: productSlug,
        description: productGroup.productDescripton || '',
        price: price,
        mrp: mrp,
        discount: discount,
        rating: rating,
        reviewCount: reviewCount,
        mainImageUrl: mainImageUrl,
        pdfUrl: pdfUrl,
        brand: brandDocId,
        categories: categoryDocIds,
        specifications: specifications,
        features: featuresHtml,
        variants: variants,
        externalId: msnLower,
        url: `https://www.moglix.com/${productGroup.productUrl}`,
        productFilterAttributesList: filterAttributes,
        productAllImages: productAllImagesMapped,
        publishedAt: new Date()
      };

      // 4. Find and Upsert Product
      let existingProduct = (await strapi.documents('api::product.product').findFirst({
        filters: {
          $or: [
            { externalId: msnLower },
            { externalId: msnLower.toUpperCase() }
          ]
        }
      })) as any;

      let savedProduct;
      if (existingProduct) {
        savedProduct = await strapi.documents('api::product.product').update({
          documentId: existingProduct.documentId,
          data: productData,
          status: 'published'
        });
        console.log(`[Scraper] Updated product "${productGroup.productName}" (${msnLower})`);
      } else {
        savedProduct = await strapi.documents('api::product.product').create({
          data: productData,
          status: 'published'
        });
        console.log(`[Scraper] Scraped new product "${productGroup.productName}" (${msnLower})`);
      }

      // 5. Auto-scrape variant products recursively if they are not in the database
      if (options.scrapeVariants && filterAttributes.length > 0) {
        const productScraperService: any = strapi.service('api::product.product');
        for (const attr of filterAttributes) {
          for (const item of attr.items) {
            if (item.msn) {
              const varMsn = item.msn.trim().toLowerCase();
              if (varMsn !== msnLower) {
                let existingVar = (await strapi.documents('api::product.product').findFirst({
                  filters: {
                    $or: [
                      { externalId: varMsn },
                      { externalId: varMsn.toUpperCase() }
                    ]
                  }
                })) as any;

                if (!existingVar) {
                  console.log(`[Scraper] Variant SKU "${varMsn}" not found in DB. Auto-scraping it...`);
                  try {
                    await productScraperService.scrapeAndSaveProduct(varMsn, { scrapeVariants: false }, processed);
                  } catch (varErr: any) {
                    console.error(`[Scraper] Failed to auto-scrape variant product "${varMsn}":`, varErr.message);
                  }
                } else {
                  console.log(`[Scraper] Variant SKU "${varMsn}" already exists in DB.`);
                }
              }
            }
          }
        }
      }

      return {
        success: true,
        productId: savedProduct.id,
        documentId: savedProduct.documentId,
        name: productGroup.productName,
        msn: msnLower,
        status: existingProduct ? 'updated' : 'created'
      };

    } catch (error: any) {
      console.error(`[Scraper] Error scraping SKU/MSN ${msnLower}:`, error.message);
      return {
        success: false,
        msn: msnLower,
        error: error.message
      };
    }
  }
}));
