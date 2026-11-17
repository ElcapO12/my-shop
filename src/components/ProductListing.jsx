// src/components/ProductListing.jsx
// فهرست محصولات مشترک بین «همهٔ محصولات» و «صفحهٔ هر دسته‌بندی»
// اگر prop به نام category داده شود، فقط محصولات همان دسته نمایش داده می‌شود.

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import ProductCard from "./ProductCard.jsx";
import { PRODUCTS, CATEGORY_LIST } from "../data/products.js";
import "../styles/products-page.css";

/* ============================================================
   DATA  (این بخش را بعداً به API / فایل دادهٔ خودتان وصل کنید)
   category: "men" | "women"   –   sold: برای مرتب‌سازی «پرفروش‌ترین»
   ============================================================ */


const CATEGORY_OPTIONS = [
  { id: "women", label: "زنانه" },
  { id: "men", label: "مردانه" },
];

const SIZE_OPTIONS = [40, 41, 42, 43, 44, 45, 46];

const COLOR_OPTIONS = [
  { id: "black", label: "مشکی", hex: "#14201a" },
  { id: "white", label: "سفید", hex: "#ffffff" },
  { id: "gray", label: "طوسی", hex: "#9ca3a0" },
  { id: "blue", label: "آبی", hex: "#1f5fd6" },
  { id: "navy", label: "سرمه‌ای", hex: "#13245a" },
  { id: "yellow", label: "زرد", hex: "#f2a900" },
  { id: "orange", label: "نارنجی", hex: "#f27a0c" },
];

const SORT_OPTIONS = [
  { id: "best", label: "پرفروش‌ترین" },
  { id: "newest", label: "جدیدترین" },
  { id: "cheap", label: "ارزان‌ترین" },
  { id: "expensive", label: "گران‌ترین" },
  { id: "rating", label: "بیشترین امتیاز" },
];

const COLOR_LABEL = Object.fromEntries(COLOR_OPTIONS.map((c) => [c.id, c]));

const PRICE_MIN = 1000000;
const PRICE_MAX = 4000000;
const PRICE_STEP = 50000;
const WISHLIST_KEY = "parskafsh:wishlist";

/* ============================================================
   HELPERS
   ============================================================ */

