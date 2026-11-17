// src/components/ProductCard.jsx
// کارت محصول مشترک بین صفحهٔ اصلی و فهرست محصولات (همان کارت فهرست محصولات)
// استایل کارت (pl-card …) در src/styles/products-page.css است.

import React from "react";
import { Link } from "react-router-dom";

const COLOR_LABEL = {
  black: { label: "مشکی", hex: "#14201a" },
  white: { label: "سفید", hex: "#ffffff" },
  gray: { label: "طوسی", hex: "#9ca3a0" },
  blue: { label: "آبی", hex: "#1f5fd6" },
  navy: { label: "سرمه‌ای", hex: "#13245a" },
  yellow: { label: "زرد", hex: "#f2a900" },
  orange: { label: "نارنجی", hex: "#f27a0c" },
};
const colorOf = (id) => COLOR_LABEL[id] || { label: id, hex: "#cfd6d1" };

const brandOf = (name) => (name.split(" ")[0].toLowerCase() === "nike" ? "Nike" : name.split(" ")[0]);

const fa = (n) => Number(n).toLocaleString("fa-IR");
const formatRating = (v) =>
  Number(v).toLocaleString("fa-IR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const discountPercent = (price, oldPrice) => Math.round(((oldPrice - price) / oldPrice) * 100);

function hideBrokenImage(e) {
  e.currentTarget.style.visibility = "hidden";
}

const sv = { viewBox: "0 0 24 24", fill: "none", "aria-hidden": "true" };
const ln = { stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round", strokeLinejoin: "round" };

const IconHeart = ({ filled }) => (
  <svg {...sv} width="19" height="19" fill={filled ? "currentColor" : "none"}>
    <path d="M12 20s-7.500-4.600-7.500-10.200A4.300 4.300 0 0 1 12 7.300a4.300 4.300 0 0 1 7.500 2.500C19.500 15.400 12 20 12 20Z" {...ln} />
  </svg>
);

const IconStar = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="#e8a33d" aria-hidden="true">
    <path d="M12 3.600l2.500 5.200 5.700.800-4.100 4 1 5.700-5.100-2.700-5.100 2.700 1-5.700-4.100-4 5.700-.800L12 3.600Z" stroke="#e8a33d" strokeWidth="1.200" strokeLinejoin="round" />
  </svg>
);

const IconArrowLeft = () => (
  <svg {...sv} width="18" height="18"><path d="M14 6l-6 6 6 6" {...ln} strokeWidth="2" /></svg>
);


export default function ProductCard({ product, wished, onToggleWish }) {

  const productUrl = `/product/${product.id}`;

  const hasOffer = product.oldPrice && product.oldPrice > product.price;
  const inStock = product.inStock !== false;
  const colors = product.colors || [];
  const sizes = product.sizes || [];

  return (
    <article className={`pl-card${inStock ? "" : " is-soldout"}`}>
      <div className="pl-card-media">
        <button
          type="button"
          className={`pl-wish${wished ? " is-on" : ""}`}
          aria-pressed={wished}
          aria-label={wished ? `حذف ${product.name} از علاقه‌مندی‌ها` : `افزودن ${product.name} به علاقه‌مندی‌ها`}
          onClick={() => onToggleWish(product.id)}
        >
          <IconHeart filled={wished} />
        </button>

        {hasOffer && <span className="pl-badge">{fa(discountPercent(product.price, product.oldPrice))}٪ تخفیف</span>}
        {!inStock && <span className="pl-soldout">ناموجود</span>}

        <Link to={productUrl}  className="pl-card-imglink" tabIndex={-1} aria-hidden="true">
          <img src={product.image} alt="" loading="lazy" onError={hideBrokenImage} />
        </Link>
      </div>

      <div className="pl-card-body">
        <span className="pl-brand">{brandOf(product.name)}</span>

        <Link to={productUrl}  className="pl-card-title" dir="auto">
          {product.name}
        </Link>

        <div className="pl-meta">
          <div className="pl-rating" aria-label={`امتیاز ${formatRating(product.rating)} از ۵`}>
            <IconStar />
            <b>{formatRating(product.rating)}</b>
            {product.reviews != null && <span>({fa(product.reviews)})</span>}
          </div>

          <div className="pl-dots" aria-label="رنگ‌های موجود">
            {colors.slice(0, 4).map((c) => (
              <i key={c} style={{ "--swatch": colorOf(c).hex }} title={colorOf(c).label} />
            ))}
          </div>
        </div>

        {sizes.length > 0 && (
          <p className="pl-sizes-line">سایز {fa(Math.min(...sizes))} تا {fa(Math.max(...sizes))}</p>
        )}

        <div className="pl-price">
          <div>
            <strong>{fa(product.price)}</strong>
            <small>تومان</small>
          </div>
          {hasOffer && <del>{fa(product.oldPrice)}</del>}
        </div>

        <Link to={productUrl}  className="pl-select">
          <span>انتخاب گزینه‌ها</span>
          <IconArrowLeft />
        </Link>
      </div>
    </article>
  );
}
