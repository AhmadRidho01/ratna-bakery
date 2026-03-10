// Entry point seluruh aplikasi backend, "Connect ke database lalu nyalakan server":

// --- --- ---

import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import connectDB from "./config/database";

const PORT = process.env.PORT || 5000;

const startServer = async (): Promise<void> => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📍 Environment: ${process.env.NODE_ENV || "development"}`);
    console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  });
};

startServer();
