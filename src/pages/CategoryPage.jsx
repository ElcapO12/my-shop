// src/pages/CategoryPage.jsx  –  صفحهٔ مخصوص هر دسته‌بندی (/category/:slug)
import React from "react";
import { Navigate, useParams } from "react-router-dom";
import ProductListing from "../components/ProductListing.jsx";
import { CATEGORY_PAGES } from "../data/products.js";

export default function CategoryPage() {
  const { slug } = useParams();
  const category = CATEGORY_PAGES[slug];

  if (!category) return <Navigate to="/products" replace />;
  return <ProductListing category={category} />;
}
