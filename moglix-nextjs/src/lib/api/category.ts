import { CategoryApiResponse } from "@/types/category";

export const getCategoryData = async (
    categoryID: string, 
    pageIndex: number = 0, 
    pageSize: number = 40,
    orderBy: string = "popularity",
    orderWay: string = "desc"
): Promise<CategoryApiResponse> => {
    const url = `https://api-gt.moglix.com/api/search/getCategory?category=${categoryID}&pageIndex=${pageIndex}&pageSize=${pageSize}&orderBy=${orderBy}&orderWay=${orderWay}&type=d`;
    
    const response = await fetch(url, {
        headers: {
            "Accept-Encoding": "identity",
        },
        next: { revalidate: 300 },
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch category data: ${response.status}`);
    }

    return response.json();
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
