import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <p className="text-8xl mb-6">🍞</p>
      <h1 className="text-4xl font-bold text-gray-800 mb-3">404</h1>
      <p className="text-xl text-gray-600 mb-2">Halaman tidak ditemukan</p>
      <p className="text-gray-400 mb-8 max-w-md">
        Sepertinya halaman yang kamu cari sudah habis terjual — atau memang
        tidak pernah ada.
      </p>
      <Link
        to="/"
        className="bg-brand-500 hover:bg-brand-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
      >
        Kembali ke Beranda
      </Link>
    </div>
  );
};

export default NotFoundPage;
