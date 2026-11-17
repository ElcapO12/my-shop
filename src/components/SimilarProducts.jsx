import React, { memo, useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";

function formatPrice(num) {
  return `${Number(num || 0).toLocaleString("fa-IR")} تومان`;
}

function SimilarProducts({ items = [], title = "محصولات مشابه", onItemClick }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    dragFree: true,
    direction: "rtl",
  });

  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);
  const [progress, setProgress] = useState(0);

  const update = useCallback(() => {
    if (!emblaApi) return;
    setCanPrev(emblaApi.canScrollPrev());
    setCanNext(emblaApi.canScrollNext());
    setProgress(emblaApi.scrollProgress());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    update();
    emblaApi.on("reInit", update);
    emblaApi.on("select", update);
    emblaApi.on("scroll", update);
    return () => {
      emblaApi.off("reInit", update);
      emblaApi.off("select", update);
      emblaApi.off("scroll", update);
    };
  }, [emblaApi, update]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  if (!items?.length) return null;

  return (
    <section dir="rtl" className="pd2-wrap sim">
      <div className="pd2-panel">
        {/* هدر شبیه پنل‌های بالایی */}
        <div className="pd2-head sim__headFix" style={{ cursor: "default" }}>
          <span>{title}</span>

          <div className="sim__nav">
            <button
              type="button"
              className="sim__btn"
              onClick={scrollPrev}
              disabled={!canPrev}
              aria-label="قبلی"
            >
              ‹
            </button>
            <button
              type="button"
              className="sim__btn"
              onClick={scrollNext}
              disabled={!canNext}
              aria-label="بعدی"
            >
              ›
            </button>
          </div>
        </div>

        {/* بدنه */}
        <div className="sim__viewport" ref={emblaRef}>
          <div className="sim__container">
            {items.map((p) => (
              <div className="sim__slide" key={p.id}>
                {/* کارت به صورت div، نه button */}
                <div
                  className="sim__card"
                  role="button"
                  tabIndex={0}
                  onClick={() => onItemClick?.(p)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onItemClick?.(p);
                    }
                  }}
                  aria-label={`مشاهده ${p.name}`}
                >
                  <div className="sim__media">
                    <img
                      className="sim__img"
                      src={p.image}
                      alt={p.name}
                      loading="lazy"
                      draggable="false"
                    />
                  </div>

                  <div className="sim__body">
                    <div className="sim__name" title={p.name}>
                      {p.name}
                    </div>

                    <div className="sim__prices">
                      <span className="sim__price">{formatPrice(p.price)}</span>

                      {Number(p.discountPercent) > 0 && (
                        <span className="sim__discount">
                          {Number(p.discountPercent).toLocaleString("fa-IR")}٪
                        </span>
                      )}

                      {!!p.oldPrice && (
                        <span className="sim__old">
                          {formatPrice(p.oldPrice)}
                        </span>
                      )}
                    </div>

                    <div className="sim__rating">
                      <span className="sim__stars">★★★★★</span>
                      <span className="sim__score">{p.rating}</span>
                    </div>

                    {/* دکمه داخل کارت */}
                    <button
                      type="button"
                      className="sim__selectBtn"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation(); // نذاره کلیک کارت هم اجرا بشه
                        onItemClick?.(p);
                      }}
                    >
                      مشاهده و انتخاب محصول
                      <span aria-hidden="true">←</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* نوار پیشرفت */}
        <div className="sim__progress" aria-hidden="true">
          <div
            className="sim__progressBar"
            style={{ transform: `scaleX(${Math.max(0.001, progress)})` }}
          />
        </div>
      </div>
    </section>
  );
}

export default memo(SimilarProducts);