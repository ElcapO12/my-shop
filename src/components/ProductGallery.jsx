import React, { useCallback, useState } from "react";

export default function ProductGallery({ images = [] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const hasImages = images.length > 0;

  const goPrev = useCallback(() => {
    setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  const goNext = useCallback(() => {
    setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  const setActive = useCallback((i) => setActiveIndex(i), []);

  if (!hasImages) {
    return <section className="gallery">تصویری برای نمایش وجود ندارد.</section>;
  }

  return (
    <section className="gallery">
      <div className="gallery-thumbs">
        {images.map((img, i) => {
          const isActive = i === activeIndex;

          return (
            <button
              key={i}
              type="button"
              aria-label={`نمایش تصویر ${i + 1}`}
              aria-pressed={isActive}
              className={`thumb${isActive ? " thumb--active" : ""}`}
              onClick={() => setActive(i)}
            >
              <img src={img} alt={`تصویر ${i + 1}`} />
            </button>
          );
        })}
      </div>

      <div className="gallery-main">
        <img src={images[activeIndex]} alt={`تصویر ${activeIndex + 1} محصول`} />

        <button
          type="button"
          className="gallery-arrow gallery-arrow--left"
          onClick={goPrev}
          aria-label="تصویر قبلی"
        >
          ‹
        </button>

        <button
          type="button"
          className="gallery-arrow gallery-arrow--right"
          onClick={goNext}
          aria-label="تصویر بعدی"
        >
          ›
        </button>

        <div className="gallery-dots">
          {images.map((_, i) => {
            const isActive = i === activeIndex;

            return (
              <button
                key={i}
                type="button"
                aria-label={`رفتن به تصویر ${i + 1}`}
                className={`dot${isActive ? " dot--active" : ""}`}
                onClick={() => setActive(i)}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}