import { CategoryApiResponse } from "@/types/category";
import { getMoglixImageUrl } from "@/lib/utils/product";

export const getCategoryData = async (
    categoryID: string, 
    pageIndex: number = 0, 
    pageSize: number = 40,
    orderBy: string = "popularity",
    orderWay: string = "desc",
    selectedBrands: string[] = [],
    maxPrice: number = 0
): Promise<CategoryApiResponse> => {
    // 1. Try to fetch from Strapi first
    try {
        const baseUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://127.0.0.1:1337/api';
        
        // Find category by slug (populated safely without wildcard categories to avoid articles schema crash)
        const catRes = await fetch(`${baseUrl}/categories?filters[slug][$eq]=${categoryID}&populate[children][fields][0]=name&populate[children][fields][1]=slug&populate[parent][fields][0]=name&populate[parent][fields][1]=slug&populate[faqs]=*`, { cache: 'no-store' });
        const catJson = await catRes.json();
        
        if (catJson && catJson.data && catJson.data.length > 0) {
            const category = catJson.data[0];
            
            // 1a. Fetch ALL matching products with limited fields to compile metadata (unique brands & price ranges)
            const metaRes = await fetch(`${baseUrl}/products?filters[$or][0][categories][slug][$eq]=${categoryID}&filters[$or][1][categories][parent][slug][$eq]=${categoryID}&filters[$or][2][categories][parent][parent][slug][$eq]=${categoryID}&fields[0]=price&fields[1]=mrp&populate[brand][fields][0]=name&pagination[limit]=1000`, { cache: 'no-store' });
            const metaJson = await metaRes.json();
            const allMetaProducts = metaJson.data || [];

            // Compile absolute unique brands list for this category
            const brandsSet = new Set<string>();
            let maxPriceVal = 1000;
            allMetaProducts.forEach((p: any) => {
                const bName = p.brand?.name || p.brandName;
                if (bName && typeof bName === 'string' && bName.trim() !== '') {
                    brandsSet.add(bName.trim());
                }
                const price = Number(p.price || 0);
                if (price > maxPriceVal) maxPriceVal = price;
            });

            // 1b. Construct active query parameters for the actual loaded products page
            let queryParams = `filters[$or][0][categories][slug][$eq]=${categoryID}&filters[$or][1][categories][parent][slug][$eq]=${categoryID}&filters[$or][2][categories][parent][parent][slug][$eq]=${categoryID}`;

            if (selectedBrands && selectedBrands.length > 0) {
                selectedBrands.forEach((brand, idx) => {
                    queryParams += `&filters[brand][name][$in][${idx}]=${encodeURIComponent(brand)}`;
                });
            }

            if (maxPrice > 0) {
                // Keep the price filtering matching database USD directly
                const maxPriceInDbCurrency = maxPrice;
                queryParams += `&filters[price][$lte]=${maxPriceInDbCurrency}`;
            }

            const prodRes = await fetch(`${baseUrl}/products?${queryParams}&populate=*&pagination[page]=${pageIndex + 1}&pagination[pageSize]=${pageSize}`, { cache: 'no-store' });
            const prodJson = await prodRes.json();
            
            const strapiProducts = prodJson.data || [];
            const pagination = prodJson.meta?.pagination || { total: 0 };
            
            // Map Strapi products to the expected Moglix shape
            const products = strapiProducts.map((p: any) => {
                const relativePath = p.mainImageUrl || 
                    (p.images?.[0]?.url ? `/uploads/${p.documentId || p.id}/${p.images[0].url.replace(/^\/uploads\//, "")}` : "");
                const absoluteImgUrl = relativePath ? getMoglixImageUrl(relativePath) : "/placeholder.png";
                
                return {
                    moglixPartNumber: p.documentId || String(p.id),
                    productName: p.name,
                    mrp: Math.ceil(Number(p.mrp || p.price * 1.25 || 100)),
                    priceWithoutTax: Math.ceil(Number(p.price || 80)),
                    salesPrice: Math.ceil(Number(p.price || 80)),
                    productUrl: `/product/${p.slug}`,
                    mainImageLink: absoluteImgUrl,
                    brandName: p.brand?.name || p.brandName || "Generic",
                    rating: p.rating || 4.5,
                    discount: p.discount || 20,
                    reviewCount: p.reviewCount || 10,
                };
            });
            
            const faqs = (category.faqs || []).map((faq: any) => ({
                question: faq.question || "",
                answer: faq.answer || "",
            }));
            
            return {
                categoryName: category.name,
                categoryId: category.slug,
                taxonomy: category.parent ? `${category.parent.name} > ${category.name}` : category.name,
                categoryDescription: category.seoDescription || category.description || "",
                categoryFaqs: faqs,
                subcategories: (category.children || []).map((sub: any) => ({
                    name: sub.name,
                    slug: sub.slug
                })),
                filterMetadata: {
                    brands: Array.from(brandsSet),
                    maxPrice: Math.ceil(maxPriceVal)
                },
                productSearchResult: {
                    totalProducts: pagination.total,
                    products: products,
                }
            };
        }
    } catch (err) {
        console.error("Strapi fetch failed or category not found:", err);
    }

    // Default clean empty response to prevent showing dummy/mock production products
    return {
        categoryName: categoryID.replace(/-/g, " "),
        categoryId: categoryID,
        taxonomy: categoryID.replace(/-/g, " "),
        categoryDescription: "",
        categoryFaqs: [],
        subcategories: [],
        productSearchResult: {
            totalProducts: 0,
            products: [],
        }
    };
};

export const getCategoryBuckets = async (categoryID: string): Promise<any> => {
    const url = `https://api-gt.moglix.com/api/search/getCategoryBucketAggregation?category=${categoryID}&type=d`;
    
    const response = await fetch(url, {
        headers: {
            "Accept-Encoding": "identity",
        },
        next: { revalidate: 300 },
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch category buckets: ${response.status}`);
    }

    return response.json();
};

export const getBrandData = async (
    brandID: string, 
    pageIndex: number = 0, 
    pageSize: number = 40,
    orderBy: string = "popularity",
    orderWay: string = "desc"
): Promise<any> => {
    const url = `https://api-gt.moglix.com/api/search/getBrand?brand=${brandID}&pageIndex=${pageIndex}&pageSize=${pageSize}&orderBy=${orderBy}&orderWay=${orderWay}&type=d`;
    
    const response = await fetch(url, {
        headers: {
            "Accept-Encoding": "identity",
        },
        next: { revalidate: 300 },
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch brand data: ${response.status}`);
    }

    return response.json();
};
