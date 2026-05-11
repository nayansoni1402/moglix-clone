// ─── Product Types ─────────────────────────────────────────────────────────

export interface ProductImage {
  links: {
    small: string;
    thumbnail: string;
    default: string;
    large: string;
    xlarge: string;
    icon: string;
    xxlarge: string;
    medium: string;
  };
  moglixImageNumber: string;
  altTag: string | null;
  position: number;
}

export interface BrandDetails {
  idBrand: string;
  brandName: string;
  storedBrandName: string;
  friendlyUrl: string;
  brandTag: string;
}

export interface CategoryDetails {
  categoryCode: string;
  categoryName: string;
  taxonomy: string;
  taxonomyCode: string;
  categoryLink: string;
}

export interface TaxRule {
  taxPercentage: number;
  hsn: string;
}

export interface BulkPrice {
  minQty: number;
  maxQty: number;
  discount: number;
  bulkSPWithoutTax: number;
  bulkSellingPrice: number;
  categoryCode: string;
  active: boolean;
}

export interface PriceQuantityCountry {
  mrp: number;
  offeredPriceWithoutTax: number;
  offeredPriceWithTax: number;
  moq: number;
  quantityAvailable: number;
  incrementUnit: number;
  packageUnit: string;
  sellingPrice: number;
  taxRule: TaxRule;
  estimatedDelivery: string;
  outOfStockFlag: boolean;
  priceWithoutTax: number;
  discount: number;
  bulkPrices: { india: BulkPrice[] };
  bulkPricesModified: BulkPrice[];
}

export interface QnA {
  id: number;
  questionText: string;
  answerText: string;
}

export interface ProductTag {
  tagId: string;
  tagName: string;
  tagImageLink?: string;
  tagType?: string;
  tagPriority?: number;
  tagDesc?: string;
}

export interface FilterAttributeItem {
  value: string;
  selected: number;
  active: number;
  msn: string;
}

export interface ProductFilterAttribute {
  name: string;
  items: FilterAttributeItem[];
}

export interface ProductGroup {
  msn: string;
  productName: string;
  isProductReturnAble: boolean;
  productDescripton: string;
  productBrandDetails: BrandDetails;
  productCategoryDetails: CategoryDetails;
  productUrl: string;
  productKeyFeatures: string[];
  productVideos: any[];
  productDocumentInfo: any[];
  productAttributes: Record<string, string[]>;
  productRating: string;
  productAllImages: ProductImage[];
  priceQuantityCountry: PriceQuantityCountry;
  manufacturerDetails: string;
  packerDetails: string;
  displayName: string;
  itemDimension: string;
  itemWeight: string;
  returnable: boolean;
  exchangeable: boolean;
  returnDuration: number;
  canonicalUrl: string;
  isBrandMsn: boolean;
  productTags?: ProductTag[];
  /** Variant selectors (Nominal Size, Colour, etc.) */
  productFilterAttributesList?: ProductFilterAttribute[];
}

export interface Review {
  id: number;
  reviewId: string;
  itemId: string;
  reviewSubject: string;
  reviewText: string;
  userId: string;
  updatedAt: string;
  rating: number;
  yes: number;
  no: number;
  isApproved: boolean;
  userName: string;
  images: string[] | null;
  imageList: string[];
}

export interface ReviewSummary {
  reviewCount: number;
  oneStarCount: number;
  twoStarCount: number;
  threeStarCount: number;
  fourStarCount: number;
  fiveStarCount: number;
  finalRating: number;
  finalAverageRating: number;
}

export interface ProductReviews {
  attributeRating: Record<string, number>;
  summaryData: ReviewSummary;
  reviewList: Review[];
  startCount: number;
}

export interface SimilarProduct {
  moglixPartNumber: string;
  brandName: string;
  salesPrice: number;
  mrp: number;
  discount: number;
  productName: string;
  variantName: string;
  mainImageLink: string;
  moglixImageNumber: string;
  productUrl: string;
  avgRating: number | null;
  ratingCount: number;
  reviewCount: number;
  quantityAvailable: number;
  keyFeatures: string[];
  taxonomy: string;
  productTags: Array<{ tagId: string; tagName: string; tagImageLink: string }>;
}

export interface TagProducts {
  productTagName: string;
  productList: SimilarProduct[];
}

export interface BreadcrumbItem {
  categoryName: string;
  categoryLink: string;
  taxonomy: string;
}

export interface RelatedLink {
  title: string;
  friendlyUrl: string;
  categoryImage: string;
}

export interface ApplicablePromo {
  promoCode: string;
  promoDescription: string;
  minCartValue: number;
  totalCoupons: number;
}

export interface PrepaidDiscount {
  percentageDiscount: number;
  minimumCartValue: number;
  categoryName: string;
}

export interface ProductWidget {
  brand?: {
    brandName: string;
    brandCategoryLink: string;
    orderPercentage: number;
    message: string;
  };
  price?: {
    interval: string;
    orderCount: number;
    orderPercentage: number;
    categoryName: string;
    categoryLink: string;
    message: string;
  };
}

export interface ProductDetails {
  _id: string;
  msn: string;
  breadcrumb: BreadcrumbItem[];
  productGroup: ProductGroup;
  questionAndAnswer: {
    totalCount: number;
    qlist: QnA[];
  };
  relatedLinks: RelatedLink[];
  tags: ProductTag[];
  tagProducts: TagProducts[];
  productWidget?: ProductWidget;
  similarProducts: {
    totalDocs: number;
    products: SimilarProduct[];
  };
  compareProducts: {
    totalCount: number;
    products: SimilarProduct[];
  };
  productReviews: ProductReviews;
  applicablePromo?: ApplicablePromo;
  prepaidDiscount?: PrepaidDiscount;
  ndd: boolean;
  mostSold: Array<{ name: string; link: string }>;
}

export interface ProductApiResponse {
  status: boolean;
  statusCode: number;
  message: string;
  data: ProductDetails;
}

export interface Product {
  title: string;
  reviews: number;
  price: number;
  discountedPrice: number;
  id: number;
  imgs: {
    thumbnails: string[];
    previews: string[];
  };
}
