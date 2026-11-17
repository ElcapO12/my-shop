import React, {
  memo,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

function ProductFAQ({ items = [], defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);

  const wrapRef = useRef(null);  // ظرف انیمیشن (max-height)
  const innerRef = useRef(null); // محتوای واقعی (برای اندازه‌گیری)

  const setHeightVar = useCallback(() => {
    const wrapEl = wrapRef.current;
    const innerEl = innerRef.current;
    if (!wrapEl || !innerEl) return;

    const h = innerEl.scrollHeight || 0;
    wrapEl.style.setProperty("--h", `${h}px`);
  }, []);

  useLayoutEffect(() => {
    setHeightVar();
  }, [setHeightVar]);

  useEffect(() => {
    if (typeof ResizeObserver === "undefined") return;

    const ro = new ResizeObserver(() => setHeightVar());
    if (innerRef.current) ro.observe(innerRef.current);

    return () => ro.disconnect();
  }, [setHeightVar]);

  const toggle = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();

      setHeightVar();
      setOpen((v) => !v);
    },
    [setHeightVar]
  );

  // اگر آیتمی نیست، هیچی نشون نده
  if (!items?.length) return null;

  return (
    <section dir="rtl" className="pd2-wrap">
      <div className="pd2-panel">
        <button
          type="button"
          className="pd2-head"
          aria-expanded={open}
          onClick={toggle}
        >
          <span>سوالات رایج</span>
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            className={`pd2-chev ${open ? "pd2-chev--rot" : ""}`}
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

        <div
          ref={wrapRef}
          className={`pd2-coll ${open ? "is-open" : ""}`}
          aria-hidden={!open}
        >
          <div ref={innerRef} className="pd2-content">
            {items.map((it, i) => (
              <details
                key={i}
                className="pd2-box"
                style={{ marginBottom: 10 }}
                onToggle={() => requestAnimationFrame(setHeightVar)}
              >
                <summary style={{ fontWeight: 800, cursor: "pointer" }}>
                  {it.q}
                </summary>
                <p style={{ margin: "10px 0 0", color: "#334155", lineHeight: 1.9 }}>
                  {it.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default memo(ProductFAQ);