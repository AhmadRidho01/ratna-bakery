import { useParams, Link } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import type { Product } from "../types";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import ErrorMessage from "../components/ui/ErrorMessage";
import Badge from "../components/ui/Badge";
import useCartStore from "../store/useCartStore";
import { useState } from "react";

const ProductDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((state) => state.addItem);

  const {
    data: product,
    loading,
    error,
    refetch,
  } = useFetch<Product>(`/products/${slug}`);

  const handleAddToCart = () => {
    if (!product) return;
    addItem(product, quantity);
    alert(`${quantity}x ${product.name} ditambahkan ke keranjang!`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <LoadingSpinner size="lg" text="Memuat produk..." />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        <ErrorMessage message="Produk tidak ditemukan." onRetry={refetch} />
        <div className="text-center mt-4">
          <Link
            to="/catalog"
            className="text-brand-500 hover:underline text-sm"
          >
            ← Kembali ke Katalog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-8">
        <Link to="/" className="hover:text-brand-500 transition-colors">
          Beranda
        </Link>
        <span>/</span>
        <Link to="/catalog" className="hover:text-brand-500 transition-colors">
          Katalog
        </Link>
        <span>/</span>
        <span className="text-gray-600">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Product Image */}
        <div className="bg-brand-50 rounded-2xl flex items-center justify-center h-96 text-9xl">
          {product.category === "roti" ? "🍞" : "🍘"}
        </div>

        {/* Product Info */}
        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-xs text-gray-400 capitalize bg-gray-100 px-3 py-1 rounded-full">
              {product.category}
            </span>
            {product.isBestSeller && (
              <Badge label="Best Seller" variant="success" />
            )}
            {!product.isAvailable && (
              <Badge label="Tidak Tersedia" variant="danger" />
            )}
          </div>

          <h1 className="text-3xl font-bold text-gray-800 mb-3">
            {product.name}
          </h1>

          <p className="text-3xl font-bold text-brand-600 mb-4">
            Rp {product.price.toLocaleString("id-ID")}
          </p>

          <p className="text-gray-500 leading-relaxed mb-6">
            {product.description}
          </p>

          {/* Product Meta */}
          <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-xl text-sm">
            <div>
              <p className="text-gray-400">Berat</p>
              <p className="font-medium text-gray-700">{product.weight} gram</p>
            </div>
            <div>
              <p className="text-gray-400">Stok</p>
              <p className="font-medium text-gray-700">
                {product.stock} tersedia
              </p>
            </div>
          </div>

          {/* Quantity & Add to Cart */}
          {product.isAvailable && product.stock > 0 ? (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <p className="text-sm text-gray-600 font-medium">Jumlah:</p>
                <div className="flex items-center gap-3 border border-gray-200 rounded-full px-4 py-2">
                  <button
                    onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                    className="text-brand-500 font-bold text-lg w-6 h-6 flex items-center justify-center"
                  >
                    −
                  </button>
                  <span className="font-bold text-gray-800 w-8 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() =>
                      setQuantity((prev) => Math.min(product.stock, prev + 1))
                    }
                    className="text-brand-500 font-bold text-lg w-6 h-6 flex items-center justify-center"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-brand-500 hover:bg-brand-600 text-white py-3 rounded-full font-medium transition-colors"
                >
                  + Tambah ke Keranjang
                </button>
                <Link
                  to="/checkout"
                  onClick={handleAddToCart}
                  className="flex-1 border-2 border-brand-500 text-brand-600 hover:bg-brand-50 py-3 rounded-full font-medium transition-colors text-center"
                >
                  Beli Sekarang
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
              <p className="text-red-500 font-medium">
                Produk sedang tidak tersedia
              </p>
              <p className="text-red-400 text-sm mt-1">
                Hubungi kami untuk informasi ketersediaan
              </p>
            </div>
          )}

          {/* WhatsApp CTA */}
          <a
            href={`https://wa.me/6281234567890?text=Halo%20Ratna%20Bakery,%20saya%20ingin%20tanya%20tentang%20${encodeURIComponent(product.name)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 flex items-center justify-center gap-2 text-green-600 hover:text-green-700 text-sm font-medium transition-colors"
          >
            📱 Tanya via WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
