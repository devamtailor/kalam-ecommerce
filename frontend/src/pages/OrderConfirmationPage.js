import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { CheckCircle, Package, Truck, Phone, MapPin, ArrowRight } from "lucide-react";
import axios from "axios";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const STATUS_STEPS = ["pending", "processing", "shipped", "delivered"];
const STATUS_LABELS = { pending: "Order Placed", processing: "Preparing", shipped: "Shipped", delivered: "Delivered" };

export default function OrderConfirmationPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API}/orders/${orderId}`)
      .then(r => setOrder(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [orderId]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#F57B2C] border-t-transparent" />
    </div>
  );

  if (!order) return (
    <div className="min-h-screen flex items-center justify-center text-[#4A3556]/60">Order not found.</div>
  );

  const currentStep = STATUS_STEPS.indexOf(order.status);

  return (
    <div className="min-h-screen bg-[#F9FAFB] py-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Banner */}
        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 text-center mb-6" data-testid="order-confirmation-banner">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle size={40} className="text-green-500" />
          </div>
          <h1 className="text-4xl font-bold text-[#8A6A9F] mb-2" style={{ fontFamily: "'Fredoka', sans-serif" }}>
            Order Placed!
          </h1>
          <p className="text-[#4A3556]/70 mb-4">
            Thank you, <span className="font-bold text-[#4A3556]">{order.customer_name}</span>! Your order has been confirmed.
          </p>
          <div className="inline-flex items-center gap-2 bg-[#FBD40B] text-[#4A3556] rounded-full px-6 py-2 font-bold text-lg">
            <Package size={18} /> {order.order_number}
          </div>
          <p className="text-sm text-[#4A3556]/50 mt-3">Estimated delivery: 3–5 business days</p>
        </div>

        {/* Order Progress */}
        <div className="bg-white rounded-[28px] p-6 shadow-sm border border-gray-100 mb-6">
          <h2 className="font-bold text-[#8A6A9F] text-lg mb-5" style={{ fontFamily: "'Fredoka', sans-serif" }}>Order Status</h2>
          <div className="flex items-center justify-between">
            {STATUS_STEPS.map((step, i) => (
              <React.Fragment key={step}>
                <div className="flex flex-col items-center gap-1">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${i <= currentStep ? "bg-[#F57B2C] text-white" : "bg-gray-100 text-gray-400"}`}>
                    {i < currentStep ? "✓" : i + 1}
                  </div>
                  <span className={`text-xs font-semibold ${i <= currentStep ? "text-[#F57B2C]" : "text-gray-400"}`}>{STATUS_LABELS[step]}</span>
                </div>
                {i < STATUS_STEPS.length - 1 && (
                  <div className={`flex-1 h-1 mx-2 rounded-full ${i < currentStep ? "bg-[#F57B2C]" : "bg-gray-100"}`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          {/* Delivery Info */}
          <div className="bg-white rounded-[28px] p-6 shadow-sm border border-gray-100">
            <h2 className="font-bold text-[#8A6A9F] mb-4 flex items-center gap-2" style={{ fontFamily: "'Fredoka', sans-serif" }}>
              <Truck size={18} className="text-[#F57B2C]" /> Delivery Details
            </h2>
            <div className="space-y-2 text-sm text-[#4A3556]/70">
              <p className="flex items-start gap-2"><Phone size={14} className="text-[#2DAEBB] mt-0.5 flex-shrink-0" />{order.customer_phone}</p>
              <p className="flex items-start gap-2"><MapPin size={14} className="text-[#2DAEBB] mt-0.5 flex-shrink-0" />{order.customer_address}, {order.city} – {order.pincode}</p>
            </div>
            <div className="mt-3 pt-3 border-t">
              <p className="text-sm"><span className="font-semibold text-[#4A3556]">Payment:</span> Cash on Delivery</p>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-[28px] p-6 shadow-sm border border-gray-100">
            <h2 className="font-bold text-[#8A6A9F] mb-4" style={{ fontFamily: "'Fredoka', sans-serif" }}>Items Ordered</h2>
            <div className="space-y-3 max-h-36 overflow-y-auto">
              {order.items.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <img src={item.product_image} alt={item.product_title} className="w-10 h-10 object-cover rounded-xl bg-[#F9FAFB]" onError={(e) => { e.target.src = "https://via.placeholder.com/40?text=Book"; }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-[#4A3556] truncate">{item.product_title}</p>
                    <p className="text-xs text-[#4A3556]/60">x{item.quantity}</p>
                  </div>
                  <p className="text-sm font-bold text-[#4A3556]">₹{(item.price * item.quantity).toFixed(0)}</p>
                </div>
              ))}
            </div>
            <div className="border-t pt-3 mt-3 flex justify-between font-bold text-[#4A3556]">
              <span>Total</span>
              <span data-testid="order-total">₹{order.total_amount.toFixed(0)}</span>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Link
            to="/products"
            data-testid="continue-shopping-btn"
            className="inline-flex items-center gap-2 bg-[#F57B2C] text-white rounded-full px-8 py-4 font-bold hover:-translate-y-1 hover:shadow-lg transition-all duration-200"
          >
            Continue Shopping <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
}
