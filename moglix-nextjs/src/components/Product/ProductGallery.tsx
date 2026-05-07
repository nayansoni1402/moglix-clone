"use client";
import React, { useState } from "react";
import Image from "next/image";

const images = [
  "/images/products/product-01.png",
  "/images/products/product-02.png",
  "/images/products/product-03.png",
  "/images/products/product-04.png",
];

const ProductGallery = () => {
  const [activeImg, setActiveImg] = useState(images[0]);

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Main Image */}
      <div className="w-full bg-white border border-gray-3 rounded-md p-4 flex items-center justify-center relative aspect-square">
        {/* Placeholder image tag since actual images might not exist */}
        <div className="w-full h-full relative">
          <Image
            src={activeImg}
            alt="Product"
            fill
            className="object-contain"
          />
        </div>
      </div>

      {/* Thumbnails */}
      <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
        {images.map((img, index) => (
          <div
            key={index}
            onClick={() => setActiveImg(img)}
            className={`w-20 h-20 flex-shrink-0 border rounded-md p-2 cursor-pointer transition ${
              activeImg === img ? "border-blue shadow-sm" : "border-gray-3 hover:border-gray-4"
            }`}
          >
            <div className="w-full h-full relative bg-gray-1">
              <Image
                src={img}
                alt={`Thumb ${index}`}
                fill
                className="object-contain"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductGallery;
