import { Link } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import type { Product } from "../types";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import ErrorMessage from "../components/ui/ErrorMessage";
import Badge from "../components/ui/Badge";
import useCartStore from "../store/useCartStore";

const HomePage = () => {
  const {
    data: products,
    loading,
    error,
    refetch,
  } = useFetch<Product[]>("/products?bestSeller=true");
  const addItem = useCartStore((state) => state.addItem);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-brand-50 to-brand-100 py-20 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 text-center md:text-left">
            <span className="inline-block bg-brand-500 text-white text-xs px-3 py-1 rounded-full mb-4 font-medium">
              🏅 PIRT • Halal • Lulus Uji Lab
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-brand-700 leading-tight mb-4">
              Roti & Camilan <br />
              <span className="text-brand-500">Khas Desa</span>
            </h1>
            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
              Dibuat dengan resep turun-temurun sejak 2015. Cita rasa autentik,
              bahan pilihan, langsung dari dapur rumahan.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
              <Link
                to="/catalog"
                className="bg-brand-500 hover:bg-brand-600 text-white px-8 py-3 rounded-full font-medium transition-colors text-center"
              >
                Lihat Katalog
              </Link>

              <a
                href="https://wa.me/6281234567890"
                target="_blank"
                rel="noopener noreferrer"
                className="border-2 border-brand-500 text-brand-600 hover:bg-brand-50 px-8 py-3 rounded-full font-medium transition-colors text-center"
              >
                Hubungi Kami
              </a>
            </div>
          </div>

          {/* Hero Image Placeholder */}
          <div className="flex-1 flex justify-center">
            <div className="w-72 h-72 bg-brand-200 rounded-full flex items-center justify-center text-8xl shadow-lg">
              🍞
            </div>
          </div>
        </div>
      </section>

      {/* Keunggulan Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[
              {
                icon: "🏅",
                title: "Bersertifikat Resmi",
                desc: "PIRT, Halal MUI, dan lulus uji laboratorium",
              },
              {
                icon: "🍞",
                title: "Resep Autentik",
                desc: "Dibuat dengan resep turun-temurun khas desa",
              },
              {
                icon: "🚚",
                title: "Pesan Mudah",
                desc: "Order online, bayar via transfer atau QRIS",
              },
            ].map((item) => (
              <div key={item.title} className="p-6">
                <div className="text-5xl mb-4">{item.icon}</div>
                <h3 className="font-bold text-lg text-gray-800 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Best Seller Section */}
      <section className="py-16 px-4 bg-brand-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-brand-700 mb-2">
              Produk Terlaris
            </h2>
            <p className="text-gray-500">Favorit pelanggan setia kami</p>
          </div>

          {loading && (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" text="Memuat produk..." />
            </div>
          )}

          {error && (
            <ErrorMessage message="Gagal memuat produk" onRetry={refetch} />
          )}

          {!loading && !error && products && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {products.map((product) => (
                <div
                  key={product._id}
                  className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                >
                  {/* Product Image */}
                  <div className="h-48 bg-brand-100 flex items-center justify-center text-6xl">
                    {product.category === "roti" ? "🍞" : "🍘"}
                  </div>

                  <div className="p-5">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-bold text-gray-800">
                        {product.name}
                      </h3>
                      {product.isBestSeller && (
                        <Badge label="Best Seller" variant="success" />
                      )}
                    </div>
                    <p className="text-gray-500 text-sm mb-3 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-brand-600 text-lg">
                        Rp {product.price.toLocaleString("id-ID")}
                      </p>
                      <button
                        onClick={() => addItem(product)}
                        disabled={!product.isAvailable}
                        className="bg-brand-500 hover:bg-brand-600 disabled:bg-gray-300 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors"
                      >
                        {product.isAvailable ? "Pesan" : "Habis"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-10">
            <Link
              to="/catalog"
              className="inline-block border-2 border-brand-500 text-brand-600 hover:bg-brand-500 hover:text-white px-8 py-3 rounded-full font-medium transition-colors"
            >
              Lihat Semua Produk →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Hajatan Section */}
      <section className="py-16 px-4 bg-brand-700 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Musim Hajatan?</h2>
          <p className="text-brand-100 text-lg mb-8 leading-relaxed">
            Kami melayani pesanan dalam jumlah besar untuk acara hajatan,
            arisan, dan selamatan. Pre-order minimal 3 hari sebelum acara.
          </p>
          <a
            href="https://wa.me/6281234567890?text=Halo%20Ratna%20Bakery,%20saya%20ingin%20pesan%20untuk%20hajatan"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block
          bg-white text-brand-700 hover:bg-brand-50 px-8 py-3 rounded-full
          font-bold transition-colors"
          >
            📱 Hubungi via WhatsApp
          </a>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
