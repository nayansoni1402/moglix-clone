import { Product, ProductDetails, ProductImage } from "@/types/product";
import { NO_IMAGE_URL, getMoglixImageUrl } from "@/lib/utils/product";

export function mapStrapiProduct(item: any): Product {
  if (!item) {
    return {
      id: 0,
      title: "Unknown Product",
      reviews: 0,
      price: 0,
      discountedPrice: 0,
      imgs: { thumbnails: [NO_IMAGE_URL], previews: [NO_IMAGE_URL] }
    };
  }

  // Get image URL
  const relativePath = item.mainImageUrl || 
    (item.images?.[0]?.url ? `/uploads/${item.documentId || item.id}/${item.images[0].url.replace(/^\/uploads\//, "")}` : "");
  const imageUrl = relativePath ? getMoglixImageUrl(relativePath) : NO_IMAGE_URL;

  const price = Math.ceil(Number(item.mrp || item.price || 0));
  const discountedPrice = Math.ceil(Number(item.price || 0));

  return {
    id: item.id,
    title: item.name || item.title || "No Title",
    reviews: item.reviewCount || 0,
    price: price > 0 ? price : discountedPrice,
    discountedPrice: discountedPrice,
    slug: item.slug,
    imgs: {
      thumbnails: [imageUrl],
      previews: [imageUrl]
    }
  };
}

