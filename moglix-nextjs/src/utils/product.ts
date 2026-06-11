import { CategoryProduct } from "@/types/category";
import { getProductImageUrl } from "@/lib/api/product";
import { NO_IMAGE_URL } from "@/lib/utils/product";

export const mapCategoryProductToProductItem = (item: any) => {
    const defaultImg = NO_IMAGE_URL;
    return {
        title: item.productName,
        reviews: item.reviewCount || 0,
        price: item.mrp || item.price || 0,
        discountedPrice: item.salesPrice || item.price || 0,
        id: parseInt(String(item.moglixPartNumber || item.id).replace(/[^0-9]/g, "")) || 0,
        slug: item.productUrl ? item.productUrl.replace("/product/", "") : undefined,
        imgs: {
            thumbnails: [item.moglixImageNumber ? getProductImageUrl(item.moglixImageNumber, "medium") : defaultImg],
            previews: [item.moglixImageNumber ? getProductImageUrl(item.moglixImageNumber, "xxlarge") : defaultImg],
        },
    };
};
