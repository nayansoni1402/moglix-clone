import { fetchStrapi } from "@/utils/api";
import ShopDetails from "@/components/ShopDetails";
import { notFound } from "next/navigation";

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const slug = await params.slug;

  // Fetch product by slug from Strapi
  const data = await fetchStrapi(`/products`, `filters[slug][$eq]=${slug}&populate=*`);

  if (!data.data || data.data.length === 0) {
    notFound();
  }

  const product = data.data[0];
  console.log("🚀 ~ ProductPage ~ product:", product)

  return (
    <main>
      {/* Pass the product data to the component */}
      <ShopDetails product={product} />
    </main>
  );
}
