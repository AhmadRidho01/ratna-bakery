import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import useFetch from "../../hooks/useFetch";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import Badge from "../../components/ui/Badge";
import type { Order } from "../../types";

const STATUS_OPTIONS = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "done",
  "cancelled",
];

const STATUS_LABEL: Record<string, string> = {
  pending: "Pending",
  confirmed: "Dikonfirmasi",
  processing: "Diproses",
  shipped: "Dikirim",
  done: "Selesai",
  cancelled: "Dibatalkan",
};

const STATUS_BADGE: Record<string, "warning" | "info" | "success" | "danger"> =
  {
    pending: "warning",
    confirmed: "info",
    processing: "info",
    shipped: "info",
    done: "success",
    cancelled: "danger",
  };

const AdminOrdersPage = () => {
  const {
    data: orders,
    loading,
    error,
    refetch,
  } = useFetch<Order[]>("/orders");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      await api.patch(`/orders/${orderId}/status`, { status: newStatus });
      refetch();
    } catch {
      alert("Gagal update status pesanan.");
    } finally {
      setUpdatingId(null);
    }
  };

  const formatRupiah = (amount: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Gagal memuat pesanan.
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
          <h1 className="font-bold text-gray-800">Kelola Pesanan</h1>
        </div>
        <span className="text-sm text-gray-500">
          {orders?.length ?? 0} pesanan
        </span>
      </header>

      <main className="p-6 max-w-6xl mx-auto">
        {!orders || orders.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-4xl mb-3">📭</p>
            <p>Belum ada pesanan masuk.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-5"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Info Pesanan */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-mono font-bold text-brand-500 text-sm">
                        {order.orderCode}
                      </span>
                      <Badge
                        variant={STATUS_BADGE[order.status]}
                        label={STATUS_LABEL[order.status]}
                      />
                      <Badge
                        variant={
                          order.paymentStatus === "paid" ? "success" : "warning"
                        }
                        label={
                          order.paymentStatus === "paid"
                            ? "Lunas"
                            : "Belum Bayar"
                        }
                      />
                    </div>
                    <p className="font-semibold text-gray-800">
                      {order.customer.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {order.customer.phone} · {order.customer.city}
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                      {order.items.length} item ·{" "}
                      {formatRupiah(order.grandTotal)} ·{" "}
                      {formatDate(order.createdAt)}
                    </p>
                  </div>

                  {/* Update Status */}
                  <div className="flex items-center gap-3">
                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(order._id, e.target.value)
                      }
                      disabled={updatingId === order._id}
                      className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:opacity-50"
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {STATUS_LABEL[s]}
                        </option>
                      ))}
                    </select>
                    {updatingId === order._id && <LoadingSpinner size="sm" />}
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

export default AdminOrdersPage;
