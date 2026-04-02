import React, { useEffect, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import axios from "axios";
import ProductCard from "../components/ProductCard";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("default");

  useEffect(() => {
    axios.get(`${API}/products`)
      .then(r => setProducts(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = products
    .filter(p => p.title.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      return 0;
    });

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #2390B6 0%, #2DAEBB 100%)" }} className="py-16 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-3" style={{ fontFamily: "'Fredoka', sans-serif" }}>
            Our Colouring Books
          </h1>
          <p className="text-white/80 text-lg">Discover a world of colour and creativity for your little one</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              data-testid="products-search-input"
              type="text"
              placeholder="Search books..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-full text-[#4A3556] focus:outline-none focus:ring-2 focus:ring-[#2DAEBB] focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={18} className="text-[#8A6A9F]" />
            <select
              data-testid="products-sort-select"
              value={sort}
              onChange={e => setSort(e.target.value)}
              className="bg-white border border-gray-200 rounded-full px-4 py-3 text-[#4A3556] focus:outline-none focus:ring-2 focus:ring-[#2DAEBB] font-semibold"
            >
              <option value="default">Default</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Results count */}
        <p className="text-[#4A3556]/60 text-sm mb-6">
          {loading ? "Loading..." : `Showing ${filtered.length} book${filtered.length !== 1 ? "s" : ""}`}
        </p>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-[28px] h-80 animate-pulse" />
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" data-testid="products-grid">
            {filtered.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        ) : (
          <div className="text-center py-20 text-[#4A3556]/50">
            <BookOpenIcon />
            <p className="text-xl font-semibold mt-4">No books found</p>
            <p className="text-sm mt-1">Try a different search term</p>
          </div>
        )}
      </div>
    </div>
  );
}

function BookOpenIcon() {
  return (
    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#8A6A9F" strokeWidth="1.5" className="mx-auto opacity-30">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}
