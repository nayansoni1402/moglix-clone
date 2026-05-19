"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import Link from "next/link";
import Image from "next/image";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

// Replace these with actual image paths from your backend/CMS
const banners = [
  { id: 1, image: "/images/hero/main-banner-1.png", link: "/category/power-tools" },
  { id: 2, image: "/images/hero/main-banner-2.png", link: "/category/safety" },
];

const rightBanners = [
  { id: 1, image: "/images/hero/side-banner-1.png", link: "/mogli-express" },
  { id: 2, image: "/images/hero/side-banner-2.png", link: "/bulk-orders" },
];

import { useConfig } from "@/app/context/ConfigContext";

const Hero = () => {
  const { heroBanners, sideBanners } = useConfig();

  const displayBanners = heroBanners && heroBanners.length > 0 ? heroBanners : banners;
  const displayRightBanners = sideBanners && sideBanners.length > 0 ? sideBanners : rightBanners;

  return (
    <section className="w-full bg-[#F4F5F9] py-4">
      <div className="max-w-[1300px] mx-auto px-4 sm:px-8 xl:px-0 flex flex-col md:flex-row gap-4">

        {/* Main Carousel (Image Based) */}
        <div className="w-full md:w-[74%] h-[260px] sm:h-[320px] md:h-[380px] rounded-xl overflow-hidden relative shadow-md">
          <Swiper
            spaceBetween={0}
            centeredSlides={true}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            navigation={true}
            loop={true}
            modules={[Autoplay, Pagination, Navigation]}
            className="w-full h-full moglix-hero-swiper"
          >
            {displayBanners.map((banner) => (
              <SwiperSlide key={banner.id}>
                <Link href={banner.link} className="block w-full h-full relative bg-gray-3">
                  <Image
                    src={banner.image}
                    alt={`Promo Banner ${banner.id}`}
                    fill
                    className="object-cover"
                    priority={banner.id === 1}
                  />
                  {/* Fallback overlay text in case image doesn't load/exist locally */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-10 transition-opacity bg-black">
                     Banner Image Placeholder
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Right Side Banners (Image Based) */}
        <div className="w-full md:w-[26%] flex flex-row md:flex-col gap-4">
          {displayRightBanners.map((b) => (
            <Link
              key={b.id}
              href={b.link}
              className="flex-1 md:flex-none md:h-[calc(50%-8px)] rounded-xl overflow-hidden relative shadow-sm hover:shadow-md transition-shadow group bg-gray-3 block"
            >
              <Image
                src={b.image}
                alt={`Side Banner ${b.id}`}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
               {/* Fallback overlay text */}
               <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-10 transition-opacity bg-black">
                 Side Banner Placeholder
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Hero;

