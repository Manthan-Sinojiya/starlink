import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import ShippingSettings from "@/models/ShippingSettings";
import { requireAdmin } from "@/lib/auth";


export async function GET() {
  try {
    await dbConnect();
    let settings = await ShippingSettings.findOne({}).lean();

    if (!settings) {
      settings = await ShippingSettings.create({
        shippingType: "flat",
        flatRate: 99,
        freeShippingThreshold: 999,
        enableFreeThreshold: true,
        defaultStateRate: 99,
        stateRates: {},
      });
    }

    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error("Get shipping error:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch shipping settings" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const admin = requireAdmin(req);
    if (!admin) return NextResponse.json({ success: false, message: "Admin access required" }, { status: 403 });

    await dbConnect();
    const body = await req.json();

    const updated = await ShippingSettings.findOneAndUpdate({}, body, { new: true, upsert: true }).lean();
    return NextResponse.json({ success: true, settings: updated });
  } catch (error) {
    console.error("Update shipping error:", error);
    return NextResponse.json({ success: false, message: "Failed to update shipping settings" }, { status: 500 });
  }
}
