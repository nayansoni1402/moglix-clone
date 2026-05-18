import React from "react";
import { getCategoryData } from "@/lib/api/category";
import CategoryClient from "./CategoryClient";
import FilterSidebar from "@/components/Category/FilterSidebar";
import { notFound } from "next/navigation";

export default async function CategoryPage({ 
  params, 
  searchParams 
}: { 
  params: Promise<{ slug: string[] }>,
  searchParams: Promise<{ page?: string }> 
}) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const slugArray = resolvedParams.slug;
  const slug = slugArray.join("/");
  const categoryID = slugArray[slugArray.length - 1];
  
  // Quant Procure uses 1-based page numbering in URLs, API uses 0-based index
  const pageParam = resolvedSearchParams.page;
  const currentPage = pageParam ? Math.max(0, parseInt(pageParam) - 1) : 0;

  try {
    const apiData = await getCategoryData(categoryID, currentPage);
    
    if (!apiData || !apiData.productSearchResult) {
      return notFound();
    }

    const totalProducts = apiData.productSearchResult.totalProducts;

    return (
        <main className="bg-[#F4F5F9] min-h-screen pt-[160px] pb-10">
            <div className="max-w-[1300px] mx-auto px-4 sm:px-8 xl:px-0">
                
                {/* Breadcrumb & Header - Server Side for SEO */}
                <div className="mb-6">
                    <div className="text-sm text-dark-3 mb-2">
                        <span className="hover:text-blue cursor-pointer">Home</span> &gt; 
                        <span className="hover:text-blue cursor-pointer ml-1">Categories</span> &gt; 
                        <span className="text-dark font-medium capitalize ml-1">{apiData.categoryName || slug.replace(/-/g, " ")}</span>
                    </div>
                    <h1 className="text-2xl font-bold text-dark mb-3">
                        {apiData.categoryName} <span className="text-sm font-normal text-dark-3 ml-2">({totalProducts} Products)</span>
                    </h1>
                    
                    {apiData.categoryDescription && (
                        <div className="bg-white border border-gray-3 p-4 rounded-md text-sm text-dark-3 leading-relaxed shadow-sm">
                            <div dangerouslySetInnerHTML={{ __html: apiData.categoryDescription }} />
                        </div>
                    )}
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    <FilterSidebar />

                    <div className="w-full lg:w-3/4 xl:w-[calc(100%-302px)]">
                        <CategoryClient 
                            initialData={apiData} 
                            slug={slug} 
                            categoryID={categoryID}
                            initialPage={currentPage}
                        />
                    </div>
                </div>
            </div>

            {/* Category FAQ Section - Server Side for SEO */}
            {apiData.categoryFaqs && apiData.categoryFaqs.length > 0 && (
                <CategoryFaqSection faqs={apiData.categoryFaqs} />
            )}
        </main>
    );
  } catch (error) {
    console.error("Error fetching category data:", error);
    return notFound();
  }
}

// Separate component for FAQ to keep it clean and interactive if needed
function CategoryFaqSection({ faqs }: { faqs: { question: string; answer: string }[] }) {
    return (
        <section className="bg-white py-10 mt-15 border-t border-gray-3">
            <div className="max-w-[1300px] mx-auto px-4 sm:px-8 xl:px-0 text-sm text-dark-3">
                <h3 className="text-xl font-bold text-dark mb-6">Frequently Asked Questions</h3>
                <div className="space-y-3 max-w-3xl">
                    {faqs.map((faq, index) => (
                        <FaqItem key={index} faq={faq} />
                    ))}
                </div>
            </div>
        </section>
    );
}

// Minimal client logic for FAQ toggle inside server-rendered list
import FaqItem from "./FaqItem";
