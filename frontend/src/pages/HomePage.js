import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Sparkles, BookOpen, Shield, Truck, ArrowRight } from "lucide-react";
import axios from "axios";
import ProductCard from "../components/ProductCard";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const HERO_IMG = "https://static.prod-images.emergentagent.com/jobs/cd5f40a9-651f-4209-9bc2-941d75259399/images/0ffcb8d647b026f08c6f5c59599a880d371dbb87d97c535a8f761791fb66e25c.png";
const LIFESTYLE_1 = "https://images.pexels.com/photos/33761560/pexels-photo-33761560.jpeg?auto=compress&cs=tinysrgb&w=600";
const LIFESTYLE_2 = "https://images.pexels.com/photos/7104398/pexels-photo-7104398.jpeg?auto=compress&cs=tinysrgb&w=600";

const features = [
  { icon: <BookOpen size={28} />, title: "Fun Learning", desc: "Every page combines colouring with engaging to-do tasks that build skills." },
  { icon: <Shield size={28} />, title: "100% Safe", desc: "Printed on child-safe, eco-friendly paper with non-toxic inks. Parent approved!" },
  { icon: <Truck size={28} />, title: "Fast Delivery", desc: "Delivered to your doorstep in 3-5 business days. Cash on Delivery available." },
];

export default function HomePage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get(`${API}/products`).then(r => setProducts(r.data)).catch(() => {});
  }, []);

  return (
    <div>
      {/* Hero */}
      <section
        className="relative overflow-hidden pt-16 pb-20"
        style={{ background: "linear-gradient(135deg, #2390B6 0%, #2DAEBB 100%)" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <div className="inline-flex items-center gap-2 bg-[#FBD40B] text-[#4A3556] rounded-full px-4 py-2 text-sm font-bold mb-6">
                <Sparkles size={14} /> New Collection Available!
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight" style={{ fontFamily: "'Fredoka', sans-serif" }}>
                Colour Your World with{" "}
                <span style={{ color: "#FBD40B" }}>Kalam!</span>
              </h1>
              <p className="text-lg text-white/90 mb-8 leading-relaxed">
                Fun, educational To-Do Colouring Books that spark creativity in every child.
                Learning through colour, one magical page at a time.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/products"
                  data-testid="hero-shop-now-btn"
                  className="inline-flex items-center gap-2 bg-[#F57B2C] text-white rounded-full px-8 py-4 font-bold hover:-translate-y-1 hover:shadow-lg transition-all duration-200"
                >
                  Shop Now <ArrowRight size={18} />
                </Link>
                <a
                  href="#about"
                  className="inline-flex items-center gap-2 bg-white/20 text-white rounded-full px-8 py-4 font-bold hover:-translate-y-1 hover:shadow-lg transition-all duration-200 backdrop-blur-sm"
                >
                  Learn More
                </a>
              </div>
            </div>
            <div className="flex justify-center">
              <img
                src={HERO_IMG}
                alt="Kalam Colouring Books"
                className="rounded-[32px] shadow-2xl w-full max-w-md object-cover"
                onError={(e) => { e.target.style.display = "none"; }}
              />
            </div>
          </div>
        </div>
        {/* Decorative wave */}
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-white" style={{ borderRadius: "100% 100% 0 0 / 20px 20px 0 0" }} />
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div key={i} className="bg-[#F9FAFB] rounded-[28px] p-8 border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 text-white"
                  style={{ backgroundColor: ["#F57B2C", "#2DAEBB", "#8A6A9F"][i] }}>
                  {f.icon}
                </div>
                <h3 className="font-bold text-xl text-[#8A6A9F] mb-2" style={{ fontFamily: "'Fredoka', sans-serif" }}>{f.title}</h3>
                <p className="text-[#4A3556]/70 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-[#F9FAFB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block bg-[#FBD40B] text-[#4A3556] rounded-full px-4 py-1 text-sm font-bold mb-3">Bestsellers</span>
            <h2 className="text-4xl font-bold text-[#8A6A9F]" style={{ fontFamily: "'Fredoka', sans-serif" }}>
              Our Popular Books
            </h2>
            <p className="text-[#4A3556]/70 mt-2">Every book is a new adventure waiting to be coloured!</p>
          </div>

          {products.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.slice(0, 4).map(p => <ProductCard key={p.id} product={p} />)}
              </div>
              {products.length > 4 && (
                <div className="text-center mt-10">
                  <Link
                    to="/products"
                    data-testid="view-all-products-btn"
                    className="inline-flex items-center gap-2 bg-[#2DAEBB] text-white rounded-full px-8 py-4 font-bold hover:-translate-y-1 hover:shadow-lg transition-all duration-200"
                  >
                    View All Books <ArrowRight size={18} />
                  </Link>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12 text-[#4A3556]/50">Loading products...</div>
          )}
        </div>
      </section>

      {/* About / Brand Story */}
      <section id="about" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="grid grid-cols-2 gap-4">
              <img src={LIFESTYLE_1} alt="Kids drawing" className="rounded-[24px] object-cover h-48 w-full" onError={(e) => { e.target.style.display="none"; }} />
              <img src={LIFESTYLE_2} alt="Kids colouring" className="rounded-[24px] object-cover h-48 w-full mt-8" onError={(e) => { e.target.style.display="none"; }} />
            </div>
            <div>
              <span className="inline-block bg-[#2DAEBB]/10 text-[#2DAEBB] rounded-full px-4 py-1 text-sm font-bold mb-4">Our Story</span>
              <h2 className="text-4xl font-bold text-[#8A6A9F] mb-4" style={{ fontFamily: "'Fredoka', sans-serif" }}>
                Where Colours Meet Creativity
              </h2>
              <p className="text-[#4A3556]/70 leading-relaxed mb-4">
                At Kalam, we believe every child is an artist. Our To-Do Colouring Books are crafted with love to combine the joy of colouring with educational activities that make learning fun.
              </p>
              <p className="text-[#4A3556]/70 leading-relaxed mb-6">
                From jungle adventures to space exploration, each book takes children on a unique journey that encourages creativity, focus, and imagination.
              </p>
              <Link
                to="/products"
                className="inline-flex items-center gap-2 bg-[#F57B2C] text-white rounded-full px-6 py-3 font-bold hover:-translate-y-1 hover:shadow-md transition-all duration-200"
              >
                Explore Our Books <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16" style={{ backgroundColor: "#2390B6" }}>
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <h2 className="text-4xl font-bold mb-4" style={{ fontFamily: "'Fredoka', sans-serif" }}>
            Ready to Start the Colour Journey?
          </h2>
          <p className="text-white/80 mb-8 text-lg">
            Order now and get free shipping on orders above ₹499. Cash on Delivery available!
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 bg-[#FBD40B] text-[#4A3556] rounded-full px-10 py-4 font-bold text-lg hover:-translate-y-1 hover:shadow-xl transition-all duration-200"
          >
            Shop Now <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
}
