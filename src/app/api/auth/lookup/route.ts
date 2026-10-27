import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email || !EMAIL_REGEX.test(email.trim().toLowerCase())) {
      return NextResponse.json({ success: false, message: "Valid email is required" }, { status: 400 });
    }

    await dbConnect();
    const cleanEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: cleanEmail }).select("name email phone address state pincode").lean();

    if (!user) {
      return NextResponse.json({ success: true, exists: false });
    }

    return NextResponse.json({
      success: true,
      exists: true,
      user: {
        name: user.name || "",
        email: user.email,
        phone: user.phone || "",
        address: user.address || "",
        state: user.state || "Maharashtra",
        pincode: user.pincode || "",
      },
    });
  } catch (error: any) {
    console.error("Lookup error:", error);
    return NextResponse.json({ success: false, message: "Failed to look up email" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = body?.email;

    if (!email || !EMAIL_REGEX.test(String(email).trim().toLowerCase())) {
      return NextResponse.json({ success: false, message: "Valid email is required" }, { status: 400 });
    }

    await dbConnect();
    const cleanEmail = String(email).trim().toLowerCase();
    const user = await User.findOne({ email: cleanEmail }).select("name email phone address state pincode").lean();

    if (!user) {
      return NextResponse.json({ success: true, exists: false });
    }

    return NextResponse.json({
      success: true,
      exists: true,
      user: {
        name: user.name || "",
        email: user.email,
        phone: user.phone || "",
        address: user.address || "",
        state: user.state || "Maharashtra",
        pincode: user.pincode || "",
      },
    });
  } catch (error: any) {
    console.error("Lookup error:", error);
    return NextResponse.json({ success: false, message: "Failed to look up email" }, { status: 500 });
  }
}
