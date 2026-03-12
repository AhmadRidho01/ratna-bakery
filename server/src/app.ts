// Konfigurasi Express lengkap:

// --- --- ---

import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoSanitize from "express-mongo-sanitize";
import rateLimit from "express-rate-limit";
import { errorHandler } from "./middlewares/errorHandler";
import authRoutes from "./routes/authRoutes";
import productRoutes from "./routes/productRoutes";
import orderRoutes from "./routes/orderRoutes";

const app = express();
app.set("trust proxy", 1);

// --- ---

// Security Middlewares
app.use(helmet());
app.use(mongoSanitize()); // cegah MongoDB injection

// Rate limiting
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Terlalu banyak request, coba lagi dalam 15 menit.",
  },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: {
    success: false,
    message: "Terlalu banyak percobaan, coba lagi dalam 15 menit.",
  },
});

// --- ---

// General Middlewares
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  }),
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// --- ---

// Routes
app.use("/api", generalLimiter);
app.use("/api/auth", authLimiter);

// Health check — untuk monitoring nanti
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

// 404 handler
app.use((req, res) => {
  res
    .status(404)
    .json({ success: false, message: "Endpoint tidak ditemukan." });
});

// --- ---

// Error Handling
app.use(errorHandler);

export default app;
