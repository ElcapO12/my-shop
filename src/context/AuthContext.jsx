// src/context/AuthContext.jsx
//
// نکته: این نسخه فقط برای فرانت‌اند و آزمایشی است (اطلاعات در localStorage مرورگر ذخیره می‌شود).
// برای سایت واقعی، سه تابع apiLogin / apiRegister / apiLogout را به بک‌اند خودتان وصل کنید
// (ترجیحاً با کوکی httpOnly). بقیهٔ برنامه نیازی به تغییر ندارد.

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const SESSION_KEY = "parskafsh:session";
const USERS_KEY = "parskafsh:users";

/* ---------- storage helpers ---------- */

function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage may be blocked */
  }
}

async function hashPassword(password) {
  if (!window.crypto?.subtle) return password; // fallback (محیط ناامن)
  const data = new TextEncoder().encode(`parskafsh::${password}`);
  const digest = await window.crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/* ---------- "API" (جایگزین با بک‌اند واقعی) ---------- */

async function apiRegister({ name, email, password }) {
  const users = readJSON(USERS_KEY, []);
  const normalized = email.trim().toLowerCase();
  if (users.some((u) => u.email === normalized)) {
    throw new Error("این ایمیل قبلاً ثبت‌نام کرده است.");
  }
  users.push({ name: name.trim(), email: normalized, passwordHash: await hashPassword(password) });
  writeJSON(USERS_KEY, users);
  return { name: name.trim(), email: normalized };
}

async function apiLogin({ email, password }) {
  const users = readJSON(USERS_KEY, []);
  const normalized = email.trim().toLowerCase();
  const user = users.find((u) => u.email === normalized);
  const hash = await hashPassword(password);
  if (!user || user.passwordHash !== hash) {
    throw new Error("ایمیل یا رمز عبور اشتباه است.");
  }
  return { name: user.name, email: user.email };
}

async function apiLogout() {
  return true;
}

/* ---------- context ---------- */

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => readJSON(SESSION_KEY, null));

  // همگام‌سازی بین تب‌ها (ورود/خروج در یک تب، تب‌های دیگر را هم به‌روز می‌کند)
  useEffect(() => {
    const onStorage = (event) => {
      if (event.key === SESSION_KEY) setUser(readJSON(SESSION_KEY, null));
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const persist = useCallback((nextUser) => {
    setUser(nextUser);
    if (nextUser) writeJSON(SESSION_KEY, nextUser);
    else {
      try {
        localStorage.removeItem(SESSION_KEY);
      } catch {
        /* ignore */
      }
    }
  }, []);

  const login = useCallback(
    async (credentials) => {
      const nextUser = await apiLogin(credentials);
      persist(nextUser);
      return nextUser;
    },
    [persist]
  );

  const register = useCallback(
    async (data) => {
      const nextUser = await apiRegister(data);
      persist(nextUser);
      return nextUser;
    },
    [persist]
  );

  const logout = useCallback(async () => {
    await apiLogout();
    persist(null);
  }, [persist]);

  const value = useMemo(
    () => ({ user, isAuthenticated: Boolean(user), login, register, logout }),
    [user, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
