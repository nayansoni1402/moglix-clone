import { cache } from "react";
import { fetchStrapi } from "./api";

const STRAPI_BASE =
  process.env.NEXT_PUBLIC_STRAPI_API_URL?.replace("/api", "") ||
  "http://127.0.0.1:1337";

export interface GlobalData {
  siteName: string;
  siteDescription: string;
  faviconUrl: string | null;
  logoUrl: string | null;
  heroBanners: Array<{ id: number; image: string; link: string }>;
  sideBanners: Array<{ id: number; image: string; link: string }>;
  offerStripBanners: Array<{ id: number; image: string; link: string }>;
  promoBanners: Array<{ id: number; title: string; subtitle: string; bgColor: string; link: string }>;
  footerSections: Array<{ heading: string; links: Array<{ label: string; href: string }> }>;
  contactAddress: string;
  contactPhone: string;
  contactEmail: string;
  copyrightText: string;
  appStoreUrl: string;
  playStoreUrl: string;
  seoDescription: string | null;
}

function resolveStrapiUrl(raw: string | null | undefined): string | null {
  if (!raw) return null;
  return raw.startsWith("http") ? raw : `${STRAPI_BASE}${raw}`;
}

export const getGlobalData = cache(async (): Promise<GlobalData> => {
  try {
    const json = await fetchStrapi("/global", {
      populate: [
        "favicon",
        "logo",
        "heroBanners",
        "heroBanners.image",
        "sideBanners",
        "sideBanners.image",
        "offerStripBanners",
        "offerStripBanners.image",
        "promoBanners",
        "footerSections",
        "footerSections.links",
      ],
    });
    
    const d = json?.data;

    const mapBanners = (list: any[]) => {
      if (!list || !Array.isArray(list)) return [];
      return list.map((b) => ({
        id: b.id,
        image: resolveStrapiUrl(b.image?.url) || "/images/placeholder.png",
        link: b.link || "#",
      }));
    };

    const mapPromoBanners = (list: any[]) => {
      if (!list || !Array.isArray(list)) return [];
      return list.map((p) => ({
        id: p.id,
        title: p.title || "",
        subtitle: p.subtitle || "",
        bgColor: p.bgColor || "bg-green-light-5 text-green-dark",
        link: p.link || "#",
      }));
    };

    const mapFooterSections = (list: any[]) => {
      if (!list || !Array.isArray(list)) return [];
      return list.map((s) => ({
        heading: s.heading || "",
        links: (s.links || []).map((l: any) => ({
          label: l.label || "",
          href: l.href || "#",
        })),
      }));
    };

    // Standard static fallbacks in case CMS is not populated
    const fallbackBanners = [
      { id: 1, image: "/images/hero/main-banner-1.png", link: "/category/power-tools" },
      { id: 2, image: "/images/hero/main-banner-2.png", link: "/category/safety" },
    ];

    const fallbackSideBanners = [
      { id: 1, image: "/images/hero/side-banner-1.png", link: "/mogli-express" },
      { id: 2, image: "/images/hero/side-banner-2.png", link: "/bulk-orders" },
    ];

    const fallbackOfferBanners = [
      { id: 1, image: "/images/offer_strips/Gold-Banner1.webp", link: "/category/top-brands" },
      { id: 2, image: "/images/offer_strips/Goldbanner1stdesktop2xgif.gif", link: "/category/top-brands" },
      { id: 3, image: "/images/offer_strips/GoldBanner1stGIF2x.gif", link: "/category/top-brands" },
    ];

    const fallbackPromoBanners = [
      {
        id: 1,
        title: "Quant Procure",
        subtitle: "Next Day Delivery on Top Brands",
        bgColor: "bg-green-light-5 text-green-dark",
        link: "/category/power-tools"
      },
      {
        id: 2,
        title: "Medical Supplies & Safety",
        subtitle: "Upto 40% off on bulk orders",
        bgColor: "bg-blue-light-5 text-blue-dark",
        link: "/category/medical"
      }
    ];

    const fallbackFooterSections = [
      {
        heading: "Help & Support",
        links: [
          { label: "Track Order", href: "/my-account" },
          { label: "Contact Us", href: "/contact" },
        ]
      },
      {
        heading: "Account",
        links: [
          { label: "My Account", href: "/my-account" },
          { label: "Login / Register", href: "/signin" },
          { label: "Cart", href: "/cart" },
          { label: "Wishlist", href: "/wishlist" },
        ]
      },
      {
        heading: "Quick Link",
        links: [
          { label: "Privacy Policy", href: "/privacy-policy" },
          { label: "Refund Policy", href: "/refund-policy" },
          { label: "Terms of Use", href: "/terms-of-use" },
          { label: "FAQ's", href: "/faq" },
        ]
      }
    ];

    const dbHeroBanners = mapBanners(d?.heroBanners);
    const dbSideBanners = mapBanners(d?.sideBanners);
    const dbOfferBanners = mapBanners(d?.offerStripBanners);
    const dbPromoBanners = mapPromoBanners(d?.promoBanners);
    const dbFooterSections = mapFooterSections(d?.footerSections);

    return {
      siteName: d?.siteName ?? "Quant Procure - Industrial Products",
      siteDescription: d?.siteDescription ?? "B2B E-commerce platform for industrial products",
      faviconUrl: resolveStrapiUrl(d?.favicon?.url),
      logoUrl: resolveStrapiUrl(d?.logo?.url),
      heroBanners: dbHeroBanners.length > 0 ? dbHeroBanners : fallbackBanners,
      sideBanners: dbSideBanners.length > 0 ? dbSideBanners : fallbackSideBanners,
      offerStripBanners: dbOfferBanners.length > 0 ? dbOfferBanners : fallbackOfferBanners,
      promoBanners: dbPromoBanners.length > 0 ? dbPromoBanners : fallbackPromoBanners,
      footerSections: dbFooterSections.length > 0 ? dbFooterSections : fallbackFooterSections,
      contactAddress: d?.contactAddress ?? "685 Market Street, Las Vegas, LA 95820, United States.",
      contactPhone: d?.contactPhone ?? "(+099) 532-786-9843",
      contactEmail: d?.contactEmail ?? "support@quantprocure.com",
      copyrightText: d?.copyrightText ?? "All rights reserved by Quant Procure.",
      appStoreUrl: d?.appStoreUrl ?? "#",
      playStoreUrl: d?.playStoreUrl ?? "#",
      seoDescription: d?.seoDescription ?? null
    };
  } catch (err: any) {
    console.warn("[getGlobalData] CMS not available or endpoint forbidden, using local fallbacks.", err.message);
    
    return {
      siteName: "Quant Procure - Industrial Products",
      siteDescription: "B2B E-commerce platform for industrial products",
      faviconUrl: null,
      logoUrl: null,
      heroBanners: [
        { id: 1, image: "/images/hero/main-banner-1.png", link: "/category/power-tools" },
        { id: 2, image: "/images/hero/main-banner-2.png", link: "/category/safety" },
      ],
      sideBanners: [
        { id: 1, image: "/images/hero/side-banner-1.png", link: "/mogli-express" },
        { id: 2, image: "/images/hero/side-banner-2.png", link: "/bulk-orders" },
      ],
      offerStripBanners: [
        { id: 1, image: "/images/offer_strips/Gold-Banner1.webp", link: "/category/top-brands" },
        { id: 2, image: "/images/offer_strips/Goldbanner1stdesktop2xgif.gif", link: "/category/top-brands" },
        { id: 3, image: "/images/offer_strips/GoldBanner1stGIF2x.gif", link: "/category/top-brands" },
        { id: 3, image: "/images/offer_strips/Gold-Banner-eecocool.png", link: "/category/top-brands" },

      ],
      promoBanners: [
        {
          id: 1,
          title: "Quant Procure",
          subtitle: "Next Day Delivery on Top Brands",
          bgColor: "bg-green-light-5 text-green-dark",
          link: "/category/power-tools"
        },
        {
          id: 2,
          title: "Medical Supplies & Safety",
          subtitle: "Upto 40% off on bulk orders",
          bgColor: "bg-blue-light-5 text-blue-dark",
          link: "/category/medical"
        }
      ],
      footerSections: [
        {
          heading: "Help & Support",
          links: [
            { label: "Track Order", href: "/my-account" },
            { label: "Contact Us", href: "/contact" },
          ]
        },
        {
          heading: "Account",
          links: [
            { label: "My Account", href: "/my-account" },
            { label: "Login / Register", href: "/signin" },
            { label: "Cart", href: "/cart" },
            { label: "Wishlist", href: "/wishlist" },
          ]
        },
        {
          heading: "Quick Link",
          links: [
            { label: "Privacy Policy", href: "/privacy-policy" },
            { label: "Refund Policy", href: "/refund-policy" },
            { label: "Terms of Use", href: "/terms-of-use" },
            { label: "FAQ's", href: "/faq" },
          ]
        }
      ],
      contactAddress: "685 Market Street, Las Vegas, LA 95820, United States.",
      contactPhone: "(+099) 532-786-9843",
      contactEmail: "support@quantprocure.com",
      copyrightText: "All rights reserved by Quant Procure.",
      appStoreUrl: "#",
      playStoreUrl: "#",
      seoDescription: null
    };
  }
});
