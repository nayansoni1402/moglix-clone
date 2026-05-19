import React from "react";
import { getCategoryData } from "@/lib/api/category";
import CategoryClient from "./CategoryClient";
import { notFound } from "next/navigation";
import FaqItem from "./FaqItem";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

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
  
  const pageParam = resolvedSearchParams.page;
  const currentPage = pageParam ? Math.max(0, parseInt(pageParam) - 1) : 0;

  try {
    const apiData = await getCategoryData(categoryID, currentPage);
    
    if (!apiData || !apiData.productSearchResult) {
      return notFound();
    }

    const totalProducts = apiData.productSearchResult.totalProducts;
    const taxonomyNames = apiData.taxonomy ? apiData.taxonomy.split(">").map(t => t.trim()) : [];
    const breadcrumbItems = slugArray.map((segment, idx) => {
      const path = `/category/${slugArray.slice(0, idx + 1).join("/")}`;
      const name = (taxonomyNames[idx]) || segment.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
      return { name, path };
    });

    return (
        <main className="bg-[#F4F5F9] min-h-screen pt-[160px] pb-10">
            <div className="max-w-[1300px] mx-auto px-4 sm:px-8 xl:px-0">
                
                {/* Breadcrumb & Header - Server Side for SEO */}
                <div className="mb-6">
                    <nav aria-label="Breadcrumb" className="mb-4">
                        <ol className="flex items-center gap-1 text-xs text-gray-5 overflow-x-auto whitespace-nowrap scrollbar-hide py-1">
                            <li className="flex items-center shrink-0">
                                <Link
                                    href="/"
                                    className="flex items-center gap-1 text-blue hover:text-blue-dark transition-colors font-medium"
                                >
                                    <Home size={13} />
                                    <span>Home</span>
                                </Link>
                            </li>
                            <li className="flex items-center gap-1 shrink-0">
                                <ChevronRight size={12} className="text-gray-4" />
                                <span className="text-gray-5 font-medium">Category</span>
                            </li>
                            {breadcrumbItems.map((item, idx) => {
                                const isLast = idx === breadcrumbItems.length - 1;
                                return (
                                    <li key={idx} className="flex items-center gap-1 shrink-0">
                                        <ChevronRight size={12} className="text-gray-4" />
                                        {isLast ? (
                                            <span className="text-body font-semibold truncate max-w-[200px] sm:max-w-[400px]">
                                                {item.name}
                                            </span>
                                        ) : (
                                            <Link
                                                href={item.path}
                                                className="text-blue hover:text-blue-dark transition-colors font-medium hover:underline"
                                            >
                                                {item.name}
                                            </Link>
                                        )}
                                    </li>
                                );
                            })}
                        </ol>
                    </nav>
                    <h1 className="text-2xl font-bold text-dark mb-3 flex items-center gap-3">
                        <span className="w-1.5 h-8 bg-blue rounded-full block flex-shrink-0" />
                        <span>{apiData.categoryName}</span>
                        <span className="text-sm font-normal text-dark-4 bg-gray-2 px-3 py-1 rounded-full">({totalProducts} Products)</span>
                    </h1>
                </div>

                {/* Categories and Filter Columns */}
                <div className="w-full">
                    <CategoryClient 
                        initialData={apiData} 
                        slug={slug} 
                        categoryID={categoryID}
                        initialPage={currentPage}
                    />
                </div>
            </div>

            {/* Category FAQ Section - Server Side for SEO */}
            {apiData.categoryFaqs && apiData.categoryFaqs.length > 0 && (
                <CategoryFaqSection faqs={apiData.categoryFaqs} />
            )}

            {/* Category SEO Description Block - Dynamically rendered with rich markdown */}
            {apiData.categoryDescription && (
                <section className="bg-white py-10 mt-10 border-t border-gray-3">
                    <div className="max-w-[1300px] mx-auto px-4 sm:px-8 xl:px-0 text-sm text-dark-3">
                        {parseMarkdown(apiData.categoryDescription)}
                    </div>
                </section>
            )}
        </main>
    );
  } catch (error) {
    console.error("Error fetching category data:", error);
    return notFound();
  }
}

function CategoryFaqSection({ faqs }: { faqs: { question: string; answer: string }[] }) {
    return (
        <section className="bg-white py-10 mt-15 border-t border-gray-3">
            <div className="max-w-[1300px] mx-auto px-4 sm:px-8 xl:px-0 text-sm text-dark-3">
                <h3 className="text-xl font-bold text-dark mb-6 flex items-center gap-2">
                    <span className="w-1 h-5 bg-blue rounded-full" /> Frequently Asked Questions
                </h3>
                <div className="space-y-3 max-w-3xl">
                    {faqs.map((faq, index) => (
                        <FaqItem key={index} faq={faq} />
                    ))}
                </div>
            </div>
        </section>
    );
}

// Reusable Markdown parser to render category SEO styling with bold prefix and H2 headers
function parseMarkdown(md: string) {
  if (!md) return null;
  const lines = md.split(/\n+/);
  
  return lines.map((line, idx) => {
    const trimmed = line.trim();
    if (!trimmed) return null;
    
    if (trimmed.startsWith("**") && trimmed.endsWith("**")) {
      return (
        <h2 key={idx} className="text-lg font-semibold text-dark mt-6 mb-2 block">
          {trimmed.slice(2, -2)}
        </h2>
      );
    }
    
    if (trimmed.startsWith("### ")) {
      return (
        <h3 key={idx} className="text-base font-semibold text-dark mt-6 mb-2 block">
          {renderInline(trimmed.substring(4))}
        </h3>
      );
    }
    if (trimmed.startsWith("## ")) {
      return (
        <h2 key={idx} className="text-lg font-semibold text-dark mt-6 mb-2 block">
          {renderInline(trimmed.substring(3))}
        </h2>
      );
    }
    if (trimmed.startsWith("# ")) {
      return (
        <h1 key={idx} className="text-xl font-bold text-dark mt-6 mb-2 block">
          {renderInline(trimmed.substring(2))}
        </h1>
      );
    }
    
    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      const cleanItem = trimmed.replace(/^[-*]\s+/, "");
      return (
        <ul key={idx} className="list-disc pl-5 my-2">
          <li>{renderInline(cleanItem)}</li>
        </ul>
      );
    }
    
    const colonIndex = trimmed.indexOf(":");
    if (colonIndex > 0 && colonIndex < 40) {
      const prefix = trimmed.substring(0, colonIndex);
      const suffix = trimmed.substring(colonIndex + 1);
      return (
        <p key={idx} className="mb-3 leading-relaxed">
          <strong>{prefix}:</strong>{renderInline(suffix)}
        </p>
      );
    }
    
    return (
      <p key={idx} className="mb-3 leading-relaxed">
        {renderInline(trimmed)}
      </p>
    );
  });
}

function renderInline(text: string) {
  const parts = text.split(/\*\*([^*]+)\*\*/g);
  return parts.map((part, index) => {
    if (index % 2 === 1) {
      return <strong key={index}>{part}</strong>;
    }
    return part;
  });
}
