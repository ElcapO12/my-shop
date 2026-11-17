import React from "react";

const BADGES = [
  {
    title: "ارسال سریع",
    subtitle: "به سراسر کشور",
    icon: (
      <svg viewBox="0 0 24 24" width="26" height="26" fill="none">
        <path
          d="M3 7h11v8H3V7Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <path
          d="M14 10h3.5L20 13v2h-6v-5Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <circle cx="7" cy="17.5" r="1.6" stroke="currentColor" strokeWidth="1.4" />
        <circle cx="17" cy="17.5" r="1.6" stroke="currentColor" strokeWidth="1.4" />
      </svg>
    ),
  },
  {
    title: "پرداخت امن",
    subtitle: "درگاه بانکی معتبر",
    icon: (
      <svg viewBox="0 0 24 24" width="26" height="26" fill="none">
        <path
          d="M12 3l7 3v5c0 5-3.2 8.4-7 10-3.8-1.6-7-5-7-10V6l7-3Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <path
          d="M9 12l2 2 4-4"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: "ضمانت اصالت کالا",
    subtitle: "خرید با اطمینان",
    icon: (
      <svg viewBox="0 0 24 24" width="26" height="26" fill="none">
        <path
          d="M12 3l7 3v5c0 5-3.2 8.4-7 10-3.8-1.6-7-5-7-10V6l7-3Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <path
          d="M9 12l2 2 4-4"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: "پشتیبانی ۲۴ ساعته",
    subtitle: "پاسخگویی سریع",
    icon: (
      <svg viewBox="0 0 24 24" width="26" height="26" fill="none">
        <path
          d="M4 13v-1a8 8 0 0 1 16 0v1"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <rect
          x="3"
          y="13"
          width="4"
          height="6"
          rx="1.4"
          stroke="currentColor"
          strokeWidth="1.6"
        />
        <rect
          x="17"
          y="13"
          width="4"
          height="6"
          rx="1.4"
          stroke="currentColor"
          strokeWidth="1.6"
        />
      </svg>
    ),
  },
];

export default function TrustBadges() {
  return (
    <div className="trust-badges" dir="rtl">
      {BADGES.map((b, i) => (
        <div className="trust-badges-item" key={i}>
          <div className="trust-badges-text">
            <div className="trust-badges-title">{b.title}</div>
            <div className="trust-badges-subtitle">{b.subtitle}</div>
          </div>
          <div className="trust-badges-icon">{b.icon}</div>
        </div>
      ))}
    </div>
  );
}