const fa = (n) => Number(n).toLocaleString("fa-IR");
const formatPrice = (v) => `${fa(v)} تومان`;
const formatRating = (v) =>
  Number(v).toLocaleString("fa-IR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const discountPercent = (price, oldPrice) => Math.round(((oldPrice - price) / oldPrice) * 100);

function hideBrokenImage(e) {
  e.currentTarget.style.visibility = "hidden";
}

function readWishlist() {
  try {
    const parsed = JSON.parse(localStorage.getItem(WISHLIST_KEY) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

const toggleInList = (list, value) =>
  list.includes(value) ? list.filter((x) => x !== value) : [...list, value];

/* ============================================================
   ICONS
   ============================================================ */

const sv = { viewBox: "0 0 24 24", fill: "none", "aria-hidden": "true" };
const ln = { stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round", strokeLinejoin: "round" };

const IconFilter = () => (
  <svg {...sv} width="22" height="22"><path d="M4 5h16l-6 7.500V19l-4-2v-4.500L4 5Z" fill="currentColor" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" /></svg>
);
const IconWallet = () => (
  <svg {...sv} width="20" height="20"><rect x="3" y="6" width="18" height="13" rx="3" {...ln} /><path d="M3 10h18M16.500 14.500h.01" {...ln} /></svg>
);
const IconGrid4 = () => (
  <svg {...sv} width="20" height="20" fill="currentColor"><rect x="3.500" y="3.500" width="7" height="7" rx="1.800" /><rect x="13.500" y="3.500" width="7" height="7" rx="1.800" /><rect x="3.500" y="13.500" width="7" height="7" rx="1.800" /><rect x="13.500" y="13.500" width="7" height="7" rx="1.800" /></svg>
);
const IconRuler = () => (
  <svg {...sv} width="20" height="20"><path d="M4 16.500 16.500 4l3.500 3.500L7.500 20 4 16.500Z" {...ln} /><path d="m8 12 2 2m1-5 2 2m1-5 2 2" {...ln} /></svg>
);
const IconPalette = () => (
  <svg {...sv} width="20" height="20"><path d="M12 3a9 9 0 1 0 0 18c1.400 0 2-.900 2-1.800 0-1.200-1-1.500-1-2.700 0-1 .800-1.700 1.800-1.700H17a4 4 0 0 0 4-4C21 6.300 17 3 12 3Z" fill="currentColor" /><circle cx="8" cy="11" r="1.200" fill="#fff" /><circle cx="11" cy="7.500" r="1.200" fill="#fff" /><circle cx="15.500" cy="8.500" r="1.200" fill="#fff" /></svg>
);
const IconCheckCircle = () => (
  <svg {...sv} width="22" height="22"><circle cx="12" cy="12" r="10" fill="currentColor" /><path d="m7.500 12.300 3 3 6-6.300" stroke="#fff" strokeWidth="2.200" strokeLinecap="round" strokeLinejoin="round" /></svg>
);
const IconTrash = () => (
  <svg {...sv} width="18" height="18"><path d="M4 7h16M9 7V4.500h6V7m-8 0 .800 12.500h8.400L17 7M10 11v5m4-5v5" {...ln} /></svg>
);
const IconArrowLeft = () => (
  <svg {...sv} width="18" height="18"><path d="M14 6l-6 6 6 6" {...ln} strokeWidth="2" /></svg>
);
const IconList = () => (
  <svg {...sv} width="20" height="20"><path d="M9 6h11M9 12h11M9 18h11" {...ln} strokeWidth="2.200" /><circle cx="4.500" cy="6" r="1.300" fill="currentColor" /><circle cx="4.500" cy="12" r="1.300" fill="currentColor" /><circle cx="4.500" cy="18" r="1.300" fill="currentColor" /></svg>
);
const IconBox = () => (
  <svg {...sv} width="18" height="18"><path d="M12 3 20 7.500v9L12 21l-8-4.500v-9L12 3Zm0 9 8-4.500M12 12v9M12 12 4 7.500" {...ln} /></svg>
);
const IconChevron = () => (
  <svg {...sv} width="16" height="16"><path d="m6 9 6 6 6-6" {...ln} strokeWidth="2" /></svg>
);
const IconClose = () => (
  <svg {...sv} width="18" height="18"><path d="M6 6l12 12M18 6 6 18" {...ln} strokeWidth="2" /></svg>
);

/* ============================================================
   PARTS
   ============================================================ */

function PriceRange({ min, max, onChange }) {
  const span = PRICE_MAX - PRICE_MIN;
  const startPct = ((min - PRICE_MIN) / span) * 100;
  const endPct = ((max - PRICE_MIN) / span) * 100;

  return (
    <div className="pl-range">
      <div className="pl-range-track" aria-hidden="true">
        <span className="pl-range-fill" style={{ insetInlineStart: `${startPct}%`, insetInlineEnd: `${100 - endPct}%` }} />
      </div>

      <input
        type="range"
        min={PRICE_MIN}
        max={PRICE_MAX}
        step={PRICE_STEP}
        value={min}
        aria-label="حداقل قیمت"
        onChange={(e) => onChange(Math.min(Number(e.target.value), max - PRICE_STEP), max)}
      />
      <input
        type="range"
        min={PRICE_MIN}
        max={PRICE_MAX}
        step={PRICE_STEP}
        value={max}
        aria-label="حداکثر قیمت"
        onChange={(e) => onChange(min, Math.max(Number(e.target.value), min + PRICE_STEP))}
      />
    </div>
  );
}

function FilterPanel({ filters, setFilters, onClear, open, onClose, hideCategories }) {
  const { priceMin, priceMax, categories, sizes, colors, onlyInStock } = filters;
  const patch = (next) => setFilters((prev) => ({ ...prev, ...next }));

  return (
    <aside className={`pl-filters${open ? " is-open" : ""}`} aria-label="فیلتر محصولات">
      <div className="pl-filters-head">
        <IconFilter />
        <h2>فیلتر محصولات</h2>
        <button type="button" className="pl-filters-close" onClick={onClose} aria-label="بستن فیلترها">
          <IconClose />
        </button>
      </div>

      <div className="pl-filters-body">
        {/* قیمت */}
        <section className="pl-fgroup">
          <h3><IconWallet /> بازه قیمت</h3>
          <PriceRange min={priceMin} max={priceMax} onChange={(a, b) => patch({ priceMin: a, priceMax: b })} />
          <p className="pl-range-label">
            {fa(priceMin)} – {fa(priceMax)} تومان
          </p>
        </section>

        {!hideCategories && (
          <>
        {/* دسته‌بندی */}
        <section className="pl-fgroup">
          <h3><IconGrid4 /> دسته‌بندی</h3>
          {CATEGORY_OPTIONS.map((c) => (
            <label key={c.id} className="pl-check">
              <span>{c.label}</span>
              <input type="checkbox" checked={categories.includes(c.id)} onChange={() => patch({ categories: toggleInList(categories, c.id) })} />
              <i aria-hidden="true" />
            </label>
          ))}
        </section>

          </>
        )}

        {/* سایز */}
        <section className="pl-fgroup">
          <h3><IconRuler /> سایز</h3>
          <div className="pl-sizes">
            {SIZE_OPTIONS.map((s) => (
              <button
                key={s}
                type="button"
                className={sizes.includes(s) ? "is-on" : ""}
                aria-pressed={sizes.includes(s)}
                onClick={() => patch({ sizes: toggleInList(sizes, s) })}
              >
                {fa(s)}
              </button>
            ))}
          </div>
        </section>

        {/* رنگ */}
        <section className="pl-fgroup">
          <h3><IconPalette /> رنگ</h3>
          <div className="pl-colors">
            {COLOR_OPTIONS.map((c) => (
              <button
                key={c.id}
                type="button"
                className={colors.includes(c.id) ? "is-on" : ""}
                style={{ "--swatch": c.hex }}
                aria-pressed={colors.includes(c.id)}
                aria-label={c.label}
                title={c.label}
                onClick={() => patch({ colors: toggleInList(colors, c.id) })}
              />
            ))}
          </div>
        </section>

        {/* موجودی */}
        <section className="pl-fgroup">
          <h3><IconCheckCircle /> وضعیت موجودی</h3>
          <label className="pl-check">
            <span>فقط کالاهای موجود</span>
            <input type="checkbox" checked={onlyInStock} onChange={(e) => patch({ onlyInStock: e.target.checked })} />
            <i aria-hidden="true" />
          </label>
        </section>

        <button type="button" className="pl-clear" onClick={onClear}>
          <IconTrash />
          حذف همه فیلترها
        </button>
      </div>
    </aside>
  );
}

function ActiveChips({ filters, setFilters, onClear }) {
  const chips = [];
  if (filters.priceMin !== PRICE_MIN || filters.priceMax !== PRICE_MAX) {
    chips.push({ key: "price", label: `${fa(filters.priceMin)} تا ${fa(filters.priceMax)} تومان`, remove: () => setFilters((f) => ({ ...f, priceMin: PRICE_MIN, priceMax: PRICE_MAX })) });
  }
  filters.categories.forEach((c) => chips.push({ key: `c-${c}`, label: CATEGORY_OPTIONS.find((o) => o.id === c)?.label, remove: () => setFilters((f) => ({ ...f, categories: f.categories.filter((x) => x !== c) })) }));
  filters.sizes.forEach((z) => chips.push({ key: `s-${z}`, label: `سایز ${fa(z)}`, remove: () => setFilters((f) => ({ ...f, sizes: f.sizes.filter((x) => x !== z) })) }));
  filters.colors.forEach((c) => chips.push({ key: `k-${c}`, label: `رنگ ${COLOR_LABEL[c].label}`, remove: () => setFilters((f) => ({ ...f, colors: f.colors.filter((x) => x !== c) })) }));
  if (filters.onlyInStock) chips.push({ key: "stock", label: "فقط موجود", remove: () => setFilters((f) => ({ ...f, onlyInStock: false })) });

  if (!chips.length) return null;
  return (
    <div className="pl-chips" aria-label="فیلترهای فعال">
      {chips.map((c) => (
        <button key={c.key} type="button" className="pl-chip" onClick={c.remove} aria-label={`حذف فیلتر ${c.label}`}>
          {c.label}
          <IconClose />
        </button>
      ))}
      <button type="button" className="pl-chips-clear" onClick={onClear}>پاک کردن همه</button>
    </div>
  );
}

/* ============================================================
   PAGE
   ============================================================ */

const DEFAULT_FILTERS = {
  priceMin: PRICE_MIN,
  priceMax: PRICE_MAX,
  categories: [],
  sizes: [],
  colors: [],
  onlyInStock: false,
};

export default function ProductListing({ category = null }) {
  const gridRef = useRef(null);

  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [sort, setSort] = useState("best");
  const [view, setView] = useState("grid");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [wishlist, setWishlist] = useState(readWishlist);

  useEffect(() => {
    document.title = `${category ? category.title : "محصولات"} | پارس‌کفش`;
  }, [category]);

  // با عوض شدن دسته‌بندی، فیلترها پاک شوند
  useEffect(() => {
    setFilters(DEFAULT_FILTERS);
    setSort("best");
  }, [category?.id]);

  useEffect(() => {
    try {
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
    } catch {
      /* storage may be blocked */
    }
  }, [wishlist]);

  const visible = useMemo(() => {
    const { priceMin, priceMax, categories, sizes, colors, onlyInStock } = filters;

    const base = category ? PRODUCTS.filter((p) => p.category === category.id) : PRODUCTS;

    const list = base.filter((p) => {
      if (p.price < priceMin || p.price > priceMax) return false;
      if (categories.length && !categories.includes(p.category)) return false;
      if (sizes.length && !sizes.some((s) => p.sizes.includes(s))) return false;
      if (colors.length && !colors.some((c) => p.colors.includes(c))) return false;
      if (onlyInStock && !p.inStock) return false;
      return true;
    });

    const sorters = {
      best: (a, b) => b.sold - a.sold,
      newest: (a, b) => a.createdAt - b.createdAt,
      cheap: (a, b) => a.price - b.price,
      expensive: (a, b) => b.price - a.price,
      rating: (a, b) => b.rating - a.rating,
    };
    return [...list].sort(sorters[sort]);
  }, [filters, sort, category]);

  const activeCount =
    (filters.priceMin !== PRICE_MIN || filters.priceMax !== PRICE_MAX ? 1 : 0) +
    filters.categories.length +
    filters.sizes.length +
    filters.colors.length +
    (filters.onlyInStock ? 1 : 0);

  const clearFilters = () => setFilters(DEFAULT_FILTERS);
  const categoryIsEmpty = category && !PRODUCTS.some((p) => p.category === category.id);
  const toggleWish = (id) => setWishlist((prev) => toggleInList(prev, id));

  return (
    <div className="page-wrapper">
      <Header />

      <main className="pl-page">
        <h1 className="pl-sr-only">{category ? category.title : "محصولات پارس‌کفش"}</h1>

        {category && (
          <nav className="pl-crumbs" aria-label="مسیر صفحه">
            <Link to="/">خانه</Link>
            <span aria-hidden="true">/</span>
            <Link to="/products">محصولات</Link>
            <span aria-hidden="true">/</span>
            <b aria-current="page">{category.title}</b>
          </nav>
        )}

        {/* بنر */}
        <section className="pl-hero" aria-label="بنر">
          <div className="pl-hero-text">
            <span className="pl-eyebrow">{category ? category.eyebrow : "کالکشن جدید کتونی"}</span>
            <h2>
              {category ? category.heading : "انتخاب بهترین کفش،"}
              <em> {category ? category.highlight : "با بهترین کیفیت"}</em>
            </h2>
            <p>{category ? category.text : "راحتی، استایل، اعتماد؛ مدل‌های اصل با ضمانت بازگشت."}</p>

            <div className="pl-hero-actions">
              <button type="button" className="pl-hero-cta" onClick={() => gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}>
                مشاهده همه محصولات
                <IconArrowLeft />
              </button>
              <ul className="pl-perks">
                <li>ارسال سریع</li>
                <li>ضمانت اصالت</li>
                <li>۷ روز بازگشت</li>
              </ul>
            </div>
          </div>

          <div className="pl-hero-art" aria-hidden="true">
            <span className="pl-hero-word">SHOES</span>
            <img src="/images/shoes/products-hero.png" alt="" onError={hideBrokenImage} />
          </div>
        </section>

        {category && (
          <nav className="pl-cats" aria-label="سایر دسته‌بندی‌ها">
            {CATEGORY_LIST.map((c) => (
              <Link key={c.id} to={`/category/${c.id}`} className={c.id === category.id ? "is-on" : ""} aria-current={c.id === category.id ? "page" : undefined}>
                {c.title}
              </Link>
            ))}
          </nav>
        )}

        <div className="pl-layout">
          <FilterPanel
            filters={filters}
            setFilters={setFilters}
            onClear={clearFilters}
            open={filtersOpen}
            onClose={() => setFiltersOpen(false)}
            hideCategories={Boolean(category)}
          />

          <section className="pl-results" ref={gridRef}>
            {/* نوار ابزار */}
            <div className="pl-toolbar">
              <button type="button" className="pl-filter-toggle" onClick={() => setFiltersOpen(true)}>
                <IconFilter />
                فیلترها{activeCount ? ` (${fa(activeCount)})` : ""}
              </button>

              <label className="pl-sort">
                <span>مرتب‌سازی بر اساس:</span>
                <select value={sort} onChange={(e) => setSort(e.target.value)}>
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.id} value={o.id}>{o.label}</option>
                  ))}
                </select>
                <IconChevron />
              </label>

              <span className="pl-count" role="status" aria-live="polite">
                <IconBox />
                {fa(visible.length)} محصول
              </span>

              <div className="pl-view" role="group" aria-label="نحوهٔ نمایش">
                <button type="button" className={view === "grid" ? "is-on" : ""} aria-pressed={view === "grid"} aria-label="نمای شبکه‌ای" onClick={() => setView("grid")}>
                  <IconGrid4 />
                </button>
                <button type="button" className={view === "list" ? "is-on" : ""} aria-pressed={view === "list"} aria-label="نمای لیستی" onClick={() => setView("list")}>
                  <IconList />
                </button>
              </div>
            </div>

            <ActiveChips filters={filters} setFilters={setFilters} onClear={clearFilters} />

            {/* لیست محصولات */}
            {visible.length ? (
              <div className={`pl-grid${view === "list" ? " is-list" : ""}`}>
                {visible.map((p) => (
                  <ProductCard key={p.id} product={p} wished={wishlist.includes(p.id)} onToggleWish={toggleWish} />
                ))}
              </div>
            ) : (
              <div className="pl-empty">
                {categoryIsEmpty ? (
                  <>
                    <p>هنوز محصولی در این دسته‌بندی ثبت نشده است.</p>
                    <Link to="/products" className="pl-empty-link">مشاهده همهٔ محصولات</Link>
                  </>
                ) : (
                  <>
                    <p>محصولی با این فیلترها پیدا نشد.</p>
                    <button type="button" onClick={clearFilters}>حذف همه فیلترها</button>
                  </>
                )}
              </div>
            )}
          </section>
        </div>

        {filtersOpen && <button type="button" className="pl-backdrop" onClick={() => setFiltersOpen(false)} aria-label="بستن فیلترها" />}
      </main>

      <Footer />
    </div>
  );
}
