import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-brand-700 text-white mt-16">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🍞</span>
              <div>
                <p className="font-bold text-lg leading-none">Ratna Bakery</p>
                <p className="text-xs text-brand-100 leading-none">
                  Sejak 2015
                </p>
              </div>
            </div>
            <p className="text-brand-100 text-sm leading-relaxed">
              Produk roti dan camilan khas desa dengan cita rasa autentik,
              bersertifikat PIRT dan Halal.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4">Menu</h4>
            <div className="flex flex-col gap-2">
              {[
                { label: "Beranda", path: "/" },
                { label: "Katalog Produk", path: "/catalog" },
                { label: "Tentang Kami", path: "/about" },
                { label: "Lacak Pesanan", path: "/track-order" },
              ].map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-brand-100 hover:text-white text-sm transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Hubungi Kami</h4>
            <div className="flex flex-col gap-2 text-brand-100 text-sm">
              <a
                href="https://wa.me/6281234567890"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                📱 WhatsApp: 0812-3456-7890
              </a>
              <p>📍 Desa Sukamaju, Jawa Barat</p>
              <p>🕐 Senin - Sabtu, 07.00 - 17.00</p>
            </div>
          </div>
        </div>

        <div className="border-t border-brand-600 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center gap-2">
          <p className="text-brand-100 text-xs">
            © 2026 Ratna Bakery. Semua hak dilindungi.
          </p>
          <div className="flex items-center gap-4 text-xs text-brand-100">
            <span>🏅 PIRT Certified</span>
            <span>☪️ Halal MUI</span>
            <span>🔬 Lulus Uji Lab</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
