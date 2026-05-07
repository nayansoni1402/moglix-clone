import React from "react";
import Hero from "./Hero";
import TopBrandsStrip from "./TopBrandsStrip";
import OfferStrip from "./offerStrip";

import NewArrival from "./NewArrivals";
import PromoBanner from "./PromoBanner";
import HomeSeoDescription from "./HomeSeoDescription";

const Home = () => {
  return (
    <main className="bg-[#F4F5F9] pt-[180px]">
      <Hero />
      
      <OfferStrip />
      
      {/* Product Carousels and Banners */}
      <div className="flex flex-col mt-4">
        <NewArrival title="Deals of the Day" viewAllLink="/category/deals" />
        <PromoBanner title="Mogli Express" subtitle="Next Day Delivery on Top Brands" bgColor="bg-green-light-5 text-green-dark" />
        <NewArrival title="Top Selling Power Tools" viewAllLink="/category/power-tools" />
        <NewArrival title="Electrical & Appliances" viewAllLink="/category/electricals" />
        <PromoBanner title="Medical Supplies & Safety" subtitle="Upto 40% off on bulk orders" bgColor="bg-blue-light-5 text-blue-dark" />
        <NewArrival title="Medical & Lab Supplies" viewAllLink="/category/medical" />
        <NewArrival title="Safety Shoes & Equipment" viewAllLink="/category/safety" />
        <NewArrival title="Office & Gardening Supplies" viewAllLink="/category/office" />
      </div>

      <HomeSeoDescription />
    </main>
  );
};

export default Home;
