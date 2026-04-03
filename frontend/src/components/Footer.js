import React from "react";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";

const LOGO = "https://customer-assets.emergentagent.com/job_cd5f40a9-651f-4209-9bc2-941d75259399/artifacts/96wkl9n0_Untitled%20design%20%2814%29.png";

export default function Footer() {
  return (
    <footer style={{ backgroundColor: "#2390B6" }} className="text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <img src={LOGO} alt="Kalam" className="h-20 w-auto mb-4 brightness-0 invert" />
            <p className="text-white/80 text-sm leading-relaxed">
              Sparking creativity in every child through fun, educational To-Do Colouring Books.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4" style={{ fontFamily: "'Fredoka', sans-serif" }}>Quick Links</h3>
            <div className="flex flex-col gap-2">
              <Link to="/" className="text-white/80 hover:text-[#FBD40B] transition-colors text-sm">Home</Link>
              <Link to="/products" className="text-white/80 hover:text-[#FBD40B] transition-colors text-sm">Shop All Books</Link>
              <Link to="/cart" className="text-white/80 hover:text-[#FBD40B] transition-colors text-sm">My Cart</Link>
            </div>
          </div>

          {/* Info */}
          <div>
            <h3 className="font-bold text-lg mb-4" style={{ fontFamily: "'Fredoka', sans-serif" }}>We Promise</h3>
            <div className="flex flex-col gap-2 text-white/80 text-sm">
              <span>Child-safe, non-toxic materials</span>
              <span>Free shipping on orders above ₹499</span>
              <span>Easy 7-day returns</span>
              <span>Cash on Delivery available</span>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-white/60 text-sm">
          <span>&copy; {new Date().getFullYear()} Kalam Children's Colour Books. All rights reserved.</span>
          <span className="flex items-center gap-1">Made with <Heart size={14} className="text-[#FBD40B] fill-current" /> for little artists</span>
        </div>
      </div>
    </footer>
  );
}
