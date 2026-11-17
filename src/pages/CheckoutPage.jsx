import React, { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCart } from "../context/CartContext.jsx";

import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";


/* ============================================================
   Config — edit these to match your store
   ============================================================ */

const SHIPPING_METHODS = [
  {
    id: "post",
    title: "پست پیشتاز",
    meta: "۲۴ تا ۴۸ ساعت",
    price: 24000,
    note: "با انتخاب این روش، کد رهگیری برای شما ارسال خواهد شد.",
  },
  {
    id: "tipax",
    title: "تیپاکس (سریع‌تر)",
    meta: "با تا ۲ روز کاری",
    price: 50000,
    note: "ارسال با تیپاکس، تحویل درب منزل.",
  },
];

const PAYMENT_METHODS = [
  {
    id: "online",
    title: "پرداخت آنلاین",
    meta: "پرداخت امن از طریق درگاه بانکی",
    icon: "card",
  },
  {
    id: "cod",
    title: "پرداخت در محل",
    meta: "هنگام تحویل سفارش، نقدی یا کارتخوان",
    icon: "cash",
  },
];

// Replace with a call to your API. type: "percent" | "fixed" (Toman)
const DISCOUNT_CODES = {
  WELCOME10: { type: "percent", value: 10 },
  SAVE50: { type: "fixed", value: 50000 },
};

const PROVINCES = [
  "آذربایجان شرقی", "آذربایجان غربی", "اردبیل", "اصفهان", "البرز", "ایلام",
  "بوشهر", "تهران", "چهارمحال و بختیاری", "خراسان جنوبی", "خراسان رضوی",
  "خراسان شمالی", "خوزستان", "زنجان", "سمنان", "سیستان و بلوچستان", "فارس",
  "قزوین", "قم", "کردستان", "کرمان", "کرمانشاه", "کهگیلویه و بویراحمد",
  "گلستان", "گیلان", "لرستان", "مازندران", "مرکزی", "هرمزگان", "همدان", "یزد",
];

// Provinces not listed here fall back to a free-text city field.
const CITIES = {
  "تهران": ["تهران", "شهریار", "ری", "اسلامشهر", "پردیس", "ورامین"],
  "اصفهان": ["اصفهان", "کاشان", "نجف‌آباد", "خمینی‌شهر", "شاهین‌شهر"],
  "خراسان رضوی": ["مشهد", "نیشابور", "سبزوار", "تربت حیدریه", "قوچان"],
  "فارس": ["شیراز", "مرودشت", "جهرم", "کازرون", "لار"],
  "آذربایجان شرقی": ["تبریز", "مراغه", "مرند", "اهر", "میانه"],
  "خوزستان": ["اهواز", "آبادان", "دزفول", "ماهشهر", "بهبهان"],
  "البرز": ["کرج", "فردیس", "نظرآباد", "اشتهارد"],
  "گیلان": ["رشت", "بندر انزلی", "لاهیجان", "لنگرود"],
  "مازندران": ["ساری", "بابل", "آمل", "قائم‌شهر", "تنکابن"],
};

/*
 * Cart adapter — maps this page onto YOUR CartContext.
 * I couldn't see CartContext.jsx, so the function names below are guesses
 * covering the common conventions. If yours differ, change ONLY this block.
 * If no quantity/remove function is found, those controls are disabled.
 */
function useCartAdapter() {
  const cart = useCart();
  const items = cart.items || [];

  const setQty =
    cart.updateQuantity || cart.updateQty || cart.setQuantity || cart.setItemQuantity || null;
  const remove = cart.removeItem || cart.removeFromCart || cart.remove || null;
  const clear = cart.clearCart || cart.clear || null;

  return {
    items,
    canEditQty: Boolean(setQty),
    canRemove: Boolean(remove),
    // Adjust the argument order here if your context expects something else.
    changeQty: (it, next) => setQty && setQty(it.id, next, { color: it.color, size: it.size }),
    removeItem: (it) => remove && remove(it.id, { color: it.color, size: it.size }),
    clearCart: () => clear && clear(),
  };
}

/* ============================================================
   Helpers
   ============================================================ */

const fa = (n) => Number(n || 0).toLocaleString("fa-IR");
const faPlain = (n) => Number(n || 0).toLocaleString("fa-IR", { useGrouping: false });

