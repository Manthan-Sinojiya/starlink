import { NextRequest, NextResponse } from "next/server";
import { connection } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(req: NextRequest) {
  await connection();
  try {
    const jwtUser = getUserFromRequest(req);
    if (!jwtUser) {
      return NextResponse.json(
        { success: false, message: "Not authenticated" },
        { status: 401 }
      );
    }

    await dbConnect();
    const user = await User.findById(jwtUser.userId).select("-password");
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        address: user.address,
        state: user.state,
        pincode: user.pincode,
        totalOrders: user.totalOrders,
        totalSpent: user.totalSpent,
        createdAt: user.createdAt,
      },
    });
  } catch (error: any) {
    if (error && typeof error === "object" && "digest" in error && String(error.digest).startsWith("NEXT_")) {
      throw error;
    }
    console.error("Me error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const jwtUser = getUserFromRequest(req);
    if (!jwtUser) {
      return NextResponse.json(
        { success: false, message: "Not authenticated" },
        { status: 401 }
      );
    }

    await dbConnect();
    const body = await req.json();
    const { name, phone, address, state, pincode } = body;

    const updated = await User.findByIdAndUpdate(
      jwtUser.userId,
      { name, phone, address, state, pincode },
      { new: true, select: "-password" }
    );

    if (!updated) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: updated._id.toString(),
        name: updated.name,
        email: updated.email,
        role: updated.role,
        phone: updated.phone,
        address: updated.address,
        state: updated.state,
        pincode: updated.pincode,
        totalOrders: updated.totalOrders,
        totalSpent: updated.totalSpent,
        createdAt: updated.createdAt,
      },
    });
  } catch (error) {
    console.error("Update me error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
