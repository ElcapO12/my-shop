// src/pages/ProductPage.jsx
import React from "react";

import ProductReviews from "../components/ProductReviews.jsx";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import ProductGallery from "../components/ProductGallery.jsx";
import ProductInfo from "../components/ProductInfo.jsx";
import ProductDetails from "../components/ProductDetails.jsx";
import ProductFAQ from "../components/ProductFAQ.jsx";
import SimilarProducts from "../components/SimilarProducts.jsx";
import TrustBadges from "../components/TrustBadges.jsx";


import similarProducts from "../data/similarProducts.js";
import product from "../data/product.js";

export default function ProductPage() {
  const { images, description, specs, sizeGuide } = product;

  return (
    <div className="page-wrapper">
      <Header />

      <main className="container">
        {/* بالا: گالری و اطلاعات کلی محصول */}
        <div className="product-layout">
          <ProductGallery images={images} />
          <ProductInfo product={product} />
        </div>
        <TrustBadges />

        {/* پایین: توضیحات و مشخصات */}
        <ProductDetails
          description={description}
          specs={specs}
          sizeGuide={sizeGuide}
        />

        <ProductFAQ items={product.faqs || []} />
        <ProductReviews />
        <SimilarProducts items={similarProducts} />
      </main>

      <Footer />
    </div>
  );
}