// Helper untuk response yang konsisten:

import { Response } from "express";
import { ApiResponse } from "../types";

export const sendSuccess = <T>(
  res: Response,
  data: T,
  message: string = "Berhasil",
  statusCode: number = 200,
): void => {
  const response: ApiResponse<T> = {
    success: true,
    message,
    data,
  };
  res.status(statusCode).json(response);
};

export const sendError = (
  res: Response,
  message: string = "Terjadi kesalahan",
  statusCode: number = 500,
  error?: string,
): void => {
  const response: ApiResponse = {
    success: false,
    message,
    error: process.env.NODE_ENV === "development" ? error : undefined,
  };
  res.status(statusCode).json(response);
};
