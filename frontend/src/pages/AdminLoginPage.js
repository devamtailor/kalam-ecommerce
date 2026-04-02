import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Mail, Eye, EyeOff } from "lucide-react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const LOGO = "https://customer-assets.emergentagent.com/job_cd5f40a9-651f-4209-9bc2-941d75259399/artifacts/96wkl9n0_Untitled%20design%20%2814%29.png";

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const { login, token } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) navigate("/adminkalam/dashboard");
  }, [token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) { setError("Please enter email and password."); return; }
    setLoading(true);
    setError("");
    try {
      const { data } = await axios.post(`${API}/auth/login`, { email, password });
      login(data.token, { email: data.email, name: data.name });
      navigate("/adminkalam/dashboard");
    } catch (err) {
      const detail = err.response?.data?.detail;
      setError(typeof detail === "string" ? detail : "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "linear-gradient(135deg, #2390B6 0%, #2DAEBB 100%)" }}>
      <div className="bg-white rounded-[32px] shadow-2xl p-8 w-full max-w-md" data-testid="admin-login-card">
        <div className="text-center mb-8">
          <img src={LOGO} alt="Kalam" className="h-20 w-auto mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-[#8A6A9F]" style={{ fontFamily: "'Fredoka', sans-serif" }}>Admin Panel</h1>
          <p className="text-[#4A3556]/60 text-sm mt-1">Sign in to manage your store</p>
        </div>

        <form onSubmit={handleSubmit} data-testid="admin-login-form" className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-[#4A3556] mb-2">Email Address</label>
            <div className="relative">
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                data-testid="admin-email-input"
                type="email"
                value={email}
                onChange={e => { setEmail(e.target.value); setError(""); }}
                placeholder="admin@kalambooks.com"
                className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#2DAEBB] text-[#4A3556]"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#4A3556] mb-2">Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                data-testid="admin-password-input"
                type={showPwd ? "text" : "password"}
                value={password}
                onChange={e => { setPassword(e.target.value); setError(""); }}
                placeholder="Enter password"
                className="w-full pl-11 pr-12 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#2DAEBB] text-[#4A3556]"
              />
              <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#4A3556]">
                {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-2xl px-4 py-3 text-red-600 text-sm" data-testid="admin-login-error">
              {error}
            </div>
          )}

          <button
            type="submit"
            data-testid="admin-login-button"
            disabled={loading}
            className="w-full bg-[#F57B2C] text-white rounded-full py-4 font-bold hover:-translate-y-1 hover:shadow-lg transition-all duration-200 disabled:opacity-60"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-xs text-[#4A3556]/40 mt-6">Kalam Admin — Authorized Access Only</p>
      </div>
    </div>
  );
}
