import "./css/euclid-circular-a-font.css";
import "./css/style.css";

import type { Metadata } from "next";
import { getGlobalData } from "@/utils/get-global";

export async function generateMetadata(): Promise<Metadata> {
  const g = await getGlobalData();

  return {
    title: g.siteName,
    description: g.siteDescription,
    icons: g.faviconUrl
      ? { icon: g.faviconUrl, shortcut: g.faviconUrl, apple: g.faviconUrl }
      : undefined,
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body suppressHydrationWarning={true}>
        {children}
      </body>
    </html>
  );
}
