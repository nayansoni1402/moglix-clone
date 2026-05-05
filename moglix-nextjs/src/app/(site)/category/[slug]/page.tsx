import React, { use } from "react";
import FilterSidebar from "@/components/Category/FilterSidebar";
import ProductItem from "@/components/Common/ProductItem";
import shopData from "@/components/Shop/shopData";

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  const categoryName = slug.replace("-", " ").toUpperCase();

  return (
    <main className="bg-[#F4F5F9] min-h-screen pt-[180px] pb-10">
      <div className="max-w-[1300px] mx-auto px-4 sm:px-8 xl:px-0">
        
        {/* Breadcrumb & Header */}
        <div className="mb-6">
          <div className="text-sm text-dark-3 mb-2">
            <span className="hover:text-blue cursor-pointer">Home</span> &gt; <span className="hover:text-blue cursor-pointer">Categories</span> &gt; <span className="text-dark font-medium capitalize">{slug.replace("-", " ")}</span>
          </div>
          <h1 className="text-2xl font-bold text-dark mb-3">
            {categoryName} <span className="text-sm font-normal text-dark-3 ml-2">(1200 Products)</span>
          </h1>
          
          {/* Top Category Description */}
          <div className="bg-white border border-gray-3 p-4 rounded-md text-sm text-dark-3 leading-relaxed shadow-sm">
            <p>
              Shop for premium quality <strong>{categoryName.toLowerCase()}</strong> online at Moglix. We offer a wide variety of {categoryName.toLowerCase()} from top brands, ensuring high performance, durability, and safety for your industrial or personal needs. Browse our extensive catalog and get the best deals and bulk discounts.
            </p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <FilterSidebar />

          {/* Main Content */}
          <div className="w-full lg:w-3/4 xl:w-[calc(100%-302px)]">
            {/* Sort Bar */}
            <div className="bg-white p-4 rounded-md border border-gray-3 shadow-sm mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-dark-3 text-custom-sm">Showing 1-20 of 1200 results</span>
              <div className="flex items-center gap-3">
                <span className="text-dark text-custom-sm font-medium">Sort By:</span>
                <select className="border border-gray-3 rounded px-3 py-1.5 text-custom-sm text-dark outline-none focus:border-blue">
                  <option>Popularity</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Newest Arrivals</option>
                </select>
              </div>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {/* Multiplying the shop data to show a grid */}
              {[...shopData, ...shopData, ...shopData, ...shopData].slice(0, 16).map((item, index) => (
                <div key={index}>
                  <ProductItem item={item} />
                </div>
              ))}
            </div>

            {/* Pagination / Load More */}
            <div className="mt-10 flex justify-center">
              <button className="bg-white border border-blue text-blue font-medium px-8 py-2 rounded-md hover:bg-blue hover:text-white transition-colors">
                Load More
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Category SEO Description */}
      <section className="bg-white py-10 mt-15 border-t border-gray-3">
        <div className="max-w-[1300px] mx-auto px-4 sm:px-8 xl:px-0 text-sm text-dark-3">
          <h2 className="text-xl font-bold text-dark mb-4">Buy Best Quality {categoryName} Online at Moglix</h2>
          <p className="mb-4">
            Moglix offers a huge range of {categoryName.toLowerCase()} from top brands. All our products are 100% genuine and procured directly from the manufacturers or authorized distributors. Get the best deals and discounts on {categoryName.toLowerCase()} and enjoy hassle-free online shopping.
          </p>
          <h3 className="font-semibold text-dark mb-2">FAQs</h3>
          <p className="mb-2"><strong>Q1. Which are the top brands in this category?</strong></p>
          <p className="mb-4">A. Some of the most popular brands include Bosch, Makita, and Stanley.</p>
        </div>
      </section>
    </main>
  );
}
