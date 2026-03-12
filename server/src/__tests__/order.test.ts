import request from "supertest";
import app from "../app";
import User from "../models/User";
import Product from "../models/Product";
import Order from "../models/Order";

// Helper
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

const createTestProduct = async () => {
  return await Product.create({
    name: "Roti Test",
    description: "Enak",
    price: 15000,
    category: "roti",
    stock: 50,
    weight: 200,
  });
};

describe("Order Endpoints", () => {
  beforeEach(async () => {
    await User.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});
  });

  // --- CREATE ORDER ---
  describe("POST /api/orders", () => {
    it("harus berhasil buat pesanan baru", async () => {
      const product = await createTestProduct();

      const res = await request(app)
        .post("/api/orders")
        .send({
          customer: {
            name: "Budi Santoso",
            phone: "081234567890",
            email: "budi@example.com",
            address: "Jl. Merdeka No. 1",
            city: "Bandung",
            postalCode: "40111",
          },
          items: [{ productId: product._id, quantity: 2 }],
          shippingCost: 10000,
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.orderCode).toBeDefined();
      expect(res.body.data.grandTotal).toBe(40000); // (15000 * 2) + 10000
    });

    it("harus gagal jika produk tidak ditemukan", async () => {
      const res = await request(app)
        .post("/api/orders")
        .send({
          customer: {
            name: "Budi",
            phone: "081234567890",
            email: "budi@example.com",
            address: "Jl. Test",
            city: "Jakarta",
            postalCode: "10110",
          },
          items: [{ productId: "000000000000000000000000", quantity: 1 }],
        });

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  // --- TRACK ORDER ---
  describe("GET /api/orders/track/:code", () => {
    it("harus mengembalikan pesanan by orderCode", async () => {
      const product = await createTestProduct();
      const order = await Order.create({
        customer: {
          name: "Siti",
          phone: "081234567890",
          email: "siti@example.com",
          address: "Jl. Melati",
          city: "Surabaya",
          postalCode: "60111",
        },
        items: [
          {
            productId: product._id,
            name: product.name,
            price: product.price,
            quantity: 1,
            subtotal: product.price,
          },
        ],
        totalAmount: product.price,
        shippingCost: 0,
        grandTotal: product.price,
      });

      const res = await request(app).get(
        `/api/orders/track/${order.orderCode}`,
      );

      expect(res.status).toBe(200);
      expect(res.body.data.orderCode).toBe(order.orderCode);
    });

    it("harus return 404 jika orderCode tidak ditemukan", async () => {
      const res = await request(app).get("/api/orders/track/RB-99999999-XXXX");

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  // --- ADMIN GET ALL ORDERS ---
  describe("GET /api/orders", () => {
    it("harus berhasil ambil semua pesanan jika admin", async () => {
      const cookies = await loginAsAdmin();

      const res = await request(app).get("/api/orders").set("Cookie", cookies);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it("harus gagal jika bukan admin", async () => {
      const res = await request(app).get("/api/orders");

      expect(res.status).toBe(401);
    });
  });

  // --- UPDATE ORDER STATUS ---
  describe("PATCH /api/orders/:id/status", () => {
    it("harus berhasil update status pesanan jika admin", async () => {
      const cookies = await loginAsAdmin();
      const product = await createTestProduct();
      const order = await Order.create({
        customer: {
          name: "Anton",
          phone: "081234567890",
          email: "anton@example.com",
          address: "Jl. Kenanga",
          city: "Medan",
          postalCode: "20111",
        },
        items: [
          {
            productId: product._id,
            name: product.name,
            price: product.price,
            quantity: 1,
            subtotal: product.price,
          },
        ],
        totalAmount: product.price,
        shippingCost: 0,
        grandTotal: product.price,
      });

      const res = await request(app)
        .patch(`/api/orders/${order._id}/status`)
        .set("Cookie", cookies)
        .send({ status: "confirmed" });

      expect(res.status).toBe(200);
      expect(res.body.data.status).toBe("confirmed");
    });
  });
});
