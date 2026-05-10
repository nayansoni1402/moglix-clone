"use client";

import { useState } from "react";
import type { ProductDetails } from "@/types/product";

// PDP Components
import Breadcrumbs from "@/components/pdp/breadcrumbs/Breadcrumbs";
import ProductGallery from "@/components/pdp/gallery/ProductGallery";
import ProductInfo from "@/components/pdp/pricing/ProductInfo";
import PriceBox from "@/components/pdp/pricing/PriceBox";
import OffersSection from "@/components/pdp/pricing/OffersSection";
import DeliveryChecker from "@/components/pdp/delivery/DeliveryChecker";
import DescriptionBlock from "@/components/pdp/specifications/DescriptionBlock";
import SpecificationTable from "@/components/pdp/specifications/SpecificationTable";
import ReviewsSection from "@/components/pdp/reviews/ReviewsSection";
import FaqSection from "@/components/pdp/faq/FaqSection";
import RelatedProducts from "@/components/pdp/recommendation/RelatedProducts";
import StickyMobileBar from "@/components/pdp/mobile/StickyMobileBar";
import VariantSelector from "@/components/pdp/variants/VariantSelector";
import MoglixInsights from "@/components/pdp/insights/MoglixInsights";

interface PDPClientProps {
  data: ProductDetails;
  msn: string;
}

const TABS = ["Overview", "Specifications", "Reviews", "FAQs"] as const;
type Tab = (typeof TABS)[number];

export default function PDPClient({ data, msn }: PDPClientProps) {
  const [activeTab, setActiveTab] = useState<Tab>("Overview");
  const {
    productGroup,
    breadcrumb,
    productReviews,
    questionAndAnswer,
    tags,
    tagProducts,
    similarProducts,
    applicablePromo,
    prepaidDiscount,
  } = data;

  const taggedGroups = tagProducts || [];

  return (
    <main className="bg-[#F4F5F9] min-h-screen pt-[140px] sm:pt-[160px] pb-28 lg:pb-10">
      <div className="max-w-[1300px] mx-auto px-4 sm:px-6 xl:px-0">

        {/* ── Breadcrumbs ─────────────────────────────────────────── */}
        <Breadcrumbs items={breadcrumb} productName={productGroup.productName} />

        {/* ── Main Product Section ─────────────────────────────────── */}
        <div className="bg-white rounded-xl border border-gray-2 shadow-sm mb-6 overflow-hidden">
          <div className="flex flex-col lg:flex-row">

            {/* Left: Image Gallery */}
            <div className="w-full lg:w-[420px] xl:w-[460px] shrink-0 p-5 border-b lg:border-b-0 lg:border-r border-gray-1">
              <ProductGallery
                images={productGroup.productAllImages}
                productName={productGroup.productName}
                videos={productGroup.productVideos}
                msn={msn}
                tags={productGroup.productTags || tags}
              />
            </div>

            {/* Center: Product Info */}
            <div className="flex-1 p-5 lg:pr-0 min-w-0 border-b lg:border-b-0 lg:border-r border-gray-1">
              <ProductInfo product={productGroup} msn={msn} tags={tags} />

              {/* Variant Selectors (Nominal Size, Colour, etc.) */}
              {productGroup.productFilterAttributesList?.length ? (
                <VariantSelector
                  filters={productGroup.productFilterAttributesList}
                  currentMsn={msn}
                />
              ) : null}

              {/* Mobile: Offers + Delivery below info */}
              <div className="mt-4 lg:hidden space-y-4">
                <OffersSection promo={applicablePromo} prepaidDiscount={prepaidDiscount} />
                <DeliveryChecker />
              </div>
            </div>

            {/* Right: Sticky Price Box (Desktop only) */}
            <div className="hidden lg:block w-[300px] xl:w-[320px] shrink-0 p-5 space-y-4">
              <div className="sticky top-[160px] space-y-4">
                <PriceBox product={productGroup} msn={msn} />
                <DeliveryChecker />
                <OffersSection promo={applicablePromo} prepaidDiscount={prepaidDiscount} />
                {data.productWidget && (
                  <MoglixInsights widget={data.productWidget} />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── Tabs Section ─────────────────────────────────────────── */}
        <div className="bg-white rounded-xl border border-gray-2 shadow-sm mb-6 overflow-hidden">
          {/* Tab Navigation */}
          <div className="flex border-b border-gray-2 overflow-x-auto scrollbar-hide">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                id={`pdp-tab-${tab.toLowerCase()}`}
                className={`px-5 sm:px-8 py-4 text-sm font-bold whitespace-nowrap transition-all border-b-2 -mb-[2px] ${
                  activeTab === tab
                    ? "text-blue border-blue bg-white"
                    : "text-dark-4 border-transparent hover:text-body"
                }`}
              >
                {tab}
                {tab === "Reviews" && productReviews?.summaryData?.reviewCount > 0 && (
                  <span className="ml-1.5 text-[11px] bg-gray-1 text-gray-5 font-bold px-1.5 py-0.5 rounded-full">
                    {productReviews.summaryData.reviewCount}
                  </span>
                )}
                {tab === "FAQs" && questionAndAnswer?.totalCount > 0 && (
                  <span className="ml-1.5 text-[11px] bg-gray-1 text-gray-5 font-bold px-1.5 py-0.5 rounded-full">
                    {questionAndAnswer.totalCount}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-5 sm:p-8">
            {activeTab === "Overview" && (
              <DescriptionBlock product={productGroup} />
            )}
            {activeTab === "Specifications" && (
              <SpecificationTable product={productGroup} />
            )}
            {activeTab === "Reviews" && productReviews && (
              <ReviewsSection reviews={productReviews} />
            )}
            {activeTab === "FAQs" && (
              <FaqSection faqs={questionAndAnswer?.qlist || []} />
            )}
          </div>
        </div>

        {/* ── Similar Products ─────────────────────────────────────── */}
        {similarProducts?.products?.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-2 shadow-sm mb-6 p-5 sm:p-6">
            <RelatedProducts
              title="Similar Products"
              products={similarProducts.products}
              viewAllLink={`/solar/solar-inverter/213180000`}
            />
          </div>
        )}

        {/* ── Tagged Product Groups ────────────────────────────────── */}
        {taggedGroups.slice(0, 3).map(
          (group) =>
            group.productList?.length > 0 && (
              <div
                key={group.productTagName}
                className="bg-white rounded-xl border border-gray-2 shadow-sm mb-6 p-5 sm:p-6"
              >
                <RelatedProducts
                  title={group.productTagName}
                  products={group.productList.slice(0, 12)}
                />
              </div>
            )
        )}

        {/* ── Related Categories ───────────────────────────────────── */}
        {data.relatedLinks?.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-2 shadow-sm mb-6 p-5 sm:p-6">
            <h3 className="text-base font-bold text-body mb-4">Explore Related Categories</h3>
            <div className="flex flex-wrap gap-2">
              {data.relatedLinks.map((link) => (
                <a
                  key={link.friendlyUrl}
                  href={`/${link.friendlyUrl}`}
                  className="text-xs font-medium text-blue bg-blue/5 border border-blue/20 px-3 py-1.5 rounded-full hover:bg-blue hover:text-white transition-all duration-150"
                >
                  {link.title}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Mobile Sticky Bottom Bar ─────────────────────────────── */}
      <StickyMobileBar product={productGroup} msn={msn} />
    </main>
  );
}
