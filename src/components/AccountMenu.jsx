// src/components/AccountMenu.jsx
// داخل Header.jsx استفاده کنید: <AccountMenu />

import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function AccountMenu() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <Link to="/login" className="account-link">
        ورود / ثبت‌نام
      </Link>
    );
  }

  return (
    <span className="account-menu">
      <span className="account-name">سلام، {user.name.split(" ")[0]}</span>
      <Link to="/logout" className="account-link">
        خروج
      </Link>
    </span>
  );
}

