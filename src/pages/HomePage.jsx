// src/pages/HomePage.jsx

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import ProductCard from "../components/ProductCard.jsx";
import "../styles/home-cards.css";

/* ============================================================
   DATA  (متن، قیمت و تصویرها را با اطلاعات واقعی جایگزین کنید)
   ============================================================ */

const HERO_SLIDES = [
  {
    id: "s1",
    eyebrow: "راحتی، کیفیت، ماندگاری",
    title: "دمپایی‌هایی برای",
    highlight: "هر قدم",
    text: "از طرح‌های روزمره تا مدل‌های طبی؛ انتخابی مطمئن برای تمام سلیقه‌ها.",
    cta: "مشاهده محصولات",
    to: "/products",
    image: "/images/hero-1.jpg",
  },
  {
    id: "s2",
    eyebrow: "مخصوص فصل سرما",
    title: "دمپایی‌های روفرشی",
    highlight: "گرم و نرم",
    text: "کفی نرم، پارچهٔ لطیف و دوام بالا برای روزهای سرد.",
    cta: "خرید دمپایی زنانه",
    to: "/category/women",
    image: "/images/hero-2.jpg",
  },
  {
    id: "s3",
    eyebrow: "ویژهٔ کودکان",
    title: "رنگ و شادی برای",
    highlight: "پاهای کوچک",
    text: "طرح‌های بامزه با کفی ضدلغزش و سبک.",
    cta: "خرید دمپایی بچگانه",
    to: "/category/kids",
    image: "/images/hero-3.jpg",
  },
  {
    id: "s4",
    eyebrow: "پیشنهاد ویژه",
    title: "تا ۳۲٪ تخفیف روی",
    highlight: "محصولات منتخب",
    text: "تخفیف‌ها محدود است؛ قبل از تمام شدن موجودی خرید کنید.",
    cta: "مشاهده تخفیف‌ها",
    to: "/products",
    image: "/images/hero-4.jpg",
  },
];

const CATEGORIES = [
  { id: "women", title: "دمپایی زنانه", image: "/images/cat-women.jpg", tint: "#fbe9ee" },
  { id: "men", title: "دمپایی مردانه", image: "/images/cat-men.jpg", tint: "#e8f0f7" },
  { id: "kids", title: "دمپایی بچگانه", image: "/images/cat-kids.jpg", tint: "#f8efdc" },
  { id: "sandals", title: "صندل و کفش", image: "/images/cat-sandals.jpg", tint: "#e6f1ea" },
  { id: "medical", title: "دمپایی طبی", image: "/images/cat-medical.jpg", tint: "#ece9f6" },
];

/* سایز، رنگ و تعداد نظر پیش‌فرض برای محصولات نمونه (با داده‌ی واقعی خودتان جایگزین کنید) */
const DEFAULT_SIZES = { men: [40, 41, 42, 43, 44, 45], women: [36, 37, 38, 39, 40, 41], kids: [26, 27, 28, 29, 30, 31, 32] };
const COLOR_SETS = [["black", "white"], ["navy", "white", "gray"], ["blue", "white"], ["gray", "black"], ["white", "yellow", "orange"]];
const withDetails = (list) =>
  list.map((p, i) => ({
    inStock: true,
    reviews: 40 + ((i * 37 + String(p.id).length * 11) % 110),
    sizes: DEFAULT_SIZES[p.category] || [38, 39, 40, 41, 42, 43],
    colors: COLOR_SETS[i % COLOR_SETS.length],
    ...p,
  }));

