// src/App.jsx

import React, { useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";

import HomePage from "./pages/HomePage.jsx";
import ProductsPage from "./pages/ProductsPage.jsx";
import CategoryPage from "./pages/CategoryPage.jsx";
import ProductPage from "./pages/ProductPage.jsx";
import CheckoutPage from "./pages/CheckoutPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import LogoutPage from "./pages/LogoutPage.jsx";

import ScrollToTop from "./components/ScrollToTop.jsx";
import RequireAuth from "./components/RequireAuth.jsx";

export default function App() {
  const navigate = useNavigate();

  useEffect(() => {
  const handleCheckout = () => {
    navigate("/cart");
  };

  window.addEventListener("store:checkout", handleCheckout);

  return () => {
    window.removeEventListener("store:checkout", handleCheckout);
  };
  }, [navigate]);
  return (
    <>
      <ScrollToTop />

        <Routes>
          <Route path="/" element={<HomePage />} />

          <Route path="/products" element={<ProductsPage />} />
          <Route path="/category/:slug" element={<CategoryPage />} />
          <Route path="/product/:id" element={<ProductPage />} />

          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<LoginPage />} />

          <Route path="/logout" element={<LogoutPage />} />

          {/* سبد خرید */}
          <Route path="/cart" element={<CheckoutPage />} />

          {/* تسویه حساب */}
          <Route
            path="/checkout"
            element={
              <RequireAuth>
                <CheckoutPage />
              </RequireAuth>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    </>
  );
}