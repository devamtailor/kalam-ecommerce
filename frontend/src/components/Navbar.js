import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ShoppingCart, Menu, X } from "lucide-react";
import { useCart } from "../contexts/CartContext";

const LOGO = "https://customer-assets.emergentagent.com/job_cd5f40a9-651f-4209-9bc2-941d75259399/artifacts/96wkl9n0_Untitled%20design%20%2814%29.png";

export default function Navbar() {
  const { cartCount } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav data-testid="navbar" className="fixed w-full top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" data-testid="nav-logo" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
            <img src={LOGO} alt="Kalam" className="h-14 w-auto" />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              data-testid="nav-home-link"
              className={`font-bold text-base transition-colors hover:text-[#F57B2C] ${isActive("/") ? "text-[#F57B2C]" : "text-[#4A3556]"}`}
            >
              Home
            </Link>
            <Link
              to="/products"
              data-testid="nav-products-link"
              className={`font-bold text-base transition-colors hover:text-[#F57B2C] ${isActive("/products") ? "text-[#F57B2C]" : "text-[#4A3556]"}`}
            >
              Shop
            </Link>
          </div>

          {/* Cart + Mobile Toggle */}
          <div className="flex items-center gap-4">
            <Link
              to="/cart"
              data-testid="nav-cart-button"
              className="relative p-2 rounded-full hover:bg-orange-50 transition-colors"
            >
              <ShoppingCart size={24} className="text-[#4A3556]" />
              {cartCount > 0 && (
                <span
                  data-testid="nav-cart-count"
                  className="absolute -top-1 -right-1 bg-[#F57B2C] text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center"
                >
                  {cartCount}
                </span>
              )}
            </Link>
            <button
              className="md:hidden p-2 text-[#4A3556]"
              onClick={() => setMobileOpen(!mobileOpen)}
              data-testid="mobile-menu-toggle"
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 flex flex-col gap-4">
          <Link to="/" onClick={() => setMobileOpen(false)} className="font-bold text-[#4A3556] hover:text-[#F57B2C]">Home</Link>
          <Link to="/products" onClick={() => setMobileOpen(false)} className="font-bold text-[#4A3556] hover:text-[#F57B2C]">Shop</Link>
          <Link to="/cart" onClick={() => setMobileOpen(false)} className="font-bold text-[#4A3556] hover:text-[#F57B2C]">Cart ({cartCount})</Link>
        </div>
      )}
    </nav>
  );
}
