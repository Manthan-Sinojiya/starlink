import mongoose, { Document, Model, Schema } from "mongoose";

export interface IOrderItem {
  productId: string;
  name: string;
  image: string;
  imageAlt?: string;
  price: number;
  quantity: number;
  weight?: string;
}

export interface IOrder extends Document {
  _id: mongoose.Types.ObjectId;
  orderNumber: string;
  customerEmail: string;
  customerName: string;
  customerPhone?: string;
  items: IOrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  shippingState?: string;
  shippingAddress?: string;
  shippingPincode?: string;
  status: "Pending" | "Confirmed" | "Shipped" | "Delivered" | "Cancelled";
  paymentStatus: "Pending" | "Paid" | "Failed" | "Refunded";
  paymentMethod: "razorpay" | "cod";
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>(
  {
    productId: { type: String, required: true },
    name: { type: String, required: true },
    image: { type: String, required: true },
    imageAlt: { type: String },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    weight: { type: String },
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrder>(
  {
    orderNumber: { type: String, required: true, unique: true },
    customerEmail: { type: String, required: true, lowercase: true },
    customerName: { type: String, required: true },
    customerPhone: { type: String },
    items: [OrderItemSchema],
    subtotal: { type: Number, required: true },
    shipping: { type: Number, default: 0 },
    total: { type: Number, required: true },
    shippingState: { type: String },
    shippingAddress: { type: String },
    shippingPincode: { type: String },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed", "Refunded"],
      default: "Pending",
    },
    paymentMethod: {
      type: String,
      enum: ["razorpay", "cod"],
      default: "razorpay",
    },
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    razorpaySignature: { type: String },
    notes: { type: String },
  },
  { timestamps: true }
);

OrderSchema.index({ customerEmail: 1 });
OrderSchema.index({ status: 1 });
OrderSchema.index({ createdAt: -1 });

const Order: Model<IOrder> =
  mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);

export default Order;
