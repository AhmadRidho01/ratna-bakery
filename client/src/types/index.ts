// Mirror dari backend

// --- --- ---

// Harus konsisten dengan tipe di backend

export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  category: "roti" | "camilan";
  images: string[];
  isAvailable: boolean;
  isBestSeller: boolean;
  stock: number;
  weight: number;
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  _id: string;
  orderCode: string;
  customer: CustomerInfo;
  items: OrderItem[];
  totalAmount: number;
  shippingCost: number;
  grandTotal: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  notes?: string;
  isPreOrder: boolean;
  eventDate?: string;
  createdAt: string;
}

export interface CustomerInfo {
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  postalCode: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "done"
  | "cancelled";
export type PaymentStatus = "unpaid" | "paid" | "failed" | "refunded";

export interface ApiResponse<T = null> {
  success: boolean;
  message: string;
  data?: T;
}
