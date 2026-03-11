import { BrowserRouter, Routes, Route } from "react-router-dom";
import useFetch from "./hooks/useFetch";
import type { Product } from "./types";

const HomePage = () => (
  <div className="p-8">
    <h1>Home Page</h1>
  </div>
);

const CatalogPage = () => {
  const { data: products, loading, error } = useFetch<Product[]>("/products");

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-xl animate-pulse">Memuat katalog produk...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-500">
        <p>Gagal memuat data: {error}</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Catalog Page</h1>
      {!products || products.length === 0 ? (
        <p className="text-gray-500">Tidak ada produk yang tersedia.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product._id}
              className="border p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <h2 className="text-xl font-semibold text-blue-700">
                {product.name}
              </h2>
              <p className="text-gray-600">
                Rp {product.price.toLocaleString("id-ID")}
              </p>
              <p className="text-sm text-gray-400 mt-2">{product.category}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const ProductDetailPage = () => (
  <div className="p-8">
    <h1>Product Detail</h1>
  </div>
);
const CheckoutPage = () => (
  <div className="p-8">
    <h1>Checkout Page</h1>
  </div>
);
const TrackOrderPage = () => (
  <div className="p-8">
    <h1>Track Order Page</h1>
  </div>
);
const AboutPage = () => (
  <div className="p-8">
    <h1>About Page</h1>
  </div>
);
const NotFoundPage = () => (
  <div className="p-8">
    <h1>404 - Halaman tidak ditemukan</h1>
  </div>
);
const AdminLoginPage = () => (
  <div className="p-8">
    <h1>Admin Login</h1>
  </div>
);
const AdminDashboardPage = () => (
  <div className="p-8">
    <h1>Admin Dashboard</h1>
  </div>
);
const AdminProductsPage = () => (
  <div className="p-8">
    <h1>Admin Products</h1>
  </div>
);
const AdminOrdersPage = () => (
  <div className="p-8">
    <h1>Admin Orders</h1>
  </div>
);

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/catalog" element={<CatalogPage />} />
        <Route path="/catalog/:slug" element={<ProductDetailPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/track-order" element={<TrackOrderPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
        <Route path="/admin/products" element={<AdminProductsPage />} />
        <Route path="/admin/orders" element={<AdminOrdersPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
