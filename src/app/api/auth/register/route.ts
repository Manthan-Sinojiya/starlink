import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { signToken } from "@/lib/auth";
import { checkRateLimit, rateLimitResponse } from "@/lib/rateLimit";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  // Prevent registration spam (max 5 per min per IP)
  const rl = checkRateLimit(req, { limit: 5, windowMs: 60_000, prefix: "auth-register" });
  if (!rl.success) return rateLimitResponse(rl);

  try {
    await dbConnect();
    const body = await req.json();
    const { name, email, password, phone, address, state, pincode } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: "Name, email, and password are required." },
        { status: 400 }
      );
    }

    const trimmedEmail = email.toLowerCase().trim();
    if (!EMAIL_REGEX.test(trimmedEmail) || trimmedEmail.length > 100) {
      return NextResponse.json(
        { success: false, message: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    if (typeof password !== "string" || password.length < 6 || password.length > 128) {
      return NextResponse.json(
        { success: false, message: "Password must be between 6 and 128 characters." },
        { status: 400 }
      );
    }

    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return NextResponse.json(
        { success: false, message: "An account with this email already exists." },
        { status: 409 }
      );
    }

    const newUser = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      phone: phone?.trim(),
      address: address?.trim(),
      state: state || "Maharashtra",
      pincode: pincode?.trim(),
      role: "customer",
    });

    const token = signToken({
      userId: newUser._id.toString(),
      email: newUser.email,
      role: newUser.role,
      name: newUser.name,
    });

    const response = NextResponse.json(
      {
        success: true,
        message: "Account created successfully! Welcome to Star Light Co.",
        token,
        user: {
          id: newUser._id.toString(),
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          phone: newUser.phone,
          address: newUser.address,
          state: newUser.state,
          pincode: newUser.pincode,
          totalOrders: 0,
          totalSpent: 0,
          createdAt: newUser.createdAt,
        },
      },
      { status: 201 }
    );

    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { success: false, message: "Server error. Please try again." },
      { status: 500 }
    );
  }
}
