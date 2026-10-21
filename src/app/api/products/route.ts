import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Product from "@/models/Product";
import { requireAdmin } from "@/lib/auth";


// GET all products (public)
export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const bestseller = searchParams.get("bestseller");
    const festive = searchParams.get("festive");
    const limit = parseInt(searchParams.get("limit") || "100");

    const query: Record<string, unknown> = {};
    if (category && category !== "all") query.mainCategory = category;
    if (bestseller === "true") query.isBestseller = true;
    if (festive === "true") query.isFestive = true;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { tagline: { $regex: search, $options: "i" } },
      ];
    }

    const products = await Product.find(query).limit(limit).sort({ createdAt: -1 }).lean();

    return NextResponse.json({ success: true, products });
  } catch (error) {
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
