// src/components/ScrollToTop.jsx
// با هر تغییر صفحه، اسکرول را به بالا برمی‌گرداند (یا به المان #hash اگر وجود داشته باشد).
// دکمهٔ Back/Forward مرورگر همچنان جای قبلی اسکرول را برمی‌گرداند.

import { useLayoutEffect } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname, search, hash } = useLocation();
  const navigationType = useNavigationType();

  useLayoutEffect(() => {
    if (navigationType === "POP") return;

    if (hash) {
      const target = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (target) {
        target.scrollIntoView();
        return;
      }
    }

    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname, search, hash, navigationType]);

  return null;
}
