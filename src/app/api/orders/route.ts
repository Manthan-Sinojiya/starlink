import { NextRequest, NextResponse } from "next/server";
import { connection } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Order from "@/models/Order";
import User from "@/models/User";
import { getUserFromRequest, requireAdmin } from "@/lib/auth";

// GET orders - admin gets all, customer gets their own
export async function GET(req: NextRequest) {
  await connection();
  try {
    const jwtUser = getUserFromRequest(req);
    if (!jwtUser) return NextResponse.json({ success: false, message: "Authentication required" }, { status: 401 });

    await dbConnect();
    let orders;

    if (jwtUser.role === "admin") {
      orders = await Order.find({}).sort({ createdAt: -1 }).lean();
    } else {
      orders = await Order.find({ customerEmail: jwtUser.email }).sort({ createdAt: -1 }).lean();
    }

    return NextResponse.json({ success: true, orders });
  } catch (error: any) {
    if (error && typeof error === "object" && "digest" in error && String(error.digest).startsWith("NEXT_")) {
      throw error;
    }
    console.error("Get orders error:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch orders" }, { status: 500 });
  }
}

// POST create order
export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    const { customerEmail, customerName, customerPhone, items, subtotal, shipping, total, shippingState, shippingAddress, shippingPincode, paymentMethod, razorpayOrderId } = body;

    if (!customerEmail || !items?.length || !total) {
      return NextResponse.json({ success: false, message: "Missing required order data" }, { status: 400 });
    }

    const orderNumber = `SLC-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;

    const order = await Order.create({
      orderNumber,
      customerEmail,
      customerName,
      customerPhone,
      items,
      subtotal,
      shipping,
      total,
      shippingState,
      shippingAddress,
      shippingPincode,
      status: "Pending",
      paymentStatus: paymentMethod === "cod" ? "Pending" : "Pending",
      paymentMethod: paymentMethod || "razorpay",
      razorpayOrderId,
    });

    // Update user stats
    await User.findOneAndUpdate(
      { email: customerEmail.toLowerCase() },
      { $inc: { totalOrders: 1, totalSpent: total } }
    );

    return NextResponse.json({ success: true, order }, { status: 201 });
  } catch (error) {
    console.error("Create order error:", error);
    return NextResponse.json({ success: false, message: "Failed to create order" }, { status: 500 });
  }
}
