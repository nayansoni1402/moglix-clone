"use client";

import React, { useRef, useCallback, useState, useMemo } from "react";
import ProductItem from "@/components/Common/ProductItem";
import ProductItemShimmer from "@/components/Common/ProductItemShimmer";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getCategoryData } from "@/lib/api/category";
import { mapCategoryProductToProductItem } from "@/utils/product";
import Link from "next/link";

interface CategoryClientProps {
    initialData: any;
    slug?: string;
    categoryID?: string;
    initialPage?: number;
}

export default function CategoryClient({ initialData, slug, categoryID, initialPage = 0 }: CategoryClientProps) {
    const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
    const [sortBy, setSortBy] = useState<string>("Popularity");
    const [maxPriceFilter, setMaxPriceFilter] = useState<number>(0);

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isFetching,
        status,
    } = useInfiniteQuery({
        queryKey: ["categoryProducts", categoryID, selectedBrands, maxPriceFilter],
        queryFn: ({ pageParam }) => getCategoryData(
            categoryID as string, 
            pageParam as number, 
            24, 
            "popularity", 
            "desc", 
            selectedBrands, 
            maxPriceFilter
        ),
        initialPageParam: initialPage,
        getNextPageParam: (lastPage, allPages) => {
            const productsLoadedSoFar = allPages.reduce((acc, page) => acc + page.productSearchResult.products.length, 0);
            const totalProducts = lastPage.productSearchResult.totalProducts;

            if (productsLoadedSoFar < totalProducts) {
                return initialPage + allPages.length;
            }
            return undefined;
        },
        initialData: (selectedBrands.length === 0 && maxPriceFilter === 0) ? {
            pages: [initialData],
            pageParams: [initialPage],
        } : undefined,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    const isFilterLoading = (status as string) === "pending" || (isFetching && !isFetchingNextPage);

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

    // Flatten products from all loaded pages
    const allProducts = useMemo(() => {
        return data?.pages.flatMap(page => page.productSearchResult.products) || [];
    }, [data]);

    // Load dynamic brand list and max price bounds directly from category metadata
    const uniqueBrands = useMemo(() => {
        return initialData.filterMetadata?.brands || [];
    }, [initialData]);

    const maxProductPrice = useMemo(() => {
        return initialData.filterMetadata?.maxPrice || 10000;
    }, [initialData]);
    
    // Set default max price bound once products are loaded
    const currentMaxPriceBound = maxPriceFilter || maxProductPrice;

    const filteredAndSortedProducts = useMemo(() => {
        let result = [...allProducts];

        // Sorting logic
        if (sortBy === "Price: Low to High") {
            result.sort((a, b) => a.salesPrice - b.salesPrice);
        } else if (sortBy === "Price: High to Low") {
            result.sort((a, b) => b.salesPrice - a.salesPrice);
        } else if (sortBy === "Newest Arrivals") {
            result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        }

        return result;
    }, [allProducts, sortBy]);

    const totalProducts = data?.pages[0]?.productSearchResult?.totalProducts ?? initialData.productSearchResult.totalProducts;

    const toggleBrand = (brandName: string) => {
        setSelectedBrands(prev => 
            prev.includes(brandName) 
                ? prev.filter(b => b !== brandName) 
                : [...prev, brandName]
        );
    };

    // Subcategories list from initial dynamic data
    const sidebarSubcategories = initialData.subcategories || [];

    return (
        <div className="flex flex-col lg:flex-row gap-8 w-full">
            {/* Dynamic Filter Sidebar integrated directly inside CategoryClient */}
            <div className="w-full lg:w-1/4 xl:w-[270px] flex-shrink-0">
                <div 
                    className="bg-white p-5 rounded-md border border-gray-3 shadow-sm sticky top-[100px] max-h-[calc(100vh-130px)] overflow-y-auto pr-3"
                    style={{ scrollbarWidth: 'thin' }}
                >
                    
                    {/* Dynamic Subcategories */}
                    {sidebarSubcategories.length > 0 && (
                        <div className="mb-6">
                            <h3 className="font-semibold text-dark text-base mb-3 border-b border-gray-3 pb-2 flex items-center gap-2">
                                <span className="w-1 h-3 bg-blue rounded-full" /> Subcategories
                            </h3>
                            <ul className="flex flex-col gap-2.5 text-dark-3 text-custom-sm">
                                {sidebarSubcategories.map((sub: any, si: number) => (
                                    <li key={si}>
                                        <Link 
                                            href={`/category/${slug}/${sub.slug}`} 
                                            className="hover:text-blue transition-colors flex items-center justify-between"
                                        >
                                            <span>{sub.name}</span>
                                            <span className="text-[10px] bg-gray-2 text-dark-4 px-1.5 py-0.5 rounded-full font-medium">explore</span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Dynamic Price Slider */}
                    <div className="mb-6">
                        <h3 className="font-semibold text-dark text-base mb-3 border-b border-gray-3 pb-2 flex items-center gap-2">
                            <span className="w-1 h-3 bg-blue rounded-full" /> Price Range
                        </h3>
                        <div className="flex flex-col gap-3">
                            <input
                                type="range"
                                min="0"
                                max={maxProductPrice}
                                value={currentMaxPriceBound}
                                onChange={(e) => setMaxPriceFilter(Number(e.target.value))}
                                className="w-full h-1 bg-gray-3 rounded-lg appearance-none cursor-pointer accent-blue"
                            />
                            <div className="flex justify-between text-custom-sm text-dark-3 font-medium">
                                <span>$0</span>
                                <span className="text-blue">${currentMaxPriceBound}</span>
                            </div>
                        </div>
                    </div>

                    {/* Dynamic Brands Checkbox Filter */}
                    {uniqueBrands.length > 0 && (
                        <div className="mb-6">
                            <h3 className="font-semibold text-dark text-base mb-3 border-b border-gray-3 pb-2 flex items-center gap-2">
                                <span className="w-1 h-3 bg-blue rounded-full" /> Brands
                            </h3>
                            <div className="flex flex-col gap-2.5 max-h-[220px] overflow-y-auto pr-1">
                                {uniqueBrands.map((brand) => (
                                    <label key={brand} className="flex items-center gap-2.5 text-custom-sm text-dark-3 cursor-pointer hover:text-blue transition-colors">
                                        <input 
                                            type="checkbox" 
                                            checked={selectedBrands.includes(brand)}
                                            onChange={() => toggleBrand(brand)}
                                            className="w-4 h-4 rounded border-gray-3 text-blue focus:ring-blue cursor-pointer" 
                                        />
                                        <span>{brand}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Standard Premium Features */}
                    <div>
                        <h3 className="font-semibold text-dark text-base mb-3 border-b border-gray-3 pb-2 flex items-center gap-2">
                            <span className="w-1 h-3 bg-blue rounded-full" /> Customer Rating
                        </h3>
                        <div className="flex flex-col gap-2.5">
                            {["4★ & above", "3★ & above", "2★ & above"].map((ratingStr, ri) => (
                                <label key={ri} className="flex items-center gap-2.5 text-custom-sm text-dark-3 cursor-pointer hover:text-blue transition-colors">
                                    <input type="radio" name="rating-filter" className="w-4 h-4 border-gray-3 text-blue focus:ring-blue cursor-pointer" />
                                    <span>{ratingStr}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Dynamic Grid Column */}
            <div className="w-full lg:w-3/4">
                {/* Sort & Stats Bar */}
                <div className="bg-white p-4 rounded-md border border-gray-3 shadow-sm mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <span className="text-dark-3 text-custom-sm">
                        Showing <strong>{filteredAndSortedProducts.length}</strong> of <strong>{totalProducts}</strong> products
                    </span>
                    <div className="flex items-center gap-3">
                        <span className="text-dark text-custom-sm font-semibold">Sort By:</span>
                        <select 
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="border border-gray-3 rounded px-3 py-1.5 text-custom-sm text-dark outline-none focus:border-blue cursor-pointer font-medium bg-white"
                        >
                            <option>Popularity</option>
                            <option>Price: Low to High</option>
                            <option>Price: High to Low</option>
                            <option>Newest Arrivals</option>
                        </select>
                    </div>
                </div>

                {/* Product Grid */}
                {isFilterLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {Array.from({ length: 8 }).map((_, idx) => (
                            <ProductItemShimmer key={idx} />
                        ))}
                    </div>
                ) : filteredAndSortedProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {filteredAndSortedProducts.map((item, index) => (
                            <div
                                key={item.moglixPartNumber || index}
                                ref={index === filteredAndSortedProducts.length - 1 ? lastProductElementRef : null}
                            >
                                <ProductItem item={mapCategoryProductToProductItem(item)} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-lg border border-gray-3 p-12 text-center shadow-sm">
                        <p className="text-dark font-medium text-lg mb-2">No products match your active filters</p>
                        <button 
                            onClick={() => { setSelectedBrands([]); setMaxPriceFilter(0); }}
                            className="text-blue text-sm font-semibold border border-blue px-4 py-2 rounded hover:bg-blue hover:text-white transition-all mt-2"
                        >
                            Reset All Filters
                        </button>
                    </div>
                )}

                {/* Loading Spinner */}
                {isFetchingNextPage && (
                    <div className="mt-12 mb-8 flex flex-col items-center justify-center gap-4">
                        <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-blue shadow-sm"></div>
                        <span className="text-sm text-dark-3 font-medium animate-pulse text-blue">Loading more premium products...</span>
                    </div>
                )}

                {!hasNextPage && filteredAndSortedProducts.length > 0 && (
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
            </div>
        </div>
    );
}
