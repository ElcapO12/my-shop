// src/pages/LoginPage.jsx

import React, { useEffect, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const IconEye = ({ off }) => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
    <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6" />
    {off && <path d="M4 4l16 16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />}
  </svg>
);

function validate(mode, values) {
  const errors = {};
  if (mode === "register" && values.name.trim().length < 2) {
    errors.name = "نام خود را وارد کنید.";
  }
  if (!EMAIL_RE.test(values.email.trim())) {
    errors.email = "یک ایمیل معتبر وارد کنید.";
  }
  if (values.password.length < 6) {
    errors.password = "رمز عبور باید حداقل ۶ کاراکتر باشد.";
  }
  if (mode === "register" && values.confirm !== values.password) {
    errors.confirm = "تکرار رمز عبور با رمز عبور یکسان نیست.";
  }
  return errors;
}

export default function LoginPage() {
  const { isAuthenticated, login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from?.pathname || "/";

  const [mode, setMode] = useState(location.pathname === "/register" ? "register" : "login");
  const [values, setValues] = useState({ name: "", email: "", password: "", confirm: "" });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    document.title = mode === "login" ? "ورود | پارس‌کفش" : "ثبت‌نام | پارس‌کفش";
  }, [mode]);

  if (isAuthenticated && !busy) {
    return <Navigate to={redirectTo} replace />;
  }

  const switchMode = (next) => {
    setMode(next);
    setErrors({});
    setFormError("");
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
    if (formError) setFormError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = validate(mode, values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setBusy(true);
    setFormError("");
    try {
      if (mode === "login") {
        await login({ email: values.email, password: values.password });
      } else {
        await register({ name: values.name, email: values.email, password: values.password });
      }
      navigate(redirectTo, { replace: true });
    } catch (error) {
      setFormError(error.message || "خطایی رخ داد. دوباره تلاش کنید.");
      setBusy(false);
    }
  };

  const isLogin = mode === "login";

  return (
    <main className="auth-page">
      <div className="auth-card">
        <Link to="/" className="auth-brand" aria-label="بازگشت به صفحهٔ اصلی">
          <span className="auth-brand-icon" aria-hidden="true">👣</span>
          <span>پارس‌کفش</span>
        </Link>

        <h1 className="auth-title">{isLogin ? "ورود به حساب کاربری" : "ایجاد حساب جدید"}</h1>
        <p className="auth-sub">
          {isLogin ? "برای ادامهٔ خرید وارد شوید." : "در چند ثانیه ثبت‌نام کنید و خرید را شروع کنید."}
        </p>

        <div className="auth-tabs" role="tablist">
          <button type="button" role="tab" aria-selected={isLogin} className={isLogin ? "is-active" : ""} onClick={() => switchMode("login")}>
            ورود
          </button>
          <button type="button" role="tab" aria-selected={!isLogin} className={!isLogin ? "is-active" : ""} onClick={() => switchMode("register")}>
            ثبت‌نام
          </button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          {!isLogin && (
            <div className="auth-field">
              <label htmlFor="auth-name">نام و نام خانوادگی</label>
              <input
                id="auth-name"
                name="name"
                type="text"
                autoComplete="name"
                value={values.name}
                onChange={handleChange}
                aria-invalid={Boolean(errors.name)}
              />
              {errors.name && <small className="auth-error">{errors.name}</small>}
            </div>
          )}

          <div className="auth-field">
            <label htmlFor="auth-email">ایمیل</label>
            <input
              id="auth-email"
              name="email"
              type="email"
              dir="ltr"
              autoComplete="email"
              placeholder="name@example.com"
              value={values.email}
              onChange={handleChange}
              aria-invalid={Boolean(errors.email)}
            />
            {errors.email && <small className="auth-error">{errors.email}</small>}
          </div>

          <div className="auth-field">
            <label htmlFor="auth-password">رمز عبور</label>
            <div className="auth-password">
              <input
                id="auth-password"
                name="password"
                type={showPassword ? "text" : "password"}
                dir="ltr"
                autoComplete={isLogin ? "current-password" : "new-password"}
                value={values.password}
                onChange={handleChange}
                aria-invalid={Boolean(errors.password)}
              />
              <button
                type="button"
                className="auth-eye"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "پنهان کردن رمز عبور" : "نمایش رمز عبور"}
              >
                <IconEye off={showPassword} />
              </button>
            </div>
            {errors.password && <small className="auth-error">{errors.password}</small>}
          </div>

          {!isLogin && (
            <div className="auth-field">
              <label htmlFor="auth-confirm">تکرار رمز عبور</label>
              <input
                id="auth-confirm"
                name="confirm"
                type={showPassword ? "text" : "password"}
                dir="ltr"
                autoComplete="new-password"
                value={values.confirm}
                onChange={handleChange}
                aria-invalid={Boolean(errors.confirm)}
              />
              {errors.confirm && <small className="auth-error">{errors.confirm}</small>}
            </div>
          )}

          {formError && (
            <div className="auth-alert" role="alert">
              {formError}
            </div>
          )}

          <button type="submit" className="auth-submit" disabled={busy}>
            {busy ? "لطفاً صبر کنید..." : isLogin ? "ورود" : "ثبت‌نام"}
          </button>
        </form>

        <p className="auth-switch">
          {isLogin ? "حساب کاربری ندارید؟" : "قبلاً ثبت‌نام کرده‌اید؟"}{" "}
          <button type="button" onClick={() => switchMode(isLogin ? "register" : "login")}>
            {isLogin ? "ثبت‌نام کنید" : "وارد شوید"}
          </button>
        </p>
      </div>
    </main>
  );
}
