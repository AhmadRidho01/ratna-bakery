import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import useCartStore from "../../store/useCartStore";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const totalItems = useCartStore((state) => state.getTotalItems());

  const navLinks = [
    { label: "Beranda", path: "/" },
    { label: "Katalog", path: "/catalog" },
    { label: "Tentang Kami", path: "/about" },
    { label: "Lacak Pesanan", path: "/track-order" },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl">🍞</span>
            <div>
              <p className="font-bold text-brand-700 leading-none">Ratna</p>
              <p className="text-xs text-brand-500 leading-none">Bakery</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-brand-500 ${
                  isActive(link.path)
                    ? "text-brand-600 border-b-2 border-brand-500 pb-1"
                    : "text-gray-600"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Cart Button */}
          <div className="flex items-center gap-3">
            <Link
              to="/checkout"
              className="relative flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors"
            >
              🛒
              <span>Keranjang</span>
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Mobile Hamburger */}
            <button
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <div className="w-5 h-0.5 bg-gray-600 mb-1" />
              <div className="w-5 h-0.5 bg-gray-600 mb-1" />
              <div className="w-5 h-0.5 bg-gray-600" />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t pt-4 flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
                className={`text-sm font-medium ${
                  isActive(link.path) ? "text-brand-600" : "text-gray-600"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
