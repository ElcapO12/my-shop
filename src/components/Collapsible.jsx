import React, { useLayoutEffect, useMemo, useRef, useState } from "react";

const OPEN_MS = 340;
const CLOSE_MS = 420;
const EASE = "cubic-bezier(.22,1,.36,1)";

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    !!window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches
  );
}

export default function Collapsible({ open, children, className = "" }) {
  const [render, setRender] = useState(open);
  const elRef = useRef(null);

  const waapiAnimRef = useRef(null);
  const cleanupRef = useRef(null);

  const supportsWAAPI = useMemo(() => {
    return typeof Element !== "undefined" && !!Element.prototype?.animate;
  }, []);

  useLayoutEffect(() => {
    const el = elRef.current;

    // اگر باید باز باشد ولی هنوز mount نشده، اول mount کن
    if (open && !render) {
      setRender(true);
      return;
    }

    if (!el || !render) return;

    // cleanup قبلی (برای جلوگیری از setRender دیرهنگام یا لیسنرهای جا مانده)
    waapiAnimRef.current?.cancel?.();
    waapiAnimRef.current = null;

    cleanupRef.current?.();
    cleanupRef.current = null;

    const reduced = prefersReducedMotion();

    // حالت reduce-motion: بدون انیمیشن
    if (reduced) {
      el.style.transition = "";
      el.style.overflow = "";
      el.style.opacity = open ? "1" : "0";
      el.style.height = open ? "auto" : "0px";

      if (!open) setRender(false);
      return;
    }

    const duration = open ? OPEN_MS : CLOSE_MS;

    // آماده‌سازی استایل‌های پایه
    el.style.overflow = "hidden";

    // مقادیر شروع/پایان
    const fromH = open ? 0 : (el.getBoundingClientRect().height || el.scrollHeight);
    const toH = open ? el.scrollHeight : 0;

    // وضعیت اولیه
    el.style.height = `${fromH}px`;
    el.style.opacity = open ? "0" : "1";

    const finish = () => {
      // پاک‌سازی استایل‌ها/حالت نهایی
      el.style.transition = "";

      if (open) {
        el.style.height = "auto";
        el.style.opacity = "1";
        el.style.overflow = "";
      } else {
        // موقع بستن کامل unmount کن تا “خطی/فضای خالی” نمونه
        setRender(false);
      }
    };

    if (supportsWAAPI) {
      waapiAnimRef.current = el.animate(
        [
          { height: `${fromH}px`, opacity: open ? 0 : 1 },
          { height: `${toH}px`, opacity: open ? 1 : 0 },
        ],
        { duration, easing: EASE, fill: "both" }
      );

      waapiAnimRef.current.onfinish = () => {
        waapiAnimRef.current = null;
        finish();
      };

      // اگر وسط کار cancel شد، finish را صدا نزن (تا حالت جدید توسط اثر بعدی تنظیم شود)
      waapiAnimRef.current.oncancel = () => {
        waapiAnimRef.current = null;
      };

      return;
    }

    // Fallback با transition
    el.style.transition = `height ${duration}ms ${EASE}, opacity ${Math.max(
      0,
      duration - 100
    )}ms ease`;

    // force reflow تا مرورگر وضعیت اولیه را “ببیند”
    // eslint-disable-next-line no-unused-expressions
    el.getBoundingClientRect();

    requestAnimationFrame(() => {
      el.style.height = `${toH}px`;
      el.style.opacity = open ? "1" : "0";
    });

    const onEnd = (e) => {
      // transitionend برای opacity هم میاد؛ ما فقط height رو ملاک می‌گیریم
      if (e.propertyName !== "height") return;
      el.removeEventListener("transitionend", onEnd);
      clearTimeout(fallbackTimer);
      finish();
    };

    // بکاپ: اگر transitionend نیومد (شرایط خاص)، بعد از duration جمع کن
    const fallbackTimer = window.setTimeout(() => {
      el.removeEventListener("transitionend", onEnd);
      finish();
    }, duration + 60);

    el.addEventListener("transitionend", onEnd);

    cleanupRef.current = () => {
      el.removeEventListener("transitionend", onEnd);
      clearTimeout(fallbackTimer);
      el.style.transition = "";
    };
  }, [open, render, supportsWAAPI]);

  if (!render) return null;

  return (
    <div
      ref={elRef}
      className={className}
      style={{ willChange: "height, opacity" }}
    >
      {children}
    </div>
  );
}