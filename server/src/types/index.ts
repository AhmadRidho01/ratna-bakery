// semua TypeScript types di satu tempat:

import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";

// Extend Request untuk menyimpan data user dari JWT
export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: "admin" | "customer";
    email: string;
  };
}

// Standard API Response
export interface ApiResponse<T = null> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

// Untuk pagination
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
  hasNext: boolean;
}

export type UserRole = "admin" | "customer";
export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "done"
  | "cancelled";
export type PaymentStatus = "unpaid" | "paid" | "failed" | "refunded";
export type ProductCategory = "roti" | "camilan";
