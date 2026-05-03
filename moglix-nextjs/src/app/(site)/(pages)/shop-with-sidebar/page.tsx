import React from "react";
import ShopWithSidebar from "@/components/ShopWithSidebar";
import { getProducts } from "@/lib/cms-products";

import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Shop Page | NextCommerce Nextjs E-commerce template",
  description: "This is Shop Page for NextCommerce Template",
  // other metadata
};

export const dynamic = "force-dynamic";

const ShopWithSidebarPage = async () => {
  const products = await getProducts();

  return (
    <main>
      <ShopWithSidebar products={products} />
    </main>
  );
};

export default ShopWithSidebarPage;
