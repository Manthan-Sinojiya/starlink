import type { Metadata, Viewport } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { StoreProvider } from "@/context/StoreContext";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#e17159",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://starlightsoaps.com"),
  title: "STAR LIGHT CO. | Luxury Handcrafted Cold-Process Artisanal Soaps",
  description:
    "Discover Star Light Co. artisanal cold-processed luxury soaps. Hand-poured with sacred Dragon's Blood resin, organic botanical extracts, and nourishing plant lipids. 100% natural, sulfate-free, and sustainably crafted.",
  keywords: [
    "artisan soap",
    "cold process soap",
    "dragon's blood soap",
    "luxury soap bar",
    "organic handmade soap",
    "natural skincare",
    "Star Light Co",
    "festival soap gift sets",
    "botanical bath bars"
  ],
  authors: [{ name: "Star Light Co. Artisans" }],
  creator: "Star Light Co.",
  publisher: "Star Light Co.",
  openGraph: {
    title: "STAR LIGHT CO. | Artisanal Cold-Process Soaps",
    description:
      "Handcrafted luxury soaps infused with ancient botanicals and sacred Dragon's Blood resin. Limited festival editions available now.",
    url: "https://starlightsoaps.com",
    siteName: "Star Light Co.",
    images: [
      {
        url: "/images/products/dragons-blood.jpg",
        width: 1200,
        height: 1200,
        alt: "Star Light Co. Dragon's Blood Artisanal Soap Bar",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "STAR LIGHT CO. | Luxury Artisanal Soaps",
    description:
      "Ancient botanical wisdom meets modern cold-process soap mastery. Discover our signature Dragon's Blood bar.",
    images: ["/images/products/dragons-blood.jpg"],
  },
  icons: {
    icon: "/images/logo.png",
    apple: "/images/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${jakarta.variable}`} data-scroll-behavior="smooth">
      <head>
        <link rel="icon" href="/images/logo.png" />
      </head>
      <body>
        <StoreProvider>
          <CartProvider>{children}</CartProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
