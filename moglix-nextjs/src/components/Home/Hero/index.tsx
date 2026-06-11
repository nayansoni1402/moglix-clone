"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";

const Hero = () => {
  return (
    <section className="w-full bg-[#F4F5F9] pt-4 pb-6">
      <div className="max-w-[1300px] mx-auto px-4 sm:px-8 xl:px-0">
        <Link href="/category/power-tools" className="block w-full rounded-xl overflow-hidden shadow-md group">
          <Image
            src="/images/hero/main-banner-1.png"
            alt="Quant Procure Main Banner"
            width={1024}
            height={364}
            className="w-full h-auto group-hover:scale-[1.005] transition-transform duration-700"
            priority
          />
        </Link>
      </div>
    </section>
  );
};

export default Hero;
