"use client";

import { useDBStore } from "@/context/DBStoreContext";
import { CLOUDINARY_IMAGES } from "@/data/cloudinaryImages";

export default function SeoStructuredData() {
  const { products, isLoaded } = useDBStore();

  const schemaOrganization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Star Light Co.",
    url: "https://starlightsoaps.com",
    logo: CLOUDINARY_IMAGES.logo,
    description: "Luxury handcrafted cold-process artisanal soaps infused with sacred Dragon's Blood resin and pure botanicals.",
    sameAs: [
      "https://x.com/starlightsoaps",
      "https://facebook.com/starlightsoaps",
      "https://instagram.com/starlightsoaps"
    ]
  };

  const schemaProducts = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Artisanal Soap Collection",
    itemListElement: products.map((soap, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Product",
        name: soap.name,
        description: soap.description,
        image: soap.image?.startsWith("http") ? soap.image : `https://starlightsoaps.com${soap.image}`,
        offers: {
          "@type": "Offer",
          priceCurrency: "INR",
          price: soap.price.toFixed(2),
          availability: soap.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: soap.rating,
          reviewCount: soap.reviewsCount
        }
      }
    }))
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrganization) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaProducts) }}
      />
    </>
  );
}
