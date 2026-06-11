
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
    <section className=" mt-6">
  <div className="max-w-[1300px] w-full mx-auto px-4 sm:px-8 xl:px-0">

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
          {/* Aspect ratio box — keeps proportions on every screen size */}
          <div className="relative w-full aspect-[2.4/1]">
            <Image
              src={brand.img}
              alt={brand.name}
              fill
              sizes="
                (max-width: 640px)  50vw,
                (max-width: 1280px) 25vw,
                325px
              "
              className="object-cover object-center"
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