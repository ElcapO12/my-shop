// src/components/Footer.jsx

import React, { useState } from "react";
import { Link } from "react-router-dom";

/* ============================================================
   DATA  (آدرس‌ها و اطلاعات تماس را با اطلاعات واقعی جایگزین کنید)
   ============================================================ */

const SHOP_LINKS = [
  { label: "همهٔ محصولات", to: "/products" },
  { label: "دمپایی مردانه", to: "/category/men" },
  { label: "دمپایی زنانه", to: "/category/women" },
  { label: "دمپایی بچگانه", to: "/category/kids" },
  { label: "صندل و کفش", to: "/category/sandals" },
];

const HELP_LINKS = [
  { label: "راهنمای خرید", to: "#" },
  { label: "راهنمای انتخاب سایز", to: "#" },
  { label: "رویه‌های بازگشت کالا", to: "#" },
  { label: "پیگیری سفارش", to: "#" },
  { label: "سوالات متداول", to: "#" },
];

const COMPANY_LINKS = [
  { label: "درباره ما", to: "#" },
  { label: "تماس با ما", to: "#" },
  { label: "قوانین و مقررات", to: "#" },
  { label: "حریم خصوصی", to: "#" },
];

const CONTACT = {
  phone: "۰۲۱-۰۰۰۰۰۰۰۰",
  phoneHref: "tel:+982100000000",
  email: "info@parskafsh.ir",
  address: "تهران، خیابان نمونه، پلاک ۰",
  hours: "شنبه تا پنجشنبه، ۹ تا ۱۸",
};

const SOCIALS = [
  { id: "instagram", label: "اینستاگرام", href: "#" },
  { id: "telegram", label: "تلگرام", href: "#" },
  { id: "whatsapp", label: "واتس‌اپ", href: "#" },
  { id: "youtube", label: "یوتیوب", href: "#" },
];

/* ============================================================
   ICONS
   ============================================================ */

const stroke = { stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round" };

const ICONS = {
  phone: <path d="M6.6 3h3l1.4 4-2 1.3a11 11 0 0 0 5.7 5.7L16 12l4 1.4v3A2.6 2.6 0 0 1 17.4 19C10.6 19 5 13.4 5 6.600A2.6 2.6 0 0 1 6.6 3Z" {...stroke} />,
  mail: (
    <>
      <rect x="3.5" y="5.5" width="17" height="13" rx="2.5" {...stroke} />
      <path d="M4.5 8l7.5 5.500L19.5 8" {...stroke} />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s6.5-5.6 6.5-11A6.5 6.5 0 0 0 5.5 10c0 5.4 6.5 11 6.5 11Z" {...stroke} />
      <circle cx="12" cy="10" r="2.3" {...stroke} />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" {...stroke} />
      <path d="M12 7.500V12l3 2" {...stroke} />
    </>
  ),
  up: <path d="M6 14l6-6 6 6" {...stroke} strokeWidth="1.9" />,
  instagram: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="4.5" {...stroke} />
      <circle cx="12" cy="12" r="3.6" {...stroke} />
      <circle cx="16.8" cy="7.2" r="0.8" fill="currentColor" />
    </>
  ),
  telegram: <path d="M20.5 4.500L3.5 11l5 1.800L10 18.500l2.8-3.2 4.5 3.4 3.2-14.200ZM8.5 12.800l8.5-5.5" {...stroke} />,
  whatsapp: (
    <>
      <path d="M4 20l1.2-4.200A8 8 0 1 1 8.3 19L4 20Z" {...stroke} />
      <path d="M9.2 8.800c.3 2.4 2.2 4.4 4.7 5.100l1.2-1.2-1.8-1-.9.700c-.9-.4-1.6-1.1-2-2l.7-.9-1-1.8-.9 1.100Z" fill="currentColor" stroke="none" />
    </>
  ),
  youtube: (
    <>
      <rect x="3" y="6" width="18" height="12" rx="4" {...stroke} />
      <path d="M10.2 9.500v5l4.3-2.5-4.3-2.500Z" fill="currentColor" stroke="none" />
    </>
  ),
};

function Icon({ name, size = 20 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" aria-hidden="true">
      {ICONS[name]}
    </svg>
  );
}

/* ============================================================
   SMALL PARTS
   ============================================================ */

