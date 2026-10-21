import mongoose, { Document, Model, Schema } from "mongoose";

export interface ICategory extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  description?: string;
  parentCategory?: string | null;
  image: string;
  imagePublicId?: string;
  imageAlt?: string;
  bannerImage?: string;
  bannerImagePublicId?: string;
  bannerHeadline?: string;
  bannerSubheadline?: string;
  badge?: string;
  subcategories: string[];
  order: number;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, default: "" },
    parentCategory: { type: String, default: null },
    image: { type: String, required: true },
    imagePublicId: { type: String },
    imageAlt: { type: String },
    bannerImage: { type: String },
    bannerImagePublicId: { type: String },
    bannerHeadline: { type: String },
    bannerSubheadline: { type: String },
    badge: { type: String, default: "Signature" },
    subcategories: [{ type: String }],
    order: { type: Number, default: 0 },
    metaTitle: { type: String },
    metaDescription: { type: String },
    metaKeywords: [{ type: String }],
  },
  { timestamps: true }
);

CategorySchema.index({ order: 1 });

const Category: Model<ICategory> =
  mongoose.models.Category || mongoose.model<ICategory>("Category", CategorySchema);

export default Category;
