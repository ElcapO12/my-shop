// src/components/ProductInfo.jsx
import React, { useCallback, useState } from "react";
import { useCart } from "../context/CartContext.jsx";

// تابع فرمت قیمت
function formatPrice(num) {
  return `${num.toLocaleString("fa-IR")} تومان`;
}

export default function ProductInfo({ product }) {
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [qty, setQty] = useState(1);

  const { addItem, openCart } = useCart();

  const increase = useCallback(() => setQty((q) => q + 1), []);
  const decrease = useCallback(() => setQty((q) => (q > 1 ? q - 1 : 1)), []);

  const handleAddToCart = useCallback(() => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images?.[0],
      color: selectedColor,
      size: selectedSize,
      quantity: qty,
    });

    openCart();
    alert("محصول به سبد خرید اضافه شد.");
  }, [addItem, openCart, product, selectedColor, selectedSize, qty]);

  return (
    <section className="product-info">
      <div className="product-badge">✦ انتخاب ویژه پارس‌کفش</div>
      <nav className="breadcrumb">خانه / دمپایی / {product.name}</nav>

      <h1 className="product-title">{product.name}</h1>

      <div className="product-rating">
        <span>★★★★★</span>
        <span className="rating-score">{product.rating}</span>
        <span className="rating-count">({product.ratingCount} نظر)</span>
      </div>

      <div className="product-price-box">
        <span className="product-price">{formatPrice(product.price)}</span>
        <span className="product-discount">{product.discountPercent}% تخفیف</span>
        <span className="product-old-price">{formatPrice(product.oldPrice)}</span>
      </div>

      <p className="product-description">{product.description}</p>

      {/* رنگ‌ها */}
      <div className="product-section">
        <span className="label">رنگ:</span>
        <div className="color-list">
          {product.colors.map((color) => {
            const isActive = color === selectedColor;

            return (
              <button
                key={color}
                className={`color-circle ${
                  isActive ? "color-circle--active" : ""
                }`}
                style={{ backgroundColor: color }}
                onClick={() => setSelectedColor(color)}
              />
            );
          })}
        </div>
      </div>

      {/* سایزها */}
      <div className="product-section">
        <span className="label">سایز:</span>
        <div className="size-list">
          {product.sizes.map((size) => {
            const isActive = size === selectedSize;

            return (
              <button
                key={size}
                className={`size-item ${isActive ? "size-item--active" : ""}`}
                onClick={() => setSelectedSize(size)}
              >
                {size}
              </button>
            );
          })}
        </div>
      </div>

      {/* تعداد و دکمه افزودن به سبد */}
      <div className="product-actions">
        <div className="qty-control">
          <button onClick={decrease}>−</button>
          <span>{qty}</span>
          <button onClick={increase}>+</button>
        </div>

        <button className="add-to-cart" onClick={handleAddToCart}>
          افزودن به سبد خرید
        </button>
      </div>
    </section>
  );
}