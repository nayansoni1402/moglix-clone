import React from "react";
import { getBrandData } from "@/lib/api/category";
import CategoryClient from "@/app/(site)/category/[...slug]/CategoryClient";
import { notFound } from "next/navigation";

export default async function BrandPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  
  try {
    const apiData = await getBrandData(slug);
    
    if (!apiData || !apiData.productSearchResult) {
      return notFound();
    }

    // Adapt brand data to CategoryData structure for CategoryClient
    const adaptedData = {
        ...apiData,
        categoryName: apiData.brandName,
        categoryId: apiData.brandId,
    };

    return (
      <CategoryClient 
        initialData={adaptedData} 
        slug={slug} 
      />
    );
  } catch (error) {
    console.error("Error fetching brand data:", error);
    return notFound();
  }
}
