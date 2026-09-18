import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";
import { CartProvider } from "@/lib/cart";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { HtmlLang } from "@/components/HtmlLang";
import { localeFromPathname, SITE_URL } from "@/i18n/config";
import { landingMetadata } from "@/i18n/metadata";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  icons: { icon: "/favicon.png" },
  ...landingMetadata("ro"),
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const headerList = await headers();
  const pathname = headerList.get("x-pathname") ?? "/";
  const locale = localeFromPathname(pathname);

  return (
    <html lang={locale}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <HtmlLang />
        <CartProvider>
          <Nav />
          <main>{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