const toEnDigits = (s = "") =>
  String(s)
    .replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d))
    .replace(/[٠-٩]/g, (d) => "٠١٢٣٤٥٦٧٨٩".indexOf(d));

const itemKey = (it) => `${it.id}-${it.color || ""}-${it.size || ""}`;

const EMPTY_FORM = {
  firstName: "",
  lastName: "",
  phone: "",
  postalCode: "",
  province: "",
  city: "",
  address: "",
};

// One source of truth for the recipient form rules (React Hook Form + zod).
const schema = z.object({
  firstName: z.string().trim().min(2, "نام را وارد کنید."),
  lastName: z.string().trim().min(2, "نام خانوادگی را وارد کنید."),
  phone: z
    .string()
    .trim()
    .refine((v) => /^09\d{9}$/.test(toEnDigits(v)), "شماره موبایل معتبر نیست (مثال: ۰۹۱۲۳۴۵۶۷۸۹)."),
  postalCode: z
    .string()
    .trim()
    .refine((v) => /^\d{10}$/.test(toEnDigits(v)), "کد پستی باید ۱۰ رقم باشد."),
  province: z.string().min(1, "استان را انتخاب کنید."),
  city: z.string().trim().min(1, "شهر را انتخاب کنید."),
  address: z.string().trim().min(10, "آدرس کامل را وارد کنید (حداقل ۱۰ حرف)."),
});

/* ============================================================
   Icons
   ============================================================ */

function Icon({ name, size = 20 }) {
  const paths = {
    check: <path d="M20 6 9 17l-5-5" />,
    cart: (
      <>
        <path d="M2 3h3l2.7 12.4a2 2 0 0 0 2 1.6h7.9a2 2 0 0 0 1.9-1.5L21 7H6" />
        <circle cx="10" cy="21" r="1" />
        <circle cx="18" cy="21" r="1" />
      </>
    ),
    user: (
      <>
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </>
    ),
    phone: (
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z" />
    ),
    pin: (
      <>
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" />
        <circle cx="12" cy="10" r="3" />
      </>
    ),
    truck: (
      <>
        <path d="M1 3h15v13H1z" />
        <path d="M16 8h4l3 3v5h-7z" />
        <circle cx="5.5" cy="18.5" r="2.5" />
        <circle cx="18.5" cy="18.5" r="2.5" />
      </>
    ),
    gift: (
      <>
        <rect x="3" y="8" width="18" height="4" rx="1" />
        <path d="M12 8v13" />
        <path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7" />
        <path d="M7.5 8a2.5 2.5 0 0 1 0-5C11 3 12 8 12 8s1-5 4.5-5a2.5 2.5 0 0 1 0 5" />
      </>
    ),
    lock: (
      <>
        <rect x="3" y="11" width="18" height="11" rx="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </>
    ),
    arrow: (
      <>
        <path d="M19 12H5" />
        <path d="m12 19-7-7 7-7" />
      </>
    ),
    x: (
      <>
        <path d="M18 6 6 18" />
        <path d="m6 6 12 12" />
      </>
    ),
    plus: (
      <>
        <path d="M12 5v14" />
        <path d="M5 12h14" />
      </>
    ),
    minus: <path d="M5 12h14" />,
    shield: (
      <>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),
    headset: (
      <>
        <path d="M3 14v-2a9 9 0 0 1 18 0v2" />
        <path d="M21 15a2 2 0 0 1-2 2h-1v-5h1a2 2 0 0 1 2 2z" />
        <path d="M3 15a2 2 0 0 0 2 2h1v-5H5a2 2 0 0 0-2 2z" />
      </>
    ),
    undo: (
      <>
        <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
        <path d="M3 3v5h5" />
      </>
    ),
    card: (
      <>
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <path d="M2 10h20" />
      </>
    ),
    cash: (
      <>
        <rect x="2" y="6" width="20" height="12" rx="2" />
        <circle cx="12" cy="12" r="2" />
      </>
    ),
    chevron: <path d="m6 9 6 6 6-6" />,
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {paths[name]}
    </svg>
  );
}

/* ============================================================
   Stepper
   ============================================================ */

