import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import User from "../models/User";

const seedAdmin = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log("✅ MongoDB Connected");

    // Cek apakah email sudah ada, kalau ada update rolenya
    const existingUser = await User.findOne({ email: "admin@ratnabakery.com" });

    if (existingUser) {
      existingUser.role = "admin";
      await existingUser.save();
      console.log("✅ Role berhasil diupdate menjadi admin");
      console.log("📧 Email   : admin@ratnabakery.com");
      console.log("🔑 Password: admin123");
    } else {
      await User.create({
        name: "Admin Ratna Bakery",
        email: "admin@ratnabakery.com",
        password: "admin123",
        role: "admin",
        phone: "081234567890",
      });
      console.log("✅ Akun admin baru berhasil dibuat");
      console.log("📧 Email   : admin@ratnabakery.com");
      console.log("🔑 Password: admin123");
    }
  } catch (error) {
    console.error("❌ Seeder gagal:", error);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

seedAdmin();
