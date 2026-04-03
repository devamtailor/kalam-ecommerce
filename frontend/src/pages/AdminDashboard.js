import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Edit, Trash2, LogOut, Package, BookOpen, RefreshCw, X, Save } from "lucide-react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const LOGO = "https://customer-assets.emergentagent.com/job_cd5f40a9-651f-4209-9bc2-941d75259399/artifacts/96wkl9n0_Untitled%20design%20%2814%29.png";

const STATUS_COLORS = {
  pending: "bg-yellow-100 text-yellow-700",
  processing: "bg-blue-100 text-blue-700",
  shipped: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

const EMPTY_FORM = { title: "", description: "", price: "", image_url: "", age_range: "3-8 years", pages_count: "48", category: "colouring-book", is_active: true };

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { token, logout } = useAuth();
  const [tab, setTab] = useState("products");
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  const authHeaders = { Authorization: `Bearer ${token}` };

  const fetchProducts = useCallback(async () => {
    try {
      const { data } = await axios.get(`${API}/products/all`, { headers: authHeaders });
      setProducts(data);
    } catch (e) {
      if (e.response?.status === 401) { logout(); navigate("/adminkalam"); }
    }
  }, [authHeaders, logout, navigate]);

  const fetchOrders = useCallback(async () => {
    try {
      const { data } = await axios.get(`${API}/orders`, { headers: authHeaders });
      setOrders(data);
    } catch (e) {
      if (e.response?.status === 401) { logout(); navigate("/adminkalam"); }
    }
  }, [authHeaders, logout, navigate]);

 useEffect(() => {
  if (!token) {
    navigate("/adminkalam");
    return;
  }

  Promise.all([fetchProducts(), fetchOrders()])
    .finally(() => setLoading(false));

}, [token, navigate, fetchProducts, fetchOrders]);
  const handleLogout = () => { logout(); navigate("/adminkalam"); };

  const openAddForm = () => { setEditingId(null); setForm(EMPTY_FORM); setFormError(""); setShowForm(true); };
  const openEditForm = (p) => { setEditingId(p.id); setForm({ title: p.title, description: p.description, price: String(p.price), image_url: p.image_url, age_range: p.age_range, pages_count: String(p.pages_count), category: p.category, is_active: p.is_active }); setFormError(""); setShowForm(true); };

  const handleSaveProduct = async () => {
    if (!form.title || !form.price || !form.image_url) { setFormError("Title, price, and image URL are required."); return; }
    setSaving(true);
    setFormError("");
    try {
      const payload = { ...form, price: parseFloat(form.price), pages_count: parseInt(form.pages_count) };
      if (editingId) {
        await axios.put(`${API}/products/${editingId}`, payload, { headers: authHeaders });
      } else {
        await axios.post(`${API}/products`, payload, { headers: authHeaders });
      }
      setShowForm(false);
      await fetchProducts();
    } catch (e) {
      setFormError(e.response?.data?.detail || "Failed to save product.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await axios.delete(`${API}/products/${id}`, { headers: authHeaders });
      await fetchProducts();
    } catch { alert("Failed to delete product."); }
  };

  const handleStatusChange = async (orderId, status) => {
    try {
      await axios.put(`${API}/orders/${orderId}/status`, { status }, { headers: authHeaders });
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
    } catch { alert("Failed to update status."); }
  };

  const inputCls = "w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2DAEBB] text-[#4A3556]";

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#F9FAFB" }}>
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#F57B2C] border-t-transparent" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F9FAFB]" data-testid="admin-dashboard">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <img src={LOGO} alt="Kalam" className="h-10 w-auto" />
            <div>
              <p className="font-bold text-[#8A6A9F] text-sm" style={{ fontFamily: "'Fredoka', sans-serif" }}>Admin Panel</p>
            </div>
          </div>
          <button data-testid="logout-button" onClick={handleLogout} className="flex items-center gap-2 text-[#4A3556]/60 hover:text-red-500 font-semibold text-sm transition-colors px-3 py-2 rounded-xl hover:bg-red-50">
            <LogOut size={16} /> Logout
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-6 bg-white rounded-2xl p-1 w-fit shadow-sm border border-gray-100">
          {[
            { key: "products", label: "Products", icon: <BookOpen size={16} />, count: products.length },
            { key: "orders", label: "Orders", icon: <Package size={16} />, count: orders.length },
          ].map(t => (
            <button
              key={t.key}
              data-testid={`${t.key}-tab`}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${tab === t.key ? "bg-[#F57B2C] text-white shadow-sm" : "text-[#4A3556]/60 hover:text-[#4A3556]"}`}
            >
              {t.icon} {t.label}
              <span className={`text-xs rounded-full px-1.5 py-0.5 ${tab === t.key ? "bg-white/20" : "bg-gray-100"}`}>{t.count}</span>
            </button>
          ))}
        </div>

        {/* Products Tab */}
        {tab === "products" && (
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-2xl font-bold text-[#8A6A9F]" style={{ fontFamily: "'Fredoka', sans-serif" }}>Products</h2>
              <div className="flex gap-2">
                <button onClick={fetchProducts} className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-[#4A3556]/60 transition-colors"><RefreshCw size={16} /></button>
                <button data-testid="add-product-button" onClick={openAddForm} className="flex items-center gap-2 bg-[#F57B2C] text-white rounded-xl px-4 py-2 font-bold text-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
                  <Plus size={16} /> Add Product
                </button>
              </div>
            </div>

            <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100 bg-[#F9FAFB]">
                      {["Image", "Title", "Price", "Age Range", "Pages", "Status", "Actions"].map(h => (
                        <th key={h} className="text-left px-5 py-3 text-xs font-bold text-[#4A3556]/60 uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {products.map(p => (
                      <tr key={p.id} className="hover:bg-[#F9FAFB] transition-colors">
                        <td className="px-5 py-4"><img src={p.image_url} alt={p.title} className="w-12 h-12 object-cover rounded-xl" onError={(e) => { e.target.src = "https://via.placeholder.com/50?text=Book"; }} /></td>
                        <td className="px-5 py-4 font-semibold text-[#4A3556] text-sm max-w-[200px] truncate" data-testid={`product-title-${p.id}`}>{p.title}</td>
                        <td className="px-5 py-4 font-bold text-[#F57B2C]">₹{p.price}</td>
                        <td className="px-5 py-4 text-sm text-[#4A3556]/70">{p.age_range}</td>
                        <td className="px-5 py-4 text-sm text-[#4A3556]/70">{p.pages_count}</td>
                        <td className="px-5 py-4">
                          <span className={`text-xs font-bold rounded-full px-2.5 py-1 ${p.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                            {p.is_active ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex gap-2">
                            <button data-testid={`product-edit-button-${p.id}`} onClick={() => openEditForm(p)} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-500 transition-colors"><Edit size={15} /></button>
                            <button data-testid={`product-delete-button-${p.id}`} onClick={() => handleDeleteProduct(p.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors"><Trash2 size={15} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {products.length === 0 && (
                      <tr><td colSpan={7} className="px-5 py-10 text-center text-[#4A3556]/40 text-sm">No products yet. Add your first product!</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {tab === "orders" && (
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-2xl font-bold text-[#8A6A9F]" style={{ fontFamily: "'Fredoka', sans-serif" }}>Orders</h2>
              <button onClick={fetchOrders} className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-[#4A3556]/60 transition-colors"><RefreshCw size={16} /></button>
            </div>

            <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100 bg-[#F9FAFB]">
                      {["Order #", "Customer", "Phone", "Items", "Total", "Date", "Status"].map(h => (
                        <th key={h} className="text-left px-5 py-3 text-xs font-bold text-[#4A3556]/60 uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {orders.map(o => (
                      <tr key={o.id} className="hover:bg-[#F9FAFB] transition-colors">
                        <td className="px-5 py-4 font-bold text-[#8A6A9F] text-sm">{o.order_number}</td>
                        <td className="px-5 py-4 text-sm text-[#4A3556] font-semibold">{o.customer_name}</td>
                        <td className="px-5 py-4 text-sm text-[#4A3556]/70">{o.customer_phone}</td>
                        <td className="px-5 py-4 text-sm text-[#4A3556]/70">{o.items?.length || 0} item{(o.items?.length || 0) !== 1 ? "s" : ""}</td>
                        <td className="px-5 py-4 font-bold text-[#F57B2C]">₹{o.total_amount}</td>
                        <td className="px-5 py-4 text-xs text-[#4A3556]/50">{new Date(o.created_at).toLocaleDateString("en-IN")}</td>
                        <td className="px-5 py-4">
                          <select
                            data-testid={`order-status-select-${o.id}`}
                            value={o.status}
                            onChange={e => handleStatusChange(o.id, e.target.value)}
                            className={`text-xs font-bold rounded-full px-3 py-1.5 border-0 focus:outline-none cursor-pointer ${STATUS_COLORS[o.status] || "bg-gray-100 text-gray-600"}`}
                          >
                            {["pending", "processing", "shipped", "delivered", "cancelled"].map(s => (
                              <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    ))}
                    {orders.length === 0 && (
                      <tr><td colSpan={7} className="px-5 py-10 text-center text-[#4A3556]/40 text-sm">No orders yet.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Product Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ background: "rgba(0,0,0,0.4)" }} data-testid="product-form-modal">
          <div className="bg-white rounded-[28px] shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-[#8A6A9F]" style={{ fontFamily: "'Fredoka', sans-serif" }}>
                {editingId ? "Edit Product" : "Add New Product"}
              </h2>
              <button onClick={() => setShowForm(false)} className="p-2 rounded-xl hover:bg-gray-100 text-[#4A3556]/60" data-testid="close-form-modal"><X size={20} /></button>
            </div>

            <div className="space-y-4">
              {[
                { label: "Title *", key: "title", type: "text", placeholder: "e.g. Jungle To-Do Colouring Book" },
                { label: "Image URL *", key: "image_url", type: "url", placeholder: "https://..." },
                { label: "Age Range", key: "age_range", type: "text", placeholder: "e.g. 4-8 years" },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-sm font-semibold text-[#4A3556] mb-1">{f.label}</label>
                  <input data-testid={`product-form-${f.key}`} type={f.type} value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} placeholder={f.placeholder} className={inputCls} />
                </div>
              ))}

              <div>
                <label className="block text-sm font-semibold text-[#4A3556] mb-1">Description</label>
                <textarea data-testid="product-form-description" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={3} placeholder="Book description..." className={`${inputCls} resize-none`} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[#4A3556] mb-1">Price (₹) *</label>
                  <input data-testid="product-form-price" type="number" value={form.price} onChange={e => setForm(p => ({ ...p, price: e.target.value }))} placeholder="299" className={inputCls} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#4A3556] mb-1">Pages Count</label>
                  <input data-testid="product-form-pages" type="number" value={form.pages_count} onChange={e => setForm(p => ({ ...p, pages_count: e.target.value }))} placeholder="48" className={inputCls} />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input data-testid="product-form-active" type="checkbox" id="is_active" checked={form.is_active} onChange={e => setForm(p => ({ ...p, is_active: e.target.checked }))} className="w-4 h-4 accent-[#F57B2C]" />
                <label htmlFor="is_active" className="text-sm font-semibold text-[#4A3556]">Active (visible in store)</label>
              </div>

              {formError && <p className="text-red-500 text-sm bg-red-50 rounded-xl px-4 py-2">{formError}</p>}

              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowForm(false)} className="flex-1 border-2 border-gray-200 text-[#4A3556]/70 rounded-full py-3 font-bold hover:bg-gray-50 transition-colors">Cancel</button>
                <button data-testid="save-product-button" onClick={handleSaveProduct} disabled={saving} className="flex-1 flex items-center justify-center gap-2 bg-[#F57B2C] text-white rounded-full py-3 font-bold hover:-translate-y-0.5 hover:shadow-md transition-all disabled:opacity-60">
                  <Save size={16} /> {saving ? "Saving..." : "Save Product"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
