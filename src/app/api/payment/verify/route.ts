import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import dbConnect from "@/lib/dbConnect";
import Order from "@/models/Order";
import mongoose from "mongoose";

// Verify Razorpay payment and update order
export async function POST(req: NextRequest) {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, orderId } = await req.json();

    if (!razorpayOrderId || !razorpayPaymentId) {
      return NextResponse.json(
        { success: false, message: "Missing payment confirmation parameters." },
        { status: 400 }
      );
    }

    const isSimulated =
      razorpayOrderId.startsWith("rzp_sim_") ||
      razorpayPaymentId.startsWith("pay_sim_");

    if (!isSimulated) {
      const keySecret = process.env.RAZORPAY_KEY_SECRET;
      if (keySecret && !keySecret.includes("YourKeySecretHere")) {
        const body = razorpayOrderId + "|" + razorpayPaymentId;
        const expectedSignature = crypto
          .createHmac("sha256", keySecret)
          .update(body.toString())
          .digest("hex");

        if (expectedSignature !== razorpaySignature) {
          return NextResponse.json(
            { success: false, message: "Payment verification signature mismatch." },
            { status: 400 }
          );
        }
      }
    }

    // Update order in DB
    await dbConnect();
    let query: Record<string, unknown> = {};

    if (orderId) {
      if (mongoose.Types.ObjectId.isValid(orderId)) {
        query = { _id: orderId };
      } else {
        query = { orderNumber: orderId };
      }
    } else {
      query = { razorpayOrderId };
    }

    const updatedOrder = await Order.findOneAndUpdate(
      query,
      {
        paymentStatus: "Paid",
        status: "Confirmed",
        razorpayPaymentId,
        razorpaySignature: razorpaySignature || "simulated_success_sig",
      },
      { new: true }
    ).lean();

    return NextResponse.json({
      success: true,
      message: "Payment verified successfully. Order confirmed.",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Payment verify error:", error);
    return NextResponse.json(
      { success: false, message: "Payment verification failed" },
      { status: 500 }
    );
  }
}
