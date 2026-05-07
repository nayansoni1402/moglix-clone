"use client";
import React, { use, useState } from "react";
import FilterSidebar from "@/components/Category/FilterSidebar";
import ProductItem from "@/components/Common/ProductItem";
import shopData from "@/components/Shop/shopData";

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  const categoryName = slug.replace(/-/g, " ").toUpperCase();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: "Which are the top brands available in this category?",
      a: "At Moglix, we offer products from industry-leading brands like Bosch, Makita, Stanley, DeWalt, and Milwaukee."
    },
    {
      q: "Do the products in this category come with a warranty?",
      a: "Yes, most products come with a standard manufacturer warranty ranging from 6 months to 2 years."
    },
    {
      q: "Can I get bulk discounts for my business?",
      a: "Absolutely! Moglix offers significant discounts on bulk orders for B2B needs."
    },
    {
      q: "What is the typical delivery time for these products?",
      a: "Standard delivery usually takes between 3 to 5 business days."
    },
    {
      q: "Are the products sold here genuine?",
      a: "Yes, 100% authenticity is our guarantee. All products are sourced from authorized distributors."
    }
  ];

  return (
    <main className="bg-[#F4F5F9] min-h-screen pt-[180px] pb-10">
      <div className="max-w-[1300px] mx-auto px-4 sm:px-8 xl:px-0">
        
        {/* Breadcrumb & Header */}
        <div className="mb-6">
          <div className="text-sm text-dark-3 mb-2">
            <span className="hover:text-blue cursor-pointer">Home</span> &gt; <span className="hover:text-blue cursor-pointer">Categories</span> &gt; <span className="text-dark font-medium capitalize">{slug.replace(/-/g, " ")}</span>
          </div>
          <h1 className="text-2xl font-bold text-dark mb-3">
            {categoryName} <span className="text-sm font-normal text-dark-3 ml-2">(1200 Products)</span>
          </h1>
          
          <div className="bg-white border border-gray-3 p-4 rounded-md text-sm text-dark-3 leading-relaxed shadow-sm">
            <p>
              Shop for premium quality <strong>{categoryName.toLowerCase()}</strong> online at Moglix. We offer a wide variety of {categoryName.toLowerCase()} from top brands, ensuring high performance, durability, and safety for your industrial or personal needs.
            </p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <FilterSidebar />

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
              {[...shopData, ...shopData, ...shopData, ...shopData].slice(0, 16).map((item, index) => (
                <div key={index}>
                  <ProductItem item={item} />
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-10 flex justify-center">
              <button className="bg-white border border-blue text-blue font-medium px-8 py-2 rounded-md hover:bg-blue hover:text-white transition-colors">
                Load More
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Category SEO Description & FAQ Section */}
      <section className="bg-white py-10 mt-15 border-t border-gray-3">
        <div className="max-w-[1300px] mx-auto px-4 sm:px-8 xl:px-0 text-sm text-dark-3">
          <h2 className="text-xl font-bold text-dark mb-4">Buy Best Quality {categoryName} Online at Moglix</h2>
          <p className="mb-8 leading-relaxed text-base">
            Moglix offers a huge range of {categoryName.toLowerCase()} from top brands. All our products are 100% genuine and procured directly from the manufacturers or authorized distributors. Get the best deals and discounts on {categoryName.toLowerCase()} and enjoy hassle-free online shopping. Our commitment to quality ensures that you receive only the best-in-class products for your specific needs.
          </p>

          <h3 className="text-xl font-bold text-dark mb-6">Frequently Asked Questions</h3>
          <div className="space-y-3 max-w-3xl">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-gray-3 rounded-md overflow-hidden">
                <button 
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className={`w-full flex items-center justify-between p-4 text-left text-sm font-semibold transition-colors ${openFaq === index ? "bg-gray-1 text-blue" : "bg-white text-dark hover:bg-gray-50"}`}
                >
                  <span>{faq.q}</span>
                  <span className="text-lg">{openFaq === index ? "−" : "+"}</span>
                </button>
                {openFaq === index && (
                  <div className="p-4 pt-0 bg-gray-1">
                    <p className="text-dark-3 text-sm leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
