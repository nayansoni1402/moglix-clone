"use client";
import React, { useState, useEffect } from "react";
import Hero from "./Hero";
import TopBrandsStrip from "./TopBrandsStrip";
import OfferStrip from "./offerStrip";

import NewArrival from "./NewArrivals";
import PromoBanner from "./PromoBanner";
import HomeSeoDescription from "./HomeSeoDescription";
import { useConfig } from "@/app/context/ConfigContext";

const Home = () => {
  const { promoBanners } = useConfig();
  const [categories, setCategories] = useState<any[]>([]);

  // Load dynamic promo banners from Strapi Global single-type, with elegant rich defaults
  const promo1 = promoBanners?.[0] || {
    title: "Quant Procure",
    subtitle: "Next Day Delivery on Top Brands",
    bgColor: "bg-green-light-5 text-green-dark",
    link: "/shop-with-sidebar"
  };

  const promo2 = promoBanners?.[1] || {
    title: "Medical Supplies & Safety",
    subtitle: "Upto 40% off on bulk orders",
    bgColor: "bg-blue-light-5 text-blue-dark",
    link: "/shop-with-sidebar"
  };

  useEffect(() => {
    async function fetchCategories() {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://127.0.0.1:1337/api';
        const response = await fetch(`${baseUrl}/categories?filters[showOnHomepage][$eq]=true&populate=*`);
        const json = await response.json();
        if (json && json.data && json.data.length > 0) {
          setCategories(json.data);
        }
      } catch (err) {
        console.error("Failed to load categories for home sliders:", err);
      }
    }
    fetchCategories();
  }, []);

  // Standard premium pre-configured fallback sections in case Strapi categories are empty
  const fallbackCarousels = [
    { title: "Top Selling Power Tools", slug: "/category/power-tools" },
    { title: "Electrical & Appliances", slug: "/category/electricals" },
    { title: "Medical & Lab Supplies", slug: "/category/medical" },
    { title: "Safety Shoes & Equipment", slug: "/category/safety" },
    { title: "Office & Gardening Supplies", slug: "/category/office" }
  ];

  const dynamicCarousels = categories.length > 0
    ? categories.map((cat: any) => ({
        title: cat.name,
        slug: `/category/${cat.slug}`
      }))
    : fallbackCarousels;

  return (
    <main className="bg-[#F4F5F9] pt-[136px]">
      <Hero />
      
      <OfferStrip />
      
      {/* Dynamic Product Carousels and Banner Integrations */}
      <div className="flex flex-col mt-6">
        {/* Always display Deals of the Day first */}
        <NewArrival title="Deals of the Day" viewAllLink="/category/deals" />
        
        {/* Banner 1 */}
        <PromoBanner title={promo1.title} subtitle={promo1.subtitle} bgColor={promo1.bgColor} link={promo1.link} />
        
        {/* Dynamic Category Sliders (First 2 categories) */}
        {dynamicCarousels.slice(0, 2).map((item, idx) => (
          <NewArrival key={`cat-upper-${idx}`} title={item.title} viewAllLink={item.slug} />
        ))}
        
        {/* Banner 2 */}
        <PromoBanner title={promo2.title} subtitle={promo2.subtitle} bgColor={promo2.bgColor} link={promo2.link} />
        
        {/* Dynamic Category Sliders (Remaining categories) */}
        {dynamicCarousels.slice(2).map((item, idx) => (
          <NewArrival key={`cat-lower-${idx}`} title={item.title} viewAllLink={item.slug} />
        ))}
      </div>

      <HomeSeoDescription />
    </main>
  );
};

export default Home;
