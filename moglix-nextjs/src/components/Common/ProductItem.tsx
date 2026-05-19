"use client";
import React from "react";
import Image from "next/image";
import { Product } from "@/types/product";
import { useModalContext } from "@/app/context/QuickViewModalContext";
import { updateQuickView } from "@/redux/features/quickView-slice";
import { addItemToCart } from "@/redux/features/cart-slice";
import { addItemToWishlist, removeItemFromWishlist } from "@/redux/features/wishlist-slice";
import { updateproductDetails } from "@/redux/features/product-details";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import Link from "next/link";
import toast from "react-hot-toast";
import { formatPrice } from "@/lib/utils/product";

const ProductItem = ({ item }: { item: Product }) => {
  const { openModal } = useModalContext();
  const dispatch = useDispatch<AppDispatch>();
  const wishlistItems = useSelector((state: RootState) => state.wishlistReducer.items);

  const slug = item.slug || item.title.toLowerCase().replace(/ /g, "-");
  const msnHash = slug.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const isWishlisted = wishlistItems.some((wItem) => wItem.id === msnHash || wItem.id === item.id);

  const handleQuickViewUpdate = (e: React.MouseEvent) => {
    e.preventDefault();
    openModal();
    dispatch(updateQuickView({ ...item }));
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    dispatch(addItemToCart({ ...item, quantity: 1 }));
    toast.success(`${item.title.substring(0, 20)}... added to cart!`);
  };

  const handleItemToWishList = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isWishlisted) {
      const matched = wishlistItems.find((wItem) => wItem.id === msnHash || wItem.id === item.id);
      if (matched) {
        dispatch(removeItemFromWishlist(matched.id));
        toast.success("Removed from wishlist!");
      }
    } else {
      dispatch(addItemToWishlist({ ...item, id: msnHash, status: "available", quantity: 1 }));
      toast.success("Added to wishlist!");
    }
  };

  const handleProductDetails = () => {
    dispatch(updateproductDetails({ ...item }));
  };

  const discount = item.price > item.discountedPrice
    ? Math.round(((item.price - item.discountedPrice) / item.price) * 100)
    : 0;


  return (
    <div className="group bg-white border border-gray-3 hover:border-blue/30 hover:shadow-md transition-all duration-200 rounded-lg relative flex flex-col overflow-hidden">

      {/* Discount Badge */}
      {discount > 0 && (
        <div className="absolute top-2 left-2 bg-red text-white text-[9px] font-bold px-1.5 py-0.5 rounded z-10 uppercase tracking-wide">
          {discount}% OFF
        </div>
      )}

      {/* Wishlist Button */}
      <button
        onClick={handleItemToWishList}
        aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        className={`absolute top-2 right-2 z-10 w-7 h-7 rounded-full flex items-center justify-center border shadow-sm transition-all duration-200 ${isWishlisted
            ? "bg-red/15 border-red text-red opacity-100"
            : "bg-white border-gray-3 text-dark-4 hover:bg-red hover:text-white hover:border-red opacity-0 group-hover:opacity-100"
          }`}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill={isWishlisted ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
        </svg>
      </button>

      {/* Product Image */}
      <Link
        href={`/product/${slug}`}
        onClick={handleProductDetails}
        className="relative block w-full h-[160px] bg-white overflow-hidden"
      >
        <Image
          src={item.imgs.previews[0]}
          alt={item.title}
          fill
          className="object-contain p-3 mix-blend-multiply transition-transform duration-300 group-hover:scale-105"
        />
      </Link>

      {/* Card Content */}
      <div className="px-3 pt-2 pb-3 flex flex-col gap-1.5 border-t border-gray-1">

        {/* Rating */}
        <div className="flex items-center gap-1.5">
          <span className="flex items-center gap-0.5 bg-green text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
            4.2
            <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path>
            </svg>
          </span>
          <span className="text-[10px] text-dark-4">({item.reviews || 0})</span>
        </div>

        {/* Title */}
        <Link href={`/product/${slug}`} onClick={handleProductDetails}>
          <h3 className="font-medium text-dark text-[12px] leading-snug line-clamp-2 hover:text-blue transition-colors">
            {item.title}
          </h3>
        </Link>

        {/* Price */}
        <div className="flex items-center gap-2 flex-wrap mt-0.5">
          <span className="font-bold text-sm text-dark">{formatPrice(item.discountedPrice)}</span>
          {item.price > item.discountedPrice && (
            <span className="text-[10px] text-dark-4 line-through">{formatPrice(item.price)}</span>
          )}
        </div>

        {/* Add to Cart */}
        <button
          onClick={handleAddToCart}
          className="w-full mt-1 bg-white border border-blue text-blue text-[11px] font-bold py-1.5 rounded hover:bg-blue hover:text-white transition-colors duration-200"
        >
          ADD TO CART
        </button>

      </div>
    </div>
  );
};

export default ProductItem;
