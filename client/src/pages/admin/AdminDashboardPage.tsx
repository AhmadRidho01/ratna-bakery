import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import useAuthStore from "../../store/useAuthStore";
import LoadingSpinner from "../../components/ui/LoadingSpinner";

interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  pendingOrders: number;
  totalRevenue: number;
}

const AdminDashboardPage = () => {
  const { user, logout } = useAuthStore();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get<{ data: DashboardStats }>(
          "/orders/dashboard/stats",
        );
        setStats(res.data.data);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  const handleLogout = async () => {
    await logout();
    window.location.href = "/admin/login";
  };

  const formatRupiah = (amount: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🍞</span>
          <div>
            <h1 className="font-bold text-gray-800">Ratna Bakery</h1>
            <p className="text-xs text-gray-500">Admin Dashboard</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">
            Halo, <strong>{user?.name}</strong>
          </span>
          <button
            onClick={handleLogout}
            className="text-sm text-red-500 hover:text-red-700 font-medium transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="p-6 max-w-6xl mx-auto">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: "Total Produk",
              value: stats?.totalProducts ?? 0,
              icon: "🥖",
              color: "bg-orange-50 text-orange-600",
            },
            {
              label: "Total Pesanan",
              value: stats?.totalOrders ?? 0,
              icon: "📦",
              color: "bg-blue-50 text-blue-600",
            },
            {
              label: "Pesanan Pending",
              value: stats?.pendingOrders ?? 0,
              icon: "⏳",
              color: "bg-yellow-50 text-yellow-600",
            },
            {
              label: "Total Revenue",
              value: formatRupiah(stats?.totalRevenue ?? 0),
              icon: "💰",
              color: "bg-green-50 text-green-600",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-xl p-5 shadow-sm border border-gray-100"
            >
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl mb-3 ${stat.color}`}
              >
                {stat.icon}
              </div>
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
              <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Quick Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            to="/admin/products"
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:border-brand-500 hover:shadow-md transition-all group"
          >
            <div className="flex items-center gap-4">
              <span className="text-4xl">🥖</span>
              <div>
                <h2 className="font-bold text-gray-800 group-hover:text-brand-500 transition-colors">
                  Kelola Produk
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Tambah, edit, dan hapus produk
                </p>
              </div>
            </div>
          </Link>

          <Link
            to="/admin/orders"
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:border-brand-500 hover:shadow-md transition-all group"
          >
            <div className="flex items-center gap-4">
              <span className="text-4xl">📋</span>
              <div>
                <h2 className="font-bold text-gray-800 group-hover:text-brand-500 transition-colors">
                  Kelola Pesanan
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Lihat dan update status pesanan
                </p>
              </div>
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboardPage;
