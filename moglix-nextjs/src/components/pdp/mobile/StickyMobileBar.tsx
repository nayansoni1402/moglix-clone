"use client";

import { ShoppingCart, Zap } from "lucide-react";
import type { ProductGroup } from "@/types/product";
import { formatPrice } from "@/lib/utils/product";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { addItemToCart } from "@/redux/features/cart-slice";
import { useCartModalContext } from "@/app/context/CartSidebarModalContext";

interface StickyMobileBarProps {
  product: ProductGroup;
  msn: string;
}

export default function StickyMobileBar({ product, msn }: StickyMobileBarProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { openCartModal } = useCartModalContext();
  const { priceQuantityCountry: price } = product;

  const msnHash = msn.split("").reduce((a, c) => a + c.charCodeAt(0), 0);

  const handleAddToCart = () => {
    const img = product.productAllImages[0]?.moglixImageNumber;
    const imgUrl = img ? `https://img.moglimg.com/p/${img}-xxlarge.jpg` : "/images/products/product-1-bg-1.png";
    dispatch(
      addItemToCart({
        id: msnHash,
        title: product.productName,
        price: price.mrp,
        discountedPrice: price.sellingPrice,
        quantity: 1,
        imgs: { previews: [imgUrl], thumbnails: [imgUrl] },
      })
    );
    openCartModal();
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9999] lg:hidden bg-white border-t border-gray-2 shadow-[0_-4px_16px_rgba(0,0,0,0.1)]">
      <div className="flex items-center gap-0 px-4 py-3">
        <div className="flex-1 min-w-0 pr-3">
          <p className="text-[10px] text-gray-5 font-medium">Best Price</p>
          <p className="text-lg font-black text-body leading-none">
            {formatPrice(price.sellingPrice)}
          </p>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={price.outOfStockFlag}
          id="mobile-add-to-cart"
          className="flex items-center justify-center gap-2 flex-1 bg-white border-2 border-blue text-blue py-3 rounded-xl font-bold text-sm hover:bg-blue/5 transition-colors active:scale-95 disabled:opacity-50 mr-2"
        >
          <ShoppingCart size={17} />
          Add to Cart
        </button>

        <button
          disabled={price.outOfStockFlag}
          id="mobile-buy-now"
          className="flex items-center justify-center gap-2 flex-1 bg-blue text-white py-3 rounded-xl font-bold text-sm hover:bg-blue-dark transition-colors active:scale-95 disabled:opacity-50"
        >
          <Zap size={17} />
          Buy Now
        </button>
      </div>
    </div>
  );
}
