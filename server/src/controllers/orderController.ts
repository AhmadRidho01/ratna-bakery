import { Request, Response } from "express";
import Order from "../models/Order";
import Product from "../models/Product";
import { AuthRequest } from "../types";
import { sendSuccess, sendError } from "../utils/response";
import { catchAsync } from "../middlewares/errorHandler";
import Midtrans from "midtrans-client";

const snap = new Midtrans.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY!,
  clientKey: process.env.MIDTRANS_CLIENT_KEY!,
});

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

// Tambah fungsi ini
export const checkout = catchAsync(async (req: Request, res: Response) => {
  const {
    customer,
    items,
    shippingCost = 0,
    notes,
    isPreOrder,
    eventDate,
  } = req.body;

  // Validasi & hitung total — sama seperti createOrder
  let totalAmount = 0;
  const orderItems = [];

  for (const item of items) {
    const product = await Product.findById(item.productId);
    if (!product) {
      sendError(res, `Produk tidak ditemukan.`, 404);
      return;
    }
    if (!product.isAvailable || product.stock < item.quantity) {
      sendError(res, `Stok ${product.name} tidak mencukupi.`, 400);
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

  const grandTotal = totalAmount + shippingCost;

  // Buat order di database
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

  // Buat transaksi Midtrans
  const midtransParameter = {
    transaction_details: {
      order_id: order.orderCode,
      gross_amount: grandTotal,
    },
    customer_details: {
      first_name: customer.name,
      phone: customer.phone,
      email: customer.email,
      shipping_address: {
        address: customer.address,
        city: customer.city,
        postal_code: customer.postalCode,
      },
    },
    item_details: [
      ...orderItems.map((item) => ({
        id: item.productId.toString(),
        price: item.price,
        quantity: item.quantity,
        name: item.name,
      })),
      {
        id: "SHIPPING",
        price: shippingCost,
        quantity: 1,
        name: "Ongkos Kirim",
      },
    ],
  };

  const midtransTransaction = await snap.createTransaction(midtransParameter);

  // Simpan token Midtrans ke order
  await Order.findByIdAndUpdate(order._id, {
    midtransToken: midtransTransaction.token,
    midtransRedirectUrl: midtransTransaction.redirect_url,
  });

  sendSuccess(
    res,
    {
      order: { orderCode: order.orderCode },
      paymentUrl: midtransTransaction.redirect_url,
      paymentToken: midtransTransaction.token,
    },
    "Pesanan berhasil dibuat.",
    201,
  );
});

// ADMIN ONLY — statistik dashboard
export const getDashboardStats = catchAsync(
  async (req: Request, res: Response) => {
    const [totalProducts, totalOrders, pendingOrders, paidOrders] =
      await Promise.all([
        Product.countDocuments({ isAvailable: true }),
        Order.countDocuments(),
        Order.countDocuments({ status: "pending" }),
        Order.find({ paymentStatus: "paid" }).select("grandTotal"),
      ]);

    const totalRevenue = paidOrders.reduce(
      (sum, order) => sum + order.grandTotal,
      0,
    );

    sendSuccess(
      res,
      {
        totalProducts,
        totalOrders,
        pendingOrders,
        totalRevenue,
      },
      "Dashboard stats berhasil diambil.",
    );
  },
);
