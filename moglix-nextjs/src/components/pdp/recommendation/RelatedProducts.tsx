"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import type { SimilarProduct } from "@/types/product";
import { formatPrice, getMoglixImageUrl, calculateDiscount } from "@/lib/utils/product";
import WishlistButton from "@/components/ui/WishlistButton";

interface RelatedProductsProps {
  title: string;
  products: SimilarProduct[];
  viewAllLink?: string;
}

function ProductCard({ product }: { product: SimilarProduct }) {
  const discount = calculateDiscount(product.mrp, product.salesPrice);
  const imageUrl = getMoglixImageUrl(product.moglixImageNumber, "large");

  return (
    <div className="flex-shrink-0 w-[180px] sm:w-[200px] bg-white border border-[#e0e0e0] rounded-lg overflow-hidden hover:shadow-md transition-all duration-200 group relative flex flex-col">
      <Link href={`/${product.productUrl}`} className="block relative w-full aspect-square p-4 bg-white">
        <Image
          src={imageUrl}
          alt={product.productName}
          fill
          className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
          sizes="200px"
        />
        {discount > 0 && (
          <span className="absolute top-2 left-2 bg-[#d9232d] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm z-10">
            {discount}% OFF
          </span>
        )}
      </Link>
      <WishlistButton
        product={{
          msn: product.moglixPartNumber || "",
          name: product.productName,
          price: product.mrp,
          discountedPrice: product.salesPrice,
          image: imageUrl
        }}
        className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center rounded-full border border-[#e0e0e0] bg-white transition-colors z-10"
        iconSize={14}
        iconClassName="text-gray-400 hover:text-red"
        activeIconClassName="text-red fill-red"
      />

      <div className="px-3 pb-3 flex-1 flex flex-col">
        <Link href={`/${product.productUrl}`} className="flex-1 flex flex-col">
          {/* Rating */}
          {product.avgRating && product.avgRating > 0 ? (
            <div className="flex items-center gap-1 mt-1 mb-1.5">
              <div className="flex items-center gap-0.5 bg-[#1ea86d] text-white text-[10px] font-bold px-1 py-0.5 rounded-sm">
                {product.avgRating.toFixed(1)} <Star size={8} className="fill-white" />
              </div>
              <span className="text-[10px] text-[#878787]">({product.reviewCount || 0})</span>
            </div>
          ) : (
            <div className="h-5 mt-1 mb-1.5" /> // Spacer if no rating
          )}

          {/* Title */}
          <p className="text-[13px] text-[#212121] leading-[1.3] line-clamp-2 font-medium mb-2">
            {product.variantName || product.productName}
          </p>

          {/* Price */}
          <div className="flex items-baseline gap-1 mt-auto">
            <span className="text-sm font-bold text-[#212121]">
              {formatPrice(product.salesPrice)}
            </span>
            {product.mrp > product.salesPrice && (
              <span className="text-[11px] text-[#878787] line-through">
                {formatPrice(product.mrp)}
              </span>
            )}
          </div>
        </Link>

        {/* Add to Cart Button */}
        <button 
          className="mt-3 w-full border border-[#0056b3] text-[#0056b3] text-[11px] font-bold py-1.5 rounded-md uppercase hover:bg-blue/5 transition-colors"
          onClick={(e) => {
            e.preventDefault();
            // Handle add to cart
          }}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}

export default function RelatedProducts({ title, products, viewAllLink }: RelatedProductsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  if (!products.length) return null;

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: dir === "left" ? -400 : 400,
      behavior: "smooth",
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base sm:text-lg font-bold text-body">{title}</h2>
        <div className="flex items-center gap-2">
          {viewAllLink && (
            <Link
              href={viewAllLink}
              className="text-blue text-xs font-bold hover:underline mr-2"
            >
              View All
            </Link>
          )}
          <button
            onClick={() => scroll("left")}
            className="w-8 h-8 rounded-full border border-gray-2 flex items-center justify-center hover:bg-gray-1 transition-colors"
            aria-label="Scroll left"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => scroll("right")}
            className="w-8 h-8 rounded-full border border-gray-2 flex items-center justify-center hover:bg-gray-1 transition-colors"
            aria-label="Scroll right"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 -mx-1 px-1"
      >
        {products.map((product) => (
          <ProductCard key={product.moglixPartNumber} product={product} />
        ))}
      </div>
    </div>
  );
}
