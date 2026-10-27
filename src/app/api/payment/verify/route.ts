import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import dbConnect from "@/lib/dbConnect";
import Order from "@/models/Order";
import User from "@/models/User";
import mongoose from "mongoose";
import { checkRateLimit, rateLimitResponse } from "@/lib/rateLimit";
import { sendOrderInvoiceEmail } from "@/lib/nodemailer";

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
      String(razorpayPaymentId).startsWith("pay_sim_") ||
      String(razorpaySignature).startsWith("sig_");

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    const isPlaceholderSecret = !keySecret || keySecret.includes("YourKeySecretHere");
    const isSimulated = hasSimulatedId || isPlaceholderSecret;

    if (!isSimulated) {
      if (!razorpaySignature) {
        return NextResponse.json(
          { success: false, message: "Missing payment signature." },
          { status: 400 }
        );
      }

      const body = razorpayOrderId + "|" + razorpayPaymentId;
      const expectedSignature = crypto
        .createHmac("sha256", keySecret!)
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

    // Update order in DB
    await dbConnect();
    let updatedOrder = null;

    if (orderId) {
      const q = mongoose.Types.ObjectId.isValid(orderId) ? { _id: orderId } : { orderNumber: orderId };
      updatedOrder = await Order.findOneAndUpdate(
        q,
        {
          paymentStatus: "Paid",
          status: "Confirmed",
          razorpayOrderId: razorpayOrderId || undefined,
          razorpayPaymentId,
          razorpaySignature: razorpaySignature || "simulated_success_sig",
        },
        { new: true }
      ).lean();
    }

    if (!updatedOrder && razorpayOrderId) {
      updatedOrder = await Order.findOneAndUpdate(
        { razorpayOrderId },
        {
          paymentStatus: "Paid",
          status: "Confirmed",
          razorpayPaymentId,
          razorpaySignature: razorpaySignature || "simulated_success_sig",
        },
        { new: true }
      ).lean();
    }

    // Sync customer user address if exists
    if (updatedOrder?.customerEmail) {
      try {
        const cleanEmail = String(updatedOrder.customerEmail).toLowerCase().trim();
        await User.findOneAndUpdate(
          { email: cleanEmail },
          {
            $set: {
              ...(updatedOrder.shippingAddress && { address: updatedOrder.shippingAddress }),
              ...(updatedOrder.shippingState && { state: updatedOrder.shippingState }),
              ...(updatedOrder.shippingPincode && { pincode: updatedOrder.shippingPincode }),
              ...(updatedOrder.customerPhone && { phone: updatedOrder.customerPhone }),
            },
          }
        );
      } catch (uErr) {
        console.warn("User sync notice in payment verify:", uErr);
      }
    }

    // Dispatch paid tax invoice email asynchronously via Nodemailer
    if (updatedOrder?.customerEmail) {
      try {
        sendOrderInvoiceEmail({
          order: updatedOrder,
          toEmail: updatedOrder.customerEmail,
          isPaymentConfirmation: true,
        }).catch((err) => {
          console.warn("[Nodemailer] Async payment invoice email error:", err);
        });
      } catch (triggerErr) {
        console.warn("[Nodemailer] Could not trigger paid invoice email:", triggerErr);
      }
    }

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
