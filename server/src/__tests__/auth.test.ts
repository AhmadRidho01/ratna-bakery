import request from "supertest";
import app from "../app";
import User from "../models/User";

describe("Auth Endpoints", () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  // --- REGISTER ---
  describe("POST /api/auth/register", () => {
    it("harus berhasil register user baru", async () => {
      const res = await request(app).post("/api/auth/register").send({
        name: "Test User",
        email: "test@example.com",
        password: "password123",
        phone: "081234567890",
      });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.email).toBe("test@example.com");
      expect(res.body.data.user.password).toBeUndefined();
    });

    it("harus gagal jika email sudah terdaftar", async () => {
      await User.create({
        name: "Existing User",
        email: "test@example.com",
        password: "password123",
      });

      const res = await request(app).post("/api/auth/register").send({
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  // --- LOGIN ---
  describe("POST /api/auth/login", () => {
    beforeEach(async () => {
      await User.create({
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      });
    });

    it("harus berhasil login dengan kredensial yang benar", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: "test@example.com",
        password: "password123",
      });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.email).toBe("test@example.com");
    });

    it("harus gagal login dengan password salah", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: "test@example.com",
        password: "wrongpassword",
      });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it("harus gagal login dengan email tidak terdaftar", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: "notexist@example.com",
        password: "password123",
      });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });
});
