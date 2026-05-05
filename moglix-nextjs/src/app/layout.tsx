import "./css/euclid-circular-a-font.css";
import "./css/style.css";

export const metadata = {
  title: "Moglix Clone - Industrial Products",
  description: "B2B E-commerce platform for industrial products",
};

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
