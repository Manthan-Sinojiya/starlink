import { Metadata } from "next";
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
      title: "Soap Not Found | Star Light Co.",
    };
  }

  return {
    title: `${soap.name} | Star Light Co. Artisanal Soaps`,
    description: soap.description,
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

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params;
  const soap = SOAPS.find((s) => s.id === id);

  if (!soap) {
    notFound();
  }

  return <ProductDetailView soap={soap} />;
}
