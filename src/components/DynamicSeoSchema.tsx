"use client";

import React, { useEffect, useMemo } from "react";
import { useDBStore } from "@/context/DBStoreContext";
import { CLOUDINARY_IMAGES } from "@/data/cloudinaryImages";

export default function DynamicSeoSchema() {
  const { siteSettings } = useDBStore();
  const seo = siteSettings?.seo;

  // Dynamically update document title & meta tags if admin customized them
  useEffect(() => {
    if (seo?.metaTitle && typeof document !== "undefined") {
      document.title = seo.metaTitle;
    }
    if (seo?.metaDescription && typeof document !== "undefined") {
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute("content", seo.metaDescription);
      }
    }
  }, [seo?.metaTitle, seo?.metaDescription]);

  const schemaContent = useMemo(() => {
    if (!seo) return null;

    // Pro Mode: If admin enabled custom schema override and supplied valid JSON
    if (seo.enableCustomSchema && seo.customSchemaJson?.trim()) {
      try {
        JSON.parse(seo.customSchemaJson.trim());
        return seo.customSchemaJson.trim();
      } catch {
        // Fall back to generated schema if syntax invalid
      }
    }

    const orgName = seo.organizationName || "Star Light Co.";
    const brandTagline = seo.brandTagline || "Luxury Cold-Process Soaps & Botanical Skincare";
    const desc =
      seo.metaDescription ||
      "Artisanal cold-processed luxury soaps handcrafted with sacred Dragon's Blood resin, organic botanical extracts, and nourishing plant lipids.";
    const phone = seo.storeTelephone || "+91 98765 43210";
    const email = seo.storeEmail || "orders@starlight.co.in";
    const priceRange = seo.priceRange || "₹299 - ₹2499";

    const schemaGraph = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Organization",
          "@id": "https://starlightsoaps.com/#organization",
          name: orgName,
          alternateName: brandTagline,
          url: "https://starlightsoaps.com",
          logo: CLOUDINARY_IMAGES.logo,
          image: CLOUDINARY_IMAGES.banner,
          description: desc,
          email: email,
          telephone: phone,
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
          name: seo.metaTitle || `${orgName} | ${brandTagline}`,
          description: desc,
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
          name: `${orgName} Atelier`,
          url: "https://starlightsoaps.com",
          logo: CLOUDINARY_IMAGES.logo,
          image: CLOUDINARY_IMAGES.heroArtisan,
          telephone: phone,
          currenciesAccepted: "INR",
          paymentAccepted: "Credit Card, Debit Card, UPI, Net Banking, Cash on Delivery",
          priceRange: priceRange,
          openingHours: "Mo-Sa 09:00-19:00",
        },
      ],
    };

    return JSON.stringify(schemaGraph);
  }, [seo]);

  if (!schemaContent) return null;

  return (
    <script
      id="starlight-dynamic-jsonld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: schemaContent }}
    />
  );
}
