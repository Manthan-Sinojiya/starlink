import mongoose, { Document, Model, Schema } from "mongoose";

export interface IProduct extends Document {
  _id: mongoose.Types.ObjectId;
  slug: string;
  name: string;
  tagline?: string;
  mainCategory: string;
  subCategory?: string;
  category?: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  weight?: string;
  weightValue?: number;
  weightUnit?: string;
  taxType?: string;
  taxRate?: number;
  cureTime?: string;
  badge?: string;
  fragranceNotes?: string[];
  scentPyramid?: {
    top: string[];
    heart: string[];
    base: string[];
  };
  keyIngredients?: string[];
  fullIngredients?: string[];
  skinType?: string;
  soapBenefits?: string[];
  ritualHowToUse?: string;
  description: string;
  image: string;
  imagePublicId?: string;
  imageAlt?: string;
  gallery?: Array<{ url: string; publicId?: string; alt?: string }>;
  inStock: boolean;
  isBestseller: boolean;
  isFestive: boolean;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: { type: String, required: true, trim: true },
    tagline: { type: String },
    mainCategory: { type: String, required: true },
    subCategory: { type: String },
    category: { type: String },
    price: { type: Number, required: true, min: 0 },
    originalPrice: { type: Number },
    rating: { type: Number, default: 5.0, min: 0, max: 5 },
    reviewsCount: { type: Number, default: 0 },
    weight: { type: String },
    weightValue: { type: Number },
    weightUnit: { type: String, default: "g" },
    taxType: { type: String, default: "inclusive" },
    taxRate: { type: Number, default: 18 },
    cureTime: { type: String },
    badge: { type: String },
    fragranceNotes: [{ type: String }],
    scentPyramid: {
      top: [{ type: String }],
      heart: [{ type: String }],
      base: [{ type: String }],
    },
    keyIngredients: [{ type: String }],
    fullIngredients: [{ type: String }],
    skinType: { type: String },
    soapBenefits: [{ type: String }],
    ritualHowToUse: { type: String },
    description: { type: String, required: true },
    image: { type: String, required: true },
    imagePublicId: { type: String },
    imageAlt: { type: String },
    gallery: [
      {
        url: { type: String, required: true },
        publicId: { type: String },
        alt: { type: String },
      },
    ],
    inStock: { type: Boolean, default: true },
    isBestseller: { type: Boolean, default: false },
    isFestive: { type: Boolean, default: false },
    metaTitle: { type: String },
    metaDescription: { type: String },
    metaKeywords: [{ type: String }],
  },
  { timestamps: true }
);

ProductSchema.index({ mainCategory: 1 });
ProductSchema.index({ isBestseller: 1 });
ProductSchema.index({ isFestive: 1 });
ProductSchema.index({ inStock: 1 });
ProductSchema.index({ name: "text", description: "text", tagline: "text" });

const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);

export default Product;
