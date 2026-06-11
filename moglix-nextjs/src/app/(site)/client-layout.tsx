"use client";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

import { ModalProvider } from "../context/QuickViewModalContext";
import { CartModalProvider } from "../context/CartSidebarModalContext";
import { ReduxProvider } from "@/redux/provider";
import QuickViewModal from "@/components/Common/QuickViewModal";
import CartSidebarModal from "@/components/Common/CartSidebarModal";
import { PreviewSliderProvider } from "../context/PreviewSliderContext";
import PreviewSliderModal from "@/components/Common/PreviewSlider";

import ScrollToTop from "@/components/Common/ScrollToTop";
import NewsletterPopup from "@/components/NewsletterPopup";
import { ConfigProvider, type SiteConfigServerData } from "../context/ConfigContext";
import { Toaster } from "react-hot-toast";

export default function ClientLayout({
  children,
  serverData,
}: {
  children: React.ReactNode;
  serverData: SiteConfigServerData;
}) {
  return (
    <>
      <ConfigProvider serverData={serverData}>
        <ReduxProvider>
          <CartModalProvider>
            <ModalProvider>
              <PreviewSliderProvider>
                <Header />
                {children}
                <NewsletterPopup />
                <Footer />
                <Toaster position="top-right" reverseOrder={false} />

                <QuickViewModal />
                <CartSidebarModal />
                <PreviewSliderModal />
              </PreviewSliderProvider>
            </ModalProvider>
          </CartModalProvider>
        </ReduxProvider>
      </ConfigProvider>
      <ScrollToTop />
    </>
  );
}
