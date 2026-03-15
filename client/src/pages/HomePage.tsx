import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import type { Product } from "../types";
import LoadingSpinner from "../components/ui/LoadingSpinner";

// ─── Hero Slider Data ────────────────────────────────────────────────────────
const slides = [
  {
    id: 1,
    subtitle: "Bersertifikat PIRT & Halal MUI",
    title: "Roti Gulung\nFavorit Semua Orang",
    desc: "Dibuat setiap hari dengan bahan pilihan, dikirim langsung ke tangan Anda.",
    ctaPrimary: { label: "Lihat Katalog", to: "/catalog" },
    ctaSecondary: { label: "Hubungi Kami", to: "/about" },
    bg: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1600&auto=format&fit=crop&q=80",
    overlay: "from-black/70 via-black/40 to-transparent",
  },
  {
    id: 2,
    subtitle: "Best Seller Ratna Bakery",
    title: "Roti Bagelen\nRenyah Tiap Gigitan",
    desc: "Camilan legendaris yang sudah menemani keluarga Indonesia sejak 2015.",
    ctaPrimary: { label: "Pesan Sekarang", to: "/catalog" },
    ctaSecondary: { label: "Tentang Kami", to: "/about" },
    bg: "https://images.unsplash.com/photo-1598373182133-52452f7691ef?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    overlay: "from-black/65 via-black/35 to-transparent",
  },
  {
    id: 3,
    subtitle: "Spesial untuk Hajatan & Event",
    title: "Pre-Order Untuk\nAcara Spesial Anda",
    desc: "Tersedia dalam jumlah besar untuk pernikahan, syukuran, dan berbagai hajatan.",
    ctaPrimary: { label: "Pre-Order Sekarang", to: "/checkout" },
    ctaSecondary: { label: "Info Lebih Lanjut", to: "/about" },
    bg: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=1600&auto=format&fit=crop&q=80",
    overlay: "from-black/70 via-black/40 to-transparent",
  },
];

// ─── Feature List Data ───────────────────────────────────────────────────────
const features = [
  {
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
        />
      </svg>
    ),
    title: "Pengiriman ke Rumah",
    desc: "Tersedia pengiriman ke seluruh wilayah Jawa Barat",
  },
  {
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8.625 9.75a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 0 1 .778-.332 48.294 48.294 0 0 0 5.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
        />
      </svg>
    ),
    title: "Konsultasi via WhatsApp",
    desc: "Tanya langsung ke kami di WA 0812-3456-7890",
  },
  {
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
        />
      </svg>
    ),
    title: "Terjamin Halal & PIRT",
    desc: "Bersertifikat Halal MUI dan lulus uji laboratorium resmi",
  },
];

// ─── Testimonial Data ────────────────────────────────────────────────────────
const testimonials = [
  {
    name: "Ibu Sari Dewi",
    role: "Pelanggan Setia",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&auto=format&fit=crop&q=80",
    text: "Roti gulungnya enak banget, anak-anak saya suka sekali! Sudah langganan lebih dari 2 tahun dan kualitasnya selalu konsisten.",
  },
  {
    name: "Pak Hendro",
    role: "Pemilik Toko Oleh-oleh",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&auto=format&fit=crop&q=80",
    text: "Saya kulak bagelen Ratna Bakery untuk dijual di toko. Pelanggan saya selalu minta ini terus, stok sering habis duluan!",
  },
  {
    name: "Ibu Ratih",
    role: "Ibu Rumah Tangga",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&auto=format&fit=crop&q=80",
    text: "Pesan untuk hajatan sunatan anak. Pelayanannya ramah, produknya dikemas rapi, tamu-tamu sangat suka dengan kemplang daunnya.",
  },
];

