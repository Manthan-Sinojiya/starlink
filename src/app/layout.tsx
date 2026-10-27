import type { Metadata, Viewport } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/context/StoreContext";
import { DBStoreProvider } from "@/context/DBStoreContext";
import { CartProvider } from "@/context/CartContext";
import MaintenanceGuard from "@/components/MaintenanceGuard";
import DynamicSeoSchema from "@/components/DynamicSeoSchema";
import { CLOUDINARY_IMAGES } from "@/data/cloudinaryImages";

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
    "botanical bath bars",
  ],
  authors: [{ name: "Star Light Co. Artisans" }],
  creator: "Star Light Co.",
  publisher: "Star Light Co.",
  openGraph: {
    title: "STAR LIGHT CO. | Luxury Artisanal Cold-Process Soaps",
    description:
      "Handcrafted luxury soaps infused with ancient botanicals and sacred Dragon's Blood resin. Limited festival editions available now.",
    url: "https://starlightsoaps.com",
    siteName: "Star Light Co.",
    images: [
      {
        url: CLOUDINARY_IMAGES.dragonsBlood,
        width: 1200,
        height: 1200,
        alt: "Star Light Co. Artisanal Soap Bar",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "STAR LIGHT CO. | Luxury Artisanal Cold-Process Soaps",
    description:
      "Ancient botanical wisdom meets modern cold-process soap mastery. Discover our signature Dragon's Blood bar.",
    images: [CLOUDINARY_IMAGES.dragonsBlood],
  },
  icons: {
    icon: [
      { url: CLOUDINARY_IMAGES.logo, sizes: "any" },
      { url: "/icon.png", type: "image/png" },
      { url: "/favicon.ico" },
    ],
    shortcut: [CLOUDINARY_IMAGES.logo],
    apple: [{ url: CLOUDINARY_IMAGES.logo }, { url: "/icon.png" }],
  },
};

const initialSchemaGraph = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://starlightsoaps.com/#organization",
      name: "Star Light Co.",
      alternateName: "Luxury Cold-Process Soaps & Botanical Skincare",
      url: "https://starlightsoaps.com",
      logo: CLOUDINARY_IMAGES.logo,
      image: CLOUDINARY_IMAGES.banner,
      description:
        "Artisanal cold-processed luxury soaps handcrafted with sacred Dragon's Blood resin, organic botanical extracts, and nourishing plant lipids.",
      email: "orders@starlight.co.in",
      telephone: "+91 98765 43210",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Artisanal Atelier",
        addressLocality: "Mumbai",
        addressRegion: "Maharashtra",
        postalCode: "400001",
        addressCountry: "IN",
      },
      sameAs: ["https://instagram.com/starlightco", "https://facebook.com/starlightco"],
    },
    {
      "@type": "WebSite",
      "@id": "https://starlightsoaps.com/#website",
      url: "https://starlightsoaps.com",
      name: "STAR LIGHT CO. | Luxury Artisanal Cold-Process Soaps",
      description: "Shop handcrafted luxury cold-process soaps and botanical skincare.",
      publisher: {
        "@id": "https://starlightsoaps.com/#organization",
      },
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: "https://starlightsoaps.com/?search={search_term_string}",
        },
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "Store",
      "@id": "https://starlightsoaps.com/#store",
      name: "Star Light Co. Atelier",
      url: "https://starlightsoaps.com",
      logo: CLOUDINARY_IMAGES.logo,
      image: CLOUDINARY_IMAGES.heroArtisan,
      telephone: "+91 98765 43210",
      currenciesAccepted: "INR",
      paymentAccepted: "Credit Card, Debit Card, UPI, Net Banking, Cash on Delivery",
      priceRange: "₹299 - ₹2499",
      openingHours: "Mo-Sa 09:00-19:00",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${jakarta.variable}`} data-scroll-behavior="smooth">
      <head>
        <link rel="icon" type="image/png" href={CLOUDINARY_IMAGES.logo} />
        <link rel="shortcut icon" href={CLOUDINARY_IMAGES.logo} />
        <link rel="apple-touch-icon" href={CLOUDINARY_IMAGES.logo} />
        <script
          id="starlight-initial-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(initialSchemaGraph) }}
        />
      </head>
      <body>
        <StoreProvider>
          <DBStoreProvider>
            <CartProvider>
              <DynamicSeoSchema />
              <MaintenanceGuard>{children}</MaintenanceGuard>
            </CartProvider>
          </DBStoreProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
