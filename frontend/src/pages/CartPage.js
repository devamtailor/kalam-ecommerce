import React from "react";
import { Link } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "../contexts/CartContext";

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, cartTotal } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center">
        <div className="text-center" data-testid="empty-cart">
          <div className="w-24 h-24 bg-[#F57B2C]/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag size={40} className="text-[#F57B2C]" />
          </div>
          <h2 className="text-3xl font-bold text-[#8A6A9F] mb-2" style={{ fontFamily: "'Fredoka', sans-serif" }}>Your cart is empty!</h2>
          <p className="text-[#4A3556]/60 mb-8">Add some colouring books to get started.</p>
          <Link to="/products" data-testid="start-shopping-btn" className="inline-flex items-center gap-2 bg-[#F57B2C] text-white rounded-full px-8 py-4 font-bold hover:-translate-y-1 hover:shadow-lg transition-all duration-200">
            Start Shopping <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] py-10" data-testid="cart-page">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-[#8A6A9F] mb-8" style={{ fontFamily: "'Fredoka', sans-serif" }}>
          My Cart ({items.length} item{items.length > 1 ? "s" : ""})
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map(item => (
              <div key={item.product_id} data-testid={`cart-item-${item.product_id}`} className="bg-white rounded-[24px] p-5 flex gap-5 items-center shadow-sm border border-gray-100">
                <img
                  src={item.product_image}
                  alt={item.product_title}
                  className="w-24 h-24 object-cover rounded-[16px] bg-[#F9FAFB] flex-shrink-0"
                  onError={(e) => { e.target.src = "https://via.placeholder.com/100?text=Book"; }}
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-[#8A6A9F] text-base truncate" style={{ fontFamily: "'Fredoka', sans-serif" }}>{item.product_title}</h3>
                  <p className="text-[#F57B2C] font-bold text-lg mt-1">₹{item.price}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    data-testid={`cart-item-decrease-${item.product_id}`}
                    onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                    className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors"
                  >
                    <Minus size={14} />
                  </button>
                  <span data-testid={`cart-item-qty-${item.product_id}`} className="font-bold text-[#4A3556] w-6 text-center">{item.quantity}</span>
                  <button
                    data-testid={`cart-item-increase-${item.product_id}`}
                    onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                    className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors"
                  >
                    <Plus size={14} />
                  </button>
                </div>
                <div className="text-right min-w-[5rem]">
                  <p className="font-bold text-[#4A3556]">₹{(item.price * item.quantity).toFixed(0)}</p>
                </div>
                <button
                  data-testid={`cart-item-remove-${item.product_id}`}
                  onClick={() => removeFromCart(item.product_id)}
                  className="text-red-400 hover:text-red-600 transition-colors p-1"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div>
            <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 sticky top-24">
              <h2 className="text-xl font-bold text-[#8A6A9F] mb-5" style={{ fontFamily: "'Fredoka', sans-serif" }}>Order Summary</h2>

              <div className="space-y-3 mb-5">
                <div className="flex justify-between text-sm text-[#4A3556]/70">
                  <span>Subtotal</span>
                  <span>₹{cartTotal.toFixed(0)}</span>
                </div>
                <div className="flex justify-between text-sm text-[#4A3556]/70">
                  <span>Shipping</span>
                  <span className="text-green-600 font-semibold">{cartTotal >= 499 ? "FREE" : "₹50"}</span>
                </div>
                {cartTotal < 499 && (
                  <p className="text-xs text-[#2DAEBB] bg-[#2DAEBB]/10 rounded-xl px-3 py-2">
                    Add ₹{(499 - cartTotal).toFixed(0)} more for free shipping!
                  </p>
                )}
                <div className="border-t pt-3 flex justify-between font-bold text-[#4A3556]">
                  <span data-testid="cart-total-label">Total</span>
                  <span data-testid="cart-total">{cartTotal >= 499 ? `₹${cartTotal.toFixed(0)}` : `₹${(cartTotal + 50).toFixed(0)}`}</span>
                </div>
              </div>

              <div className="bg-[#F9FAFB] rounded-[16px] p-3 mb-5 text-sm text-[#4A3556]/70 text-center">
                Payment: <span className="font-semibold text-[#4A3556]">Cash on Delivery</span>
              </div>

              <Link
                to="/checkout"
                data-testid="checkout-button"
                className="block w-full text-center bg-[#F57B2C] text-white rounded-full py-4 font-bold hover:-translate-y-1 hover:shadow-lg transition-all duration-200"
              >
                Proceed to Checkout <ArrowRight size={16} className="inline ml-1" />
              </Link>

              <Link to="/products" className="block w-full text-center mt-3 text-[#4A3556]/60 hover:text-[#4A3556] text-sm transition-colors">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
