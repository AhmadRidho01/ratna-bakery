import request from "supertest";
import app from "../app";
import User from "../models/User";
import Product from "../models/Product";

// Helper — login sebagai admin dan ambil cookie
const loginAsAdmin = async () => {
  await User.create({
    name: "Admin Test",
    email: "admin@test.com",
    password: "password123",
    role: "admin",
  });

  const res = await request(app).post("/api/auth/login").send({
    email: "admin@test.com",
    password: "password123",
  });

  return res.headers["set-cookie"] as unknown as string[];
};

describe("Product Endpoints", () => {
  beforeEach(async () => {
    await User.deleteMany({});
    await Product.deleteMany({});
  });

  // --- GET ALL PRODUCTS ---
  describe("GET /api/products", () => {
    it("harus mengembalikan array produk", async () => {
      await Product.create({
        name: "Roti Gulung Test",
        description: "Enak",
        price: 15000,
        category: "roti",
        stock: 50,
        weight: 200,
      });

      const res = await request(app).get("/api/products");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBe(1);
    });

    it("harus bisa filter by kategori", async () => {
      await Product.create([
        {
          name: "Roti A",
          description: "Deskripsi roti",
          price: 10000,
          category: "roti",
          stock: 10,
          weight: 100,
        },
        {
          name: "Camilan B",
          description: "Deskripsi camilan",
          price: 8000,
          category: "camilan",
          stock: 10,
          weight: 100,
        },
      ]);

      const res = await request(app).get("/api/products?category=roti");

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].category).toBe("roti");
    });
  });

  // --- GET PRODUCT BY SLUG ---
  describe("GET /api/products/:slug", () => {
    it("harus mengembalikan produk yang benar", async () => {
      const product = await Product.create({
        name: "Roti Bagelen",
        description: "Roti bagelen renyah",
        price: 20000,
        category: "roti",
        stock: 30,
        weight: 150,
      });

      const res = await request(app).get(`/api/products/${product.slug}`);

      expect(res.status).toBe(200);
      expect(res.body.data.name).toBe("Roti Bagelen");
    });

    it("harus return 404 jika produk tidak ditemukan", async () => {
      const res = await request(app).get("/api/products/produk-tidak-ada");

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  // --- CREATE PRODUCT ---
  describe("POST /api/products", () => {
    it("harus berhasil tambah produk jika admin", async () => {
      const cookies = await loginAsAdmin();

      const res = await request(app)
        .post("/api/products")
        .set("Cookie", cookies)
        .send({
          name: "Kemplang Daun",
          description: "Renyah dan gurih",
          price: 12000,
          category: "camilan",
          stock: 100,
          weight: 100,
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe("Kemplang Daun");
    });

    it("harus gagal jika bukan admin", async () => {
      const res = await request(app).post("/api/products").send({
        name: "Produk Tanpa Auth",
        price: 10000,
        category: "roti",
        stock: 10,
        weight: 100,
      });

      expect(res.status).toBe(401);
    });
  });

  // --- DELETE PRODUCT ---
  describe("DELETE /api/products/:id", () => {
    it("harus berhasil hapus produk jika admin", async () => {
      const cookies = await loginAsAdmin();
      const product = await Product.create({
        name: "Produk Hapus",
        description: "Produk untuk dihapus",
        price: 10000,
        category: "roti",
        stock: 10,
        weight: 100,
      });

      const res = await request(app)
        .delete(`/api/products/${product._id}`)
        .set("Cookie", cookies);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      const deleted = await Product.findById(product._id);
      expect(deleted).toBeNull();
    });
  });
});
