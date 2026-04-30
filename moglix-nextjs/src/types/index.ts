export interface StrapiImage {
  id: number;
  url: string;
  alternativeText?: string;
}

export interface Brand {
  id: number;
  name: string;
  slug: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface Product {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  price: number;
  mrp: number;
  discount: number;
  rating: number;
  reviewCount: number;
  images?: StrapiImage[];
  brand?: Brand;
  category?: Category;
  externalId: string;
  url: string;
}

export interface StrapiResponse<T> {
  data: T;
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}
