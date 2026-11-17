// src/components/Header.jsx

import React, {
  memo,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";

/* ============================================================
   CONSTANTS
   ============================================================ */

const NAV_ITEMS = [
  { label: "صفحه اصلی", href: "/" },
  { label: "محصولات", href: "#products" },
  { label: "دسته‌بندی‌ها", href: "#categories" },
  { label: "درباره ما", href: "#about" },
  { label: "تماس با ما", href: "#contact" },
];

const MOBILE_BREAKPOINT = 768;
const CART_WIDTH = 380;
const CART_CLOSE_DELAY = 220;

/* ============================================================
   HELPERS
   ============================================================ */

function formatPrice(value) {
  return `${Number(value || 0).toLocaleString("fa-IR")} تومان`;
}

/* ============================================================
   ICONS
   ============================================================ */

const IconUser = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true">
    <circle cx="12" cy="8" r="3.4" stroke="currentColor" strokeWidth="1.6" />
    <path
      d="M5 19c1.2-3.2 4-4.8 7-4.8s5.8 1.6 7 4.8"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
  </svg>
);

const IconCart = () => (
  <svg viewBox="0 0 24 24" width="21" height="21" fill="none" aria-hidden="true">
    <path
      d="M3 4h2l2.4 11.2A2 2 0 0 0 9.4 17h7.2a2 2 0 0 0 2-1.6L20 8H6"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="10" cy="20.5" r="1.3" stroke="currentColor" strokeWidth="1.4" />
    <circle cx="17" cy="20.5" r="1.3" stroke="currentColor" strokeWidth="1.4" />
  </svg>
);

const IconSearch = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
    <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.8" />
    <path d="M20 20l-4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const IconTruck = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
    <path d="M3 7h11v8H3V7Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    <path d="M14 10h3.5L20 13v2h-6v-5Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    <circle cx="7" cy="17.3" r="1.5" stroke="currentColor" strokeWidth="1.4" />
    <circle cx="17" cy="17.3" r="1.5" stroke="currentColor" strokeWidth="1.4" />
  </svg>
);

