import { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { SOAPS } from "@/data/soaps";
import ProductDetailView from "@/components/ProductDetailView";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return SOAPS.map((soap) => ({
    id: soap.id,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const soap = SOAPS.find((s) => s.id === id);

  if (!soap) {
    return {
      title: "Artisanal Soap | Star Light Co.",
      description: "Handcrafted cold-process botanical soaps curing 4-6 weeks in small batches.",
    };
  }

  const title = soap.metaTitle || `${soap.name} | Star Light Co. Artisanal Soaps`;
  const description = soap.metaDescription || soap.description;
  const keywords = soap.metaKeywords
    ? soap.metaKeywords.split(",").map((k) => k.trim())
    : [soap.name, soap.mainCategory, soap.subCategory, "artisanal soap", "cold process soap", "botanical skincare"];

  return {
    title,
    description,
    keywords,
    openGraph: {
      title: `${soap.name} — Star Light Co.`,
      description: soap.tagline,
      images: [
        {
          url: soap.image,
          width: 800,
          height: 800,
          alt: soap.name,
        },
      ],
    },
  };
}

async function ProductDetailsContent({ params }: PageProps) {
  const { id } = await params;
  const soap = SOAPS.find((s) => s.id === id);

  return <ProductDetailView id={id} initialSoap={soap || null} />;
}

export default function ProductPage({ params }: PageProps) {
  return (
    <Suspense
      fallback={
        <div
          style={{
            minHeight: "60vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "var(--font-serif)",
            fontSize: "1.1rem",
            color: "var(--color-text-secondary)",
          }}
        >
          Loading artisanal formulation...
        </div>
      }
    >
      <ProductDetailsContent params={params} />
    </Suspense>
  );
}

