import React from "react";
import Image from "next/image";
import Link from "next/link";

const brands = [
  { name: "FAB", img: "/images/brand/brand-01.png" },
  { name: "CabONE", img: "/images/brand/brand-02.png" },
  { name: "Luminous", img: "/images/brand/brand-03.png" },
  { name: "Bosch", img: "/images/brand/brand-04.png" },
  { name: "Makita", img: "/images/brand/brand-05.png" },
  { name: "Havells", img: "/images/brand/brand-06.png" },
  { name: "Exide", img: "/images/brand/brand-01.png" },
  { name: "Syska", img: "/images/brand/brand-02.png" },
];

const TopBrandsStrip = () => {
  return (
    <section className="bg-white py-8 border-b border-gray-3 mt-6">
      <div className="max-w-[1300px] mx-auto px-4 sm:px-8 xl:px-0">
        <h2 className="font-semibold text-xl xl:text-heading-6 text-dark mb-6">
          Top Brands & Related Categories
        </h2>
        <div className="flex items-center gap-6 overflow-x-auto scrollbar-hide pb-4">
          {brands.map((brand, index) => (
            <Link key={index} href="/category/top-brands" className="flex flex-col items-center gap-3 min-w-[100px] group">
              <div className="w-24 h-24 rounded-full border border-gray-3 p-2 group-hover:border-blue transition-colors flex items-center justify-center bg-gray-1 overflow-hidden relative">
                {/* Fallback image style since actual images might not exist */}
                <div className="w-full h-full flex items-center justify-center text-dark-3 font-bold text-lg bg-gray-2 rounded-full">
                  {brand.name.substring(0, 3)}
                </div>
              </div>
              <span className="text-custom-sm font-medium text-dark group-hover:text-blue transition-colors text-center">
                {brand.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopBrandsStrip;
