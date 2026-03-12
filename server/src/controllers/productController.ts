import { Request, Response } from "express";
import Product from "../models/Product";
import { sendSuccess, sendError } from "../utils/response";
import { catchAsync } from "../middlewares/errorHandler";
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";

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

// Konfigurasi Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer — simpan di memory, bukan disk
export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 }, // max 2MB
  fileFilter: (_, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("File harus berupa gambar."));
  },
});

// Upload gambar ke Cloudinary
export const uploadImage = catchAsync(async (req: Request, res: Response) => {
  if (!req.file) {
    sendError(res, "Tidak ada file yang diupload.", 400);
    return;
  }

  const result = await new Promise<{ secure_url: string }>(
    (resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "ratna-bakery/products",
            transformation: [{ width: 800, crop: "limit" }],
          },
          (error, result) => {
            if (error || !result) reject(error);
            else resolve(result);
          },
        )
        .end(req.file!.buffer);
    },
  );

  sendSuccess(res, { url: result.secure_url }, "Gambar berhasil diupload.");
});
