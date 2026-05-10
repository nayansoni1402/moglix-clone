import { Suspense } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProductDetails } from "@/lib/api/product";
import type { ProductDetails } from "@/types/product";
import PDPClient from "./PDPClient";

interface Props {
  params: Promise<{ slug: string }>;
}

/**
 * The slug can be:
 * - a raw MSN like "msnq94pm8zwek0"
 * - or a full Moglix URL slug like "eapro-3500va-...-eglp1p450048solar"
 *
 * We attempt to fetch by the slug directly as an MSN first.
 */
function extractMsn(slug: string): string {
  // Slugs are lowercased MSNs (like msnq94pm8zwek0)
  return slug.toLowerCase().trim();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const msn = extractMsn(slug);
  try {
    const res = await getProductDetails(msn);
    if (!res.status || !res.data) return { title: "Product Not Found" };
    const product = res.data.productGroup;
    const imageUrl = product.productAllImages[0]
      ? `https://img.moglimg.com/p/${product.productAllImages[0].moglixImageNumber}-xlarge.jpg`
      : undefined;

    return {
      title: `${product.productName} | Moglix`,
      description: product.productDescripton?.slice(0, 155) || product.productName,
      keywords: [
        product.productBrandDetails.brandName,
        product.productCategoryDetails.categoryName,
        msn.toUpperCase(),
      ],
      openGraph: {
        title: product.productName,
        description: product.productDescripton?.slice(0, 155),
        images: imageUrl ? [{ url: imageUrl }] : [],
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: product.productName,
        description: product.productDescripton?.slice(0, 155),
        images: imageUrl ? [imageUrl] : [],
      },
      alternates: {
        canonical: `/product/${product.canonicalUrl}`,
      },
    };
  } catch {
    return { title: "Product" };
  }
}

function buildJsonLd(data: ProductDetails) {
  const product = data.productGroup;
  const price = product.priceQuantityCountry;
  const imageUrl = product.productAllImages[0]
    ? `https://img.moglimg.com/p/${product.productAllImages[0].moglixImageNumber}-xlarge.jpg`
    : undefined;

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.productName,
    description: product.productDescripton,
    brand: { "@type": "Brand", name: product.productBrandDetails.brandName },
    sku: data.msn,
    image: imageUrl,
    offers: {
      "@type": "Offer",
      price: price.sellingPrice,
      priceCurrency: "INR",
      availability: price.outOfStockFlag
        ? "https://schema.org/OutOfStock"
        : "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
    },
    aggregateRating:
      data.productReviews?.summaryData?.reviewCount > 0
        ? {
            "@type": "AggregateRating",
            ratingValue: data.productReviews.summaryData.finalAverageRating,
            reviewCount: data.productReviews.summaryData.reviewCount,
            bestRating: 5,
            worstRating: 1,
          }
        : undefined,
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const msn = extractMsn(slug);

  let data: ProductDetails;
  try {
    const res = await getProductDetails(msn);
    if (!res.status || !res.data) notFound();
    data = res.data;
  } catch {
    notFound();
  }

  const jsonLd = buildJsonLd(data);

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Suspense fallback={<div className="min-h-screen bg-[#F4F5F9]" />}>
        <PDPClient data={data} msn={msn} />
      </Suspense>
    </>
  );
}
