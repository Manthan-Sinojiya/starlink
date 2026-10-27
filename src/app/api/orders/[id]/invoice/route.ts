import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Order from "@/models/Order";
import mongoose from "mongoose";
import { generateInvoiceHtml } from "@/lib/nodemailer";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return new NextResponse("Order identifier required", { status: 400 });
    }

    await dbConnect();
    const query = mongoose.Types.ObjectId.isValid(id)
      ? { _id: id }
      : { orderNumber: id };

    const order = await Order.findOne(query).lean();
    if (!order) {
      return new NextResponse("Order not found", { status: 404 });
    }

    const html = generateInvoiceHtml(order);

    return new NextResponse(html, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Content-Disposition": `inline; filename="Tax-Invoice-${order.orderNumber}.html"`,
      },
    });
  } catch (error: any) {
    console.error("Invoice generation error:", error);
    return new NextResponse("Failed to generate invoice", { status: 500 });
  }
}
