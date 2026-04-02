import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("kalam_admin_token"));
  const [admin, setAdmin] = useState(() => {
    try {
      const saved = localStorage.getItem("kalam_admin_data");
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });

  const login = (newToken, adminData) => {
    localStorage.setItem("kalam_admin_token", newToken);
    localStorage.setItem("kalam_admin_data", JSON.stringify(adminData));
    setToken(newToken);
    setAdmin(adminData);
  };

  const logout = () => {
    localStorage.removeItem("kalam_admin_token");
    localStorage.removeItem("kalam_admin_data");
    setToken(null);
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ token, admin, login, logout, isAdmin: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
