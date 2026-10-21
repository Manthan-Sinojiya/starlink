import { NextRequest, NextResponse } from "next/server";
import { connection } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Product from "@/models/Product";
import { requireAdmin } from "@/lib/auth";
import { checkRateLimit, rateLimitResponse } from "@/lib/rateLimit";

// GET all products (public)
export async function GET(req: NextRequest) {
  await connection();

  // Rate limit public product queries (100 req/min)
  const rl = checkRateLimit(req, { limit: 100, windowMs: 60_000, prefix: "products-get" });
  if (!rl.success) return rateLimitResponse(rl);

  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const bestseller = searchParams.get("bestseller");
    const festive = searchParams.get("festive");
    const limit = Math.min(Math.max(parseInt(searchParams.get("limit") || "100") || 100, 1), 200);

    const query: Record<string, unknown> = {};
    if (category && category !== "all") query.mainCategory = category;
    if (bestseller === "true") query.isBestseller = true;
    if (festive === "true") query.isFestive = true;
    if (search && typeof search === "string") {
      const sanitized = search
        .trim()
        .slice(0, 60)
        .replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
      if (sanitized) {
        query.$or = [
          { name: { $regex: sanitized, $options: "i" } },
          { description: { $regex: sanitized, $options: "i" } },
          { tagline: { $regex: sanitized, $options: "i" } },
        ];
      }
    }

    const products = await Product.find(query).limit(limit).sort({ createdAt: -1 }).lean();

    return NextResponse.json({ success: true, products });
  } catch (error: any) {
    if (error && typeof error === "object" && "digest" in error && String(error.digest).startsWith("NEXT_")) {
      throw error;
    }
    console.error("Get products error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

// POST create product (admin only)
export async function POST(req: NextRequest) {
  try {
    const admin = requireAdmin(req);
    if (!admin) {
      return NextResponse.json(
        { success: false, message: "Admin access required" },
        { status: 403 }
      );
    }

    await dbConnect();
    const body = await req.json();

    const rawName = (body.name || "Handcrafted Bar").trim();
    const rawSlug = body.slug || rawName.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    const existing = await Product.findOne({ slug: rawSlug });
    const finalSlug = existing ? `${rawSlug}-${Date.now()}` : rawSlug;

    let weightDisplay = body.weight || "125g / 4.4 oz";
    if (body.weightValue && body.weightUnit) {
      if (body.weightUnit === "kg") {
        weightDisplay = `${body.weightValue} kg (${(body.weightValue * 1000).toFixed(0)}g)`;
      } else {
        weightDisplay = `${body.weightValue}g / ${(body.weightValue * 0.035274).toFixed(1)} oz`;
      }
    }

    const product = await Product.create({
      ...body,
      slug: finalSlug,
      weight: weightDisplay,
    });

    return NextResponse.json({ success: true, product }, { status: 201 });
  } catch (error) {
    console.error("Create product error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create product" },
      { status: 500 }
    );
  }
}
