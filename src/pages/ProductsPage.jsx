
import React from "react";
import { Navigate, useSearchParams } from "react-router-dom";
import ProductListing from "../components/ProductListing.jsx";
import { CATEGORY_PAGES } from "../data/products.js";

export default function ProductsPage() {
  const [params] = useSearchParams();
  const legacy = params.get("category");

  if (legacy && CATEGORY_PAGES[legacy]) {
    return <Navigate to={`/category/${legacy}`} replace />;
  }

  return <ProductListing />;
}