// ─── Countdown Hook ──────────────────────────────────────────────────────────
function useCountdown(targetDate: Date) {
  const calc = () => {
    const diff = targetDate.getTime() - Date.now();
    if (diff <= 0) return { days: 0, hours: 0, mins: 0, secs: 0 };
    return {
      days: Math.floor(diff / 86400000),
      hours: Math.floor((diff % 86400000) / 3600000),
      mins: Math.floor((diff % 3600000) / 60000),
      secs: Math.floor((diff % 60000) / 1000),
    };
  };
  const [time, setTime] = useState(calc);
  useEffect(() => {
    const id = setInterval(() => setTime(calc), 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

// ─── Component ───────────────────────────────────────────────────────────────
export function HomePage() {
  // Hero slider state
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const goTo = (idx: number) => {
    if (animating || idx === current) return;
    setAnimating(true);
    setTimeout(() => {
      setCurrent(idx);
      setAnimating(false);
    }, 400);
  };

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      goTo((current + 1) % slides.length);
    }, 5500);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [current]);

  // Best seller products
  const { data: products, loading } = useFetch<Product[]>(
    "/products?bestSeller=true&available=true",
  );

  // Testimonial state
  const [tIdx, setTIdx] = useState(0);

  // Countdown — target: 30 hari dari sekarang (dalam implementasi nyata bisa dari DB)
  const target = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  const countdown = useCountdown(target);

  const slide = slides[current];

  return (
    <div className="overflow-x-hidden">
      {/* ── 1. HERO SLIDER ─────────────────────────────────────────────────── */}
      <section className="relative h-[85vh] min-h-[560px] overflow-hidden">
        {/* Background images */}
        {slides.map((s, i) => (
          <div
            key={s.id}
            className={`absolute inset-0 bg-center bg-cover transition-opacity duration-700 ${
              i === current ? "opacity-100" : "opacity-0"
            }`}
            style={{ backgroundImage: `url(${s.bg})` }}
          />
        ))}

        {/* Overlay gradient */}
        <div
          className={`absolute inset-0 bg-gradient-to-r ${slide.overlay} transition-all duration-700`}
        />

        {/* Content */}
        <div className="relative h-full flex items-center">
          <div className="container mx-auto px-6 lg:px-16">
            <div
              key={current}
              className={`max-w-2xl transition-all duration-500 ${
                animating
                  ? "opacity-0 translate-y-4"
                  : "opacity-100 translate-y-0"
              }`}
            >
              <p className="inline-block text-brand-500 bg-white/10 backdrop-blur-sm border border-brand-500/40 text-sm font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full mb-5">
                {slide.subtitle}
              </p>
              <h1 className="text-white text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-5 whitespace-pre-line drop-shadow-lg">
                {slide.title}
              </h1>
              <p className="text-white/80 text-lg mb-8 max-w-lg leading-relaxed">
                {slide.desc}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to={slide.ctaPrimary.to}
                  className="bg-brand-500 hover:bg-brand-600 text-white font-semibold px-7 py-3.5 rounded-lg transition-all duration-200 shadow-lg hover:shadow-brand-500/30 hover:-translate-y-0.5"
                >
                  {slide.ctaPrimary.label}
                </Link>
                <Link
                  to={slide.ctaSecondary.to}
                  className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-semibold px-7 py-3.5 rounded-lg border border-white/30 transition-all duration-200 hover:-translate-y-0.5"
                >
                  {slide.ctaSecondary.label}
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Dot navigation */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2.5">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`transition-all duration-300 rounded-full ${
                i === current
                  ? "w-8 h-2.5 bg-brand-500"
                  : "w-2.5 h-2.5 bg-white/50 hover:bg-white/80"
              }`}
            />
          ))}
        </div>

        {/* Arrow navigation */}
        <button
          onClick={() => goTo((current - 1 + slides.length) % slides.length)}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/10 hover:bg-white/25 backdrop-blur-sm text-white rounded-full flex items-center justify-center transition-all border border-white/20"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5 8.25 12l7.5-7.5"
            />
          </svg>
        </button>
        <button
          onClick={() => goTo((current + 1) % slides.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/10 hover:bg-white/25 backdrop-blur-sm text-white rounded-full flex items-center justify-center transition-all border border-white/20"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m8.25 4.5 7.5 7.5-7.5 7.5"
            />
          </svg>
        </button>
      </section>

      {/* ── 2. FEATURE LIST ────────────────────────────────────────────────── */}
      <section className="bg-white py-10 shadow-sm">
        <div className="container mx-auto px-6 lg:px-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div
                key={i}
                className="flex items-center gap-4 p-5 rounded-xl border border-brand-100 bg-brand-50 hover:border-brand-300 hover:shadow-md transition-all duration-200 group"
              >
                <div className="flex-shrink-0 w-14 h-14 bg-brand-500 text-white rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-200">
                  {f.icon}
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 text-base">
                    {f.title}
                  </h3>
                  <p className="text-gray-500 text-sm mt-0.5 leading-snug">
                    {f.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. BEST SELLER ─────────────────────────────────────────────────── */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6 lg:px-16">
          <div className="text-center mb-12">
            <p className="text-brand-500 font-semibold text-sm tracking-widest uppercase mb-2">
              Pilihan Terbaik
            </p>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-800">
              Produk <span className="text-brand-500">Best Seller</span>
            </h2>
            <p className="text-gray-500 mt-3 max-w-lg mx-auto">
              Produk-produk favorit yang paling banyak dipesan oleh pelanggan
              setia kami.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
              {(products ?? []).slice(0, 3).map((p) => (
                <Link
                  key={p._id}
                  to={`/catalog/${p.slug}`}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="relative h-52 bg-brand-50 overflow-hidden">
                    {p.images[0] ? (
                      <img
                        src={p.images[0]}
                        alt={p.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-6xl">
                        {p.category === "roti" ? "🍞" : "🍘"}
                      </div>
                    )}
                    <span className="absolute top-3 right-3 bg-brand-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                      Best Seller
                    </span>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-gray-800 text-lg group-hover:text-brand-600 transition-colors">
                      {p.name}
                    </h3>
                    <p className="text-gray-400 text-sm mt-1 line-clamp-2">
                      {p.description}
                    </p>
                    <div className="flex items-center justify-between mt-4">
                      <span className="text-brand-600 font-bold text-xl">
                        Rp {p.price.toLocaleString("id-ID")}
                      </span>
                      <span className="text-brand-500 text-sm font-semibold group-hover:underline">
                        Lihat Detail →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="text-center mt-10">
            <Link
              to="/catalog"
              className="inline-block border-2 border-brand-500 text-brand-600 hover:bg-brand-500 hover:text-white font-semibold px-8 py-3 rounded-lg transition-all duration-200"
            >
              Lihat Semua Produk
            </Link>
          </div>
        </div>
      </section>

      {/* ── 4. PROMO HAJATAN (Deal of the Month) ───────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            {/* Image side */}
            <div className="relative rounded-2xl overflow-hidden shadow-xl h-80 lg:h-auto">
              <img
                src="https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=800&auto=format&fit=crop&q=80"
                alt="Promo Hajatan"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              {/* Badge */}
              <div className="absolute top-5 left-5 bg-brand-500 text-white rounded-xl px-4 py-2 shadow-lg">
                <p className="text-xs font-medium opacity-80">Spesial</p>
                <p className="text-2xl font-black leading-none">Pre-Order</p>
                <p className="text-xs font-medium opacity-80 mt-0.5">Hajatan</p>
              </div>
            </div>

            {/* Content side */}
            <div>
              <p className="text-brand-500 font-semibold text-sm tracking-widest uppercase mb-3">
                Musim Hajatan
              </p>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 leading-tight mb-4">
                Pesan Lebih Awal,
                <br />
                <span className="text-brand-500">Harga Lebih Hemat</span>
              </h2>
              <p className="text-gray-500 leading-relaxed mb-6">
                Kami melayani pesanan dalam jumlah besar untuk berbagai acara —
                pernikahan, sunatan, syukuran, dan hajatan lainnya. Pre-order
                minimal 3 hari sebelum acara. Kemasan eksklusif tersedia.
              </p>

              {/* Countdown */}
              <div className="mb-7">
                <p className="text-sm text-gray-400 mb-3 font-medium">
                  Penawaran berakhir dalam:
                </p>
                <div className="flex gap-3">
                  {[
                    { val: countdown.days, label: "Hari" },
                    { val: countdown.hours, label: "Jam" },
                    { val: countdown.mins, label: "Menit" },
                    { val: countdown.secs, label: "Detik" },
                  ].map((t) => (
                    <div
                      key={t.label}
                      className="bg-brand-50 border border-brand-100 rounded-xl w-16 h-16 flex flex-col items-center justify-center shadow-sm"
                    >
                      <span className="text-brand-700 font-black text-xl leading-none">
                        {String(t.val).padStart(2, "0")}
                      </span>
                      <span className="text-brand-400 text-xs mt-0.5">
                        {t.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  to="/checkout"
                  className="bg-brand-500 hover:bg-brand-600 text-white font-semibold px-7 py-3.5 rounded-lg transition-all duration-200 shadow-md hover:shadow-brand-500/30 hover:-translate-y-0.5"
                >
                  Pre-Order Sekarang
                </Link>
                <a
                  href="https://wa.me/6281234567890"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 border-2 border-green-500 text-green-600 hover:bg-green-50 font-semibold px-6 py-3.5 rounded-lg transition-all duration-200"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                  </svg>
                  Tanya via WA
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. TESTIMONIAL ─────────────────────────────────────────────────── */}
      <section className="py-20 bg-brand-50">
        <div className="container mx-auto px-6 lg:px-16">
          <div className="text-center mb-12">
            <p className="text-brand-500 font-semibold text-sm tracking-widest uppercase mb-2">
              Kata Mereka
            </p>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-800">
              Pelanggan <span className="text-brand-500">Kami Berbicara</span>
            </h2>
          </div>

          <div className="max-w-3xl mx-auto">
            {/* Testimonial card */}
            <div className="bg-white rounded-2xl shadow-md p-8 lg:p-10 relative">
              {/* Quote icon */}
              <svg
                className="absolute top-6 right-8 w-12 h-12 text-brand-100"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>

              <div className="flex items-center gap-4 mb-6">
                <img
                  src={testimonials[tIdx].avatar}
                  alt={testimonials[tIdx].name}
                  className="w-14 h-14 rounded-full object-cover ring-2 ring-brand-200"
                />
                <div>
                  <h4 className="font-bold text-gray-800">
                    {testimonials[tIdx].name}
                  </h4>
                  <p className="text-brand-500 text-sm">
                    {testimonials[tIdx].role}
                  </p>
                </div>
              </div>

              <p className="text-gray-600 text-lg leading-relaxed italic">
                "{testimonials[tIdx].text}"
              </p>

              {/* Stars */}
              <div className="flex gap-1 mt-5">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-5 h-5 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-center items-center gap-5 mt-7">
              <button
                onClick={() =>
                  setTIdx(
                    (tIdx - 1 + testimonials.length) % testimonials.length,
                  )
                }
                className="w-10 h-10 rounded-full bg-white border border-brand-200 text-brand-600 hover:bg-brand-500 hover:text-white hover:border-brand-500 transition-all flex items-center justify-center shadow-sm"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 19.5 8.25 12l7.5-7.5"
                  />
                </svg>
              </button>

              <div className="flex gap-2">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setTIdx(i)}
                    className={`rounded-full transition-all duration-300 ${
                      i === tIdx
                        ? "w-7 h-2.5 bg-brand-500"
                        : "w-2.5 h-2.5 bg-brand-200 hover:bg-brand-300"
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={() => setTIdx((tIdx + 1) % testimonials.length)}
                className="w-10 h-10 rounded-full bg-white border border-brand-200 text-brand-600 hover:bg-brand-500 hover:text-white hover:border-brand-500 transition-all flex items-center justify-center shadow-sm"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m8.25 4.5 7.5 7.5-7.5 7.5"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
