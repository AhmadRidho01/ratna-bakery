import { create } from "zustand";
import type { CartItem, Product } from "../types";

interface CartStore {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

const useCartStore = create<CartStore>((set, get) => ({
  items: [],

  addItem: (product, quantity = 1) => {
    const existingItem = get().items.find(
      (item) => item.product._id === product._id,
    );

    if (existingItem) {
      // Kalau produk sudah ada di cart, tambah quantity
      set((state) => ({
        items: state.items.map((item) =>
          item.product._id === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        ),
      }));
    } else {
      // Kalau belum ada, tambahkan sebagai item baru
      set((state) => ({
        items: [...state.items, { product, quantity }],
      }));
    }
  },

  removeItem: (productId) => {
    set((state) => ({
      items: state.items.filter((item) => item.product._id !== productId),
    }));
  },

  updateQuantity: (productId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(productId);
      return;
    }
    set((state) => ({
      items: state.items.map((item) =>
        item.product._id === productId ? { ...item, quantity } : item,
      ),
    }));
  },

  clearCart: () => set({ items: [] }),

  getTotalItems: () => {
    return get().items.reduce((total, item) => total + item.quantity, 0);
  },

  getTotalPrice: () => {
    return get().items.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0,
    );
  },
}));

export default useCartStore;
