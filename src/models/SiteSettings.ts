import mongoose, { Document, Model, Schema } from "mongoose";

export interface IRitualPillar {
  id?: string;
  iconName?: string;
  title: string;
  desc: string;
}

export interface IReviewStory {
  id?: string;
  name: string;
  location: string;
  verified: boolean;
  soapPurchased: string;
  rating: number;
  review: string;
  initials?: string;
}

export interface ISocialLinks {
  instagram?: string;
  facebook?: string;
  twitter?: string;
}

export interface ISeoSettings {
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  organizationName?: string;
  brandTagline?: string;
  storeTelephone?: string;
  storeEmail?: string;
  priceRange?: string;
  enableCustomSchema?: boolean;
  customSchemaJson?: string;
}

export interface ISiteSettings extends Document {
  maintenanceMode: boolean;
  maintenanceMessage: string;
  whatsappNumber: string;
  contactPhone: string;
  contactEmail: string;
  socialLinks?: ISocialLinks;
  seo?: ISeoSettings;
  ritualSection: {
    tag: string;
    title: string;
    subtitle: string;
    pillars: IRitualPillar[];
  };
  reviewsSection: {
    tag: string;
    title: string;
    subtitle: string;
    reviews: IReviewStory[];
  };
}

const RitualPillarSchema = new Schema({
  id: { type: String },
  iconName: { type: String, default: "Leaf" },
  title: { type: String, required: true },
  desc: { type: String, required: true },
});

const ReviewStorySchema = new Schema({
  id: { type: String },
  name: { type: String, required: true },
  location: { type: String, default: "" },
  verified: { type: Boolean, default: true },
  soapPurchased: { type: String, default: "" },
  rating: { type: Number, default: 5 },
  review: { type: String, required: true },
  initials: { type: String, default: "" },
});

const SiteSettingsSchema = new Schema<ISiteSettings>(
  {
    maintenanceMode: { type: Boolean, default: false },
    maintenanceMessage: {
      type: String,
      default:
        "We are currently curating new batches of our artisanal cold-process soaps. The Star Light atelier will reopen shortly.",
    },
    whatsappNumber: { type: String, default: "919876543210" },
    contactPhone: { type: String, default: "+91 98765 43210" },
    contactEmail: { type: String, default: "care@starlightsoaps.com" },
    socialLinks: {
      instagram: { type: String, default: "https://instagram.com/starlightsoaps" },
      facebook: { type: String, default: "https://facebook.com/starlightsoaps" },
      twitter: { type: String, default: "https://x.com/starlightsoaps" },
    },
    ritualSection: {
      tag: { type: String, default: "The Star Light Standard" },
      title: { type: String, default: "The Art of True Cold-Process Saponification" },
      subtitle: {
        type: String,
        default:
          "Most shelf soaps are synthetic detergents masquerading as soap. Here is why our cold-cured bars transform your daily bathing into a transformative skincare ritual.",
      },
      pillars: [RitualPillarSchema],
    },
    reviewsSection: {
      tag: { type: String, default: "Tested & Loved" },
      title: { type: String, default: "Skin Stories from Our Community" },
      subtitle: {
        type: String,
        default:
          "Over 14,000 satisfied customers have swapped commercial harsh cleansers for our gentle botanical cold-process soaps.",
      },
      reviews: [ReviewStorySchema],
    },
    seo: {
      metaTitle: {
        type: String,
        default: "STAR LIGHT CO. | Luxury Handcrafted Cold-Process Artisanal Soaps",
      },
      metaDescription: {
        type: String,
        default:
          "Discover Star Light Co. artisanal cold-processed luxury soaps. Hand-poured with sacred Dragon's Blood resin, organic botanical extracts, and nourishing plant lipids.",
      },
      metaKeywords: {
        type: String,
        default:
          "artisan soap, cold process soap, dragon's blood soap, luxury soap bar, organic handmade soap, ayurvedic soap",
      },
      organizationName: { type: String, default: "Star Light Co." },
      brandTagline: {
        type: String,
        default: "Luxury Cold-Process Soaps & Botanical Skincare",
      },
      storeTelephone: { type: String, default: "+91 98765 43210" },
      storeEmail: { type: String, default: "orders@starlight.co.in" },
      priceRange: { type: String, default: "₹299 - ₹2499" },
      enableCustomSchema: { type: Boolean, default: false },
      customSchemaJson: { type: String, default: "" },
    },
  },
  { timestamps: true }
);

const SiteSettings: Model<ISiteSettings> =
  mongoose.models.SiteSettings ||
  mongoose.model<ISiteSettings>("SiteSettings", SiteSettingsSchema);

export default SiteSettings;
