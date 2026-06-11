import type { ProductApiResponse } from "@/types/product";
import { NO_IMAGE_URL } from "@/lib/utils/product";

const IMAGE_BASE = "https://img.moglimg.com/";

export const getProductDetails = async (msn: string): Promise<ProductApiResponse> => {
  const response = await fetch(
    `https://api-gt.moglix.com/api/aggregate/pdpDetailsV2?msn=${msn}`,
    {
      headers: {
        "Accept-Encoding": "identity",
      },
      next: { revalidate: 300 },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch product: ${response.status}`);
  }

  return response.json();
};

export const getImageUrl = (path: string, size: "large" | "xlarge" | "xxlarge" | "medium" | "thumbnail" = "xxlarge") => {
  return NO_IMAGE_URL;
};

export const getProductImageUrl = (moglixImageNumber: string, size: string = "xxlarge") => {
  return NO_IMAGE_URL;
};

export const getStrapiProductDetails = async (slug: string): Promise<any> => {
  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://127.0.0.1:1337/api';
  const response = await fetch(`${baseUrl}/products?filters[slug][$eq]=${slug}&populate=*`, { cache: 'no-store' });
  if (!response.ok) {
    throw new Error(`Failed to fetch product from Strapi: ${response.statusText}`);
  }
  const json = await response.json();
  return json.data?.[0] || null;
};
