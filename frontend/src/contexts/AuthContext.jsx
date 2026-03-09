import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Auto login on refresh
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("adminToken");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get("/auth/profile");
        setUser(response.data.data);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const login = async (phone, password) => {
    try {
      const response = await api.post("/auth/login", {
        phone,
        password,
      });

      const { admin, token } = response.data.data;

      localStorage.setItem("adminToken", token);
      setUser(admin);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      };
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      await api.put("/auth/change-password", {
        currentPassword,
        newPassword,
      });

      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Password change failed",
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("adminToken");
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, changePassword, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);