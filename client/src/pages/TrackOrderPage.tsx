import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../services/api";
import type { Order } from "../types";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import Badge from "../components/ui/Badge";

const statusConfig: Record<
  string,
  {
    label: string;
    variant: "success" | "warning" | "info" | "danger" | "default";
  }
> = {
  pending: { label: "Menunggu Konfirmasi", variant: "warning" },
  confirmed: { label: "Dikonfirmasi", variant: "info" },
  processing: { label: "Sedang Diproses", variant: "info" },
  shipped: { label: "Dalam Pengiriman", variant: "info" },
  done: { label: "Selesai", variant: "success" },
  cancelled: { label: "Dibatalkan", variant: "danger" },
};

const paymentConfig: Record<
  string,
  { label: string; variant: "success" | "warning" | "danger" | "default" }
> = {
  unpaid: { label: "Belum Dibayar", variant: "warning" },
  paid: { label: "Sudah Dibayar", variant: "success" },
  failed: { label: "Pembayaran Gagal", variant: "danger" },
  refunded: { label: "Dikembalikan", variant: "default" },
};

const TrackOrderPage = () => {
  const [searchParams] = useSearchParams();
  const [code, setCode] = useState(searchParams.get("code") || "");
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTrack = async () => {
    if (!code.trim()) return;
    setLoading(true);
    setError(null);
    setOrder(null);

    try {
      const response = await api.get<{ success: boolean; data: Order }>(
        `/orders/track/${code.trim()}`,
      );
      setOrder(response.data.data);
    } catch {
      setError("Pesanan tidak ditemukan. Periksa kembali kode pesananmu.");
    } finally {
      setLoading(false);
    }
  };

  // Auto-track kalau ada code dari URL params
  useEffect(() => {
    if (code) handleTrack();
  }, []);

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-brand-700 mb-2">
          Lacak Pesanan
        </h1>
        <p className="text-gray-500">
          Masukkan kode pesanan untuk melihat status terkini
        </p>
      </div>

      {/* Search Box */}
      <div className="flex gap-3 mb-8">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          onKeyDown={(e) => e.key === "Enter" && handleTrack()}
          placeholder="Contoh: RB-20260310-ABCD"
          className="flex-1 border border-gray-200 rounded-full px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300 transition"
        />
        <button
          onClick={handleTrack}
          disabled={loading || !code.trim()}
          className="bg-brand-500 hover:bg-brand-600 disabled:bg-gray-300 text-white px-6 py-3 rounded-full font-medium transition-colors"
        >
          {loading ? "..." : "Lacak"}
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-8">
          <LoadingSpinner size="md" text="Mencari pesanan..." />
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
          <p className="text-red-500">{error}</p>
        </div>
      )}

      {/* Order Result */}
      {order && (
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          {/* Header */}
          <div className="bg-brand-50 p-6 border-b">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-500">Kode Pesanan</p>
              <div className="flex gap-2">
                <Badge
                  label={statusConfig[order.status]?.label || order.status}
                  variant={statusConfig[order.status]?.variant || "default"}
                />
                <Badge
                  label={
                    paymentConfig[order.paymentStatus]?.label ||
                    order.paymentStatus
                  }
                  variant={
                    paymentConfig[order.paymentStatus]?.variant || "default"
                  }
                />
              </div>
            </div>
            <p className="text-xl font-bold text-brand-700">
              {order.orderCode}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Dipesan pada{" "}
              {new Date(order.createdAt).toLocaleDateString("id-ID", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          {/* Items */}
          <div className="p-6 border-b">
            <h3 className="font-semibold text-gray-700 mb-3">Item Pesanan</h3>
            <div className="flex flex-col gap-2">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {item.name} x{item.quantity}
                  </span>
                  <span className="font-medium">
                    Rp {item.subtotal.toLocaleString("id-ID")}
                  </span>
                </div>
              ))}
              <div className="border-t pt-2 flex justify-between font-bold">
                <span>Total</span>
                <span className="text-brand-600">
                  Rp {order.grandTotal.toLocaleString("id-ID")}
                </span>
              </div>
            </div>
          </div>

          {/* Customer Info */}
          <div className="p-6">
            <h3 className="font-semibold text-gray-700 mb-3">
              Informasi Pengiriman
            </h3>
            <div className="text-sm text-gray-500 flex flex-col gap-1">
              <p className="font-medium text-gray-700">{order.customer.name}</p>
              <p>{order.customer.phone}</p>
              <p>
                {order.customer.address}, {order.customer.city}{" "}
                {order.customer.postalCode}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrackOrderPage;
