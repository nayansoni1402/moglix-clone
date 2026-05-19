"use client";
import React, { useState } from "react";

const FilterSidebar = () => {
  const [priceRange, setPriceRange] = useState(5000);

  return (
    <div className="w-full lg:w-1/4 xl:w-[270px] flex-shrink-0">
      <div className="bg-white p-5 rounded-md border border-gray-3 shadow-sm">
        <div className="mb-6">
          <h3 className="font-semibold text-dark text-lg mb-3 border-b border-gray-3 pb-2">
            Categories
          </h3>
          <ul className="flex flex-col gap-2 text-dark-3 text-custom-sm">
            <li className="hover:text-blue cursor-pointer">Power Tools (450)</li>
            <li className="hover:text-blue cursor-pointer">Hand Tools (200)</li>
            <li className="hover:text-blue cursor-pointer">Safety Shoes (120)</li>
            <li className="hover:text-blue cursor-pointer">Drill Machines (80)</li>
          </ul>
        </div>

        <div className="mb-6">
          <h3 className="font-semibold text-dark text-lg mb-3 border-b border-gray-3 pb-2">
            Price Range
          </h3>
          <div className="flex flex-col gap-3">
            <input
              type="range"
              min="0"
              max="10000"
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="w-full h-1 bg-gray-3 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-custom-sm text-dark-3">
              <span>$0</span>
              <span>${priceRange}</span>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="font-semibold text-dark text-lg mb-3 border-b border-gray-3 pb-2">
            Brands
          </h3>
          <div className="flex flex-col gap-2">
            {["Bosch", "Makita", "Stanley", "DeWalt", "Black & Decker"].map((brand) => (
              <label key={brand} className="flex items-center gap-2 text-custom-sm text-dark-3 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-3 text-blue focus:ring-blue" />
                {brand}
              </label>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-dark text-lg mb-3 border-b border-gray-3 pb-2">
            Discount
          </h3>
          <div className="flex flex-col gap-2">
            {["10% and above", "20% and above", "30% and above", "50% and above"].map((discount) => (
              <label key={discount} className="flex items-center gap-2 text-custom-sm text-dark-3 cursor-pointer">
                <input type="radio" name="discount" className="w-4 h-4 border-gray-3 text-blue focus:ring-blue" />
                {discount}
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;
