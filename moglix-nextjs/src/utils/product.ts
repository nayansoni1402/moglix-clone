import { CategoryProduct } from "@/types/category";
import { getProductImageUrl } from "@/lib/api/product";

export const mapCategoryProductToProductItem = (item: CategoryProduct) => {
    return {
        title: item.productName,
        reviews: item.reviewCount || 0,
        price: item.mrp,
        discountedPrice: item.salesPrice,
        id: parseInt(item.moglixPartNumber.replace(/[^0-9]/g, "")) || 0,
        imgs: {
            thumbnails: [getProductImageUrl(item.moglixImageNumber, "medium")],
            previews: [getProductImageUrl(item.moglixImageNumber, "xxlarge")],
        },
    };
};
