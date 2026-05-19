"use client";
import React from "react";

export default function ProductItemShimmer() {
  return (
    <div className="w-full bg-white border border-gray-3 rounded-lg overflow-hidden flex flex-col animate-pulse">
      {/* Product Image Skeleton */}
      <div className="w-full h-[160px] bg-gray-2" />

      {/* Card Content Skeleton */}
      <div className="px-3 pt-2 pb-3 flex flex-col gap-2.5 border-t border-gray-1">
        {/* Rating Skeleton */}
        <div className="flex items-center gap-1.5">
          <div className="w-10 h-4 bg-gray-2 rounded" />
          <div className="w-8 h-3 bg-gray-2 rounded" />
        </div>

        {/* Title Skeleton */}
        <div className="space-y-1.5">
          <div className="w-full h-3 bg-gray-2 rounded" />
          <div className="w-3/4 h-3 bg-gray-2 rounded" />
        </div>

        {/* Price Skeleton */}
        <div className="w-16 h-4 bg-gray-2 rounded mt-1" />

        {/* Button Skeleton */}
        <div className="w-full h-[28px] bg-gray-2 rounded mt-1" />
      </div>
    </div>
  );
}
