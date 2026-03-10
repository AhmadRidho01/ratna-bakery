import mongoose, { Document, Schema } from "mongoose";
import { ProductCategory } from "../types";

export interface IProduct extends Document {
  name: string;
  slug: string;
  description: string;
  price: number;
  category: ProductCategory;
  images: string[];
  isAvailable: boolean;
  isBestSeller: boolean;
  stock: number;
  weight: number;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, unique: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, enum: ["roti", "camilan"], required: true },
    images: [{ type: String }],
    isAvailable: { type: Boolean, default: true },
    isBestSeller: { type: Boolean, default: false },
    stock: { type: Number, default: 0, min: 0 },
    weight: { type: Number, required: true, min: 0 },
  },
  { timestamps: true },
);

// Auto-generate slug dari name
ProductSchema.pre("save", function () {
  if (this.isModified("name")) {
    this.slug = this.name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
  }
});

export default mongoose.model<IProduct>("Product", ProductSchema);
