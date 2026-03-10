import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { AuthRequest } from "../types";
import { sendSuccess, sendError } from "../utils/response";
import { catchAsync } from "../middlewares/errorHandler";

const generateToken = (id: string, role: string, email: string): string => {
  return jwt.sign({ id, role, email }, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  } as jwt.SignOptions);
};

const setTokenCookie = (res: Response, token: string): void => {
  res.cookie("token", token, {
    httpOnly: true, // tidak bisa diakses JavaScript — cegah XSS
    secure: process.env.NODE_ENV === "production", // HTTPS only di production
    sameSite: "strict", // cegah CSRF
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 hari
  });
};

export const register = catchAsync(async (req: Request, res: Response) => {
  const { name, email, password, phone } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    sendError(res, "Email sudah terdaftar.", 400);
    return;
  }

  const user = await User.create({ name, email, password, phone });
  const token = generateToken(user._id.toString(), user.role, user.email);
  setTokenCookie(res, token);

  sendSuccess(res, { user, token }, "Registrasi berhasil.", 201);
});

export const login = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.comparePassword(password))) {
    sendError(res, "Email atau password salah.", 401);
    return;
  }

  if (!user.isActive) {
    sendError(res, "Akun kamu telah dinonaktifkan.", 403);
    return;
  }

  const token = generateToken(user._id.toString(), user.role, user.email);
  setTokenCookie(res, token);

  sendSuccess(res, { user, token }, "Login berhasil.");
});

export const logout = catchAsync(async (req: Request, res: Response) => {
  res.clearCookie("token");
  sendSuccess(res, null, "Logout berhasil.");
});

export const getMe = catchAsync(async (req: AuthRequest, res: Response) => {
  const user = await User.findById(req.user?.id);
  if (!user) {
    sendError(res, "User tidak ditemukan.", 404);
    return;
  }
  sendSuccess(res, user, "Data user berhasil diambil.");
});
