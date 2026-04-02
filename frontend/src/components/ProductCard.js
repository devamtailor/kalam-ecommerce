import React from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Star } from "lucide-react";
import { useCart } from "../contexts/CartContext";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product);
  };

  return (
    <div
      data-testid={`product-card-${product.id}`}
      className="bg-white rounded-[28px] border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 overflow-hidden flex flex-col"
    >
      <Link to={`/products/${product.id}`} className="block">
        <div className="relative overflow-hidden bg-[#F9FAFB] h-52">
          <img
            src={product.image_url}
            alt={product.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            onError={(e) => { e.target.src = "https://via.placeholder.com/400x300?text=Kalam+Book"; }}
          />
          <span className="absolute top-3 left-3 bg-[#FBD40B] text-[#4A3556] text-xs font-bold rounded-full px-3 py-1">
            {product.age_range}
          </span>
        </div>
      </Link>

      <div className="p-5 flex flex-col flex-1">
        <Link to={`/products/${product.id}`}>
          <h3 data-testid="product-title" className="font-bold text-[#8A6A9F] text-lg mb-1 hover:text-[#F57B2C] transition-colors line-clamp-2" style={{ fontFamily: "'Fredoka', sans-serif" }}>
            {product.title}
          </h3>
        </Link>
        <p className="text-[#4A3556]/70 text-sm mb-3 line-clamp-2 flex-1">{product.description}</p>

        <div className="flex items-center gap-1 mb-3">
          {[1,2,3,4,5].map(s => (
            <Star key={s} size={12} className="fill-[#FBD40B] text-[#FBD40B]" />
          ))}
          <span className="text-xs text-gray-400 ml-1">{product.pages_count} pages</span>
        </div>

        <div className="flex items-center justify-between">
          <span data-testid="product-price" className="text-2xl font-bold text-[#F57B2C]">₹{product.price}</span>
          <button
            data-testid="add-to-cart-button"
            onClick={handleAddToCart}
            className="flex items-center gap-2 bg-[#F57B2C] text-white rounded-full px-4 py-2 text-sm font-bold hover:-translate-y-1 hover:shadow-md transition-all duration-200"
          >
            <ShoppingCart size={14} /> Add
          </button>
        </div>
      </div>
    </div>
  );
}
