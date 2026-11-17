// src/components/RequireAuth.jsx
// برای صفحه‌هایی که فقط کاربر واردشده باید ببیند (مثلاً پرداخت یا پروفایل)

import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function RequireAuth({ children }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return children;
}
