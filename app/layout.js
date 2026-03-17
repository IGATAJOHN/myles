import "./globals.css";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";

export const metadata = {
  title: "Myles Luxe",
  description: "Myles Luxe luxury boxer briefs built for comfort and designed for confidence."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="site-shell">
          <SiteHeader />
          {children}
          <SiteFooter />
        </div>
        <FloatingWhatsApp />
      </body>
    </html>
  );
}
