import { useState } from "react";
import { Link } from "react-router-dom";
import useCartStore from "../store/useCartStore";
import type { CustomerInfo } from "../types";
import api from "../services/api";

type CheckoutStep = "cart" | "form" | "payment";

const CheckoutPage = () => {
  const [step, setStep] = useState<CheckoutStep>("cart");
  const [isLoading, setIsLoading] = useState(false);
  const [orderCode, setOrderCode] = useState<string>("");
  const [paymentUrl, setPaymentUrl] = useState<string>("");
  const [isPreOrder, setIsPreOrder] = useState(false);
  const [eventDate, setEventDate] = useState("");
  const [notes, setNotes] = useState("");

  const { items, removeItem, updateQuantity, clearCart, getTotalPrice } =
    useCartStore();

  const [customer, setCustomer] = useState<CustomerInfo>({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    postalCode: "",
  });

  const shippingCost = 15000;
  const totalPrice = getTotalPrice();
  const grandTotal = totalPrice + shippingCost;

  const handleCustomerChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setCustomer((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const isFormValid = () => {
    return Object.values(customer).every((val) => val.trim() !== "");
  };

  const handleSubmitOrder = async () => {
    if (!isFormValid()) {
      alert("Harap lengkapi semua data pengiriman.");
      return;
    }

    setIsLoading(true);
    try {
      const orderPayload = {
        customer,
        items: items.map((item) => ({
          productId: item.product._id,
          quantity: item.quantity,
        })),
        shippingCost,
        notes,
        isPreOrder,
        eventDate: isPreOrder && eventDate ? eventDate : undefined,
      };

      const response = await api.post<{
        success: boolean;
        data: {
          order: { orderCode: string };
          paymentUrl: string;
        };
      }>("/orders/checkout", orderPayload);

      if (response.data.success) {
        setOrderCode(response.data.data.order.orderCode);
        setPaymentUrl(response.data.data.paymentUrl);
        clearCart();
        setStep("payment");
      }
    } catch (error) {
      alert("Gagal membuat pesanan. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  // STEP: CART
  if (step === "cart") {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Keranjang Belanja
        </h1>

        {items.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-6xl mb-4">🛒</p>
            <p className="text-gray-500 text-lg mb-6">
              Keranjang kamu masih kosong
            </p>
            <Link
              to="/catalog"
              className="bg-brand-500 hover:bg-brand-600 text-white px-8 py-3 rounded-full font-medium transition-colors"
            >
              Mulai Belanja
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              {items.map((item) => (
                <div
                  key={item.product._id}
                  className="flex items-center gap-4 bg-white border border-gray-100 rounded-2xl p-4 shadow-sm"
                >
                  <div className="w-16 h-16 bg-brand-50 rounded-xl flex-shrink-0 overflow-hidden">
                    {item.product.images[0] ? (
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-full h-full object-cover rounded-xl"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-3xl">
                        {item.product.category === "roti" ? "🍞" : "🍘"}
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 truncate">
                      {item.product.name}
                    </p>
                    <p className="text-brand-600 font-medium text-sm">
                      Rp {item.product.price.toLocaleString("id-ID")}
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2 border border-gray-200 rounded-full px-3 py-1">
                    <button
                      onClick={() =>
                        updateQuantity(item.product._id, item.quantity - 1)
                      }
                      className="text-brand-500 font-bold w-5 h-5 flex items-center justify-center"
                    >
                      −
                    </button>
                    <span className="w-6 text-center text-sm font-bold">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(item.product._id, item.quantity + 1)
                      }
                      className="text-brand-500 font-bold w-5 h-5 flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>

                  <div className="text-right">
                    <p className="font-bold text-gray-800 text-sm">
                      Rp{" "}
                      {(item.product.price * item.quantity).toLocaleString(
                        "id-ID",
                      )}
                    </p>
                    <button
                      onClick={() => removeItem(item.product._id)}
                      className="text-red-400 hover:text-red-500 text-xs mt-1 transition-colors"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm h-fit">
              <h2 className="font-bold text-gray-800 mb-4">
                Ringkasan Pesanan
              </h2>

              <div className="flex flex-col gap-2 text-sm mb-4">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal</span>
                  <span>Rp {totalPrice.toLocaleString("id-ID")}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Ongkir (estimasi)</span>
                  <span>Rp {shippingCost.toLocaleString("id-ID")}</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-bold text-gray-800">
                  <span>Total</span>
                  <span>Rp {grandTotal.toLocaleString("id-ID")}</span>
                </div>
              </div>

              {/* Pre-order Toggle */}
              <div className="mb-4 p-3 bg-brand-50 rounded-xl">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPreOrder}
                    onChange={(e) => setIsPreOrder(e.target.checked)}
                    className="w-4 h-4 accent-brand-500"
                  />
                  <span className="text-sm font-medium text-brand-700">
                    Pesanan untuk Hajatan / Event
                  </span>
                </label>
                {isPreOrder && (
                  <input
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    className="mt-2 w-full border border-brand-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
                  />
                )}
              </div>

              <button
                onClick={() => setStep("form")}
                className="w-full bg-brand-500 hover:bg-brand-600 text-white py-3 rounded-full font-medium transition-colors"
              >
                Lanjut ke Pengiriman →
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // STEP: FORM
  if (step === "form") {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <button
          onClick={() => setStep("cart")}
          className="text-brand-500 hover:underline text-sm mb-6 flex items-center gap-1"
        >
          ← Kembali ke Keranjang
        </button>

        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Data Pengiriman
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    name: "name",
                    label: "Nama Lengkap",
                    type: "text",
                    placeholder: "Budi Santoso",
                  },
                  {
                    name: "phone",
                    label: "No. WhatsApp",
                    type: "tel",
                    placeholder: "08123456789",
                  },
                  {
                    name: "email",
                    label: "Email",
                    type: "email",
                    placeholder: "budi@email.com",
                  },
                  {
                    name: "city",
                    label: "Kota",
                    type: "text",
                    placeholder: "Bandung",
                  },
                  {
                    name: "postalCode",
                    label: "Kode Pos",
                    type: "text",
                    placeholder: "40111",
                  },
                ].map((field) => (
                  <div
                    key={field.name}
                    className={field.name === "email" ? "md:col-span-2" : ""}
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {field.label}
                    </label>
                    <input
                      type={field.type}
                      name={field.name}
                      value={customer[field.name as keyof CustomerInfo]}
                      onChange={handleCustomerChange}
                      placeholder={field.placeholder}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300 transition"
                    />
                  </div>
                ))}

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Alamat Lengkap
                  </label>
                  <textarea
                    name="address"
                    value={customer.address}
                    onChange={handleCustomerChange}
                    placeholder="Jl. Merdeka No. 10, RT 01/RW 02"
                    rows={3}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300 transition resize-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Catatan (opsional)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Contoh: Tolong dikemas rapi, hadiah ulang tahun"
                    rows={2}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300 transition resize-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Summary Sidebar */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm h-fit">
            <h2 className="font-bold text-gray-800 mb-4">Ringkasan</h2>
            <div className="flex flex-col gap-2 text-sm mb-6">
              {items.map((item) => (
                <div
                  key={item.product._id}
                  className="flex justify-between text-gray-500"
                >
                  <span className="truncate mr-2">
                    {item.product.name} x{item.quantity}
                  </span>
                  <span className="flex-shrink-0">
                    Rp{" "}
                    {(item.product.price * item.quantity).toLocaleString(
                      "id-ID",
                    )}
                  </span>
                </div>
              ))}
              <div className="border-t pt-2 flex justify-between font-bold text-gray-800">
                <span>Total</span>
                <span>Rp {grandTotal.toLocaleString("id-ID")}</span>
              </div>
            </div>

            <button
              onClick={handleSubmitOrder}
              disabled={isLoading || !isFormValid()}
              className="w-full bg-brand-500 hover:bg-brand-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 rounded-full font-medium transition-colors"
            >
              {isLoading ? "Memproses..." : "Bayar Sekarang →"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // STEP: PAYMENT
  return (
    <div className="max-w-lg mx-auto px-4 py-16 text-center">
      <div className="text-6xl mb-6">🎉</div>
      <h1 className="text-2xl font-bold text-gray-800 mb-2">
        Pesanan Berhasil Dibuat!
      </h1>
      <p className="text-gray-500 mb-2">Kode pesanan kamu:</p>
      <p className="text-2xl font-bold text-brand-600 mb-6">{orderCode}</p>

      <div className="bg-brand-50 rounded-2xl p-6 mb-6 text-left">
        <p className="text-sm text-gray-600 leading-relaxed">
          Selesaikan pembayaran untuk memproses pesananmu. Simpan kode pesanan
          untuk melacak status pengiriman.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {paymentUrl && (
          <a
            href={paymentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-brand-500 hover:bg-brand-600 text-white py-3 rounded-full font-medium transition-colors block"
          >
            💳 Bayar Sekarang
          </a>
        )}
        <Link
          to={`/track-order?code=${orderCode}`}
          className="w-full border-2 border-brand-500 text-brand-600 hover:bg-brand-50 py-3 rounded-full font-medium transition-colors block"
        >
          🔍 Lacak Pesanan
        </Link>
        <Link
          to="/"
          className="text-gray-400 hover:text-gray-600 text-sm transition-colors"
        >
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
};

export default CheckoutPage;
