import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/lib/cart";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "ThermalBridge — Editor de etichete termic pentru imprimante",
  description:
    "ThermalBridge este o aplicație desktop cross-platform pentru proiectarea, gestionarea și tipărirea etichetelor termice și inkjet. USB, BLE, TCP, CUPS — fără cloud, fără abonament.",
  openGraph: {
    title: "ThermalBridge",
    description:
      "Editor de etichete termic pentru imprimante. USB, Bluetooth, Wi-Fi sau coada OS.",
    images: [{ url: "/banner.jpg", width: 1200, height: 400 }],
    type: "website",
    locale: "ro_RO",
  },
  twitter: { card: "summary_large_image" },
  icons: { icon: "/favicon.png" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ro">
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
        <CartProvider>
          <Nav />
          <main>{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
