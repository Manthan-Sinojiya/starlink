import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { connection } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Category from "@/models/Category";
import { requireAdmin } from "@/lib/auth";
import { deleteFromCloudinary } from "@/lib/cloudinary";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await connection();
  try {
    await dbConnect();
    const { id } = await params;
    const query = mongoose.Types.ObjectId.isValid(id) ? { _id: id } : { slug: id };
    const category = await Category.findOne(query).lean();
    if (!category) return NextResponse.json({ success: false, message: "Category not found" }, { status: 404 });
    return NextResponse.json({ success: true, category });
  } catch (error: any) {
    if (error && typeof error === "object" && "digest" in error && String(error.digest).startsWith("NEXT_")) {
      throw error;
    }
    console.error("Get category error:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch category" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const admin = requireAdmin(req);
    if (!admin) return NextResponse.json({ success: false, message: "Admin access required" }, { status: 403 });

    await dbConnect();
    const { id } = await params;
    const body = await req.json();

    const query = mongoose.Types.ObjectId.isValid(id) ? { _id: id } : { slug: id };
    const updated = await Category.findOneAndUpdate(query, body, { new: true }).lean();
    if (!updated) return NextResponse.json({ success: false, message: "Category not found" }, { status: 404 });

    return NextResponse.json({ success: true, category: updated });
  } catch (error: any) {
    console.error("Update category error:", error);
    return NextResponse.json({ success: false, message: error?.message || "Failed to update category" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const admin = requireAdmin(req);
    if (!admin) return NextResponse.json({ success: false, message: "Admin access required" }, { status: 403 });

    await dbConnect();
    const { id } = await params;
    const query = mongoose.Types.ObjectId.isValid(id) ? { _id: id } : { slug: id };
    const category = await Category.findOneAndDelete(query);

    if (!category) return NextResponse.json({ success: false, message: "Category not found" }, { status: 404 });

    if (category.imagePublicId) {
      try { await deleteFromCloudinary(category.imagePublicId); } catch (e) { console.warn(e); }
    }

    return NextResponse.json({ success: true, message: "Category deleted" });
  } catch (error: any) {
    console.error("Delete category error:", error);
    return NextResponse.json({ success: false, message: error?.message || "Failed to delete category" }, { status: 500 });
  }
}