const BEST_SELLERS = withDetails([
  { id: "p1", category: "men", name: "دمپایی مردانه مدل آرش", rating: 4.7, price: 285000, image: "/images/product-1.jpg", badge: null },
  { id: "p2", category: "women", name: "دمپایی زنانه مدل نگین", rating: 4.6, price: 249000, image: "/images/product-2.jpg", badge: null },
  { id: "p3", category: "kids", name: "دمپایی بچگانه مدل خرس", rating: 4.8, price: 195000, image: "/images/product-3.jpg", badge: "ویژه امروز" },
  { id: "p4", category: "men", name: "صندل مردانه مدل هرمز", rating: 4.5, price: 369000, image: "/images/product-4.jpg", badge: null },
  { id: "p5", category: "women", name: "دمپایی زنانه مدل رز", rating: 4.7, price: 265000, image: "/images/product-5.jpg", badge: null },
  { id: "p6", category: "kids", name: "دمپایی بچگانه مدل شیر", rating: 4.6, price: 175000, image: "/images/product-6.jpg", badge: null },
  { id: "p7", category: "men", name: "دمپایی مردانه مدل پرشین", rating: 4.5, price: 299000, image: "/images/product-7.jpg", badge: null },
  { id: "p8", category: "women", name: "صندل زنانه مدل بهار", rating: 4.8, price: 349000, image: "/images/product-8.jpg", badge: null },
]);

const PRODUCT_TABS = [
  { id: "all", label: "همه" },
  { id: "men", label: "مردانه" },
  { id: "women", label: "زنانه" },
  { id: "kids", label: "بچگانه" },
];

const OFFERS = withDetails([
  { id: "o1", name: "دمپایی طبی مدل آسایش", rating: 4.6, price: 219000, oldPrice: 289000, image: "/images/offer-1.jpg" },
  { id: "o2", name: "دمپایی روفرشی مدل ابر", rating: 4.7, price: 175000, oldPrice: 245000, image: "/images/offer-2.jpg" },
  { id: "o3", name: "صندل زنانه مدل ماهور", rating: 4.4, price: 329000, oldPrice: 459000, image: "/images/offer-3.jpg" },
  { id: "o4", name: "دمپایی بچگانه مدل پاندا", rating: 4.9, price: 139000, oldPrice: 199000, image: "/images/offer-4.jpg" },
  { id: "o5", name: "دمپایی مردانه مدل آریا", rating: 4.5, price: 245000, oldPrice: 315000, image: "/images/offer-5.jpg" },
  { id: "o6", name: "صندل مردانه مدل نیلوفر", rating: 4.6, price: 289000, oldPrice: 399000, image: "/images/offer-6.jpg" },
]);

const NEW_ARRIVALS = withDetails([
  { id: "n1", name: "دمپایی مردانه مدل کاویان", rating: 4.5, price: 305000, image: "/images/new-1.jpg", badge: "جدید" },
  { id: "n2", name: "دمپایی زنانه مدل یاس", rating: 4.6, price: 259000, image: "/images/new-2.jpg", badge: "جدید" },
  { id: "n3", name: "دمپایی بچگانه مدل دلفین", rating: 4.7, price: 185000, image: "/images/new-3.jpg", badge: "جدید" },
  { id: "n4", name: "صندل مردانه مدل سهند", rating: 4.5, price: 389000, image: "/images/new-4.jpg", badge: "جدید" },
  { id: "n5", name: "دمپایی زنانه مدل سوسن", rating: 4.8, price: 275000, image: "/images/new-5.jpg", badge: "جدید" },
  { id: "n6", name: "دمپایی طبی مدل آرامش", rating: 4.7, price: 335000, image: "/images/new-6.jpg", badge: "جدید" },
]);


const BANNERS = [
  {
    id: "b1",
    variant: "dark",
    title: "دمپایی‌های روفرشی زمستانی",
    text: "گرم، نرم و بادوام",
    cta: "مشاهده مدل‌ها",
    to: "/products",
    image: "/images/banner-winter.jpg",
  },
  {
    id: "b2",
    variant: "warm",
    title: "دمپایی‌های بچگانه",
    text: "راحتی در هر قدم",
    cta: "مشاهده مدل‌ها",
    to: "/category/kids",
    image: "/images/banner-kids.jpg",
  },
];

const TRUST = [
  { id: "ship", icon: "truck", title: "ارسال سریع", sub: "به سراسر کشور" },
  { id: "pay", icon: "lock", title: "پرداخت امن", sub: "از طریق درگاه بانکی" },
  { id: "return", icon: "return", title: "۷ روز ضمانت بازگشت", sub: "در صورت عدم رضایت" },
  { id: "support", icon: "support", title: "پشتیبانی پاسخگو", sub: "راهنمایی در انتخاب سایز" },
];

