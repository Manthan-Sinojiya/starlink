import { SOAPS } from "@/data/soaps";

export default function SeoStructuredData() {
  const schemaOrganization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Star Light Co.",
    url: "https://starlightsoaps.com",
    logo: "https://starlightsoaps.com/images/logo.png",
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
    itemListElement: SOAPS.map((soap, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Product",
        name: soap.name,
        description: soap.description,
        image: `https://starlightsoaps.com${soap.image}`,
        offers: {
          "@type": "Offer",
          priceCurrency: "USD",
          price: soap.price.toFixed(2),
          availability: "https://schema.org/InStock"
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
