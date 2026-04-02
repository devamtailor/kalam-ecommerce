import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ShoppingCart, Star, BookOpen, Users } from "lucide-react";
import axios from "axios";
import { useCart } from "../contexts/CartContext";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    axios.get(`${API}/products/${id}`)
      .then(r => setProduct(r.data))
      .catch(() => navigate("/products"))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#F57B2C] border-t-transparent" />
    </div>
  );

  if (!product) return null;

  return (
    <div className="min-h-screen bg-[#F9FAFB] py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/products" className="inline-flex items-center gap-2 text-[#4A3556]/70 hover:text-[#F57B2C] mb-8 font-semibold transition-colors" data-testid="back-to-products-link">
          <ArrowLeft size={18} /> Back to Books
        </Link>

        <div className="bg-white rounded-[32px] shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Image */}
            <div className="bg-[#F9FAFB] p-8 flex items-center justify-center min-h-96">
              <img
                src={product.image_url}
                alt={product.title}
                className="w-full max-w-sm object-contain rounded-[24px] shadow-lg"
                onError={(e) => { e.target.src = "https://via.placeholder.com/400x400?text=Kalam+Book"; }}
              />
            </div>

            {/* Details */}
            <div className="p-8 lg:p-12 flex flex-col justify-center">
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-[#FBD40B] text-[#4A3556] text-xs font-bold rounded-full px-3 py-1">{product.age_range}</span>
                <span className="bg-[#2DAEBB]/10 text-[#2DAEBB] text-xs font-bold rounded-full px-3 py-1 flex items-center gap-1">
                  <BookOpen size={12} /> {product.pages_count} Pages
                </span>
              </div>

              <h1 data-testid="product-detail-title" className="text-4xl font-bold text-[#8A6A9F] mb-3" style={{ fontFamily: "'Fredoka', sans-serif" }}>
                {product.title}
              </h1>

              <div className="flex items-center gap-1 mb-4">
                {[1,2,3,4,5].map(s => <Star key={s} size={16} className="fill-[#FBD40B] text-[#FBD40B]" />)}
                <span className="text-sm text-[#4A3556]/60 ml-2">5.0 • Loved by kids</span>
              </div>

              <p className="text-[#4A3556]/70 leading-relaxed mb-6">{product.description}</p>

              <div className="flex items-center gap-4 mb-2">
                <span className="flex items-center gap-2 text-sm text-[#4A3556]/60">
                  <Users size={14} /> Best for {product.age_range}
                </span>
              </div>

              <div className="text-4xl font-bold text-[#F57B2C] mb-6" data-testid="product-detail-price">
                ₹{product.price}
              </div>

              {/* Quantity */}
              <div className="flex items-center gap-4 mb-6">
                <span className="font-semibold text-[#4A3556]">Qty:</span>
                <div className="flex items-center border border-gray-200 rounded-full overflow-hidden">
                  <button
                    data-testid="quantity-decrease-btn"
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="px-4 py-2 hover:bg-gray-100 font-bold text-[#4A3556] transition-colors"
                  >-</button>
                  <span data-testid="quantity-display" className="px-4 py-2 font-bold text-[#4A3556] min-w-[3rem] text-center">{quantity}</span>
                  <button
                    data-testid="quantity-increase-btn"
                    onClick={() => setQuantity(q => q + 1)}
                    className="px-4 py-2 hover:bg-gray-100 font-bold text-[#4A3556] transition-colors"
                  >+</button>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  data-testid="add-to-cart-detail-btn"
                  onClick={handleAddToCart}
                  className="flex-1 flex items-center justify-center gap-2 bg-[#F57B2C] text-white rounded-full py-4 font-bold hover:-translate-y-1 hover:shadow-lg transition-all duration-200"
                >
                  <ShoppingCart size={18} />
                  {added ? "Added to Cart!" : "Add to Cart"}
                </button>
                <Link
                  to="/cart"
                  data-testid="view-cart-btn"
                  className="flex-1 flex items-center justify-center gap-2 border-2 border-[#2DAEBB] text-[#2DAEBB] rounded-full py-4 font-bold hover:bg-[#2DAEBB] hover:text-white transition-all duration-200"
                >
                  View Cart
                </Link>
              </div>

              <div className="mt-6 p-4 bg-[#F9FAFB] rounded-[16px] text-sm text-[#4A3556]/70">
                <span className="font-semibold text-[#4A3556]">Payment:</span> Cash on Delivery available. Free shipping on orders above ₹499.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
