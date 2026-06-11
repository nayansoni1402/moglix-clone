"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

// ── Types ───────────────────────────────────────────────────
export interface SiteConfig {
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
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

// Server-side data shape (passed from server component)
export interface SiteConfigServerData {
  siteName?: string;
  siteDescription?: string;
  faviconUrl?: string | null;
  logoUrl?: string | null;
  heroBanners?: Array<{ id: number; image: string; link: string }>;
  sideBanners?: Array<{ id: number; image: string; link: string }>;
  offerStripBanners?: Array<{ id: number; image: string; link: string }>;
  promoBanners?: Array<{ id: number; title: string; subtitle: string; bgColor: string; link: string }>;
  footerSections?: Array<{ heading: string; links: Array<{ label: string; href: string }> }>;
  contactAddress?: string;
  contactPhone?: string;
  contactEmail?: string;
  copyrightText?: string;
  appStoreUrl?: string;
  playStoreUrl?: string;
  seoDescription?: string | null;
}

const defaultServerData: Required<SiteConfigServerData> = {
  siteName: "Quant Procure Clone",
  siteDescription: "B2B E-commerce platform",
  faviconUrl: null,
  logoUrl: null,
  heroBanners: [],
  sideBanners: [],
  offerStripBanners: [],
  promoBanners: [],
  footerSections: [],
  contactAddress: "",
  contactPhone: "",
  contactEmail: "",
  copyrightText: "© 2026 Quant Procure. All rights reserved.",
  appStoreUrl: "#",
  playStoreUrl: "#",
  seoDescription: null,
};

// ── Context ─────────────────────────────────────────────────
const ConfigContext = createContext<SiteConfig | null>(null);

// ── Hook ────────────────────────────────────────────────────
export function useConfig(): SiteConfig {
  const ctx = useContext(ConfigContext);
  if (!ctx) {
    throw new Error("useConfig() must be used within a <ConfigProvider />");
  }
  return ctx;
}

// ── Breakpoints (matches Tailwind defaults) ─────────────────
const MOBILE_MAX = 767;   // < 768  → mobile
const TABLET_MAX = 1023;  // 768–1023 → tablet
                           // >= 1024 → desktop

function getDeviceType(width: number) {
  return {
    isMobile: width <= MOBILE_MAX,
    isTablet: width > MOBILE_MAX && width <= TABLET_MAX,
    isDesktop: width > TABLET_MAX,
  };
}

// ── Provider ────────────────────────────────────────────────
export function ConfigProvider({
  children,
  serverData,
}: {
  children: ReactNode;
  serverData: SiteConfigServerData;
}) {
  const [device, setDevice] = useState(() => ({
    isMobile: false,
    isTablet: false,
    isDesktop: true, // SSR default
  }));

  useEffect(() => {
    // Initial check
    setDevice(getDeviceType(window.innerWidth));

    // Listen for resize
    const onResize = () => setDevice(getDeviceType(window.innerWidth));
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const mergedServerData = {
    ...defaultServerData,
    ...serverData,
  };

  const value: SiteConfig = {
    ...mergedServerData,
    ...device,
  };

  return (
    <ConfigContext.Provider value={value}>{children}</ConfigContext.Provider>
  );
}