export function mapStrapiProductToProductDetails(strapiProduct: any): ProductDetails {
  const relativePath = strapiProduct.mainImageUrl || 
    (strapiProduct.images?.[0]?.url ? `/uploads/${strapiProduct.documentId || strapiProduct.id}/${strapiProduct.images[0].url.replace(/^\/uploads\//, "")}` : "");
  const absoluteImgUrl = relativePath ? getMoglixImageUrl(relativePath) : NO_IMAGE_URL;

  const productImages: ProductImage[] = [];

  if (strapiProduct.images && strapiProduct.images.length > 0) {
    strapiProduct.images.forEach((img: any, idx: number) => {
      let imgUrl = img.url;
      if (imgUrl && !imgUrl.startsWith("http")) {
        const docId = strapiProduct.documentId || strapiProduct.id;
        const filename = imgUrl.replace(/^\/uploads\//, "");
        imgUrl = getMoglixImageUrl(`/uploads/${docId}/${filename}`);
      }
      if (imgUrl) {
        productImages.push({
          links: {
            small: imgUrl,
            thumbnail: imgUrl,
            default: imgUrl,
            large: imgUrl,
            xlarge: imgUrl,
            icon: imgUrl,
            xxlarge: imgUrl,
            medium: imgUrl,
          },
          moglixImageNumber: imgUrl,
          altTag: strapiProduct.name,
          position: idx + 1,
        });
      }
    });
  }

  if (productImages.length === 0) {
    productImages.push({
      links: {
        small: absoluteImgUrl,
        thumbnail: absoluteImgUrl,
        default: absoluteImgUrl,
        large: absoluteImgUrl,
        xlarge: absoluteImgUrl,
        icon: absoluteImgUrl,
        xxlarge: absoluteImgUrl,
        medium: absoluteImgUrl,
      },
      moglixImageNumber: absoluteImgUrl,
      altTag: strapiProduct.name,
      position: 1,
    });
  }

  const price = Math.ceil(Number(strapiProduct.mrp || strapiProduct.price * 1.25 || 100));
  const discountedPrice = Math.ceil(Number(strapiProduct.price || 80));
  const discountVal = strapiProduct.discount || 20;

  const mappedProductGroup = {
    msn: strapiProduct.slug,
    productName: strapiProduct.name,
    isProductReturnAble: true,
    productDescripton: strapiProduct.description || "",
    productBrandDetails: {
      idBrand: strapiProduct.brand?.documentId || "generic",
      brandName: strapiProduct.brand?.name || strapiProduct.brandName || "Generic",
      storedBrandName: strapiProduct.brand?.name || strapiProduct.brandName || "Generic",
      friendlyUrl: strapiProduct.brand?.slug || "generic",
      brandTag: strapiProduct.brand?.name || "Generic"
    },
    productCategoryDetails: {
      categoryCode: strapiProduct.categories?.[0]?.slug || "category",
      categoryName: strapiProduct.categories?.[0]?.name || "Category",
      taxonomy: strapiProduct.categories?.[0]?.name || "Category",
      taxonomyCode: strapiProduct.categories?.[0]?.slug || "category",
      categoryLink: `/category/${strapiProduct.categories?.[0]?.slug || "category"}`
    },
    productUrl: `/product/${strapiProduct.slug}`,
    productKeyFeatures: [],
    productVideos: [],
    productDocumentInfo: strapiProduct.pdfUrl ? [{ documentUrl: strapiProduct.pdfUrl, name: "Datasheet" }] : [],
    productAttributes: {
      "Manufacturer Part Number": [strapiProduct.externalId || "N/A"],
    },
    productRating: String(strapiProduct.rating || 4.5),
    productAllImages: productImages,
    priceQuantityCountry: {
      mrp: price,
      offeredPriceWithoutTax: discountedPrice,
      offeredPriceWithTax: discountedPrice,
      moq: 1,
      quantityAvailable: 100,
      incrementUnit: 1,
      packageUnit: "Piece",
      sellingPrice: discountedPrice,
      taxRule: {
        taxPercentage: 18,
        hsn: ""
      },
      estimatedDelivery: "3-5 Days",
      outOfStockFlag: false,
      priceWithoutTax: discountedPrice,
      discount: discountVal,
      bulkPrices: { india: [] },
      bulkPricesModified: []
    },
    manufacturerDetails: "See description",
    packerDetails: "See description",
    displayName: strapiProduct.name,
    itemDimension: "",
    itemWeight: "",
    returnable: true,
    exchangeable: true,
    returnDuration: 7,
    canonicalUrl: `/product/${strapiProduct.slug}`,
    isBrandMsn: false,
  };

  const breadcrumb = [
    {
      categoryName: "Home",
      categoryLink: "",
      taxonomy: "Home"
    }
  ];

  if (strapiProduct.categories && strapiProduct.categories.length > 0) {
    const sortedCategories = [...strapiProduct.categories].sort((a: any, b: any) => {
      return String(a.slug || '').localeCompare(String(b.slug || ''));
    });
    
    for (const cat of sortedCategories) {
      breadcrumb.push({
        categoryName: cat.name,
        categoryLink: `category/${cat.slug}`,
        taxonomy: cat.name
      });
    }
  }

  // Push product itself as the last element so that Breadcrumbs component's items.slice(0, -1) works correctly
  breadcrumb.push({
    categoryName: strapiProduct.name,
    categoryLink: `product/${strapiProduct.slug}`,
    taxonomy: strapiProduct.name
  });

  return {
    _id: strapiProduct.documentId || String(strapiProduct.id),
    msn: strapiProduct.slug,
    breadcrumb: breadcrumb,
    productGroup: mappedProductGroup as any,
    questionAndAnswer: {
      totalCount: 0,
      qlist: []
    },
    relatedLinks: [],
    tags: [],
    tagProducts: [],
    similarProducts: {
      totalDocs: 0,
      products: []
    },
    compareProducts: {
      totalCount: 0,
      products: []
    },
    productReviews: {
      attributeRating: {},
      summaryData: {
        reviewCount: strapiProduct.reviewCount || 0,
        oneStarCount: 0,
        twoStarCount: 0,
        threeStarCount: 0,
        fourStarCount: 0,
        fiveStarCount: strapiProduct.reviewCount || 0,
        finalRating: strapiProduct.rating || 4.5,
        finalAverageRating: strapiProduct.rating || 4.5
      },
      reviewList: [],
      startCount: 0
    },
    ndd: false,
    mostSold: []
  };
}
