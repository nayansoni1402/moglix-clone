"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { ProductGroup } from "@/types/product";

interface SpecificationTableProps {
  product: ProductGroup;
}

export default function SpecificationTable({ product }: SpecificationTableProps) {
  const [expanded, setExpanded] = useState(false);
  const attrs = product.productAttributes;
  const entries = Object.entries(attrs);
  const visible = expanded ? entries : entries.slice(0, 8);

  return (
    <div>
      <h2 className="text-lg font-bold text-body mb-4">Technical Specifications</h2>

      <div className="rounded-xl border border-gray-2 overflow-hidden">
        {/* Product Identity */}
        <div className="bg-gray-1 px-4 py-2.5 border-b border-gray-2">
          <span className="text-xs font-bold text-dark-4 uppercase tracking-wider">
            General Information
          </span>
        </div>
        <div className="divide-y divide-gray-1">
          {[
            { label: "Brand", value: product.productBrandDetails.brandName },
            { label: "Category", value: product.productCategoryDetails.categoryName },
            { label: "Model", value: attrs["Model"]?.[0] || "N/A" },
            { label: "Item Dimensions", value: product.itemDimension },
            { label: "Item Weight", value: product.itemWeight },
            { label: "Country of Origin", value: attrs["Country of origin"]?.[0] || "India" },
          ]
            .filter((r) => r.value && r.value !== "N/A")
            .map((row, i) => (
              <div key={i} className={`flex ${i % 2 === 0 ? "bg-white" : "bg-[#FAFAFA]"}`}>
                <div className="w-2/5 sm:w-1/3 px-4 py-3 text-xs font-bold text-dark-4 uppercase tracking-tight border-r border-gray-1">
                  {row.label}
                </div>
                <div className="flex-1 px-4 py-3 text-sm text-dark-3 font-medium">{row.value}</div>
              </div>
            ))}
        </div>

        {/* Technical Attributes */}
        {entries.length > 0 && (
          <>
            <div className="bg-gray-1 px-4 py-2.5 border-y border-gray-2">
              <span className="text-xs font-bold text-dark-4 uppercase tracking-wider">
                Technical Details
              </span>
            </div>
            <div className="divide-y divide-gray-1">
              {visible.map(([key, values], i) => (
                <div key={key} className={`flex ${i % 2 === 0 ? "bg-white" : "bg-[#FAFAFA]"}`}>
                  <div className="w-2/5 sm:w-1/3 px-4 py-3 text-xs font-bold text-dark-4 uppercase tracking-tight border-r border-gray-1">
                    {key}
                  </div>
                  <div className="flex-1 px-4 py-3 text-sm text-dark-3 font-medium">
                    {values.join(", ")}
                  </div>
                </div>
              ))}
            </div>

            {entries.length > 8 && (
              <div className="border-t border-gray-1 p-3 flex justify-center">
                <button
                  onClick={() => setExpanded(!expanded)}
                  className="flex items-center gap-1.5 text-blue text-sm font-bold hover:underline transition-colors"
                >
                  {expanded ? "Show Less" : `Show All ${entries.length} Specifications`}
                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
                  />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Manufacturer */}
      {product.manufacturerDetails && (
        <div className="mt-4 p-4 bg-gray-1 rounded-xl border border-gray-1">
          <p className="text-xs text-gray-5 font-medium">
            <span className="font-bold text-dark-4">Manufacturer: </span>
            {product.manufacturerDetails}
          </p>
          {product.packerDetails && (
            <p className="text-xs text-gray-5 font-medium mt-1">
              <span className="font-bold text-dark-4">Packer: </span>
              {product.packerDetails}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
