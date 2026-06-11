"use client";

import { useState } from "react";
import { ShoppingCart, Zap, Heart, Minus, Plus, Users } from "lucide-react";
import type { ProductGroup } from "@/types/product";
import { formatPrice, formatPriceRaw } from "@/lib/utils/product";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { addItemToCart } from "@/redux/features/cart-slice";
import WishlistButton from "@/components/ui/WishlistButton";
import { useCartModalContext } from "@/app/context/CartSidebarModalContext";
import toast from "react-hot-toast";

interface PriceBoxProps {
  product: ProductGroup;
  msn: string;
}

export default function PriceBox({ product, msn }: PriceBoxProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { openCartModal } = useCartModalContext();
  const [qty, setQty] = useState(1);
  const msnHash = msn.split("").reduce((a, c) => a + c.charCodeAt(0), 0);

  const { priceQuantityCountry: price } = product;

  const getBulkPrice = () => {
    const bulk = price.bulkPricesModified;
    if (!bulk?.length) return null;
    return bulk.find((b) => qty >= b.minQty && (qty <= b.maxQty || b.maxQty === 2147483647));
  };

  const activeBulk = getBulkPrice();
  const effectivePrice = activeBulk ? activeBulk.bulkSellingPrice : price.sellingPrice;

  const handleAddToCart = () => {
    const img = product.productAllImages[0]?.moglixImageNumber;
    const imgUrl = img ? `https://img.moglimg.com/p/${img}-xxlarge.jpg` : "/images/products/product-1-bg-1.png";
    dispatch(
      addItemToCart({
        id: msnHash,
        title: product.productName,
        price: price.mrp,
        discountedPrice: effectivePrice,
        quantity: qty,
        imgs: { previews: [imgUrl], thumbnails: [imgUrl] },
      })
    );
    toast.success(`${product.productName.substring(0, 20)}... added to cart!`);
    openCartModal();
  };

  return (
    <div className="bg-white border border-gray-2 rounded-xl p-5 space-y-4 shadow-sm">
      {/* Price Summary */}
      <div>
        <div className="flex items-baseline gap-2 mb-0.5">
          <span className="text-2xl font-black text-body">
            {formatPrice(effectivePrice * qty)}
          </span>
          {activeBulk && (
            <span className="text-xs font-bold text-green bg-green/10 px-2 py-0.5 rounded">
              {activeBulk.discount}% bulk discount
            </span>
          )}
        </div>
        <p className="text-xs text-gray-5">Inclusive of all taxes</p>
      </div>

      {/* Quantity Selector */}
      <div>
        <label className="text-xs font-bold text-dark-4 uppercase tracking-wide mb-2 block">
          Quantity
        </label>
        <div className="flex items-center border border-gray-2 rounded-lg w-fit overflow-hidden">
          <button
            onClick={() => setQty((q) => Math.max(price.moq || 1, q - (price.incrementUnit || 1)))}
            className="w-10 h-10 flex items-center justify-center text-dark-3 hover:bg-gray-1 transition-colors font-bold"
            aria-label="Decrease quantity"
          >
            <Minus size={16} />
          </button>
          <span className="w-12 h-10 flex items-center justify-center text-body font-bold text-sm border-x border-gray-2">
            {qty}
          </span>
          <button
            onClick={() =>
              setQty((q) => Math.min(price.quantityAvailable, q + (price.incrementUnit || 1)))
            }
            className="w-10 h-10 flex items-center justify-center text-dark-3 hover:bg-gray-1 transition-colors font-bold"
            aria-label="Increase quantity"
          >
            <Plus size={16} />
          </button>
        </div>
        <p className="text-xs text-gray-5 mt-1">
          Min: {price.moq || 1} {price.packageUnit}
        </p>
      </div>

      {/* Bulk Pricing Table */}
      {price.bulkPricesModified?.length > 0 && (
        <div className="border border-gray-1 rounded-lg overflow-hidden">
          <div className="bg-gray-1 px-3 py-2 flex items-center gap-2">
            <Users size={13} className="text-blue" />
            <span className="text-xs font-bold text-dark-4 uppercase tracking-wide">Bulk Pricing</span>
          </div>
          <div className="divide-y divide-gray-1">
            {price.bulkPricesModified.slice(0, 4).map((b, i) => (
              <div
                key={i}
                className={`flex items-center justify-between px-3 py-2 text-xs transition-colors ${
                  activeBulk === b ? "bg-blue/5 font-bold" : "hover:bg-gray-50"
                }`}
              >
                <span className="text-dark-3 font-medium">
                  {b.minQty}
                  {b.maxQty === 2147483647 ? "+" : ` - ${b.maxQty}`} pcs
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-green font-bold">{b.discount}% OFF</span>
                  <span className="text-body font-bold">{formatPrice(b.bulkSellingPrice)}/pc</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-3">
        <button
          onClick={handleAddToCart}
          disabled={price.outOfStockFlag}
          id="pdp-add-to-cart"
          className="w-full flex items-center justify-center gap-2.5 bg-white border-2 border-blue text-blue py-3.5 rounded-xl font-bold text-sm hover:bg-blue hover:text-white transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
        >
          <ShoppingCart size={18} />
          Add to Cart
        </button>

        <button
          disabled={price.outOfStockFlag}
          id="pdp-buy-now"
          className="w-full flex items-center justify-center gap-2.5 bg-blue text-white py-3.5 rounded-xl font-bold text-sm hover:bg-blue-dark transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_14px_rgba(0,86,179,0.3)]"
        >
          <Zap size={18} />
          Buy Now
        </button>

        <WishlistButton
          product={{
            msn: msn || "",
            name: product.productName,
            price: price.mrp,
            discountedPrice: effectivePrice,
            image: product.productAllImages[0]?.moglixImageNumber ? `https://img.moglimg.com/p/${product.productAllImages[0].moglixImageNumber}-xxlarge.jpg` : undefined
          }}
          className="w-full"
          id="pdp-wishlist"
          renderCustom={(isWishlisted) => (
            <div className={`w-full flex items-center justify-center gap-2.5 py-3 rounded-xl font-bold text-sm border-2 transition-all duration-200 ${
              isWishlisted
                ? "border-red bg-red/5 text-red"
                : "border-gray-2 text-dark-4 hover:border-red hover:text-red"
            }`}>
              <Heart size={18} className={isWishlisted ? "fill-red" : ""} />
              {isWishlisted ? "Wishlisted" : "Add to Wishlist"}
            </div>
          )}
        />
      </div>

      {/* Secure Badge */}
      <div className="flex items-center justify-center gap-2 text-xs text-gray-5 pt-1 border-t border-gray-1">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
        <span>100% Secure Payment</span>
      </div>

      {/* Bulk Inquiry CTA */}
      <div className="bg-gray-1 rounded-lg p-3 text-center">
        <p className="text-xs text-dark-3 font-medium mb-1">Need large quantities?</p>
        <button className="text-xs text-blue font-bold hover:underline">
          Request Bulk Quote →
        </button>
      </div>
    </div>
  );
}