const IconClose = () => (
  <svg viewBox="0 0 24 24" width="19" height="19" fill="none" aria-hidden="true">
    <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

/* ============================================================
   HOOK: MOBILE DETECTION
   ============================================================ */

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.innerWidth <= MOBILE_BREAKPOINT;
  });

  useEffect(() => {
    const media = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`);
    const update = () => setIsMobile(media.matches);

    update();
    media.addEventListener("change", update);

    return () => media.removeEventListener("change", update);
  }, []);

  return isMobile;
}

/* ============================================================
   MINI CART
   ============================================================ */

function MiniCart({
  onClose,
  onCheckout,
  position,
  isMobile,
  modal,
  onMouseEnter,
  onMouseLeave,
}) {
  const { items, totalCount, totalPrice, updateQuantity, removeItem } = useCart();
  const dialogRef = useRef(null);
  const closeButtonRef = useRef(null);

  const hasItems = items.length > 0;

  useEffect(() => {
    const previouslyFocused = document.activeElement;

    if (modal) {
      (closeButtonRef.current ?? dialogRef.current)?.focus({ preventScroll: true });
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (!modal || event.key !== "Tab") return;

      const dialog = dialogRef.current;
      if (!dialog) return;

      const focusable = Array.from(
        dialog.querySelectorAll(
          'button:not(:disabled), a[href], input:not(:disabled), [tabindex]:not([tabindex="-1"])'
        )
      ).filter((element) => element.getClientRects().length > 0);

      if (!focusable.length) {
        event.preventDefault();
        dialog.focus({ preventScroll: true });
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus({ preventScroll: true });
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus({ preventScroll: true });
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);

      if (modal && previouslyFocused instanceof HTMLElement) {
        previouslyFocused.focus({ preventScroll: true });
      }
    };
  }, [onClose, modal]);

  useEffect(() => {
    if (!isMobile) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMobile]);

  const changeQuantity = (item, amount) => {
    updateQuantity(item.id, item.color, item.size, Math.max(1, item.quantity + amount));
  };

  const handleRemove = (item) => {
    removeItem(item.id, item.color, item.size);
  };

  const handleCheckout = () => {
    onClose();
    if (typeof onCheckout === "function") onCheckout();
  };

  return createPortal(
    <>
      {isMobile && (
        <div className="cart-popover-backdrop" onClick={onClose} aria-hidden="true" />
      )}

      <div
        ref={dialogRef}
        id="mini-cart"
        className="cart-popover"
        dir="rtl"
        role="dialog"
        aria-modal={modal ? "true" : undefined}
        aria-labelledby="cart-modal-title"
        tabIndex={-1}
        style={{
          "--cart-top": `${position.top}px`,
          "--cart-left": `${position.left}px`,
        }}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <div className="cart-popover-header">
          <div className="cart-popover-header-main">
            <span id="cart-modal-title" className="cart-popover-title">
              سبد خرید شما
            </span>

            {hasItems && (
              <span className="cart-popover-count">
                {totalCount.toLocaleString("fa-IR")} کالا
              </span>
            )}
          </div>

          <button
            ref={closeButtonRef}
            type="button"
            className="cart-popover-closeBtn"
            onClick={onClose}
            aria-label="بستن سبد خرید"
          >
            <IconClose />
          </button>
        </div>

        {!hasItems && (
          <div className="cart-popover-empty">
            <div className="cart-empty-icon">
              <IconCart />
            </div>

            <p className="cart-popover-empty-title">سبد خرید شما خالی است</p>

            <p className="cart-popover-empty-sub">
              محصولات مورد علاقه خود را به سبد خرید اضافه کنید.
            </p>

            <button type="button" className="cart-empty-continue" onClick={onClose}>
              ادامه خرید
            </button>
          </div>
        )}

        {hasItems && (
          <>
            <ul className="cart-popover-items">
              {items.map((item) => (
                <li
                  key={`${item.id}-${item.color ?? ""}-${item.size ?? ""}`}
                  className="cart-popover-item"
                >
                  <div className="cart-popover-media">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="cart-popover-img"
                        loading="lazy"
                      />
                    ) : (
                      <div className="cart-popover-placeholder">بدون تصویر</div>
                    )}
                  </div>

                  <div className="cart-popover-info">
                    <div className="cart-popover-name" title={item.name}>
                      {item.name}
                    </div>

                    <div className="cart-popover-meta">
                      {item.color && (
                        <span className="cart-mini-chip">
                          رنگ:<span> {item.color}</span>
                        </span>
                      )}

                      {item.size && (
                        <span className="cart-mini-chip">
                          سایز:<span> {item.size}</span>
                        </span>
                      )}
                    </div>

                    <div className="cart-popover-bottom">
                      <strong className="cart-popover-price">{formatPrice(item.price)}</strong>

                      <div className="cart-popover-qty">
                        <button
                          type="button"
                          className="cart-popover-qtyBtn"
                          disabled={item.quantity <= 1}
                          onClick={() => changeQuantity(item, -1)}
                          aria-label={`کاهش تعداد ${item.name}`}
                        >
                          −
                        </button>

                        <span className="cart-popover-qtyValue">
                          {item.quantity.toLocaleString("fa-IR")}
                        </span>

                        <button
                          type="button"
                          className="cart-popover-qtyBtn"
                          onClick={() => changeQuantity(item, 1)}
                          aria-label={`افزایش تعداد ${item.name}`}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="cart-popover-remove"
                    onClick={() => handleRemove(item)}
                    aria-label={`حذف ${item.name}`}
                  >
                    حذف
                  </button>
                </li>
              ))}
            </ul>

            <div className="cart-popover-footer">
              <div className="cart-popover-total">
                <span>مجموع سبد خرید</span>
                <strong>{formatPrice(totalPrice)}</strong>
              </div>

              <button
                type="button"
                className="cart-popover-checkoutBtn"
                onClick={handleCheckout}
              >
                ادامه فرایند خرید
              </button>
            </div>
          </>
        )}
      </div>
    </>,
    document.body
  );
}

/* ============================================================
   HEADER
   ============================================================ */

function Header() {
  const { totalCount, totalPrice } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const isMobile = useIsMobile();

  const [open, setOpen] = useState(false);
  const [focusInside, setFocusInside] = useState(false);
  const [cartPosition, setCartPosition] = useState({ top: 80, left: 12 });

  const headerRef = useRef(null);
  const cartButtonRef = useRef(null);
  const cartCloseTimerRef = useRef(null);

  const updateCartPosition = useCallback(() => {
    const button = cartButtonRef.current;
    if (!button) return;

    const rect = button.getBoundingClientRect();
    let next;

    if (window.innerWidth <= MOBILE_BREAKPOINT) {
      const headerBottom =
        headerRef.current?.getBoundingClientRect().bottom ?? rect.bottom;
      next = { top: Math.round(headerBottom + 8), left: 12 };
    } else {
      const maxLeft = Math.max(12, window.innerWidth - CART_WIDTH - 12);
      next = {
        top: Math.round(rect.bottom + 12),
        left: Math.round(Math.max(12, Math.min(rect.left, maxLeft))),
      };
    }

    setCartPosition((prev) =>
      prev.top === next.top && prev.left === next.left ? prev : next
    );
  }, []);

  const cancelCartClose = useCallback(() => {
    if (cartCloseTimerRef.current) {
      window.clearTimeout(cartCloseTimerRef.current);
      cartCloseTimerRef.current = null;
    }
  }, []);

  const closeCart = useCallback(() => {
    cancelCartClose();
    setOpen(false);
    setFocusInside(false);
  }, [cancelCartClose]);

  const scheduleCartClose = useCallback(() => {
    if (isMobile) return;

    cancelCartClose();
    cartCloseTimerRef.current = window.setTimeout(() => {
      setOpen(false);
      setFocusInside(false);
      cartCloseTimerRef.current = null;
    }, CART_CLOSE_DELAY);
  }, [cancelCartClose, isMobile]);

  const openCart = useCallback(
    (withFocus = false) => {
      cancelCartClose();
      updateCartPosition();
      setFocusInside((prev) => prev || withFocus);
      setOpen(true);
    },
    [cancelCartClose, updateCartPosition]
  );

  const handleCartClick = useCallback(() => {
    if (open && (isMobile || focusInside)) {
      closeCart();
    } else {
      openCart(true);
    }
  }, [open, isMobile, focusInside, closeCart, openCart]);

  useEffect(() => cancelCartClose, [cancelCartClose]);

  useEffect(() => {
    if (!open) return;

    updateCartPosition();

    window.addEventListener("resize", updateCartPosition);
    window.addEventListener("scroll", updateCartPosition, true);

    return () => {
      window.removeEventListener("resize", updateCartPosition);
      window.removeEventListener("scroll", updateCartPosition, true);
    };
  }, [open, updateCartPosition]);

  const handleSearch = (event) => {
    event.preventDefault();

    const query = String(new FormData(event.currentTarget).get("search") || "").trim();
    if (!query) return;

    window.dispatchEvent(new CustomEvent("store:search", { detail: { query } }));

    const url = new URL(window.location.href);
    url.searchParams.set("search", query);
    window.history.replaceState({}, "", url);
  };

  const goToCheckout = useCallback(() => {
    closeCart();
    navigate("/checkout");
  }, [closeCart, navigate]);

  return (
    <>
      <header className="site-header" ref={headerRef}>
        <div className="site-header-top">
          <div className="site-header-top-inner">
            <div className="site-logo">
              <span className="site-logo-icon">🌿</span>

              <div className="site-logo-text">
                <span className="site-logo-title">دمپایی‌فروشی</span>
                <span className="site-logo-tagline">راحتی در هر قدم</span>
              </div>
            </div>

            <form className="site-search" role="search" onSubmit={handleSearch}>
              <button type="submit" className="site-search-submit" aria-label="جستجو">
                <IconSearch />
              </button>

              <input
                type="search"
                name="search"
                placeholder="جستجوی محصول..."
                aria-label="جستجوی محصول"
                autoComplete="off"
              />
            </form>

            <div className="site-header-actions">
              <div
                className="cart-wrapper"
                onMouseEnter={() => {
                  if (!isMobile) openCart();
                }}
                onMouseLeave={scheduleCartClose}
              >
                <button
                  ref={cartButtonRef}
                  type="button"
                  className="header-action-btn"
                  onClick={handleCartClick}
                  aria-label="سبد خرید"
                  aria-haspopup="dialog"
                  aria-expanded={open}
                  aria-controls={open ? "mini-cart" : undefined}
                >
                  <span className="header-action-icon">
                    <IconCart />

                    {totalCount > 0 && (
                      <span className="header-cart-badge">
                        {totalCount.toLocaleString("fa-IR")}
                      </span>
                    )}
                  </span>

                  <span className="header-action-text">
                    <span className="header-action-label">سبد خرید</span>
                    <span className="header-action-value">{formatPrice(totalPrice)}</span>
                  </span>
                </button>
              </div>

              <button
                type="button"
                className="header-action-btn"
                aria-label="حساب کاربری"
                onClick={() => navigate(isAuthenticated ? "/logout" : "/login")}
              >
                <span className="header-action-icon">
                  <IconUser />
                </span>

                <span className="header-action-text">
                  <span className="header-action-label">
                    حساب کاربری
                  </span>

                  <span className="header-action-value">
                    {isAuthenticated
                      ? `سلام، ${user?.name?.trim().split(/\s+/)[0]}`
                      : "ورود / ثبت‌نام"}
                  </span>
                </span>
              </button>
            </div>
          </div>
        </div>

        <div className="site-header-bottom">
          <div className="site-header-bottom-inner">
            <nav className="site-nav" aria-label="منوی اصلی">
              {NAV_ITEMS.map(({ label, href }) => (
                <a key={label} href={href}>
                  {label}
                </a>
              ))}
            </nav>

            <div className="site-shipping-note">
              <IconTruck />
              ارسال سریع به سراسر کشور
            </div>
          </div>
        </div>
      </header>

      {open && (
        <MiniCart
          onClose={closeCart}
          onCheckout={goToCheckout}
          position={cartPosition}
          isMobile={isMobile}
          modal={isMobile || focusInside}
          onMouseEnter={cancelCartClose}
          onMouseLeave={scheduleCartClose}
        />
      )}
    </>
  );
}

export default memo(Header);