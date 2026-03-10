import mongoose, { Document, Schema } from "mongoose";
import { OrderStatus, PaymentStatus } from "../types";

export interface IOrderItem {
  productId: mongoose.Types.ObjectId;
  name: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface IOrder extends Document {
  orderCode: string;
  customer: {
    name: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    postalCode: string;
  };
  items: IOrderItem[];
  totalAmount: number;
  shippingCost: number;
  grandTotal: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod?: string;
  midtransToken?: string;
  midtransRedirectUrl?: string;
  notes?: string;
  isPreOrder: boolean;
  eventDate?: Date;
}

const OrderItemSchema = new Schema<IOrderItem>({
  productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  subtotal: { type: Number, required: true },
});

const OrderSchema = new Schema<IOrder>(
  {
    orderCode: { type: String, unique: true },
    customer: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      email: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
    },
    items: [OrderItemSchema],
    totalAmount: { type: Number, required: true },
    shippingCost: { type: Number, default: 0 },
    grandTotal: { type: Number, required: true },
    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "done",
        "cancelled",
      ],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid", "failed", "refunded"],
      default: "unpaid",
    },
    paymentMethod: { type: String },
    midtransToken: { type: String },
    midtransRedirectUrl: { type: String },
    notes: { type: String },
    isPreOrder: { type: Boolean, default: false },
    eventDate: { type: Date },
  },
  { timestamps: true },
);

// Auto-generate orderCode sebelum disimpan
OrderSchema.pre("save", async function () {
  if (!this.orderCode) {
    const date = new Date();
    const dateStr =
      date.getFullYear().toString() +
      String(date.getMonth() + 1).padStart(2, "0") +
      String(date.getDate()).padStart(2, "0");
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    this.orderCode = `RB-${dateStr}-${random}`;
  }
});

export default mongoose.model<IOrder>("Order", OrderSchema);
