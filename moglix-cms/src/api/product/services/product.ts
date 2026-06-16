/**
 * product service
 */

import { factories } from '@strapi/strapi';
import slugify from 'slugify';
import fs from 'fs-extra';
import path from 'path';
import mime from 'mime-types';
import os from 'os';
import { Client } from 'ssh2';

async function makeRemoteDir(sftp: any, dirPath: string) {
  const dirs = dirPath.split('/').filter(Boolean);
  let currentPath = dirPath.startsWith('/') ? '/' : '';
  for (const dir of dirs) {
    currentPath = path.posix.join(currentPath, dir);
    try {
      await new Promise<void>((resolve) => {
        sftp.mkdir(currentPath, () => {
          resolve();
        });
      });
    } catch (err) {}
  }
}

async function transferFileToSFTP(localFilePath: string, fileName: string, remoteBasePath?: string) {
  const host = process.env.SFTP_HOST;
  const port = parseInt(process.env.SFTP_PORT || '22', 10);
  const username = process.env.SFTP_USERNAME || 'sonu';
  const password = process.env.SFTP_PASSWORD;
  const keyPath = process.env.SFTP_KEY_PATH;
  const basePath = remoteBasePath || process.env.SFTP_BASE_PATH || '/home/sonu/uploads';

  if (!host) {
    console.log('[SFTP] SFTP_HOST not configured. Skipping SFTP transfer.');
    return;
  }

  const sftpConfig: any = { host, port, username };

  if (password) {
    sftpConfig.password = password;
  } else if (keyPath) {
    if (await fs.pathExists(keyPath)) {
      sftpConfig.privateKey = await fs.readFile(keyPath);
    }
  } else {
    // Check default local ssh keys
    const userHome = os.homedir();
    const defaultKeyPath = path.join(userHome, '.ssh', 'id_rsa');
    if (await fs.pathExists(defaultKeyPath)) {
      sftpConfig.privateKey = await fs.readFile(defaultKeyPath);
    }
  }

  const remoteFilePath = path.posix.join(basePath, fileName);

  return new Promise<void>((resolve, reject) => {
    const conn = new Client();
    conn.on('ready', () => {
      conn.sftp(async (err, sftp) => {
        if (err) {
          conn.end();
          return reject(err);
        }
        
        // Ensure remote folders exist recursively
        await makeRemoteDir(sftp, basePath);
        
        sftp.fastPut(localFilePath, remoteFilePath, {}, (err) => {
          conn.end();
          if (err) return reject(err);
          console.log(`[SFTP] Successfully transferred ${fileName} to remote ${remoteFilePath}`);
          resolve();
        });
      });
    }).on('error', (err) => {
      reject(err);
    }).connect(sftpConfig);
  });
}

