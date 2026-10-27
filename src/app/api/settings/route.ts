import { NextRequest, NextResponse } from "next/server";
import { connection } from "next/server";
import dbConnect from "@/lib/dbConnect";
import SiteSettings from "@/models/SiteSettings";
import { requireAdmin } from "@/lib/auth";

const DEFAULT_SETTINGS = {
  maintenanceMode: false,
  maintenanceMessage:
    "We are currently curating new artisanal cold-process batches. The Star Light atelier will reopen shortly.",
  whatsappNumber: "919876543210",
  contactPhone: "+91 98765 43210",
  contactEmail: "care@starlightsoaps.com",
  socialLinks: {
    instagram: "https://instagram.com/starlightsoaps",
    facebook: "https://facebook.com/starlightsoaps",
    twitter: "https://x.com/starlightsoaps",
  },
  ritualSection: {
    tag: "The Star Light Standard",
    title: "The Art of True Cold-Process Saponification",
    subtitle:
      "Most shelf soaps are synthetic detergents masquerading as soap. Here is why our cold-cured bars transform your daily bathing into a transformative skincare ritual.",
    pillars: [
      {
        id: "p1",
        iconName: "Flame",
        title: "Ancient Dragon's Blood",
        desc: "Wild-harvested sacred resin used for centuries to tone, fortify skin elasticity, and guard against cellular stressors.",
      },
      {
        id: "p2",
        iconName: "Droplet",
        title: "Glycerin Retention",
        desc: "Commercial soap factories strip natural glycerin for lotion profits. Our cold-process method seals every drop inside the bar.",
      },
      {
        id: "p3",
        iconName: "Leaf",
        title: "Unrefined Botanical Lipids",
        desc: "Formulated with raw Ghanaian shea butter, organic virgin coconut oil, and cold-pressed sweet almond nectar.",
      },
      {
        id: "p4",
        iconName: "PackageCheck",
        title: "Zero Plastic Guarantee",
        desc: "Every bar arrives swaddled in recyclable terracotta parchment paper and compostable unbleached plant fibers.",
      },
    ],
  },
  reviewsSection: {
    tag: "Tested & Loved",
    title: "Skin Stories from Our Community",
    subtitle:
      "Over 14,000 satisfied customers have swapped commercial harsh cleansers for our gentle botanical cold-process soaps.",
    reviews: [
      {
        id: "r1",
        name: "Seraphina Vance",
        location: "San Francisco, CA",
        verified: true,
        soapPurchased: "Dragon's Blood & Smoked Amber",
        rating: 5,
        review:
          "“I threw away all liquid body washes after one shower with Star Light Co. The lather is creamy like dense whipped velvet, and the scent of warm amber and star anise lingers subtly all day without being overpowering. My skin has never felt this hydrated.”",
        initials: "SV",
      },
      {
        id: "r2",
        name: "Julian Thorne",
        location: "London, UK",
        verified: true,
        soapPurchased: "Festival Dragon's Glow Gift Set",
        rating: 5,
        review:
          "“The packaging alone is worth an art exhibit. The dark collector box with the terracotta ribbon and dragon seal blew my partner away. The soaps with the gold leaf look and smell like imperial apothecary treasures. Will be buying these as gifts every season!”",
        initials: "JT",
      },
      {
        id: "r3",
        name: "Aria Montgomery",
        location: "Austin, TX",
        verified: true,
        soapPurchased: "Kashmiri Saffron & Raw Honey",
        rating: 5,
        review:
          "“The saffron threads and goat milk formula completely healed my winter dryness in less than a week. You can feel the real cold-process glycerin difference immediately. Plus, knowing it comes in plastic-free terracotta packaging makes it even better.”",
        initials: "AM",
      },
    ],
  },
};

export async function GET() {
  await connection();
  try {
    await dbConnect();
    let settings = await SiteSettings.findOne({}).lean();

    if (!settings) {
      settings = await SiteSettings.create(DEFAULT_SETTINGS);
    }

    return NextResponse.json({ success: true, settings });
  } catch (error: any) {
    if (error && typeof error === "object" && "digest" in error && String(error.digest).startsWith("NEXT_")) {
      throw error;
    }
    console.error("Get settings error:", error);
    // Return fallback defaults gracefully if db error
    return NextResponse.json({ success: true, settings: DEFAULT_SETTINGS });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const admin = requireAdmin(req);
    if (!admin) {
      return NextResponse.json({ success: false, message: "Admin access required" }, { status: 403 });
    }

    await dbConnect();
    const body = await req.json();

    const updated = await SiteSettings.findOneAndUpdate({}, body, {
      new: true,
      upsert: true,
    }).lean();

    return NextResponse.json({ success: true, settings: updated });
  } catch (error) {
    console.error("Update settings error:", error);
    return NextResponse.json({ success: false, message: "Failed to update settings" }, { status: 500 });
  }
}
