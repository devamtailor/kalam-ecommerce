import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, MapPin, Phone, User, CreditCard, Truck } from "lucide-react";
import axios from "axios";
import { useCart } from "../contexts/CartContext";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const inputClass = "w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#2DAEBB] focus:border-transparent text-[#4A3556] bg-white transition-all";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, cartTotal, clearCart } = useCart();
  const [form, setForm] = useState({ customer_name: "", customer_phone: "", customer_address: "", city: "", pincode: "", notes: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const shipping = cartTotal >= 499 ? 0 : 50;
  const grandTotal = cartTotal + shipping;

  const validate = () => {
    const e = {};
    if (!form.customer_name.trim()) e.customer_name = "Name is required";
    if (!form.customer_phone.trim() || !/^\d{10}$/.test(form.customer_phone.trim())) e.customer_phone = "Enter a valid 10-digit phone number";
    if (!form.customer_address.trim()) e.customer_address = "Address is required";
    if (!form.city.trim()) e.city = "City is required";
    if (!form.pincode.trim() || !/^\d{6}$/.test(form.pincode.trim())) e.pincode = "Enter a valid 6-digit pincode";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    if (items.length === 0) { navigate("/products"); return; }

    setLoading(true);
    try {
      const payload = {
        ...form,
        items: items.map(i => ({ product_id: i.product_id, product_title: i.product_title, product_image: i.product_image, price: i.price, quantity: i.quantity })),
        total_amount: grandTotal,
      };
      const { data } = await axios.post(`${API}/orders`, payload);
      clearCart();
      navigate(`/order-confirmation/${data.id}`);
    } catch {
      setErrors({ submit: "Something went wrong. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const handle = (field) => (e) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
    setErrors(prev => ({ ...prev, [field]: "" }));
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#4A3556]/60 mb-4">Your cart is empty.</p>
          <Link to="/products" className="text-[#F57B2C] font-bold hover:underline">Browse Books</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/cart" className="inline-flex items-center gap-2 text-[#4A3556]/70 hover:text-[#F57B2C] mb-8 font-semibold transition-colors">
          <ArrowLeft size={18} /> Back to Cart
        </Link>

        <h1 className="text-4xl font-bold text-[#8A6A9F] mb-8" style={{ fontFamily: "'Fredoka', sans-serif" }}>Checkout</h1>

        <form onSubmit={handleSubmit} data-testid="checkout-form">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Delivery Details */}
              <div className="bg-white rounded-[28px] p-8 shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-[#8A6A9F] mb-6 flex items-center gap-2" style={{ fontFamily: "'Fredoka', sans-serif" }}>
                  <MapPin size={20} className="text-[#F57B2C]" /> Delivery Details
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-semibold text-[#4A3556] mb-2">
                      <User size={14} className="inline mr-1" /> Full Name *
                    </label>
                    <input data-testid="checkout-name-input" type="text" value={form.customer_name} onChange={handle("customer_name")} placeholder="Enter your full name" className={inputClass} />
                    {errors.customer_name && <p className="text-red-500 text-xs mt-1">{errors.customer_name}</p>}
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-semibold text-[#4A3556] mb-2">
                      <Phone size={14} className="inline mr-1" /> Phone Number *
                    </label>
                    <input data-testid="checkout-phone-input" type="tel" value={form.customer_phone} onChange={handle("customer_phone")} placeholder="10-digit mobile number" className={inputClass} maxLength={10} />
                    {errors.customer_phone && <p className="text-red-500 text-xs mt-1">{errors.customer_phone}</p>}
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-semibold text-[#4A3556] mb-2">Full Address *</label>
                    <textarea data-testid="checkout-address-input" value={form.customer_address} onChange={handle("customer_address")} placeholder="House/Flat No., Street, Area, Landmark" rows={3} className={`${inputClass} resize-none`} />
                    {errors.customer_address && <p className="text-red-500 text-xs mt-1">{errors.customer_address}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#4A3556] mb-2">City *</label>
                    <input data-testid="checkout-city-input" type="text" value={form.city} onChange={handle("city")} placeholder="City" className={inputClass} />
                    {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#4A3556] mb-2">Pincode *</label>
                    <input data-testid="checkout-pincode-input" type="text" value={form.pincode} onChange={handle("pincode")} placeholder="6-digit pincode" className={inputClass} maxLength={6} />
                    {errors.pincode && <p className="text-red-500 text-xs mt-1">{errors.pincode}</p>}
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-semibold text-[#4A3556] mb-2">Special Instructions (optional)</label>
                    <textarea data-testid="checkout-notes-input" value={form.notes} onChange={handle("notes")} placeholder="Any special delivery instructions..." rows={2} className={`${inputClass} resize-none`} />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-[28px] p-8 shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-[#8A6A9F] mb-4 flex items-center gap-2" style={{ fontFamily: "'Fredoka', sans-serif" }}>
                  <CreditCard size={20} className="text-[#F57B2C]" /> Payment Method
                </h2>
                <div className="border-2 border-[#2DAEBB] rounded-2xl p-5 bg-[#2DAEBB]/5 flex items-center gap-4">
                  <div className="w-10 h-10 bg-[#2DAEBB] rounded-full flex items-center justify-center flex-shrink-0">
                    <Truck size={20} className="text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-[#4A3556]">Cash on Delivery (COD)</p>
                    <p className="text-sm text-[#4A3556]/60">Pay with cash when your order arrives</p>
                  </div>
                  <div className="ml-auto">
                    <div className="w-5 h-5 rounded-full bg-[#2DAEBB] flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-white" />
                    </div>
                  </div>
                </div>
                <p className="text-xs text-[#4A3556]/50 mt-3 text-center">
                  Online payment (Razorpay) coming soon
                </p>
              </div>
            </div>

            {/* Order Summary */}
            <div>
              <div className="bg-white rounded-[28px] p-6 shadow-sm border border-gray-100 sticky top-24">
                <h2 className="text-xl font-bold text-[#8A6A9F] mb-5" style={{ fontFamily: "'Fredoka', sans-serif" }}>Order Summary</h2>
                <div className="space-y-3 mb-5 max-h-48 overflow-y-auto">
                  {items.map(item => (
                    <div key={item.product_id} className="flex items-center gap-3">
                      <img src={item.product_image} alt={item.product_title} className="w-12 h-12 object-cover rounded-xl bg-[#F9FAFB]" onError={(e) => { e.target.src = "https://via.placeholder.com/50?text=Book"; }} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-[#4A3556] truncate">{item.product_title}</p>
                        <p className="text-xs text-[#4A3556]/60">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-bold text-[#4A3556]">₹{(item.price * item.quantity).toFixed(0)}</p>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm text-[#4A3556]/70"><span>Subtotal</span><span>₹{cartTotal.toFixed(0)}</span></div>
                  <div className="flex justify-between text-sm text-[#4A3556]/70"><span>Shipping</span><span className={shipping === 0 ? "text-green-600 font-semibold" : ""}>{shipping === 0 ? "FREE" : `₹${shipping}`}</span></div>
                  <div className="flex justify-between font-bold text-[#4A3556] text-lg border-t pt-2">
                    <span>Total</span>
                    <span data-testid="checkout-total">₹{grandTotal.toFixed(0)}</span>
                  </div>
                </div>

                {errors.submit && <p className="text-red-500 text-sm mt-3 text-center">{errors.submit}</p>}

                <button
                  type="submit"
                  data-testid="place-order-button"
                  disabled={loading}
                  className="mt-5 w-full bg-[#F57B2C] text-white rounded-full py-4 font-bold hover:-translate-y-1 hover:shadow-lg transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                >
                  {loading ? "Placing Order..." : "Place Order (COD)"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