const TESTIMONIALS = [
  { id: "t1", name: "مریم ر.", city: "تهران", rating: 5, text: "کیفیت دمپایی عالی بود و سایزبندی دقیق. بسته‌بندی هم مرتب رسید." },
  { id: "t2", name: "علی ک.", city: "شیراز", rating: 5, text: "کفی نرم و سبکه، بعد از چند ماه هنوز مثل روز اول سالمه." },
  { id: "t3", name: "سارا م.", city: "اصفهان", rating: 4, text: "برای بچه‌ها سفارش دادم، هم رنگ‌ها قشنگ بود هم راحت بود." },
];

const WISHLIST_KEY = "parskafsh:wishlist";

/* ============================================================
   HELPERS
   ============================================================ */

const faDigits = (n) => String(n).padStart(2, "0").replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[d]);

function hideBrokenImage(event) {
  event.currentTarget.style.display = "none";
}

function readWishlist() {
  try {
    const parsed = JSON.parse(localStorage.getItem(WISHLIST_KEY) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function secondsToMidnight() {
  const now = new Date();
  const end = new Date(now);
  end.setHours(24, 0, 0, 0);
  return Math.max(0, Math.floor((end - now) / 1000));
}

function useCountdown() {
  const [left, setLeft] = useState(secondsToMidnight);
  useEffect(() => {
    const id = setInterval(() => setLeft(secondsToMidnight()), 1000);
    return () => clearInterval(id);
  }, []);
  return { h: Math.floor(left / 3600), m: Math.floor((left % 3600) / 60), s: left % 60 };
}

/* ============================================================
   ICONS
   ============================================================ */

const svgProps = { viewBox: "0 0 24 24", fill: "none", "aria-hidden": "true" };
const line = { stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round", strokeLinejoin: "round" };

const IconArrowLeft = ({ size = 16 }) => (
  <svg {...svgProps} width={size} height={size}><path d="M14 6l-6 6 6 6" {...line} strokeWidth="1.9" /></svg>
);
const IconArrowRight = ({ size = 16 }) => (
  <svg {...svgProps} width={size} height={size}><path d="M10 6l6 6-6 6" {...line} strokeWidth="1.9" /></svg>
);
const IconStar = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="#e8a33d" aria-hidden="true">
    <path d="M12 3.600l2.5 5.2 5.7.8-4.1 4 1 5.7-5.1-2.7-5.1 2.7 1-5.7-4.1-4 5.7-.8L12 3.600Z" stroke="#e8a33d" strokeWidth="1.2" strokeLinejoin="round" />
  </svg>
);
const IconFlame = () => (
  <svg {...svgProps} width="22" height="22" fill="#e8a33d">
    <path d="M12 2.500c.5 3-1.2 4.7-2.8 6.500C7.6 10.8 6.5 12.5 6.5 14.800a5.5 5.5 0 0 0 11 0c0-2.3-1-3.8-2-5.2-.4 1.2-1 2-1.8 2.4.5-3.6-.3-7.5-1.7-9.500Z" />
  </svg>
);
const IconTruck = () => (
  <svg {...svgProps} width="26" height="26">
    <path d="M3 7h11v8H3V7Z" {...line} />
    <path d="M14 10h3.500L20 13v2h-6v-5Z" {...line} />
    <circle cx="7" cy="17.3" r="1.5" {...line} strokeWidth="1.5" />
    <circle cx="17" cy="17.3" r="1.5" {...line} strokeWidth="1.5" />
  </svg>
);
const IconLock = () => (
  <svg {...svgProps} width="26" height="26">
    <path d="M12 3l7 3v5.200c0 4.6-3 8.3-7 9.8-4-1.5-7-5.2-7-9.800V6l7-3Z" {...line} />
    <path d="M9 12.200l2 2 4-4.4" {...line} />
  </svg>
);
const IconReturn = () => (
  <svg {...svgProps} width="26" height="26">
    <path d="M4 10a8 8 0 1 1 2.2 7.2" {...line} />
    <path d="M4 5v5h5" {...line} />
  </svg>
);
const IconSupport = () => (
  <svg {...svgProps} width="26" height="26">
    <path d="M4.5 13v-1a7.5 7.5 0 0 1 15 0v1" {...line} />
    <rect x="3.5" y="12.5" width="3.5" height="5.5" rx="1.5" {...line} />
    <rect x="17" y="12.5" width="3.5" height="5.5" rx="1.5" {...line} />
    <path d="M18.5 18c0 1.5-1.5 2.5-4 2.5" {...line} />
  </svg>
);

const TRUST_ICONS = { truck: IconTruck, lock: IconLock, return: IconReturn, support: IconSupport };

/* ============================================================
   SHARED PARTS
   ============================================================ */

function SectionHead({ title, subtitle, icon, actionLabel, actionTo }) {
  return (
    <div className="hp-head">
      <div className="hp-head-text">
        <h2 className="hp-head-title">
          {title}
          {icon}
        </h2>
        <span className="hp-head-bar" aria-hidden="true" />
        {subtitle && <p>{subtitle}</p>}
      </div>

      {actionLabel && (
        <Link to={actionTo || "/products"} className="hp-head-action">
          <IconArrowLeft size={15} />
          {actionLabel}
        </Link>
      )}
    </div>
  );
}

/* ============================================================
   SECTIONS
   ============================================================ */

function HeroSlider() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchX = useRef(null);
  const count = HERO_SLIDES.length;

  const go = useCallback((next) => setIndex(((next % count) + count) % count), [count]);

  useEffect(() => {
    if (paused) return undefined;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return undefined;
    const id = setTimeout(() => setIndex((i) => (i + 1) % count), 6500);
    return () => clearTimeout(id);
  }, [paused, index, count]);

  const onTouchStart = (e) => {
    touchX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e) => {
    if (touchX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    touchX.current = null;
    if (Math.abs(dx) < 50) return;
    // صفحه راست‌به‌چپ است: کشیدن به چپ = اسلاید بعدی
    go(dx < 0 ? index + 1 : index - 1);
  };

  return (
    <section className="hp-hero" aria-roledescription="carousel" aria-label="پیشنهادهای ویژه">
      <div className="hp-container">
        <div
          className="hp-hero-frame"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {HERO_SLIDES.map((slide, i) => {
            const active = i === index;
            return (
              <div
                key={slide.id}
                className={`hp-slide${active ? " is-active" : ""}`}
                role="group"
                aria-roledescription="slide"
                aria-label={`${(i + 1).toLocaleString("fa-IR")} از ${count.toLocaleString("fa-IR")}`}
                aria-hidden={!active}
              >
                <img className="hp-slide-img" src={slide.image} alt="" onError={hideBrokenImage} />

                <div className="hp-slide-text">
                  <span className="hp-slide-eyebrow">{slide.eyebrow}</span>
                  <h2 className="hp-slide-title">
                    {slide.title} <em>{slide.highlight}</em>
                  </h2>
                  <p>{slide.text}</p>
                  <Link to={slide.to} className="hp-cta" tabIndex={active ? 0 : -1}>
                    <IconArrowLeft />
                    {slide.cta}
                  </Link>
                </div>
              </div>
            );
          })}

          <button type="button" className="hp-arrow hp-arrow--prev" onClick={() => go(index - 1)} aria-label="اسلاید قبلی">
            <IconArrowRight size={20} />
          </button>
          <button type="button" className="hp-arrow hp-arrow--next" onClick={() => go(index + 1)} aria-label="اسلاید بعدی">
            <IconArrowLeft size={20} />
          </button>

          <div className="hp-dots">
            {HERO_SLIDES.map((slide, i) => (
              <button
                key={slide.id}
                type="button"
                className={i === index ? "is-active" : ""}
                onClick={() => go(i)}
                aria-label={`رفتن به اسلاید ${(i + 1).toLocaleString("fa-IR")}`}
                aria-current={i === index}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function CategorySection() {
  return (
    <section className="hp-section" id="categories">
      <div className="hp-container">
        <SectionHead title="دسته‌بندی محصولات" subtitle="محصول مورد نظرت رو از بین دسته‌بندی‌های زیر انتخاب کن." />

        <div className="hp-cat-grid">
          {CATEGORIES.map((cat) => (
            <Link key={cat.id} to={`/category/${cat.id}`} className="hp-cat" style={{ "--tint": cat.tint }}>
              <span className="hp-cat-media">
                <img src={cat.image} alt="" loading="lazy" onError={hideBrokenImage} />
              </span>
              <span className="hp-cat-foot">
                <span className="hp-cat-title">{cat.title}</span>
                <span className="hp-cat-btn" aria-hidden="true">
                  <IconArrowLeft size={15} />
                </span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function DealsSection({ shop }) {
  const { h, m, s } = useCountdown();
  const rowRef = useRef(null);

  // کشیدن با ماوس (روی موبایل خودِ اسکرول لمسی کار می‌کند)
  const drag = useRef({ active: false, startX: 0, startLeft: 0, moved: false });
  const [dragging, setDragging] = useState(false);

  const onPointerDown = (e) => {
    if (e.pointerType !== "mouse" || e.button !== 0) return;
    const row = rowRef.current;
    drag.current = { active: true, startX: e.clientX, startLeft: row.scrollLeft, moved: false };
    // snap و smooth باید «همین الان» خاموش شوند، وگرنه اسکرول را به عقب برمی‌گردانند
    row.style.scrollSnapType = "none";
    row.style.scrollBehavior = "auto";
  };
  const onPointerMove = (e) => {
    const d = drag.current;
    if (!d.active) return;
    const dx = e.clientX - d.startX;
    if (!d.moved && Math.abs(dx) < 5) return;
    if (!d.moved) {
      d.moved = true;
      setDragging(true);
    }
    rowRef.current.scrollLeft = d.startLeft - dx;
  };
  const endDrag = () => {
    if (!drag.current.active) return;
    drag.current.active = false;
    setDragging(false);
    const row = rowRef.current;
    if (row) {
      row.style.scrollSnapType = "";
      row.style.scrollBehavior = "";
    }
  };
  const onClickCapture = (e) => {
    if (drag.current.moved) {
      e.preventDefault();
      e.stopPropagation();
      drag.current.moved = false;
    }
  };

  const scrollRow = (direction) => {
    const row = rowRef.current;
    if (!row) return;
    // direction: 1 = به سمت چپ (آیتم‌های بعدی در صفحهٔ راست‌به‌چپ)
    row.scrollBy({ left: -direction * Math.round(row.clientWidth * 0.8), behavior: "smooth" });
  };

  return (
    <section className="hp-section">
      <div className="hp-container">
        <div className="hp-deals">
          <div className="hp-deals-head">
            <div>
              <h2>پیشنهادهای ویژه امروز</h2>
              <p>تخفیف‌ها تا پایان امروز معتبر است.</p>
            </div>

            <div className="hp-deals-tools">
              <div className="hp-countdown" role="timer" aria-label="زمان باقی‌مانده">
                <span><strong>{faDigits(s)}</strong><small>ثانیه</small></span>
                <i aria-hidden="true">:</i>
                <span><strong>{faDigits(m)}</strong><small>دقیقه</small></span>
                <i aria-hidden="true">:</i>
                <span><strong>{faDigits(h)}</strong><small>ساعت</small></span>
              </div>

              <div className="hp-deals-nav">
                <button type="button" onClick={() => scrollRow(-1)} aria-label="قبلی"><IconArrowRight size={18} /></button>
                <button type="button" onClick={() => scrollRow(1)} aria-label="بعدی"><IconArrowLeft size={18} /></button>
              </div>
            </div>
          </div>

          <div
            className={`hp-deals-row${dragging ? " is-dragging" : ""}`}
            ref={rowRef}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerLeave={endDrag}
            onPointerCancel={endDrag}
            onClickCapture={onClickCapture}
            onDragStart={(e) => e.preventDefault()}
          >
            {OFFERS.map((product) => (
              <div className="hp-deals-item" key={product.id}>
                <ProductCard product={product} wished={shop.wishlist.includes(product.id)} onToggleWish={shop.onToggleWish} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function BestSellersSection({ shop }) {
  const [tab, setTab] = useState("all");
  const list = (tab === "all" ? BEST_SELLERS : BEST_SELLERS.filter((p) => p.category === tab)).slice(0, 6);

  return (
    <section className="hp-section" id="products">
      <div className="hp-container">
        <SectionHead
          title="پرفروش‌ترین محصولات"
          icon={<IconFlame />}
          subtitle="محبوب‌ترین مدل‌ها با بهترین قیمت"
          actionLabel="مشاهده همه"
        />

        <div className="hp-tabs" role="tablist" aria-label="فیلتر محصولات">
          {PRODUCT_TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={tab === t.id}
              className={tab === t.id ? "is-active" : ""}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {list.length ? (
          <div className="hp-grid">
            {list.map((product) => (
              <ProductCard key={product.id} product={product} wished={shop.wishlist.includes(product.id)} onToggleWish={shop.onToggleWish} />
            ))}
          </div>
        ) : (
          <p className="hp-empty">محصولی در این دسته یافت نشد.</p>
        )}
      </div>
    </section>
  );
}

function BannerSection() {
  return (
    <section className="hp-section">
      <div className="hp-container hp-banners">
        {BANNERS.map((banner) => (
          <div key={banner.id} className={`hp-banner hp-banner--${banner.variant}`}>
            <img src={banner.image} alt="" loading="lazy" onError={hideBrokenImage} />
            <div className="hp-banner-text">
              <h3>{banner.title}</h3>
              <p>{banner.text}</p>
              <Link to={banner.to} className="hp-pill">
                <IconArrowLeft size={15} />
                {banner.cta}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function NewArrivalsSection({ shop }) {
  return (
    <section className="hp-section">
      <div className="hp-container">
        <SectionHead title="تازه‌ترین محصولات" subtitle="جدیدترین مدل‌های اضافه‌شده به فروشگاه" actionLabel="مشاهده همه" />
        <div className="hp-grid">
          {NEW_ARRIVALS.map((product) => (
            <ProductCard key={product.id} product={product} wished={shop.wishlist.includes(product.id)} onToggleWish={shop.onToggleWish} />
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  return (
    <section className="hp-section">
      <div className="hp-container">
        <SectionHead title="نظر مشتریان" subtitle="تجربهٔ خرید کسانی که قبلاً از پارس‌کفش خرید کرده‌اند" />
        <div className="hp-reviews">
          {TESTIMONIALS.map((item) => (
            <figure className="hp-review" key={item.id}>
              <div className="hp-review-stars" aria-label={`امتیاز ${item.rating} از ۵`}>
                {Array.from({ length: item.rating }).map((_, i) => (
                  <IconStar key={i} />
                ))}
              </div>
              <blockquote>{item.text}</blockquote>
              <figcaption>
                <span className="hp-review-avatar" aria-hidden="true">{item.name.charAt(0)}</span>
                <span>
                  <strong>{item.name}</strong>
                  <small>{item.city}</small>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function TrustStrip() {
  return (
    <section className="hp-section hp-section--last">
      <div className="hp-container">
        <ul className="hp-trust">
          {TRUST.map((item) => {
            const Icon = TRUST_ICONS[item.icon];
            return (
              <li key={item.id}>
                <span className="hp-trust-icon"><Icon /></span>
                <span>
                  <strong>{item.title}</strong>
                  <small>{item.sub}</small>
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

/* ============================================================
   PAGE
   ============================================================ */

export default function HomePage() {
  const [wishlist, setWishlist] = useState(readWishlist);

  useEffect(() => {
    try {
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
    } catch {
      /* storage may be blocked */
    }
  }, [wishlist]);

  const toggleWish = useCallback((id) => {
    setWishlist((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }, []);

  const shop = { wishlist, onToggleWish: toggleWish };

  return (
    <div className="page-wrapper">
      <Header />
      <main>
        <h1 className="sr-only">پارس‌کفش؛ فروشگاه آنلاین دمپایی و صندل</h1>
        <HeroSlider />
        <CategorySection />
        <DealsSection shop={shop} />
        <BestSellersSection shop={shop} />
        <BannerSection />
        <NewArrivalsSection shop={shop} />
        <TestimonialsSection />
        <TrustStrip />
      </main>
      <Footer />
    </div>
  );
}
