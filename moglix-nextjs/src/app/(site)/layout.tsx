import { getGlobalData } from "@/utils/get-global";
import ClientLayout from "./client-layout";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Server-side fetch — cached for 1 week via ISR, deduplicated per request
  const g = await getGlobalData();

  return (
    <ClientLayout
      serverData={g}
    >
      {children}
    </ClientLayout>
  );
}
