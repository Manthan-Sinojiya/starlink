import { NextRequest, NextResponse } from "next/server";
import { connection } from "next/server";
import dbConnect from "@/lib/dbConnect";
import ShippingSettings from "@/models/ShippingSettings";
import { requireAdmin } from "@/lib/auth";

import { DEFAULT_SHIPPING_SETTINGS } from "@/data/soaps";

export async function GET() {
  await connection();
  try {
    await dbConnect();
    let settings = await ShippingSettings.findOne({}).lean();

    if (!settings) {
      settings = await ShippingSettings.create({
        shippingType: "state_wise",
        flatRate: 99,
        freeShippingThreshold: 999,
        enableFreeThreshold: true,
        defaultStateRate: 99,
        stateRates: DEFAULT_SHIPPING_SETTINGS.stateRates,
      });
    } else if (!settings.stateRates || Object.keys(settings.stateRates).length === 0) {
      settings = await ShippingSettings.findOneAndUpdate(
        {},
        { stateRates: DEFAULT_SHIPPING_SETTINGS.stateRates },
        { new: true }
      ).lean();
    }

    return NextResponse.json({ success: true, settings });
  } catch (error: any) {
    if (error && typeof error === "object" && "digest" in error && String(error.digest).startsWith("NEXT_")) {
      throw error;
    }
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
