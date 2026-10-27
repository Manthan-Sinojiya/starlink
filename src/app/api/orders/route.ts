import { NextRequest, NextResponse } from "next/server";
import { connection } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Order from "@/models/Order";
import User from "@/models/User";
import { getUserFromRequest, requireAdmin, signToken } from "@/lib/auth";
import { CLOUDINARY_IMAGES } from "@/data/cloudinaryImages";
import { sendOrderInvoiceEmail } from "@/lib/nodemailer";

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
      orders = await Order.find({ customerEmail: jwtUser.email.toLowerCase() }).sort({ createdAt: -1 }).lean();
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
    const {
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
      paymentMethod,
      razorpayOrderId,
      password,
      customerPassword,
    } = body;

    if (!customerEmail || !items?.length || total === undefined || total === null) {
      return NextResponse.json({ success: false, message: "Missing required order data" }, { status: 400 });
    }

    const cleanEmail = customerEmail.trim().toLowerCase();
    const orderNumber = `SLC-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;

    const sanitizedItems = items.map((it: any) => ({
      productId: String(it.productId || it.id || it._id || "soap"),
      name: String(it.name || "Handcrafted Soap Bar"),
      image: it.image || CLOUDINARY_IMAGES.dragonsBlood,
      imageAlt: it.imageAlt || it.name || "Artisanal Soap",
      price: Number(it.price) || 0,
      quantity: Math.max(Number(it.quantity) || 1, 1),
      weight: it.weight || "125g",
    }));

    const order = await Order.create({
      orderNumber,
      customerEmail: cleanEmail,
      customerName: customerName || "Valued Customer",
      customerPhone: customerPhone || "",
      items: sanitizedItems,
      subtotal: Number(subtotal) || 0,
      shipping: Number(shipping) || 0,
      total: Number(total),
      shippingState: shippingState || "Maharashtra",
      shippingAddress: shippingAddress || "",
      shippingPincode: shippingPincode || "",
      status: "Pending",
      paymentStatus: "Pending",
      paymentMethod: paymentMethod || "razorpay",
      razorpayOrderId: razorpayOrderId || undefined,
    });

    // ── AUTO CREATE OR UPDATE CUSTOMER ACCOUNT ──
    let userRecord: any = null;
    let isNewAccount = false;
    let token: string | null = null;

    try {
      const existingUser = await User.findOne({ email: cleanEmail });

      if (existingUser) {
        // Auto-save & update latest delivery details for existing customer
        if (customerName && customerName.trim()) existingUser.name = customerName.trim();
        if (customerPhone && customerPhone.trim()) existingUser.phone = customerPhone.trim();
        if (shippingAddress && shippingAddress.trim()) existingUser.address = shippingAddress.trim();
        if (shippingState) existingUser.state = shippingState;
        if (shippingPincode && shippingPincode.trim()) existingUser.pincode = shippingPincode.trim();
        existingUser.totalOrders = (existingUser.totalOrders || 0) + 1;
        existingUser.totalSpent = (existingUser.totalSpent || 0) + Number(total);
        await existingUser.save();
        userRecord = existingUser;
      } else {
        // Auto-create customer account
        isNewAccount = true;
        const rawPassword = customerPassword || password;
        const cleanPhoneDigits = (customerPhone || "").replace(/\D/g, "");
        const finalPassword =
          rawPassword && String(rawPassword).length >= 6
            ? String(rawPassword)
            : `Star@${cleanPhoneDigits.slice(-4) || "2026"}`;

        userRecord = await User.create({
          name: customerName?.trim() || "Customer",
          email: cleanEmail,
          password: finalPassword,
          phone: customerPhone?.trim() || "",
          address: shippingAddress?.trim() || "",
          state: shippingState || "Maharashtra",
          pincode: shippingPincode?.trim() || "",
          role: "customer",
          totalOrders: 1,
          totalSpent: Number(total),
        });
      }

      if (userRecord) {
        token = signToken({
          userId: userRecord._id.toString(),
          email: userRecord.email,
          role: userRecord.role,
          name: userRecord.name,
        });
      }
    } catch (userErr) {
      console.warn("User auto-sync notice:", userErr);
    }

    // ── ASYNC NODEMAILER INVOICE EMAIL ──
    try {
      sendOrderInvoiceEmail({ order, toEmail: cleanEmail }).catch((mailErr) => {
        console.warn("[Nodemailer] Async invoice email notice:", mailErr);
      });
    } catch (mailTriggerErr) {
      console.warn("[Nodemailer] Mail trigger error:", mailTriggerErr);
    }

    const resPayload = {
      success: true,
      order,
      accountCreated: isNewAccount,
      token,
      user: userRecord
        ? {
            id: userRecord._id.toString(),
            name: userRecord.name,
            email: userRecord.email,
            phone: userRecord.phone,
            address: userRecord.address,
            state: userRecord.state,
            pincode: userRecord.pincode,
            role: userRecord.role,
            totalOrders: userRecord.totalOrders,
            totalSpent: userRecord.totalSpent,
          }
        : null,
    };

    const response = NextResponse.json(resPayload, { status: 201 });

    if (token) {
      response.cookies.set("auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      });
    }

    return response;
  } catch (error: any) {
    console.error("Create order error:", error);
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to create order" },
      { status: 500 }
    );
  }
}
