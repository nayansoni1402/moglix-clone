import type { ProductApiResponse } from "@/types/product";

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
  if (!path) return "/images/placeholder.png";
  if (path.startsWith("http")) return path;
  return `${IMAGE_BASE}${path}`;
};

export const getProductImageUrl = (moglixImageNumber: string, size: string = "xxlarge") => {
  if (!moglixImageNumber) return "/images/placeholder.png";
  return `${IMAGE_BASE}p/${moglixImageNumber}-${size}.jpg`;
};