const STEPS = [
  { n: 1, label: "سبد خرید", icon: "cart" },
  { n: 2, label: "اطلاعات ارسال", icon: "truck" },
  { n: 3, label: "پرداخت", icon: "card" },
];

function Stepper({ step, onGo }) {
  return (
    <nav className="ck-stepper" aria-label="مراحل خرید">
      {STEPS.map((s, i) => {
        const state = s.n < step ? "done" : s.n === step ? "current" : "todo";
        return (
          <React.Fragment key={s.n}>
            <button
              type="button"
              className={`ck-step ck-step--${state}`}
              aria-current={state === "current" ? "step" : undefined}
              disabled={state !== "done"}
              onClick={() => state === "done" && onGo(s.n)}
            >
              <span className="ck-step-badge">
                {state === "done" ? <Icon name="check" size={16} /> : faPlain(s.n)}
              </span>
              <span className="ck-step-label">{s.label}</span>
              <span className="ck-step-icon">
                <Icon name={s.icon} size={18} />
              </span>
            </button>
            {i < STEPS.length - 1 && (
              <span
                className={`ck-step-line${s.n < step ? " ck-step-line--done" : ""}`}
                aria-hidden="true"
              />
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}

/* ============================================================
   Order summary
   ============================================================ */

function Summary({
  step,
  items,
  count,
  subtotal,
  shipping,
  discount,
  discountAmount,
  total,
  onRemoveDiscount,
  children,
}) {
  const showItems = step >= 2;
  return (
    <aside className="ck-card ck-summary" aria-label="خلاصه سفارش">
      <div className="ck-card-head">
        <h2 className="ck-card-title">{step === 1 ? "مجموع سبد خرید" : "خلاصه سفارش"}</h2>
        <span className="ck-summary-count">
          <Icon name="cart" size={18} />
          {fa(count)} کالا
        </span>
      </div>

      {showItems && (
        <ul className="ck-sum-items">
          {items.map((it) => (
            <li className="ck-sum-item" key={itemKey(it)}>
              <div className="ck-sum-thumb">
                {it.image ? <img src={it.image} alt={it.title} /> : null}
              </div>
              <div className="ck-sum-info">
                <div className="ck-sum-name">{it.title}</div>
                <div className="ck-sum-meta">
                  {[it.color, it.size && `سایز ${it.size}`].filter(Boolean).join(" / ")}
                </div>
              </div>
              <div className="ck-sum-price">
                <span className="ck-sum-qty">{fa(it.quantity)}×</span>
                <strong>{fa(it.price * it.quantity)} تومان</strong>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="ck-sum-rows">
        <div className="ck-sum-row">
          <span>جمع جزء ({fa(count)} کالا)</span>
          <span>{fa(subtotal)} تومان</span>
        </div>

        <div className="ck-sum-row">
          <span className="ck-sum-row-label">
            <Icon name="truck" size={18} />
            <span>
              هزینه ارسال
              {shipping && <small>{shipping.title}</small>}
            </span>
          </span>
          {shipping ? (
            <span>{fa(shipping.price)} تومان</span>
          ) : (
            <span className="ck-muted">در مرحله بعد</span>
          )}
        </div>

        {discount && (
          <div className="ck-sum-row ck-sum-row--discount">
            <span className="ck-sum-row-label">
              <Icon name="gift" size={18} />
              <span>
                تخفیف
                <button type="button" className="ck-chip" onClick={onRemoveDiscount}>
                  کد تخفیف اعمال شد <Icon name="x" size={12} />
                </button>
              </span>
            </span>
            <span>− {fa(discountAmount)} تومان</span>
          </div>
        )}
      </div>

      <div className="ck-total">
        <span>مبلغ قابل پرداخت</span>
        <strong>{fa(total)} تومان</strong>
      </div>

      {children}
    </aside>
  );
}

/* ============================================================
   Step 1 — cart
   ============================================================ */

function CartStep({
  items,
  canEditQty,
  canRemove,
  changeQty,
  removeItem,
  discount,
  onApplyCode,
}) {
  const [code, setCode] = useState("");
  const [msg, setMsg] = useState(null);

  const apply = (e) => {
    e.preventDefault();
    const res = onApplyCode(code);
    setMsg(res);
    if (res.ok) setCode("");
  };

  return (
    <section className="ck-card ck-cart" aria-label="محصولات سبد خرید">
      <div className="ck-cart-head" aria-hidden="true">
        <span />
        <span>محصول</span>
        <span>قیمت</span>
        <span>تعداد</span>
        <span>جمع جزء</span>
      </div>

      <ul className="ck-cart-list">
        {items.map((it) => (
          <li className="ck-cart-row" key={itemKey(it)}>
            <button
              type="button"
              className="ck-icon-btn ck-cart-remove"
              onClick={() => removeItem(it)}
              disabled={!canRemove}
              aria-label={`حذف ${it.title}`}
              title="حذف"
            >
              <Icon name="x" size={16} />
            </button>

            <div className="ck-cart-product">
              <div className="ck-cart-thumb">
                {it.image ? <img src={it.image} alt={it.title} /> : null}
              </div>
              <div className="ck-cart-pinfo">
                <div className="ck-cart-name">{it.title}</div>
                <div className="ck-cart-meta">
                  {[it.color, it.size && `سایز ${it.size}`].filter(Boolean).join(" | ")}
                </div>
              </div>
            </div>

            <div className="ck-cart-price" data-label="قیمت">
              {fa(it.price)} <small>تومان</small>
            </div>

            <div className="ck-qty" data-label="تعداد">
              <button
                type="button"
                onClick={() => changeQty(it, it.quantity + 1)}
                disabled={!canEditQty}
                aria-label="افزایش تعداد"
              >
                <Icon name="plus" size={14} />
              </button>
              <span>{fa(it.quantity)}</span>
              <button
                type="button"
                onClick={() => changeQty(it, it.quantity - 1)}
                disabled={!canEditQty || it.quantity <= 1}
                aria-label="کاهش تعداد"
              >
                <Icon name="minus" size={14} />
              </button>
            </div>

            <div className="ck-cart-sub" data-label="جمع جزء">
              {fa(it.price * it.quantity)} <small>تومان</small>
            </div>
          </li>
        ))}
      </ul>

      <form className="ck-coupon" onSubmit={apply}>
        <label htmlFor="ck-coupon-input" className="ck-coupon-label">
          کد تخفیف
        </label>
        <input
          id="ck-coupon-input"
          className="ck-input ck-input--plain"
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="کد تخفیف را وارد کنید"
          autoComplete="off"
          dir="ltr"
        />
        <button type="submit" className="ck-btn ck-btn--primary ck-btn--sm" disabled={!code.trim()}>
          اعمال کد تخفیف
        </button>
        {(msg || discount) && (
          <p className={`ck-coupon-msg${msg && !msg.ok ? " is-error" : ""}`} role="status">
            {msg ? msg.text : "کد تخفیف اعمال شده است."}
          </p>
        )}
      </form>
    </section>
  );
}

/* ============================================================
   Step 2 — recipient + shipping method
   ============================================================ */

function Field({ id, label, required, icon, error, full, children }) {
  return (
    <div className={`ck-field${full ? " ck-field--full" : ""}`}>
      <label className="ck-label" htmlFor={id}>
        {label}
        {required && <span className="ck-req"> *</span>}
      </label>
      <div className={`ck-control${error ? " has-error" : ""}`}>
        <span className="ck-control-icon">
          <Icon name={icon} size={18} />
        </span>
        {children}
      </div>
      {error && (
        <p className="ck-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

function ShippingStep({ defaults, shippingId, setShippingId, onSubmit }) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: defaults,
    mode: "onTouched", // validate on blur first, then live while fixing
  });

  const province = watch("province");
  const cities = CITIES[province];
  const method = SHIPPING_METHODS.find((m) => m.id === shippingId);

  // id + aria + RHF's register() props for a field
  const field = (name) => ({
    id: `ck-${name}`,
    "aria-invalid": Boolean(errors[name]),
    ...register(name),
  });

  return (
    <form className="ck-card ck-form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="ck-card-head">
        <h2 className="ck-card-title">
          <Icon name="user" size={22} /> اطلاعات گیرنده
        </h2>
      </div>

      <div className="ck-grid">
        <Field id="ck-firstName" label="نام" required icon="user" error={errors.firstName?.message}>
          <input className="ck-input" placeholder="مثلاً علی" autoComplete="given-name" {...field("firstName")} />
        </Field>

        <Field id="ck-lastName" label="نام خانوادگی" required icon="user" error={errors.lastName?.message}>
          <input className="ck-input" placeholder="مثلاً محمدی" autoComplete="family-name" {...field("lastName")} />
        </Field>

        <Field id="ck-phone" label="شماره موبایل" required icon="phone" error={errors.phone?.message}>
          <input
            className="ck-input"
            placeholder="۰۹۱۲۳۴۵۶۷۸۹"
            inputMode="numeric"
            autoComplete="tel"
            maxLength={11}
            {...field("phone")}
          />
        </Field>

        <Field id="ck-postalCode" label="کد پستی" required icon="pin" error={errors.postalCode?.message}>
          <input
            className="ck-input"
            placeholder="۱۲۳۴۵۶۷۸۹۰"
            inputMode="numeric"
            autoComplete="postal-code"
            maxLength={10}
            {...field("postalCode")}
          />
        </Field>

        <Field id="ck-province" label="استان" required icon="pin" error={errors.province?.message}>
          <select
            className="ck-input ck-select"
            id="ck-province"
            aria-invalid={Boolean(errors.province)}
            {...register("province", {
              // changing the province invalidates the previously chosen city
              onChange: () => setValue("city", "", { shouldValidate: false }),
            })}
          >
            <option value="">انتخاب استان</option>
            {PROVINCES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
          <span className="ck-chevron">
            <Icon name="chevron" size={16} />
          </span>
        </Field>

        <Field id="ck-city" label="شهر" required icon="pin" error={errors.city?.message}>
          {cities ? (
            <>
              <select key="city-select" className="ck-input ck-select" {...field("city")}>
                <option value="">انتخاب شهر</option>
                {cities.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <span className="ck-chevron">
                <Icon name="chevron" size={16} />
              </span>
            </>
          ) : (
            <input
              key="city-text"
              className="ck-input"
              placeholder={province ? "نام شهر را وارد کنید" : "ابتدا استان را انتخاب کنید"}
              disabled={!province}
              autoComplete="address-level2"
              {...field("city")}
            />
          )}
        </Field>

        <Field id="ck-address" label="آدرس کامل" required icon="pin" error={errors.address?.message} full>
          <textarea
            className="ck-input ck-textarea"
            placeholder="خیابان، کوچه، پلاک، واحد"
            rows={3}
            autoComplete="street-address"
            {...field("address")}
          />
        </Field>
      </div>

      <h3 className="ck-subtitle">روش ارسال</h3>
      <div className="ck-options" role="radiogroup" aria-label="روش ارسال">
        {SHIPPING_METHODS.map((m) => (
          <label key={m.id} className={`ck-option${shippingId === m.id ? " is-selected" : ""}`}>
            <input
              type="radio"
              name="shipping"
              value={m.id}
              checked={shippingId === m.id}
              onChange={() => setShippingId(m.id)}
            />
            <span className="ck-radio" aria-hidden="true" />
            <span className="ck-option-body">
              <span className="ck-option-title">
                <Icon name="truck" size={18} /> {m.title}
              </span>
              <span className="ck-option-meta">
                {m.meta}
                <i aria-hidden="true">|</i>
                {fa(m.price)} تومان
              </span>
            </span>
          </label>
        ))}
      </div>
      {method && <p className="ck-hint">{method.note}</p>}

      <button type="submit" className="ck-btn ck-btn--primary ck-btn--block">
        تأیید اطلاعات و ادامه به پرداخت <Icon name="arrow" size={20} />
      </button>
    </form>
  );
}

/* ============================================================
   Step 3 — payment
   ============================================================ */

function PaymentStep({ form, shipping, paymentId, setPaymentId, note, setNote, onEdit, onPlace, placing }) {
  return (
    <section className="ck-card ck-form">
      <div className="ck-card-head">
        <h2 className="ck-card-title">
          <Icon name="card" size={22} /> روش پرداخت
        </h2>
      </div>

      <div className="ck-options ck-options--stack" role="radiogroup" aria-label="روش پرداخت">
        {PAYMENT_METHODS.map((m) => (
          <label key={m.id} className={`ck-option${paymentId === m.id ? " is-selected" : ""}`}>
            <input
              type="radio"
              name="payment"
              value={m.id}
              checked={paymentId === m.id}
              onChange={() => setPaymentId(m.id)}
            />
            <span className="ck-radio" aria-hidden="true" />
            <span className="ck-option-body">
              <span className="ck-option-title">
                <Icon name={m.icon} size={18} /> {m.title}
              </span>
              <span className="ck-option-meta">{m.meta}</span>
            </span>
          </label>
        ))}
      </div>

      <h3 className="ck-subtitle">ارسال به</h3>
      <div className="ck-recap">
        <div className="ck-recap-body">
          <strong>
            {form.firstName} {form.lastName}
          </strong>
          <span dir="ltr" className="ck-recap-phone">
            {form.phone}
          </span>
          <p>
            {form.province}، {form.city} — {form.address}
          </p>
          <p className="ck-muted">
            کد پستی: {form.postalCode} · {shipping.title} ({shipping.meta})
          </p>
        </div>
        <button type="button" className="ck-btn ck-btn--ghost ck-btn--sm" onClick={onEdit}>
          ویرایش
        </button>
      </div>

      <div className="ck-field ck-field--full">
        <label className="ck-label" htmlFor="ck-note">
          توضیحات سفارش (اختیاری)
        </label>
        <textarea
          id="ck-note"
          className="ck-input ck-textarea ck-input--plain"
          rows={3}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="مثلاً: لطفاً قبل از ارسال تماس بگیرید"
        />
      </div>

      <button
        type="button"
        className="ck-btn ck-btn--primary ck-btn--block"
        onClick={onPlace}
        disabled={placing}
      >
        <Icon name="lock" size={18} />
        {placing
          ? "در حال ثبت سفارش…"
          : paymentId === "online"
          ? "پرداخت و ثبت نهایی سفارش"
          : "ثبت نهایی سفارش"}
      </button>
    </section>
  );
}

/* ============================================================
   Success / empty / trust strip
   ============================================================ */

function SuccessView({ order }) {
  return (
    <section className="ck-card ck-state" role="status">
      <span className="ck-state-icon ck-state-icon--ok">
        <Icon name="check" size={34} />
      </span>
      <h2>سفارش شما ثبت شد</h2>
      <p>
        کد پیگیری سفارش: <strong dir="ltr">{order.code}</strong>
      </p>
      <p className="ck-muted">جزئیات سفارش و کد رهگیری مرسوله به شماره موبایل شما پیامک می‌شود.</p>
      <Link className="ck-btn ck-btn--primary" to="/">
        بازگشت به فروشگاه
      </Link>
    </section>
  );
}

function EmptyView() {
  return (
    <section className="ck-card ck-state">
      <span className="ck-state-icon">
        <Icon name="cart" size={34} />
      </span>
      <h2>سبد خرید شما خالی است</h2>
      <p className="ck-muted">برای ادامه، چند محصول به سبد خرید اضافه کنید.</p>
      <Link className="ck-btn ck-btn--primary" to="/">
        مشاهده محصولات
      </Link>
    </section>
  );
}

const TRUST = [
  { icon: "truck", title: "ارسال سریع", sub: "به سراسر کشور" },
  { icon: "shield", title: "پرداخت امن", sub: "با درگاه‌های معتبر بانکی" },
  { icon: "undo", title: "بازگشت کالا", sub: "تا ۷ روز پس از دریافت" },
  { icon: "headset", title: "پشتیبانی ۲۴ ساعته", sub: "پاسخگویی سریع" },
];

function TrustStrip() {
  return (
    <div className="ck-trust">
      {TRUST.map((t) => (
        <div className="ck-trust-item" key={t.title}>
          <span className="ck-trust-icon">
            <Icon name={t.icon} size={26} />
          </span>
          <span>
            <strong>{t.title}</strong>
            <small>{t.sub}</small>
          </span>
        </div>
      ))}
    </div>
  );
}

/* ============================================================
   Page
   ============================================================ */

export default function CheckoutPage() {
  const { items, canEditQty, canRemove, changeQty, removeItem, clearCart } = useCartAdapter();

  // The current step lives in the URL (?step=2) so the browser's Back/Forward
  // buttons move between steps and a refresh keeps you on the same step.
  const [params, setParams] = useSearchParams();
  const [form, setForm] = useState(null); // saved recipient info (null until step 2 is submitted)

  const requested = Number(params.get("step")) || 1;
  let step = Math.min(Math.max(requested, 1), 3);
  // Step 3 needs the saved address; after a refresh it is gone, so go back to step 2.
  if (step === 3 && !form) step = 2;

  const setStep = (n) => setParams(n === 1 ? {} : { step: String(n) });
  const [shippingId, setShippingId] = useState(SHIPPING_METHODS[0].id);
  const [paymentId, setPaymentId] = useState(PAYMENT_METHODS[0].id);
  const [note, setNote] = useState("");
  const [discount, setDiscount] = useState(null); // { code, type, value }
  const [placing, setPlacing] = useState(false);
  const [order, setOrder] = useState(null);

  const count = items.reduce((n, it) => n + it.quantity, 0);
  const subtotal = items.reduce((n, it) => n + it.price * it.quantity, 0);
  const shipping = step >= 2 ? SHIPPING_METHODS.find((m) => m.id === shippingId) : null;

  const discountAmount = discount
    ? discount.type === "percent"
      ? Math.round((subtotal * discount.value) / 100)
      : Math.min(discount.value, subtotal)
    : 0;
  const total = Math.max(0, subtotal - discountAmount + (shipping ? shipping.price : 0));

  // Scroll to the top whenever the step changes.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step, order]);

  const applyCode = (raw) => {
    const code = toEnDigits(raw).trim().toUpperCase();
    const found = DISCOUNT_CODES[code];
    if (!found) return { ok: false, text: "کد تخفیف معتبر نیست." };
    setDiscount({ code, ...found });
    return { ok: true, text: "کد تخفیف با موفقیت اعمال شد." };
  };

  const placeOrder = () => {
    setPlacing(true);
    // TODO: send { items, form, shippingId, paymentId, note, discount } to your API here.
    setTimeout(() => {
      setOrder({ code: `DM-${faPlain(100000 + Math.floor(Math.random() * 900000))}` });
      setPlacing(false);
      clearCart();
    }, 900);
  };

  let main;
  if (order) {
    main = <SuccessView order={order} />;
  } else if (items.length === 0) {
    main = <EmptyView />;
  } else {
    main = (
      <div className="ck-layout">
        <div className="ck-main">
          {step === 1 && (
            <CartStep
              items={items}
              canEditQty={canEditQty}
              canRemove={canRemove}
              changeQty={changeQty}
              removeItem={removeItem}
              discount={discount}
              onApplyCode={applyCode}
            />
          )}

          {step === 2 && (
            <ShippingStep
              defaults={form || EMPTY_FORM}
              shippingId={shippingId}
              setShippingId={setShippingId}
              onSubmit={(values) => {
                setForm({
                  ...values,
                  phone: toEnDigits(values.phone),
                  postalCode: toEnDigits(values.postalCode),
                });
                setStep(3);
              }}
            />
          )}

          {step === 3 && (
            <PaymentStep
              form={form}
              shipping={SHIPPING_METHODS.find((m) => m.id === shippingId)}
              paymentId={paymentId}
              setPaymentId={setPaymentId}
              note={note}
              setNote={setNote}
              onEdit={() => setStep(2)}
              onPlace={placeOrder}
              placing={placing}
            />
          )}
        </div>

        <Summary
          step={step}
          items={items}
          count={count}
          subtotal={subtotal}
          shipping={shipping}
          discount={discount}
          discountAmount={discountAmount}
          total={total}
          onRemoveDiscount={() => setDiscount(null)}
        >
          {step === 1 && (
            <>
              <button
                type="button"
                className="ck-btn ck-btn--primary ck-btn--block"
                onClick={() => setStep(2)}
              >
                <Icon name="lock" size={18} /> ادامه جهت تسویه حساب
              </button>
              <p className="ck-secure">
                <Icon name="shield" size={16} /> پرداخت امن و مطمئن
              </p>
            </>
          )}
        </Summary>
      </div>
    );
  }

  return (
    <div className="page-wrapper" dir="rtl">
      <Header />

      <main className="container ck-page">
        {!order && items.length > 0 && <Stepper step={step} onGo={setStep} />}
        {main}
        <TrustStrip />
      </main>

      <Footer />
    </div>
  );
}
