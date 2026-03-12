import { Router } from "express";
import {
  getAllProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
  upload,
} from "../controllers/productController";
import { authenticate, authorizeAdmin } from "../middlewares/auth";

const router = Router();

// Public routes
router.get("/", getAllProducts);
router.post(
  "/upload-image",
  authenticate,
  authorizeAdmin,
  upload.single("image"),
  uploadImage,
);
router.get("/:slug", getProductBySlug);

// Admin only routes
router.post("/", authenticate, authorizeAdmin, createProduct);
router.put("/:id", authenticate, authorizeAdmin, updateProduct);
router.delete("/:id", authenticate, authorizeAdmin, deleteProduct);

export default router;
