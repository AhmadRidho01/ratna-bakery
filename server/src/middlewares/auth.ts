import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthRequest } from "../types";
import { sendError } from "../utils/response";

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): void => {
  try {
    // Ambil token dari cookie (lebih aman) atau Authorization header
    const token =
      req.cookies?.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      sendError(res, "Akses ditolak. Silakan login terlebih dahulu.", 401);
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
      role: "admin" | "customer";
      email: string;
    };

    req.user = decoded;
    next();
  } catch (error) {
    sendError(res, "Token tidak valid atau sudah expired.", 401);
  }
};

export const authorizeAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): void => {
  if (req.user?.role !== "admin") {
    sendError(res, "Akses ditolak. Hanya admin yang diizinkan.", 403);
    return;
  }
  next();
};
