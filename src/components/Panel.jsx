import React, { useState } from "react";

export default function Panel({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);

  const toggle = () => setOpen((prev) => !prev);

  const chevClass = `pd-chev${open ? " pd-chev--rot" : ""}`;
  const bodyClass = `pd-body${open ? " pd-body--open" : ""}`;

  return (
    <div className="pd-panel">
      <button
        type="button"
        className="pd-head"
        onClick={toggle}
        aria-expanded={open}
      >
        <span>{title}</span>

        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          className={chevClass}
        >
          <path
            d="M7 10l5 5 5-5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <div className={bodyClass}>
        <div className="pd-content">{children}</div>
      </div>
    </div>
  );
}