import { Metadata } from "next";
import { Suspense } from "react";
import { connection } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Product from "@/models/Product";
import ProductDetailView from "@/components/ProductDetailView";
import { ProductDetailSkeleton } from "@/components/Skeleton";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  await connection();
  const { id } = await params;
  try {
    await dbConnect();
    const soap = await Product.findOne({
      $or: [{ slug: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }],
    }).lean();

    if (!soap) {
      return {
        title: "Artisanal Soap | Star Light Co.",
        description: "Handcrafted cold-process botanical soaps curing 4-6 weeks in small batches.",
      };
    }

    const title = soap.metaTitle || `${soap.name} | Star Light Co. Artisanal Soaps`;
    const description = soap.metaDescription || soap.tagline || soap.description;
    const rawKeywords = soap.metaKeywords;
    const keywords = Array.isArray(rawKeywords)
      ? rawKeywords
      : typeof rawKeywords === "string"
      ? (rawKeywords as string).split(",").map((k: string) => k.trim())
      : [soap.name, soap.mainCategory || "", soap.subCategory || "", "artisanal soap", "cold process soap", "botanical skincare"];

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
  } catch {
    return {
      title: "Artisanal Soap | Star Light Co.",
      description: "Handcrafted cold-process botanical soaps curing 4-6 weeks in small batches.",
    };
  }
}

async function ProductDetailsContent({ params }: PageProps) {
  await connection();
  const { id } = await params;
  let initialSoap: any = null;

  try {
    await dbConnect();
    const found = await Product.findOne({
      $or: [{ slug: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }],
    }).lean();

    if (found) {
      initialSoap = JSON.parse(JSON.stringify({
        ...found,
        id: String(found.slug || found._id),
        _id: String(found._id),
      }));
    }
  } catch (e) {
    console.error("Error fetching product on server:", e);
  }

  return <ProductDetailView id={id} initialSoap={initialSoap} />;
}

export default function ProductPage({ params }: PageProps) {
  return (
    <Suspense fallback={<ProductDetailSkeleton />}>
      <ProductDetailsContent params={params} />
    </Suspense>
  );
}

