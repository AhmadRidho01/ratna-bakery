import { Request, Response } from "express";
import Order from "../models/Order";
import Product from "../models/Product";
import { AuthRequest } from "../types";
import { sendSuccess, sendError } from "../utils/response";
import { catchAsync } from "../middlewares/errorHandler";

// PUBLIC — buat pesanan baru
export const createOrder = catchAsync(async (req: Request, res: Response) => {
  const { customer, items, notes, isPreOrder, eventDate } = req.body;

  // Validasi produk dan hitung total
  let totalAmount = 0;
  const orderItems = [];

  for (const item of items) {
    const product = await Product.findById(item.productId);
    if (!product) {
      sendError(
        res,
        `Produk dengan ID ${item.productId} tidak ditemukan.`,
        404,
      );
      return;
    }
    if (!product.isAvailable) {
      sendError(res, `Produk "${product.name}" sedang tidak tersedia.`, 400);
      return;
    }

    const subtotal = product.price * item.quantity;
    totalAmount += subtotal;

    orderItems.push({
      productId: product._id,
      name: product.name,
      price: product.price,
      quantity: item.quantity,
      subtotal,
    });
  }

  const shippingCost = req.body.shippingCost || 0;
  const grandTotal = totalAmount + shippingCost;

  const order = await Order.create({
    customer,
    items: orderItems,
    totalAmount,
    shippingCost,
    grandTotal,
    notes,
    isPreOrder: isPreOrder || false,
    eventDate: eventDate ? new Date(eventDate) : undefined,
  });

  sendSuccess(res, order, "Pesanan berhasil dibuat.", 201);
});

// PUBLIC — cek status pesanan via orderCode
export const getOrderByCode = catchAsync(
  async (req: Request, res: Response) => {
    const order = await Order.findOne({ orderCode: req.params.code });
    if (!order) {
      sendError(res, "Pesanan tidak ditemukan.", 404);
      return;
    }
    sendSuccess(res, order, "Pesanan berhasil diambil.");
  },
);

// ADMIN ONLY
export const getAllOrders = catchAsync(async (req: Request, res: Response) => {
  const { status, paymentStatus } = req.query;
  const filter: Record<string, unknown> = {};

  if (status) filter.status = status;
  if (paymentStatus) filter.paymentStatus = paymentStatus;

  const orders = await Order.find(filter).sort({ createdAt: -1 });
  sendSuccess(res, orders, "Semua pesanan berhasil diambil.");
});

export const updateOrderStatus = catchAsync(
  async (req: Request, res: Response) => {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true },
    );
    if (!order) {
      sendError(res, "Pesanan tidak ditemukan.", 404);
      return;
    }
    sendSuccess(res, order, "Status pesanan berhasil diupdate.");
  },
);
