"use client";

import React, { useRef, useCallback } from "react";
import ProductItem from "@/components/Common/ProductItem";
import { CategoryData } from "@/types/category";
import { getCategoryData } from "@/lib/api/category";
import { mapCategoryProductToProductItem } from "@/utils/product";
import { useInfiniteQuery } from "@tanstack/react-query";

interface CategoryClientProps {
    initialData: any;
    slug?: string;
    categoryID?: string;
    initialPage?: number;
}

export default function CategoryClient({ initialData, slug, categoryID, initialPage }: CategoryClientProps) {
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        status,
    } = useInfiniteQuery({
        queryKey: ["categoryProducts", categoryID],
        queryFn: ({ pageParam }) => getCategoryData(categoryID, pageParam as number),
        initialPageParam: initialPage,
        getNextPageParam: (lastPage, allPages) => {
            const productsLoadedSoFar = allPages.reduce((acc, page) => acc + page.productSearchResult.products.length, 0);
            const totalProducts = lastPage.productSearchResult.totalProducts;

            if (productsLoadedSoFar < totalProducts) {
                return initialPage + allPages.length;
            }
            return undefined;
        },
        initialData: {
            pages: [initialData],
            pageParams: [initialPage],
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    const observer = useRef<IntersectionObserver | null>(null);
    const lastProductElementRef = useCallback(
        (node: HTMLDivElement | null) => {
            if (isFetchingNextPage) return;
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasNextPage) {
                    fetchNextPage();
                }
            });
            if (node) observer.current.observe(node);
        },
        [isFetchingNextPage, hasNextPage, fetchNextPage]
    );

    // Flatten products from all pages
    const allProducts = data?.pages.flatMap(page => page.productSearchResult.products) || [];
    const totalProducts = initialData.productSearchResult.totalProducts;

    return (
        <>
            {/* Sort Bar */}
            <div className="bg-white p-4 rounded-md border border-gray-3 shadow-sm mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-dark-3 text-custom-sm">
                    Showing {initialPage * 40 + 1}-{initialPage * 40 + allProducts.length} of {totalProducts} results
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
                {allProducts.map((item, index) => (
                    <div
                        key={item.moglixPartNumber || index}
                        ref={index === allProducts.length - 1 ? lastProductElementRef : null}
                    >
                        <ProductItem item={mapCategoryProductToProductItem(item)} />
                    </div>
                ))}
            </div>

            {/* Loading Spinner */}
            {isFetchingNextPage && (
                <div className="mt-12 mb-8 flex flex-col items-center justify-center gap-4">
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-blue shadow-sm"></div>
                    <span className="text-sm text-dark-3 font-medium animate-pulse text-blue">Loading more premium products...</span>
                </div>
            )}

            {!hasNextPage && allProducts.length > 0 && (
                <div className="mt-12 mb-8 text-center">
                    <div className="inline-block px-6 py-2 bg-white border border-gray-3 rounded-full shadow-sm text-dark-3 text-sm font-medium">
                        You've reached the end of the collection
                    </div>
                </div>
            )}

            {status === "error" && (
                <div className="mt-8 text-center text-red-500">
                    Error loading more products. Please refresh the page.
                </div>
            )}
        </>
    );
}
