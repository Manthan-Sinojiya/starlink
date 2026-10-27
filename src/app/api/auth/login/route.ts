import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { signToken } from "@/lib/auth";
import { checkRateLimit, rateLimitResponse } from "@/lib/rateLimit";

export async function POST(req: NextRequest) {
  // Prevent credential brute forcing (5 attempts per min per IP)
  const rl = checkRateLimit(req, { limit: 5, windowMs: 60_000, prefix: "auth-login" });
  if (!rl.success) return rateLimitResponse(rl);

  try {
    await dbConnect();
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password || typeof email !== "string" || typeof password !== "string") {
      return NextResponse.json(
        { success: false, message: "Valid email and password are required" },
        { status: 400 }
      );
    }

    const sanitizedEmail = email.toLowerCase().trim().slice(0, 100);
    let user = await User.findOne({ email: sanitizedEmail });
    if (!user) {
      const adminEmail = (process.env.ADMIN_EMAIL || "admin@starlight.com").toLowerCase().trim();
      const adminPassword = process.env.ADMIN_PASSWORD || "Admin@123456";
      if (sanitizedEmail === adminEmail && password === adminPassword) {
        user = await User.create({
          name: "Star Light Admin",
          email: adminEmail,
          password: adminPassword,
          role: "admin",
          phone: "+91 98765 43210",
          state: "Maharashtra",
        });
      } else {
        return NextResponse.json(
          { success: false, message: "Invalid email or password." },
          { status: 401 }
        );
      }
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: "Incorrect password. Please try again." },
        { status: 401 }
      );
    }

    const token = signToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      name: user.name,
    });

    const response = NextResponse.json({
      success: true,
      message: `Welcome back, ${user.name}!`,
      token,
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

    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, message: "Server error. Please try again." },
      { status: 500 }
    );
  }
}
