import { NextRequest, NextResponse } from "next/server";
import { connection } from "next/server";
import dbConnect from "@/lib/dbConnect";
import HeroSection from "@/models/HeroSection";
import { requireAdmin } from "@/lib/auth";

// GET hero section (public)
export async function GET() {
  await connection();
  try {
    await dbConnect();
    let hero = await HeroSection.findOne({}).lean();

    // Return default if none in DB
    if (!hero) {
      return NextResponse.json({
        success: true,
        slides: getDefaultSlides(),
      });
    }

    return NextResponse.json({ success: true, slides: hero.slides });
  } catch (error: any) {
    if (error && typeof error === "object" && "digest" in error && String(error.digest).startsWith("NEXT_")) {
      throw error;
    }
    console.error("Get hero error:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch hero section" }, { status: 500 });
  }
}

// PUT update hero section (admin only)
export async function PUT(req: NextRequest) {
  try {
    const admin = requireAdmin(req);
    if (!admin) return NextResponse.json({ success: false, message: "Admin access required" }, { status: 403 });

    await dbConnect();
    const body = await req.json();
    const { slides } = body;

    const hero = await HeroSection.findOneAndUpdate(
      {},
      { slides },
      { new: true, upsert: true }
    ).lean();

    return NextResponse.json({ success: true, hero });
  } catch (error) {
    console.error("Update hero error:", error);
    return NextResponse.json({ success: false, message: "Failed to update hero section" }, { status: 500 });
  }
}

function getDefaultSlides() {
  return [
    {
      id: "slide-1",
      headline: "Dragon's Blood\nArtisanal Soap",
      subheadline: "Sacred Dragon's Blood Resin · Himalayan Pink Salt",
      description: "Cold-processed with rare Dragon's Blood resin and Himalayan pink salt. A velvety ritual for radiant skin.",
      image: "/images/products/dragons-blood.jpg",
      imageAlt: "Dragon's Blood artisanal cold-process soap bar by Star Light Co.",
      ctaText: "Shop Dragon's Blood",
      ctaLink: "/#all-soaps",
      badge: "Best Seller",
      isActive: true,
      order: 0,
    },
    {
      id: "slide-2",
      headline: "Kashmiri Saffron\n& Wild Honey",
      subheadline: "Kashmiri Saffron · Wild Forest Honey · Goat Milk",
      description: "A luxurious golden bar infused with the world's finest saffron for a radiant, luminous complexion.",
      image: "/images/products/saffron-honey.jpg",
      imageAlt: "Kashmiri Saffron and Honey artisanal soap bar by Star Light Co.",
      ctaText: "Discover Saffron Bar",
      ctaLink: "/#all-soaps",
      badge: "New Arrival",
      isActive: true,
      order: 1,
    },
    {
      id: "slide-3",
      headline: "Damask Rose\nFrench Pink Clay",
      subheadline: "Bulgarian Rose Otto · French Pink Clay · Argan Oil",
      description: "Rosa damascena petals meet French pink clay in a velvet-lather bar for delicate, luminous skin.",
      image: "/images/products/damask-rose.jpg",
      imageAlt: "Damask Rose and French Pink Clay artisanal soap bar by Star Light Co.",
      ctaText: "Explore Rose Collection",
      ctaLink: "/#all-soaps",
      badge: "Bestseller",
      isActive: true,
      order: 2,
    },
  ];
}
