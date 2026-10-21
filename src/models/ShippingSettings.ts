import mongoose, { Document, Model, Schema } from "mongoose";

export interface IShippingSettings extends Document {
  shippingType: "flat" | "free_threshold" | "state_wise";
  flatRate: number;
  freeShippingThreshold: number;
  enableFreeThreshold: boolean;
  defaultStateRate: number;
  stateRates: Record<string, number>;
}

const ShippingSettingsSchema = new Schema<IShippingSettings>(
  {
    shippingType: {
      type: String,
      enum: ["flat", "free_threshold", "state_wise"],
      default: "flat",
    },
    flatRate: { type: Number, default: 99 },
    freeShippingThreshold: { type: Number, default: 999 },
    enableFreeThreshold: { type: Boolean, default: true },
    defaultStateRate: { type: Number, default: 99 },
    stateRates: { type: Map, of: Number, default: {} },
  },
  { timestamps: true }
);

const ShippingSettings: Model<IShippingSettings> =
  mongoose.models.ShippingSettings ||
  mongoose.model<IShippingSettings>("ShippingSettings", ShippingSettingsSchema);

export default ShippingSettings;
