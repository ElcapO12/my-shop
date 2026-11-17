import React, {
  memo,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

function ProductDetails({ description, specs = [], sizeGuide = [] }) {
  const [open, setOpen] = useState(false);

  const wrapRef = useRef(null); // ظرف انیمیشن (max-height)
  const innerRef = useRef(null); // محتوای واقعی (برای اندازه‌گیری)

  // ارتفاع محتوا را در CSS variable ذخیره کن
  const setHeightVar = useCallback(() => {
    const wrapEl = wrapRef.current;
    const innerEl = innerRef.current;
    if (!wrapEl || !innerEl) return;

    const h = innerEl.scrollHeight || 0;
    wrapEl.style.setProperty("--h", `${h}px`);
  }, []);

  useLayoutEffect(() => {
    setHeightVar(); // اولین اندازه‌گیری
  }, [setHeightVar]);

  useEffect(() => {
    // اگر محتوا تغییر کرد/ریسایز شد، ارتفاع را به‌روز کن
    if (typeof ResizeObserver === "undefined") return;

    const ro = new ResizeObserver(() => setHeightVar());
    if (innerRef.current) ro.observe(innerRef.current);

    return () => ro.disconnect();
  }, [setHeightVar]);

  const toggle = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();

      // قبل از تغییر حالت، ارتفاع را ست کن تا انیمیشن بدون گیر شروع شود
      setHeightVar();
      setOpen((v) => !v);
    },
    [setHeightVar]
  );

  return (
    <section dir="rtl" className="pd2-wrap">
      <div className="pd2-panel">
        <button
          type="button"
          className="pd2-head"
          aria-expanded={open}
          onClick={toggle}
        >
          <span>مشخصات محصول</span>
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

        {/* بدنه: max-height بر اساس --h انیمیت می‌شود */}
        <div
          ref={wrapRef}
          className={`pd2-coll ${open ? "is-open" : ""}`}
          aria-hidden={!open}
        >
          <div ref={innerRef} className="pd2-content">
            <div className="pd2-grid">
              {/* بالا چپ: راهنمای سایز */}
              <div className="pd2-col-size">
                <div className="pd2-sizeBox">
                  <h4 className="pd2-sub">راهنمای سایز</h4>

                  {sizeGuide?.length ? (
                    <>
                      <div className="pd2-scroll">
                        <table className="pd2-sizeTable">
                          <thead>
                            <tr>
                              <th>سایز (EU)</th>
                              <th>طول کف پا (cm)</th>
                            </tr>
                          </thead>
                          <tbody>
                            {sizeGuide.map((row, idx) => (
                              <tr key={idx}>
                                <td>
                                  <span className="pd2-chip pd2-chip-eu">
                                    {row.eu}
                                  </span>
                                </td>
                                <td>
                                  <span className="pd2-chip pd2-chip-len">
                                    {row.length}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      <p className="pd2-size-note">
                        نکته: طول کف پا را از پاشنه تا نوک بلندترین انگشت اندازه
                        بگیرید. اگر بین دو سایز بودید، یک سایز بزرگ‌تر انتخاب
                        کنید.
                      </p>
                    </>
                  ) : (
                    <p className="pd2-size-note">راهنمای سایز در دسترس نیست.</p>
                  )}
                </div>
              </div>

              {/* بالا راست: مشخصات */}
              <div className="pd2-col-specs">
                <div className="pd2-box">
                  <h4 className="pd2-sub">مشخصات</h4>

                  {specs?.length ? (
                    <ul className="pd2-specs">
                      {specs.map((row, i) => (
                        <li key={i} className="pd2-spec-item">
                          <span className="pd2-spec-label">{row.label}</span>
                          <span className="pd2-spec-value">{row.value}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>مشخصاتی ثبت نشده است.</p>
                  )}
                </div>
              </div>

              {/* پایین: توضیحات – کل عرض */}
              <div className="pd2-col-desc">
                <div className="pd2-box">
                  <h4 className="pd2-sub">توضیحات</h4>
                  <p className="pd2-desc">
                    {description || "توضیحاتی ثبت نشده است."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default memo(ProductDetails);