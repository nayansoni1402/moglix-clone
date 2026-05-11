import React from "react";
import { getCategoryData } from "@/lib/api/category";
import CategoryClient from "./CategoryClient";
import { notFound } from "next/navigation";

export default async function CategoryPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const resolvedParams = await params;
  const slugArray = resolvedParams.slug;
  const slug = slugArray.join("/");
  
  // Extract category ID from slug (it's always the last segment in Moglix URLs)
  const categoryID = slugArray[slugArray.length - 1];

  try {
    const apiData = await getCategoryData(categoryID);
    
    if (!apiData || !apiData.productSearchResult) {
      return notFound();
    }

    return (
      <CategoryClient 
        initialData={apiData} 
        slug={slug} 
      />
    );
  } catch (error) {
    console.error("Error fetching category data:", error);
    return notFound();
  }
}
