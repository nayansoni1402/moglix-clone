import { getProductBySlug } from "@/lib/cms-products";
import ShopDetails from "@/components/ShopDetails";
import { notFound } from "next/navigation";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <main>
      <ShopDetails product={product} />
    </main>
  );
}
