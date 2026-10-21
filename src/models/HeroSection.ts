import mongoose, { Document, Model, Schema } from "mongoose";

export interface IHeroSlide {
  id: string;
  headline: string;
  subheadline?: string;
  description?: string;
  image: string;
  imagePublicId?: string;
  imageAlt: string;
  ctaText?: string;
  ctaLink?: string;
  badge?: string;
  isActive: boolean;
  order: number;
}

export interface IHeroSection extends Document {
  _id: mongoose.Types.ObjectId;
  slides: IHeroSlide[];
  metaTitle?: string;
  metaDescription?: string;
  updatedAt: Date;
}

const HeroSlideSchema = new Schema<IHeroSlide>(
  {
    id: { type: String, required: true },
    headline: { type: String, required: true },
    subheadline: { type: String },
    description: { type: String },
    image: { type: String, required: true },
    imagePublicId: { type: String },
    imageAlt: { type: String, required: true },
    ctaText: { type: String },
    ctaLink: { type: String },
    badge: { type: String },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { _id: false }
);

const HeroSectionSchema = new Schema<IHeroSection>(
  {
    slides: [HeroSlideSchema],
    metaTitle: { type: String },
    metaDescription: { type: String },
  },
  { timestamps: true }
);

const HeroSection: Model<IHeroSection> =
  mongoose.models.HeroSection ||
  mongoose.model<IHeroSection>("HeroSection", HeroSectionSchema);

export default HeroSection;