function FooterLink({ to, children }) {
  // لینک‌های داخلی با Router، بقیه با <a> معمولی
  if (to.startsWith("/")) return <Link to={to}>{children}</Link>;
  return <a href={to}>{children}</a>;
}

function LinkColumn({ title, links }) {
  return (
    <nav className="pf-col" aria-label={title}>
      <h3 className="pf-col-title">{title}</h3>
      <ul>
        {links.map((link) => (
          <li key={link.label}>
            <FooterLink to={link.to}>{link.label}</FooterLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/* ============================================================
   FOOTER
   ============================================================ */

export default function Footer() {
  const [status, setStatus] = useState(null);
  const year = new Date().toLocaleDateString("fa-IR", { year: "numeric" });

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const email = String(new FormData(form).get("email") || "").trim();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus("error");
      return;
    }
    window.dispatchEvent(new CustomEvent("store:newsletter", { detail: { email } }));
    form.reset();
    setStatus("ok");
  };

  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="pf" dir="rtl">
      {/* ---- بدنهٔ اصلی ---- */}
      <div className="pf-main">
        <div className="pf-inner pf-grid">
          <section className="pf-brand" aria-label="دربارهٔ پارس‌کفش">
            <Link to="/" className="pf-logo">
              <span className="pf-logo-icon" aria-hidden="true">🌿</span>
              <span>
                <strong>پارس‌کفش</strong>
                <small>راحتی در هر قدم</small>
              </span>
            </Link>

            <p className="pf-about">
              پارس‌کفش عرضهٔ انواع دمپایی و صندل با کیفیت برای تمام اعضای خانواده است؛
              با طراحی مدرن، متریال بادوام و قیمت مناسب.
            </p>

            <ul className="pf-contact">
              <li>
                <Icon name="phone" size={17} />
                <a href={CONTACT.phoneHref}>{CONTACT.phone}</a>
              </li>
              <li>
                <Icon name="mail" size={17} />
                <a href={`mailto:${CONTACT.email}`} dir="ltr">{CONTACT.email}</a>
              </li>
              <li>
                <Icon name="pin" size={17} />
                <span>{CONTACT.address}</span>
              </li>
              <li>
                <Icon name="clock" size={17} />
                <span>{CONTACT.hours}</span>
              </li>
            </ul>
          </section>

          <LinkColumn title="فروشگاه" links={SHOP_LINKS} />
          <LinkColumn title="راهنمای مشتریان" links={HELP_LINKS} />
          <LinkColumn title="پارس‌کفش" links={COMPANY_LINKS} />

          <section className="pf-col pf-join" aria-label="خبرنامه">
            <h3 className="pf-col-title">خبرنامه</h3>
            <p>از جدیدترین محصولات و تخفیف‌ها باخبر شوید.</p>

            <form className="pf-form" onSubmit={handleSubmit} noValidate>
              <input
                type="email"
                name="email"
                dir="ltr"
                placeholder="ایمیل شما"
                aria-label="ایمیل"
                aria-invalid={status === "error"}
                onChange={() => status && setStatus(null)}
              />
              <button type="submit">عضویت</button>
            </form>

            <p className={`pf-msg${status === "error" ? " is-error" : ""}`} role="status" aria-live="polite">
              {status === "ok" && "عضویت شما انجام شد."}
              {status === "error" && "ایمیل معتبر وارد کنید."}
            </p>

            <div className="pf-social" aria-label="شبکه‌های اجتماعی">
              {SOCIALS.map((item) => (
                <a key={item.id} href={item.href} aria-label={item.label} title={item.label}>
                  <Icon name={item.id} />
                </a>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* ---- نوار پایین ---- */}
      <div className="pf-bottom">
        <div className="pf-inner pf-bottom-inner">
          <span className="pf-copy">© {year} پارس‌کفش. تمامی حقوق محفوظ است.</span>

          {/* جای نمادهای اعتماد (اینماد، ساماندهی) — کد نمادها را اینجا بگذارید */}
          <div className="pf-trust" aria-label="نمادهای اعتماد">
            <span className="pf-trust-slot">نماد اعتماد</span>
            <span className="pf-trust-slot">ساماندهی</span>
          </div>

          <button type="button" className="pf-top" onClick={scrollTop}>
            بازگشت به بالا
            <Icon name="up" size={16} />
          </button>
        </div>
      </div>
    </footer>
  );
}
