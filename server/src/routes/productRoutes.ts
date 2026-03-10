import { Router } from "express";
import {
  getAllProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController";
import { authenticate, authorizeAdmin } from "../middlewares/auth";

const router = Router();

// Public routes
router.get("/", getAllProducts);
router.get("/:slug", getProductBySlug);

// Admin only routes
router.post("/", authenticate, authorizeAdmin, createProduct);
router.put("/:id", authenticate, authorizeAdmin, updateProduct);
router.delete("/:id", authenticate, authorizeAdmin, deleteProduct);

export default router;
