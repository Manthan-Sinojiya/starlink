import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import dbConnect from "@/lib/dbConnect";
import Order from "@/models/Order";
import mongoose from "mongoose";
import { checkRateLimit, rateLimitResponse } from "@/lib/rateLimit";

// Verify Razorpay payment and update order
export async function POST(req: NextRequest) {
  // Rate limit payment verification attempts (max 15/min per IP)
  const rl = checkRateLimit(req, { limit: 15, windowMs: 60_000, prefix: "payment-verify" });
  if (!rl.success) return rateLimitResponse(rl);

  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, orderId } = await req.json();

    if (!razorpayOrderId || !razorpayPaymentId) {
      return NextResponse.json(
        { success: false, message: "Missing payment confirmation parameters." },
        { status: 400 }
      );
    }

    const hasSimulatedId =
      String(razorpayOrderId).startsWith("rzp_sim_") ||
      String(razorpayPaymentId).startsWith("pay_sim_");

    if (process.env.NODE_ENV === "production" && hasSimulatedId) {
      return NextResponse.json(
        { success: false, message: "Simulated payments are strictly disabled in production." },
        { status: 403 }
      );
    }

    const isSimulated = process.env.NODE_ENV !== "production" && hasSimulatedId;

    if (!isSimulated) {
      const keySecret = process.env.RAZORPAY_KEY_SECRET;
      if (!keySecret || keySecret.includes("YourKeySecretHere")) {
        if (process.env.NODE_ENV === "production") {
          return NextResponse.json(
            { success: false, message: "Payment gateway configuration error." },
            { status: 500 }
          );
        }
      } else {
        if (!razorpaySignature) {
          return NextResponse.json(
            { success: false, message: "Missing payment signature." },
            { status: 400 }
          );
        }

        const body = razorpayOrderId + "|" + razorpayPaymentId;
        const expectedSignature = crypto
          .createHmac("sha256", keySecret)
          .update(body.toString())
          .digest("hex");

        const expectedBuf = Buffer.from(expectedSignature, "utf8");
        const actualBuf = Buffer.from(String(razorpaySignature), "utf8");
        const isValid =
          expectedBuf.length === actualBuf.length &&
          crypto.timingSafeEqual(expectedBuf, actualBuf);

        if (!isValid) {
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
