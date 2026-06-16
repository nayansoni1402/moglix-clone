
"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

const brands = [
  { name: "Banner 2", img: "/images/offer_strips/Gold-Banner1.webp" },
  { name: "Banner 3", img: "/images/offer_strips/Goldbanner1stdesktop2xgif.gif" },

];

import { useConfig } from "@/app/context/ConfigContext";

const OfferStrip = () => {
  const { offerStripBanners } = useConfig();
  
  const displayOfferBanners = offerStripBanners && offerStripBanners.length > 0 
    ? offerStripBanners.map(b => ({ name: `Banner ${b.id}`, img: b.image, link: b.link }))
    : brands.map(b => ({ name: b.name, img: b.img, link: "/category/top-brands" }));

  return (
    <section className="bg-white py-4 mt-0">
  <div className="w-full px-2 sm:px-16">

    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">

      {displayOfferBanners.map((brand, index) => (
        <Link
          key={index}
          href={brand.link}
          className="
            relative block overflow-hidden rounded-xl
            hover:brightness-105 active:brightness-95
            transition-all duration-200
            focus-visible:outline-2 focus-visible:outline-blue-500
          "
        >
          {/* aspect-[2.1/1] matches your banner proportions in screenshot */}
          <div className="relative w-full aspect-[2.1/1]">
            <Image
              src={brand.img}
              alt={brand.name}
              fill
              sizes="
                (max-width: 640px)  50vw,
                (max-width: 1024px) 50vw,
                25vw
              "
              className="object-cover object-center"
              priority={index < 2}
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