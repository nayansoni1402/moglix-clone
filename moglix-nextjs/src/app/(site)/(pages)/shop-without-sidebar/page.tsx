import React from "react";
import ShopWithoutSidebar from "@/components/ShopWithoutSidebar";
import { getProducts } from "@/lib/cms-products";

import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Shop Page | NextCommerce Nextjs E-commerce template",
  description: "This is Shop Page for NextCommerce Template",
  // other metadata
};

export const dynamic = "force-dynamic";

const ShopWithoutSidebarPage = async () => {
  const products = await getProducts();

  return (
    <main>
      <ShopWithoutSidebar products={products} />
    </main>
  );
};

export default ShopWithoutSidebarPage;
