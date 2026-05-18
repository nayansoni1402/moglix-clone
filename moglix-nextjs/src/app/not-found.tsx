import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Error from "@/components/Error";
import { ReduxProvider } from "@/redux/provider";
import { ModalProvider } from "@/app/context/QuickViewModalContext";
import { CartModalProvider } from "@/app/context/CartSidebarModalContext";
import { PreviewSliderProvider } from "@/app/context/PreviewSliderContext";
import { ConfigProvider } from "@/app/context/ConfigContext";

import "@/app/css/euclid-circular-a-font.css";
import "@/app/css/style.css";

export default function NotFound() {
  return (
    <html lang="en">
      <body>
        <ConfigProvider
          serverData={{
            siteName: "Quant Procure Clone",
            siteDescription: "B2B E-commerce platform",
            faviconUrl: null,
            logoUrl: null,
          }}
        >
          <ReduxProvider>
            <CartModalProvider>
              <ModalProvider>
                <PreviewSliderProvider>
                  <Header />
                  <Error />
                  <Footer />
                </PreviewSliderProvider>
              </ModalProvider>
            </CartModalProvider>
          </ReduxProvider>
        </ConfigProvider>
      </body>
    </html>
  );
}
