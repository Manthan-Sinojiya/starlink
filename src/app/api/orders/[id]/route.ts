import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Order from "@/models/Order";
import { getUserFromRequest, requireAdmin } from "@/lib/auth";


// GET single order
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const jwtUser = getUserFromRequest(req);
    if (!jwtUser) return NextResponse.json({ success: false, message: "Authentication required" }, { status: 401 });

    await dbConnect();
    const { id } = await params;
    const order = await Order.findById(id).lean();

    if (!order) return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });

    // Customers can only see their own orders
    if (jwtUser.role !== "admin" && order.customerEmail !== jwtUser.email) {
      return NextResponse.json({ success: false, message: "Access denied" }, { status: 403 });
    }

    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error("Get order error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
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

    const updated = await Order.findByIdAndUpdate(id, body, { new: true }).lean();
    if (!updated) return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });

    return NextResponse.json({ success: true, order: updated });
  } catch (error) {
    console.error("Update order error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
