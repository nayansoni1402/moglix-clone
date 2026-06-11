import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { addItemToWishlist, removeItemFromWishlist } from "@/redux/features/wishlist-slice";
import toast from "react-hot-toast";

export interface WishlistProductData {
  msn: string;
  name: string;
  price?: number;
  discountedPrice?: number;
  image?: string;
}

export function useWishlist() {
  const dispatch = useDispatch<AppDispatch>();
  const wishlistItems = useSelector((state: RootState) => state.wishlistReducer.items);

  const checkWishlisted = (msn: string) => {
    if (!msn) return false;
    const msnHash = msn.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
    return wishlistItems.some((item) => item.id === msnHash);
  };

  const toggleWishlist = (product: WishlistProductData) => {
    if (!product.msn) return;
    const msnHash = product.msn.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
    const isWishlisted = wishlistItems.some((item) => item.id === msnHash);

    if (isWishlisted) {
      dispatch(removeItemFromWishlist(msnHash));
      toast.success("Removed from wishlist!");
    } else {
      dispatch(
        addItemToWishlist({
          id: msnHash,
          title: product.name,
          price: product.price || 0,
          discountedPrice: product.discountedPrice || 0,
          quantity: 1,
          imgs: product.image 
            ? { previews: [product.image], thumbnails: [product.image] } 
            : undefined,
        })
      );
      toast.success("Added to wishlist!");
    }
  };

  return { wishlistItems, checkWishlisted, toggleWishlist };
}
