import { cache } from "react";
import { fetchStrapi } from "./api";

const STRAPI_BASE =
  process.env.NEXT_PUBLIC_STRAPI_API_URL?.replace("/api", "") ||
  "http://localhost:1337";

export interface GlobalData {
  siteName: string;
  siteDescription: string;
  faviconUrl: string | null;
  logoUrl: string | null;
}

function resolveStrapiUrl(raw: string | null | undefined): string | null {
  if (!raw) return null;
  return raw.startsWith("http") ? raw : `${STRAPI_BASE}${raw}`;
}

/**
 * Server-side cached fetch for Strapi "global" single-type.
 * React `cache()` deduplicates within a single server request,
 * and `next: { revalidate }` in fetchStrapi caches across requests (ISR).
 */
export const getGlobalData = cache(async (): Promise<GlobalData> => {
  try {
    const json = await fetchStrapi("/global", {
      populate: ["favicon", "logo"],
    });
    const d = json?.data;
    console.log("[getGlobalData] API response:", resolveStrapiUrl(d?.logo?.url));

    return {
      siteName: d?.siteName ?? "Quant Procure - Industrial Products",
      siteDescription:
        d?.siteDescription ?? "B2B E-commerce platform for industrial products",
      faviconUrl: resolveStrapiUrl(d?.favicon?.url),
      logoUrl: resolveStrapiUrl(d?.logo?.url),
    };
  } catch (err: any) {
    // Log as a warning instead of error to avoid triggering the Next.js dev error overlay
    console.warn("[getGlobalData] CMS not available or endpoint forbidden, using fallback.", err.message);
    return {
      siteName: "Quant Procure - Industrial Products",
      siteDescription: "B2B E-commerce platform for industrial products",
      faviconUrl: null,
      logoUrl: null,
    };
  }
});
