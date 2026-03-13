import { useState } from "react";
import useFetch from "../hooks/useFetch";
import type { Product } from "../types";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import ErrorMessage from "../components/ui/ErrorMessage";
import Badge from "../components/ui/Badge";
import useCartStore from "../store/useCartStore";
import { Link } from "react-router-dom";

type FilterCategory = "semua" | "roti" | "camilan";

const CatalogPage = () => {
  const [activeFilter, setActiveFilter] = useState<FilterCategory>("semua");
  const addItem = useCartStore((state) => state.addItem);

  const url =
    activeFilter === "semua"
      ? "/products?available=true"
      : `/products?available=true&category=${activeFilter}`;

  const { data: products, loading, error, refetch } = useFetch<Product[]>(url);

  const filters: { label: string; value: FilterCategory }[] = [
    { label: "Semua Produk", value: "semua" },
    { label: "🍞 Roti", value: "roti" },
    { label: "🍘 Camilan", value: "camilan" },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-brand-700 mb-3">
          Katalog Produk
        </h1>
        <p className="text-gray-500 max-w-xl mx-auto">
          Semua produk dibuat fresh, menggunakan bahan pilihan tanpa pengawet
          berbahaya.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-3 justify-center mb-10 flex-wrap">
        {filters.map((filter) => (
          <button
            key={filter.value}
            onClick={() => setActiveFilter(filter.value)}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-colors border ${
              activeFilter === filter.value
                ? "bg-brand-500 text-white border-brand-500"
                : "bg-white text-gray-600 border-gray-200 hover:border-brand-300"
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* States */}
      {loading && (
        <div className="flex justify-center py-16">
          <LoadingSpinner size="lg" text="Memuat produk..." />
        </div>
      )}

      {error && (
        <ErrorMessage message="Gagal memuat produk" onRetry={refetch} />
      )}

      {/* Product Grid */}
      {!loading && !error && (
        <>
          {!products || products.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <p className="text-4xl mb-4">🛒</p>
              <p className="text-lg">Tidak ada produk di kategori ini.</p>
            </div>
          ) : (
            <>
              <p className="text-gray-400 text-sm mb-6">
                Menampilkan {products.length} produk
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {products.map((product) => (
                  <div
                    key={product._id}
                    className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all overflow-hidden border border-gray-100"
                  >
                    {/* Image */}
                    <Link to={`/catalog/${product.slug}`}>
                      <div className="h-48 bg-brand-50 flex items-center justify-center hover:bg-brand-100 transition-colors cursor-pointer overflow-hidden">
                        {product.images[0] ? (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-6xl">
                            {product.category === "roti" ? "🍞" : "🍘"}
                          </span>
                        )}
                      </div>
                    </Link>

                    <div className="p-5">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <Link
                          to={`/catalog/${product.slug}`}
                          className="font-bold text-gray-800 hover:text-brand-600 transition-colors"
                        >
                          {product.name}
                        </Link>
                        {product.isBestSeller && (
                          <Badge label="Best Seller" variant="success" />
                        )}
                      </div>

                      <p className="text-xs text-gray-400 capitalize mb-2">
                        {product.category}
                      </p>

                      <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                        {product.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-bold text-brand-600 text-lg">
                            Rp {product.price.toLocaleString("id-ID")}
                          </p>
                          <p className="text-xs text-gray-400">
                            Stok: {product.stock}
                          </p>
                        </div>
                        <button
                          onClick={() => addItem(product)}
                          disabled={!product.isAvailable || product.stock === 0}
                          className="bg-brand-500 hover:bg-brand-600 disabled:bg-gray-200 disabled:text-gray-400 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors"
                        >
                          {product.isAvailable && product.stock > 0
                            ? "+ Keranjang"
                            : "Habis"}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default CatalogPage;
