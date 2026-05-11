"use client";

import React, { useState } from "react";
import FilterSidebar from "@/components/Category/FilterSidebar";
import ProductItem from "@/components/Common/ProductItem";
import { CategoryData, CategoryProduct } from "@/types/category";
import { getProductImageUrl } from "@/lib/api/product";

interface CategoryClientProps {
    initialData: CategoryData;
    slug: string;
}

export default function CategoryClient({ initialData, slug }: CategoryClientProps) {
    const [data, setData] = useState(initialData);
    const [openFaq, setOpenFaq] = useState<number | null>(0);

    const products = data.productSearchResult.products;
    const totalProducts = data.productSearchResult.totalProducts;

    const mapToProductType = (item: CategoryProduct) => {
        return {
            title: item.productName,
            reviews: item.reviewCount || 0,
            price: item.mrp,
            discountedPrice: item.salesPrice,
            id: parseInt(item.moglixPartNumber.replace(/[^0-9]/g, "")) || 0,
            imgs: {
                thumbnails: [getProductImageUrl(item.moglixImageNumber, "medium")],
                previews: [getProductImageUrl(item.moglixImageNumber, "xxlarge")],
            },
        };
    };

    return (
        <main className="bg-[#F4F5F9] min-h-screen pt-[160px] pb-10">
            <div className="max-w-[1300px] mx-auto px-4 sm:px-8 xl:px-0">
                
                {/* Breadcrumb & Header */}
                <div className="mb-6">
                    <div className="text-sm text-dark-3 mb-2">
                        <span className="hover:text-blue cursor-pointer">Home</span> &gt; 
                        <span className="hover:text-blue cursor-pointer ml-1">Categories</span> &gt; 
                        <span className="text-dark font-medium capitalize ml-1">{data.categoryName || slug.replace(/-/g, " ")}</span>
                    </div>
                    <h1 className="text-2xl font-bold text-dark mb-3">
                        {data.categoryName} <span className="text-sm font-normal text-dark-3 ml-2">({totalProducts} Products)</span>
                    </h1>
                    
                    {data.categoryDescription && (
                        <div className="bg-white border border-gray-3 p-4 rounded-md text-sm text-dark-3 leading-relaxed shadow-sm">
                            <p dangerouslySetInnerHTML={{ __html: data.categoryDescription }} />
                        </div>
                    )}
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    <FilterSidebar />

                    <div className="w-full lg:w-3/4 xl:w-[calc(100%-302px)]">
                        {/* Sort Bar */}
                        <div className="bg-white p-4 rounded-md border border-gray-3 shadow-sm mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <span className="text-dark-3 text-custom-sm">
                                Showing 1-{products.length} of {totalProducts} results
                            </span>
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
                            {products.map((item, index) => (
                                <div key={item.moglixPartNumber || index}>
                                    <ProductItem item={mapToProductType(item)} />
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

            {/* Category FAQ Section */}
            {data.categoryFaqs && data.categoryFaqs.length > 0 && (
                <section className="bg-white py-10 mt-15 border-t border-gray-3">
                    <div className="max-w-[1300px] mx-auto px-4 sm:px-8 xl:px-0 text-sm text-dark-3">
                        <h3 className="text-xl font-bold text-dark mb-6">Frequently Asked Questions</h3>
                        <div className="space-y-3 max-w-3xl">
                            {data.categoryFaqs.map((faq, index) => (
                                <div key={index} className="border border-gray-3 rounded-md overflow-hidden">
                                    <button 
                                        onClick={() => setOpenFaq(openFaq === index ? null : index)}
                                        className={`w-full flex items-center justify-between p-4 text-left text-sm font-semibold transition-colors ${openFaq === index ? "bg-gray-1 text-blue" : "bg-white text-dark hover:bg-gray-50"}`}
                                    >
                                        <span>{faq.question}</span>
                                        <span className="text-lg">{openFaq === index ? "−" : "+"}</span>
                                    </button>
                                    {openFaq === index && (
                                        <div className="p-4 pt-0 bg-gray-1">
                                            <p className="text-dark-3 text-sm leading-relaxed">{faq.answer}</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </main>
    );
}
