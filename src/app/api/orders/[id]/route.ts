import { NextRequest, NextResponse } from "next/server";
import { connection } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Order from "@/models/Order";
import { getUserFromRequest, requireAdmin } from "@/lib/auth";

import mongoose from "mongoose";

// GET single order
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await connection();
  try {
    await dbConnect();
    const { id } = await params;
    const query = mongoose.Types.ObjectId.isValid(id) ? { _id: id } : { orderNumber: id };
    const order = await Order.findOne(query).lean();

    if (!order) return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });

    const jwtUser = getUserFromRequest(req);
    // If not matching exact orderNumber query, verify user authentication
    if (!id.startsWith("SLC-")) {
      if (!jwtUser) return NextResponse.json({ success: false, message: "Authentication required" }, { status: 401 });
      if (jwtUser.role !== "admin" && order.customerEmail !== jwtUser.email) {
        return NextResponse.json({ success: false, message: "Access denied" }, { status: 403 });
      }
    }

    return NextResponse.json({ success: true, order });
  } catch (error: any) {
    if (error && typeof error === "object" && "digest" in error && String(error.digest).startsWith("NEXT_")) {
      throw error;
    }
    console.error("Get order error:", error);
    return NextResponse.json({ success: false, message: error?.message || "Server error" }, { status: 500 });
  }
}

// PUT update order status (admin only)
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const admin = requireAdmin(req);
    if (!admin) return NextResponse.json({ success: false, message: "Admin access required" }, { status: 403 });

    await dbConnect();
    const { id } = await params;
    const body = await req.json();

    const query = mongoose.Types.ObjectId.isValid(id) ? { _id: id } : { orderNumber: id };
    const updated = await Order.findOneAndUpdate(query, body, { new: true }).lean();
    if (!updated) return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });

    return NextResponse.json({ success: true, order: updated });
  } catch (error: any) {
    console.error("Update order error:", error);
    return NextResponse.json({ success: false, message: error?.message || "Server error" }, { status: 500 });
  }
}
