import { Router } from "express";
import {
  createOrder,
  checkout,
  getOrderByCode,
  getAllOrders,
  updateOrderStatus,
} from "../controllers/orderController";
import { authenticate, authorizeAdmin } from "../middlewares/auth";

const router = Router();

// Public routes
router.post("/", createOrder);
router.post("/checkout", checkout);
router.get("/track/:code", getOrderByCode);

// Admin only routes
router.get("/", authenticate, authorizeAdmin, getAllOrders);
router.patch("/:id/status", authenticate, authorizeAdmin, updateOrderStatus);

export default router;
