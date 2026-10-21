import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import Category from "@/models/Category";
import Product from "@/models/Product";
import HeroSection from "@/models/HeroSection";
import ShippingSettings from "@/models/ShippingSettings";
import { SOAPS, CATEGORIES_DATA, DEFAULT_SHIPPING_SETTINGS } from "@/data/soaps";

// GET /api/admin/seed - seeds the database with admin user, categories, products, shipping & hero
export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const force = searchParams.get("force") === "true";

    // 1. Seed admin user
    const adminEmail = process.env.ADMIN_EMAIL || "admin@starlight.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "Admin@123456";

    const existingAdmin = await User.findOne({ email: adminEmail });
    if (!existingAdmin) {
      await User.create({
        name: "Star Light Admin",
        email: adminEmail,
        password: adminPassword, // hashed by pre-save hook
        role: "admin",
        phone: "+91 98765 43210",
        state: "Maharashtra",
      });
    }

    // If force is specified, remove outdated categories & products
    if (force) {
      await Category.deleteMany({});
      await Product.deleteMany({});
    }

    // 2. Seed default categories if none exist
    const catCount = await Category.countDocuments();
    if (catCount === 0) {
      const catsToInsert = CATEGORIES_DATA.map((c, idx) => ({
        name: c.name,
        slug: c.slug || c.id.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        description: c.description,
        image: c.image || "/images/products/dragons-blood.jpg",
        imageAlt: `${c.name} artisanal category`,
        badge: c.badge || "Signature",
        subcategories: c.subcategories || [],
        order: idx,
        metaTitle: c.metaTitle,
        metaDescription: c.metaDescription,
      }));
      await Category.insertMany(catsToInsert);
    }

    // 3. Seed products if none exist
    const prodCount = await Product.countDocuments();
    if (prodCount === 0) {
      const prodsToInsert = SOAPS.map((s) => ({
        slug: s.slug || s.id || s.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        name: s.name,
        tagline: s.tagline,
        mainCategory: s.mainCategory,
        subCategory: s.subCategory,
        category: s.category,
        price: s.price,
        originalPrice: s.originalPrice,
        rating: s.rating || 5.0,
        reviewsCount: s.reviewsCount || 0,
        weight: s.weight,
        weightValue: s.weightValue || 125,
        weightUnit: s.weightUnit || "g",
        taxType: s.taxType || "inclusive",
        taxRate: s.taxRate || 18,
        cureTime: s.cureTime,
        badge: s.badge,
        fragranceNotes: s.fragranceNotes || [],
        scentPyramid: s.scentPyramid,
        keyIngredients: s.keyIngredients || [],
        fullIngredients: s.fullIngredients || [],
        skinType: s.skinType,
        soapBenefits: s.soapBenefits || [],
        ritualHowToUse: s.ritualHowToUse,
        description: s.description,
        image: s.image,
        imageAlt: s.imageAlt || `${s.name} artisanal soap`,
        inStock: s.inStock !== false,
        isBestseller: !!s.isBestseller,
        isFestive: !!s.isFestive,
        metaTitle: s.metaTitle,
        metaDescription: s.metaDescription,
      }));
      await Product.insertMany(prodsToInsert);
    }

    // 4. Seed shipping settings if none exist
    const shipExists = await ShippingSettings.findOne({});
    if (!shipExists) {
      await ShippingSettings.create({
        shippingType: DEFAULT_SHIPPING_SETTINGS.shippingType,
        flatRate: DEFAULT_SHIPPING_SETTINGS.flatRate,
        freeShippingThreshold: DEFAULT_SHIPPING_SETTINGS.freeShippingThreshold,
        enableFreeThreshold: DEFAULT_SHIPPING_SETTINGS.enableFreeThreshold,
        defaultStateRate: DEFAULT_SHIPPING_SETTINGS.defaultStateRate,
        stateRates: DEFAULT_SHIPPING_SETTINGS.stateRates,
      });
    }

    // 5. Seed default hero slides if none exist
    const heroExists = await HeroSection.findOne({});
    if (!heroExists) {
      await HeroSection.create({
        slides: [
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
        ],
      });
    }

    return NextResponse.json({
      success: true,
      message: "Database seeded successfully with products, categories, shipping & hero slides.",
      adminEmail,
    });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json({ success: false, message: "Seeding failed", error: String(error) }, { status: 500 });
  }
}

export async function POST(req: Request) {
  return GET(req);
}
