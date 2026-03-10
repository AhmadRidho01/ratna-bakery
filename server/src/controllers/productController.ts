import { Request, Response } from "express";
import Product from "../models/Product";
import { sendSuccess, sendError } from "../utils/response";
import { catchAsync } from "../middlewares/errorHandler";

// PUBLIC
export const getAllProducts = catchAsync(
  async (req: Request, res: Response) => {
    const { category, available, bestSeller, search } = req.query;

    const filter: Record<string, unknown> = {};

    if (category) filter.category = category;
    if (available === "true") filter.isAvailable = true;
    if (bestSeller === "true") filter.isBestSeller = true;
    if (search) {
      filter.name = { $regex: search as string, $options: "i" };
    }

    const products = await Product.find(filter).sort({ createdAt: -1 });
    sendSuccess(res, products, "Produk berhasil diambil.");
  },
);

export const getProductBySlug = catchAsync(
  async (req: Request, res: Response) => {
    const product = await Product.findOne({ slug: req.params.slug });
    if (!product) {
      sendError(res, "Produk tidak ditemukan.", 404);
      return;
    }
    sendSuccess(res, product, "Produk berhasil diambil.");
  },
);

// ADMIN ONLY
export const createProduct = catchAsync(async (req: Request, res: Response) => {
  const product = await Product.create(req.body);
  sendSuccess(res, product, "Produk berhasil ditambahkan.", 201);
});

export const updateProduct = catchAsync(async (req: Request, res: Response) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!product) {
    sendError(res, "Produk tidak ditemukan.", 404);
    return;
  }
  sendSuccess(res, product, "Produk berhasil diupdate.");
});

export const deleteProduct = catchAsync(async (req: Request, res: Response) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) {
    sendError(res, "Produk tidak ditemukan.", 404);
    return;
  }
  sendSuccess(res, null, "Produk berhasil dihapus.");
});
