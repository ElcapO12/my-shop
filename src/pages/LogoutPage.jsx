// src/pages/LogoutPage.jsx

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function LogoutPage() {
  const { logout } = useAuth();
  const [done, setDone] = useState(false);

  useEffect(() => {
    let cancelled = false;
    document.title = "خروج | پارس‌کفش";
    logout().finally(() => {
      if (!cancelled) setDone(true);
    });
    return () => {
      cancelled = true;
    };
  }, [logout]);

  return (
    <main className="auth-page">
      <div className="auth-card auth-card--center">
        <span className="auth-done-icon" aria-hidden="true">{done ? "✓" : "…"}</span>
        <h1 className="auth-title">{done ? "با موفقیت خارج شدید" : "در حال خروج..."}</h1>
        <p className="auth-sub">{done ? "امیدواریم دوباره شما را ببینیم." : "لطفاً چند لحظه صبر کنید."}</p>

        {done && (
          <div className="auth-actions">
            <Link to="/login" className="auth-submit">ورود دوباره</Link>
            <Link to="/" className="auth-ghost">بازگشت به فروشگاه</Link>
          </div>
        )}
      </div>
    </main>
  );
}
