"use client";
import React, { useRef, useCallback, useState, useEffect } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import ProductItem from "@/components/Common/ProductItem";
import shopData from "@/components/Shop/shopData";
import { mapStrapiProduct } from "@/utils/product-mapper";

import "swiper/css";
import "swiper/css/navigation";

interface Props {
  title?: string;
  viewAllLink?: string;
}

const NewArrival = ({ title = "New Arrivals", viewAllLink = "/shop-with-sidebar" }: Props) => {
  const sliderRef = useRef<any>(null);
  const [products, setProducts] = useState<any[]>([]);

  const categorySlug = viewAllLink.startsWith("/category/")
    ? viewAllLink.replace("/category/", "")
    : "";

  useEffect(() => {
    async function fetchProducts() {
      try {
        let url = `${process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://127.0.0.1:1337/api'}/products?populate=*&pagination[pageSize]=12`;
        if (categorySlug && categorySlug !== "deals") {
          url += `&filters[$or][0][categories][slug][$eq]=${categorySlug}&filters[$or][1][categories][parent][slug][$eq]=${categorySlug}&filters[$or][2][categories][parent][parent][slug][$eq]=${categorySlug}`;
        }
        
        const response = await fetch(url);
        const json = await response.json();
        
        if (json && json.data) {
          const mapped = json.data.map(mapStrapiProduct);
          setProducts(mapped);
        }
      } catch (err) {
        console.error("Failed to load products for", title, err);
      }
    }

    fetchProducts();
  }, [categorySlug, title]);

  const handlePrev = useCallback(() => {
    if (!sliderRef.current) return;
    sliderRef.current.swiper.slidePrev();
  }, []);

  const handleNext = useCallback(() => {
    if (!sliderRef.current) return;
    sliderRef.current.swiper.slideNext();
  }, []);

  return (
    <section className="overflow-hidden py-8 bg-white border-b border-gray-3">
      <div className="max-w-[1300px] w-full mx-auto px-4 sm:px-8 xl:px-0">
        
        {/* Section Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            {/* Accent bar like Quant Procure */}
            <span className="w-1.5 h-7 bg-blue rounded-full block flex-shrink-0" />
            <h2 className="font-bold text-xl text-dark">{title}</h2>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href={viewAllLink}
              className="text-blue font-semibold text-xs border border-blue px-3 py-1.5 rounded hover:bg-blue hover:text-white transition-colors"
            >
              VIEW ALL
            </Link>
            <div className="flex items-center gap-1.5">
              <button
                onClick={handlePrev}
                className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-3 text-dark hover:bg-blue hover:text-white hover:border-blue transition-all"
                aria-label="Previous"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 18l-6-6 6-6"/></svg>
              </button>
              <button
                onClick={handleNext}
                className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-3 text-dark hover:bg-blue hover:text-white hover:border-blue transition-all"
                aria-label="Next"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6"/></svg>
              </button>
            </div>
          </div>
        </div>

        {/* Slider */}
        <div className="relative">
          <Swiper
            ref={sliderRef}
            modules={[Navigation]}
            spaceBetween={16}
            slidesPerView={1.5}
            breakpoints={{
              480:  { slidesPerView: 2.2 },
              640:  { slidesPerView: 2.8 },
              768:  { slidesPerView: 3.5 },
              1024: { slidesPerView: 4.5 },
              1280: { slidesPerView: 5.5 },
            }}
          >
            {products.map((item, key) => (
              <SwiperSlide key={key} className="h-auto">
                <ProductItem item={item} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

      </div>
    </section>
  );
};

export default NewArrival;
