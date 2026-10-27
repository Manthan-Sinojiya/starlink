import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { connection } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Product from "@/models/Product";
import { requireAdmin } from "@/lib/auth";
import { deleteFromCloudinary } from "@/lib/cloudinary";

// GET single product by slug or id
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connection();
  try {
    await dbConnect();
    const { id } = await params;

    const query = mongoose.Types.ObjectId.isValid(id) ? { _id: id } : { slug: id };
    const product = await Product.findOne(query).lean();

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    if (error && typeof error === "object" && "digest" in error && String(error.digest).startsWith("NEXT_")) {
      throw error;
    }
    console.error("Get product error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch product" },
      { status: 500 }
    );
  }
}

// PUT update product (admin only)
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = requireAdmin(req);
    if (!admin) {
      return NextResponse.json(
        { success: false, message: "Admin access required" },
        { status: 403 }
      );
    }

    await dbConnect();
    const { id } = await params;
    const body = await req.json();

    let weightDisplay = body.weight;
    if (body.weightValue && body.weightUnit) {
      if (body.weightUnit === "kg") {
        weightDisplay = `${body.weightValue} kg (${(body.weightValue * 1000).toFixed(0)}g)`;
      } else {
        weightDisplay = `${body.weightValue}g / ${(body.weightValue * 0.035274).toFixed(1)} oz`;
      }
    }

    const query = mongoose.Types.ObjectId.isValid(id) ? { _id: id } : { slug: id };
    const updated = await Product.findOneAndUpdate(
      query,
      { ...body, weight: weightDisplay },
      { new: true }
    ).lean();

    if (!updated) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, product: updated });
  } catch (error: any) {
    console.error("Update product error:", error);
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to update product" },
      { status: 500 }
    );
  }
}

// DELETE product (admin only)
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = requireAdmin(req);
    if (!admin) {
      return NextResponse.json(
        { success: false, message: "Admin access required" },
        { status: 403 }
      );
    }

    await dbConnect();
    const { id } = await params;
    const query = mongoose.Types.ObjectId.isValid(id) ? { _id: id } : { slug: id };
    const product = await Product.findOneAndDelete(query);

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    // Delete image from Cloudinary if stored there
    if (product.imagePublicId) {
      try {
        await deleteFromCloudinary(product.imagePublicId);
      } catch (e) {
        console.warn("Failed to delete image from Cloudinary:", e);
      }
    }

    return NextResponse.json({ success: true, message: "Product deleted successfully" });
  } catch (error: any) {
    console.error("Delete product error:", error);
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to delete product" },
      { status: 500 }
    );
  }
}
