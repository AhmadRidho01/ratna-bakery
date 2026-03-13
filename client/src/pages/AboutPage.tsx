import { Link } from "react-router-dom";

const AboutPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Hero */}
      <div className="text-center mb-16">
        <p className="text-6xl mb-4">🍞</p>
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Ratna Bakery</h1>
        <p className="text-xl text-gray-500">
          Menghadirkan cita rasa rumahan sejak 2015
        </p>
      </div>

      {/* Cerita */}
      <div className="bg-brand-50 rounded-2xl p-8 mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Cerita Kami</h2>
        <p className="text-gray-600 leading-relaxed mb-4">
          Ratna Bakery lahir dari dapur rumahan di Desa Sukamaju, Jawa Barat.
          Berawal dari kegemaran Bu Ratna membuat roti untuk keluarga, kini kami
          telah melayani ribuan pelanggan setia dari berbagai penjuru.
        </p>
        <p className="text-gray-600 leading-relaxed">
          Dengan resep turun-temurun dan bahan-bahan pilihan, setiap gigitan
          membawa kehangatan seperti masakan rumah sendiri.
        </p>
      </div>

      {/* Produk Unggulan */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Produk Unggulan
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              emoji: "🍞",
              name: "Roti Bagelen",
              desc: "Renyah, gurih, cocok untuk camilan atau oleh-oleh",
            },
            {
              emoji: "🥐",
              name: "Roti Gulung",
              desc: "Best seller kami — lembut dengan isian pilihan",
            },
            {
              emoji: "🍘",
              name: "Kemplang Daun",
              desc: "Kerupuk tradisional khas Jawa Barat yang autentik",
            },
          ].map((item) => (
            <div
              key={item.name}
              className="bg-white border border-gray-100 rounded-xl p-6 text-center shadow-sm"
            >
              <p className="text-4xl mb-3">{item.emoji}</p>
              <h3 className="font-bold text-gray-800 mb-2">{item.name}</h3>
              <p className="text-sm text-gray-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Sertifikasi */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Terjamin Kualitasnya
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              emoji: "📋",
              label: "PIRT",
              desc: "Izin Produksi Industri Rumah Tangga resmi",
            },
            {
              emoji: "☪️",
              label: "Halal MUI",
              desc: "Bersertifikat halal dari Majelis Ulama Indonesia",
            },
            {
              emoji: "🔬",
              label: "Uji Lab",
              desc: "Lulus uji laboratorium standar keamanan pangan",
            },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-start gap-4 bg-white border border-gray-100 rounded-xl p-5 shadow-sm"
            >
              <span className="text-3xl">{item.emoji}</span>
              <div>
                <p className="font-bold text-gray-800">{item.label}</p>
                <p className="text-sm text-gray-500 mt-1">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Kontak */}
      <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Hubungi Kami</h2>
        <div className="space-y-4">
          {[
            { emoji: "📱", label: "WhatsApp", value: "0812-3456-7890" },
            {
              emoji: "📍",
              label: "Alamat",
              value: "Desa Sukamaju, Jawa Barat",
            },
            {
              emoji: "🕐",
              label: "Jam Operasional",
              value: "Senin–Sabtu, 07.00–17.00 WIB",
            },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-4">
              <span className="text-2xl w-8">{item.emoji}</span>
              <div>
                <p className="text-sm text-gray-400">{item.label}</p>
                <p className="font-medium text-gray-700">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="text-center">
        <Link
          to="/catalog"
          className="bg-brand-500 hover:bg-brand-600 text-white font-semibold px-8 py-3 rounded-xl transition-colors inline-block"
        >
          Lihat Katalog Produk
        </Link>
      </div>
    </div>
  );
};

export default AboutPage;
