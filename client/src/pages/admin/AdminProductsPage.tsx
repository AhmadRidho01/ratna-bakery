import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import useFetch from "../../hooks/useFetch";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import Badge from "../../components/ui/Badge";
import type { Product } from "../../types";

interface ProductFormProps {
  product: Product | null;
  onClose: () => void;
  onSuccess: () => void;
}

const ProductForm = ({ product, onClose, onSuccess }: ProductFormProps) => {
  const [name, setName] = useState(product?.name ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [price, setPrice] = useState(product?.price?.toString() ?? "");
  const [category, setCategory] = useState<"roti" | "camilan">(
    product?.category ?? "roti",
  );
  const [stock, setStock] = useState(product?.stock?.toString() ?? "");
  const [weight, setWeight] = useState(product?.weight?.toString() ?? "");
  const [isAvailable, setIsAvailable] = useState(product?.isAvailable ?? true);
  const [isBestSeller, setIsBestSeller] = useState(
    product?.isBestSeller ?? false,
  );
  const [imageUrl, setImageUrl] = useState(product?.images[0] ?? "");
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      const res = await api.post<{ data: { url: string } }>(
        "/products/upload-image",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );
      setImageUrl(res.data.data.url);
    } catch {
      setError("Gagal upload gambar. Coba lagi.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (!name || !price || !stock || !weight) {
      setError("Nama, harga, stok, dan berat wajib diisi.");
      return;
    }
    setError("");
    setIsSubmitting(true);

    const payload = {
      name,
      description,
      price: Number(price),
      category,
      stock: Number(stock),
      weight: Number(weight),
      isAvailable,
      isBestSeller,
      images: imageUrl ? [imageUrl] : [],
    };

    try {
      if (product) {
        await api.put(`/products/${product._id}`, payload);
      } else {
        await api.post("/products", payload);
      }
      onSuccess();
    } catch {
      setError("Gagal menyimpan produk. Coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-800">
            {product ? "Edit Produk" : "Tambah Produk"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl"
          >
            ✕
          </button>
        </div>

        {/* Form Body */}
        <div className="px-6 py-5 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
              {error}
            </div>
          )}

          {/* Upload Gambar */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Foto Produk
            </label>
            <div
              onClick={() => fileRef.current?.click()}
              className="w-full h-36 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center cursor-pointer hover:border-brand-500 transition-colors overflow-hidden"
            >
              {isUploading ? (
                <LoadingSpinner size="md" />
              ) : imageUrl ? (
                <img
                  src={imageUrl}
                  alt="preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center text-gray-400">
                  <p className="text-3xl mb-1">📷</p>
                  <p className="text-xs">Klik untuk upload gambar</p>
                </div>
              )}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>

          {/* Nama */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Nama Produk *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="Roti Gulung Spesial"
            />
          </div>

          {/* Deskripsi */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Deskripsi
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
              placeholder="Deskripsi produk..."
            />
          </div>

          {/* Harga & Stok */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Harga (Rp) *
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                placeholder="25000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Stok *
              </label>
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                placeholder="100"
              />
            </div>
          </div>

          {/* Berat & Kategori */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Berat (gram) *
              </label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                placeholder="250"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Kategori
              </label>
              <select
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value as "roti" | "camilan")
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="roti">Roti</option>
                <option value="camilan">Camilan</option>
              </select>
            </div>
          </div>

          {/* Toggle */}
          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isAvailable}
                onChange={(e) => setIsAvailable(e.target.checked)}
                className="w-4 h-4 accent-brand-500"
              />
              <span className="text-sm text-gray-700">Tersedia</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isBestSeller}
                onChange={(e) => setIsBestSeller(e.target.checked)}
                className="w-4 h-4 accent-brand-500"
              />
              <span className="text-sm text-gray-700">Best Seller</span>
            </label>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || isUploading}
            className="flex-1 bg-brand-500 hover:bg-brand-600 disabled:bg-gray-300 text-white py-2.5 rounded-lg text-sm font-semibold transition-colors"
          >
            {isSubmitting
              ? "Menyimpan..."
              : product
                ? "Simpan Perubahan"
                : "Tambah Produk"}
          </button>
        </div>
      </div>
    </div>
  );
};

// --- --- ---

const AdminProductsPage = () => {
  const {
    data: products,
    loading,
    error,
    refetch,
  } = useFetch<Product[]>("/products");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const handleDelete = async (product: Product) => {
    if (!confirm(`Hapus produk "${product.name}"?`)) return;
    setDeletingId(product._id);
    try {
      await api.delete(`/products/${product._id}`);
      refetch();
    } catch {
      alert("Gagal menghapus produk.");
    } finally {
      setDeletingId(null);
    }
  };

  const formatRupiah = (amount: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Gagal memuat produk.
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/dashboard"
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            ← Dashboard
          </Link>
          <span className="text-gray-300">|</span>
          <h1 className="font-bold text-gray-800">Kelola Produk</h1>
        </div>
        <button
          onClick={() => {
            setEditingProduct(null);
            setShowForm(true);
          }}
          className="bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          + Tambah Produk
        </button>
      </header>

      <main className="p-6 max-w-6xl mx-auto">
        {/* Form Modal */}
        {showForm && (
          <ProductForm
            product={editingProduct}
            onClose={() => setShowForm(false)}
            onSuccess={() => {
              setShowForm(false);
              refetch();
            }}
          />
        )}

        {/* Product List */}
        {!products || products.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-4xl mb-3">🥖</p>
            <p>Belum ada produk. Tambah produk pertama kamu!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
              >
                {/* Gambar */}
                <div className="h-40 bg-gray-100 overflow-hidden">
                  {product.images[0] ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl">
                      🥖
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-semibold text-gray-800 text-sm leading-tight">
                      {product.name}
                    </h3>
                    <div className="flex gap-1 flex-shrink-0">
                      <Badge
                        variant={product.isAvailable ? "success" : "danger"}
                        label={product.isAvailable ? "Aktif" : "Nonaktif"}
                      />
                      {product.isBestSeller && (
                        <Badge variant="warning" label="Best" />
                      )}
                    </div>
                  </div>
                  <p className="text-brand-500 font-bold text-sm mb-3">
                    {formatRupiah(product.price)}
                  </p>
                  <p className="text-xs text-gray-400 mb-3">
                    Stok: {product.stock} · {product.category}
                  </p>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingProduct(product);
                        setShowForm(true);
                      }}
                      className="flex-1 text-xs border border-gray-300 hover:border-brand-500 hover:text-brand-500 py-1.5 rounded-lg transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product)}
                      disabled={deletingId === product._id}
                      className="flex-1 text-xs border border-red-200 text-red-500 hover:bg-red-50 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                    >
                      {deletingId === product._id ? "..." : "Hapus"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminProductsPage;
