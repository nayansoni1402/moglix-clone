"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

const brands = [
  { name: "Banner 2", img: "/images/offer_strips/Gold-Banner1.webp" },
  { name: "Banner 3", img: "/images/offer_strips/Goldbanner1stdesktop2xgif.gif" },
  { name: "Banner 4", img: "/images/offer_strips/GoldBanner1stGIF2x.gif" },
];

import { useConfig } from "@/app/context/ConfigContext";

const OfferStrip = () => {
  const { offerStripBanners } = useConfig();
  
  const displayOfferBanners = offerStripBanners && offerStripBanners.length > 0 
    ? offerStripBanners.map(b => ({ name: `Banner ${b.id}`, img: b.image, link: b.link }))
    : brands.map(b => ({ name: b.name, img: b.img, link: "/category/top-brands" }));

  return (
    <section className="bg-white py-6 mt-0">
      <div className="w-full px-2 sm:px-4">

        {/* Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

          {displayOfferBanners.map((brand, index) => (
            <Link
              key={index}
              href={brand.link}
              className="rounded-xl overflow-hidden shadow-sm hover:shadow-md transition"
            >
              <div className="relative w-full h-[140px] sm:h-[160px] md:h-[180px] lg:h-[200px]">
                <Image
                  src={brand.img}
                  alt={brand.name}
                  fill
                  className="object-cover"
                  priority={index === 0}
                />
              </div>
            </Link>
          ))}

        </div>
      </div>
    </section>
  );
};

export default OfferStrip;