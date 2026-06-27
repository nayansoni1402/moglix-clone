import { ProductTag, SimilarProduct } from "./product";

export interface CategoryProduct extends SimilarProduct {}

export interface CategoryResult {
    products: CategoryProduct[];
    totalProducts: number;
}

export interface CategoryData {
    productSearchResult: CategoryResult;
    categoryName: string;
    categoryId: string; // Note: lowercase 'id' in API
    taxonomy: string;
    hierarchy?: Array<{ name: string; slug: string }>;
    categoryDescription?: string;
    categoryFaqs?: Array<{ question: string; answer: string }>;
    categoryMainImageLink?: string;
    redirectionLink?: string;
    subcategories?: Array<{ name: string; slug: string }>;
    filterMetadata?: { brands: string[]; maxPrice: number };
}

// Since the API returns the data directly without a status/data wrapper
export interface CategoryApiResponse extends CategoryData {}
