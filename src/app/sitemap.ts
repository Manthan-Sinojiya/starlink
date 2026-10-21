import type { MetadataRoute } from "next";
import dbConnect from "@/lib/dbConnect";
import Product from "@/models/Product";
import Category from "@/models/Category";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://starlightco.in";

  let products: { id: string; updatedAt: Date }[] = [];
  let categories: { slug: string; updatedAt: Date }[] = [];

  try {
    await dbConnect();
    const dbProducts = await Product.find({}, "slug _id updatedAt").lean();
    if (dbProducts && dbProducts.length > 0) {
      products = dbProducts.map((p: any) => ({
        id: p.slug || p._id.toString(),
        updatedAt: p.updatedAt ? new Date(p.updatedAt) : new Date(),
      }));
    }

    const dbCategories = await Category.find({}, "slug name updatedAt").lean();
    if (dbCategories && dbCategories.length > 0) {
      categories = dbCategories.map((c: any) => ({
        slug: c.slug || c.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        updatedAt: c.updatedAt ? new Date(c.updatedAt) : new Date(),
      }));
    }
  } catch (e) {
    console.warn("Sitemap DB fallback:", e);
  }

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/register`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  const categoryRoutes: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${baseUrl}/category/${encodeURIComponent(cat.slug)}`,
    lastModified: cat.updatedAt,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const productRoutes: MetadataRoute.Sitemap = products.map((prod) => ({
    url: `${baseUrl}/products/${encodeURIComponent(prod.id)}`,
    lastModified: prod.updatedAt,
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