async function downloadAndUploadImage(strapiInstance: any, imageUrl: string, fileName: string, remoteBasePath?: string) {
  const tempDir = path.join(os.tmpdir(), 'strapi-scrape-uploads');
  const tempFilePath = path.join(tempDir, fileName);
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch image from ${imageUrl}, status: ${response.status}`);
    }
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    await fs.ensureDir(tempDir);
    await fs.writeFile(tempFilePath, buffer);

    const size = buffer.length;
    const ext = path.extname(fileName);
    const mimeType = mime.lookup(ext) || 'image/jpeg';
    
    const fileData = {
      filepath: tempFilePath,
      originalFileName: fileName,
      size,
      mimetype: mimeType,
    };
    
    const [uploadedFile] = await strapiInstance
      .plugin('upload')
      .service('upload')
      .upload({
        files: fileData,
        data: {
          fileInfo: {
            alternativeText: `Uploaded scraped image: ${fileName}`,
            caption: fileName,
            name: fileName,
          },
        },
      });
      
    if (!uploadedFile) {
      throw new Error('Upload to Strapi failed, no file object returned.');
    }

    const finalFileName = uploadedFile.hash + uploadedFile.ext;

    // Align file name in the database with the actual hashed filename
    try {
      await strapiInstance.db.query('plugin::upload.file').update({
        where: { id: uploadedFile.id },
        data: { name: finalFileName }
      });
      console.log(`[DB Alignment] Aligned file name in DB for ID ${uploadedFile.id} to: ${finalFileName}`);
    } catch (dbErr: any) {
      console.error(`[DB Alignment] Failed to align file name in DB:`, dbErr.message);
    }

    const localFileRoot = path.join(process.cwd(), 'public');
    const finalLocalPath = path.join(localFileRoot, uploadedFile.url);

    // Transfer to remote SFTP server if configured
    try {
      await transferFileToSFTP(finalLocalPath, finalFileName, remoteBasePath);
    } catch (sftpErr: any) {
      console.error(`[SFTP] Failed to transfer image to SFTP server:`, sftpErr.message);
    }
    
    // Save locally under public/uploads/<productDocId>/<finalFileName> as well to serve/show on CMS
    if (remoteBasePath) {
      const parts = remoteBasePath.split('/').filter(Boolean);
      const productDocId = parts[parts.length - 1];
      if (productDocId) {
        const localDirPath = path.join(process.cwd(), 'public', 'uploads', productDocId);
        try {
          await fs.ensureDir(localDirPath);
          await fs.copy(finalLocalPath, path.join(localDirPath, finalFileName));
          console.log(`[Local Save] Saved image locally at public/uploads/${productDocId}/${finalFileName}`);
        } catch (localErr: any) {
          console.error(`[Local Save] Failed to save image locally under public/uploads/${productDocId}:`, localErr.message);
        }
      }
    }
      
    return uploadedFile;
  } catch (error: any) {
    console.error(`Error downloading/uploading image ${imageUrl}:`, error.message);
    return null;
  } finally {
    if (await fs.pathExists(tempFilePath)) {
      await fs.remove(tempFilePath);
    }
  }
}

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

      // 4. Find and Upsert Product skeleton first to secure the documentId
      let existingProduct = (await strapi.documents('api::product.product').findFirst({
        filters: {
          $or: [
            { externalId: msnLower },
            { externalId: msnLower.toUpperCase() }
          ]
        }
      })) as any;

      const productDataSkeleton = {
        name: productGroup.productName,
        slug: productSlug,
        description: productGroup.productDescripton || '',
        price: price,
        mrp: mrp,
        discount: discount,
        rating: rating,
        reviewCount: reviewCount,
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

      let savedProduct;
      if (existingProduct) {
        savedProduct = await strapi.documents('api::product.product').update({
          documentId: existingProduct.documentId,
          data: productDataSkeleton,
          status: 'published'
        });
      } else {
        savedProduct = await strapi.documents('api::product.product').create({
          documentId: msnLower,
          data: productDataSkeleton,
          status: 'published'
        });
      }

      const productDocId = savedProduct.documentId;

      // Image mapping (using the generated/loaded productDocId)
      const uploadedImageIds: any[] = [];
      let mainImageUrl = '';

      if (productGroup.productAllImages && productGroup.productAllImages.length > 0) {
        for (let idx = 0; idx < productGroup.productAllImages.length; idx++) {
          const img = productGroup.productAllImages[idx];
          const imgUrl = img.links?.xxlarge || img.links?.default || img.moglixImageNumber;
          if (imgUrl) {
            const absoluteUrl = imgUrl.startsWith('http') ? imgUrl : `https://cdn.moglix.com/${imgUrl}`;
            const ext = path.extname(absoluteUrl.split('?')[0]) || '.jpg';
            const fileName = `${msnLower}-${idx}${ext}`;
            
            // remote base path will be: SFTP_BASE_PATH / productDocId
            const remoteBasePath = path.posix.join(process.env.SFTP_BASE_PATH || '/home/sonu/uploads', productDocId);

            console.log(`[Scraper] Downloading and uploading image ${idx + 1}/${productGroup.productAllImages.length} to folder ${productDocId}: ${absoluteUrl}`);
            const uploadedFile = await downloadAndUploadImage(strapi, absoluteUrl, fileName, remoteBasePath);
            if (uploadedFile) {
              uploadedImageIds.push(uploadedFile.id);
              if (idx === 0) {
                const finalFileName = uploadedFile.hash + uploadedFile.ext;
                // Save mainImageUrl inside the productDocId folder
                mainImageUrl = `/uploads/${productDocId}/${finalFileName}`;
              }
            }
          }
        }
      }

      // If we couldn't download/upload any images, fallback to original main image URL
      if (!mainImageUrl && productGroup.productAllImages && productGroup.productAllImages.length > 0) {
        const firstImg = productGroup.productAllImages[0];
        const imgPath = firstImg.links?.xxlarge || firstImg.links?.default || firstImg.moglixImageNumber;
        if (imgPath) {
          mainImageUrl = imgPath.startsWith('http') ? imgPath : `https://cdn.moglix.com/${imgPath}`;
        }
      }

      // Update the product with images relation and mainImageUrl
      if (uploadedImageIds.length > 0 || mainImageUrl) {
        savedProduct = await strapi.documents('api::product.product').update({
          documentId: productDocId,
          data: {
            mainImageUrl: mainImageUrl || undefined,
            images: uploadedImageIds
          },
          status: 'published'
        });
        console.log(`[Scraper] Linked ${uploadedImageIds.length} images to product "${productGroup.productName}" (${productDocId})`);
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
