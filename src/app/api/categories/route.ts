import { NextRequest, NextResponse } from "next/server";
import { connection } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Category from "@/models/Category";
import { requireAdmin } from "@/lib/auth";
import { CLOUDINARY_IMAGES } from "@/data/cloudinaryImages";

// GET all categories (public)
export async function GET() {
  await connection();
  try {
    await dbConnect();
    const categories = await Category.find({}).sort({ order: 1 }).lean();
    return NextResponse.json({ success: true, categories });
  } catch (error: any) {
    if (error && typeof error === "object" && "digest" in error && String(error.digest).startsWith("NEXT_")) {
      throw error;
    }
    console.error("Get categories error:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch categories" }, { status: 500 });
  }
}

// POST create category (admin only)
export async function POST(req: NextRequest) {
  try {
    const admin = requireAdmin(req);
    if (!admin) return NextResponse.json({ success: false, message: "Admin access required" }, { status: 403 });

    await dbConnect();
    const body = await req.json();
    const rawName = (body.name || "New Category").trim();
    const rawSlug = body.slug || rawName.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    const existing = await Category.findOne({ slug: rawSlug });
    const finalSlug = existing ? `${rawSlug}-${Date.now()}` : rawSlug;

    const count = await Category.countDocuments();
    const category = await Category.create({
      ...body,
      name: rawName,
      slug: finalSlug,
      image: body.image || CLOUDINARY_IMAGES.dragonsBlood,
      description: (body.description || "").trim() || `${rawName} handcrafted cold-process soaps.`,
      badge: body.badge || "Signature",
      order: body.order ?? count,
    });

    return NextResponse.json({ success: true, category }, { status: 201 });
  } catch (error: any) {
    console.error("Create category error:", error);
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to create category" },
      { status: 500 }
    );
  }
}
