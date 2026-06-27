import { Product, ProductDetails, ProductImage } from "@/types/product";
import { NO_IMAGE_URL } from "@/lib/utils/product";

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
  const imageUrl = item.mainImageUrl || NO_IMAGE_URL;

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
  const absoluteImgUrl = strapiProduct.mainImageUrl || NO_IMAGE_URL;

  const productImages: ProductImage[] = [
    {
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
    }
  ];

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
      categoryLink: "/",
      taxonomy: "Home"
    }
  ];
  if (strapiProduct.categories?.[0]) {
    breadcrumb.push({
      categoryName: strapiProduct.categories[0].name,
      categoryLink: `/category/${strapiProduct.categories[0].slug}`,
      taxonomy: strapiProduct.categories[0].name
    });
  }

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
