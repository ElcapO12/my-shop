import React, {
  memo,
  useState,
  useEffect,
  useMemo,
  useRef,
} from "react";

/* ============================================================
   SAMPLE DATA
   ============================================================ */

const SAMPLE_SUMMARY = {
  average: 4.7,
  total: 12,
  breakdown: [
    { stars: 5, count: 9 },
    { stars: 4, count: 2 },
    { stars: 3, count: 1 },
    { stars: 2, count: 0 },
    { stars: 1, count: 0 },
  ],
};

const SAMPLE_REVIEWS = [
  {
    id: 1,
    name: "محمد رضایی",
    date: "1402/05/01",
    rating: 5,
    text: "واقعا راحت و نرم هست. بعد از چند ساعت پا رو اذیت نمی‌کند، کیفیت نسبت به قیمتش عالیه.",
  },
  {
    id: 2,
    name: "سارا احمدی",
    date: "1402/04/25",
    rating: 4,
    text: "طراحی ساده و شیک داره. جنس رویه خوبه، تنها نکته اینه که کمی قالبش کوچیکه.",
  },
  {
    id: 3,
    name: "علی کریمی",
    date: "1402/04/10",
    rating: 5,
    text: "نسبت به قیمتش خیلی خوبه، برای استفاده روزمره مناسب هست.",
  },
  {
    id: 4,
    name: "مهدی حسینی",
    date: "1402/03/28",
    rating: 4,
    text: "کیفیت دوخت خوبه، فقط یه کم سفت بود که بعد چند روز راه رفتن بهتر شد.",
  },
  {
    id: 5,
    name: "زهرا محمدی",
    date: "1402/03/15",
    rating: 5,
    text: "رنگش دقیقا مثل عکسه، سایزبندیش هم استاندارده.",
  },
  {
    id: 6,
    name: "آرمان رستمی",
    date: "1402/03/05",
    rating: 3,
    text: "بد نیست، اما انتظار داشتم زیره نرم‌تری داشته باشه.",
  },
  {
    id: 7,
    name: "شبنم موسوی",
    date: "1402/02/25",
    rating: 5,
    text: "برای پیاده‌روی طولانی استفاده کردم، اصلا پام رو نزد.",
  },
];

const SAMPLE_QUESTIONS = [
  {
    id: 1,
    question: "سلام، این مدل برای سایز ۴۳ هم موجوده؟",
    answer:
      "بله، این مدل تا سایز ۴۵ موجود است. لطفاً هنگام ثبت سفارش، سایز مورد نظر را انتخاب کنید.",
  },
  {
    id: 2,
    question: "جنس رویه این دمپایی از چیه؟",
    answer:
      "رویه این مدل از چرم مصنوعی با کیفیت است که مقاومت خوبی در برابر سایش و رطوبت دارد.",
  },
  {
    id: 3,
    question: "قالب کفش بزرگه یا کوچیک؟",
    answer:
      "قالب این مدل تقریبا استاندارد است؛ اگر بین دو سایز هستید یک سایز بزرگ‌تر انتخاب کنید.",
  },
  {
    id: 4,
    question: "برای استفاده روزمره توی خونه هم مناسبه؟",
    answer: "بله، زیره این مدل ضد لغزش است و برای استفاده روزمره مشکلی ندارد.",
  },
  {
    id: 5,
    question: "امکان شستشو با ماشین لباسشویی داره؟",
    answer:
      "خیر، بهتر است برای شستشو از دست و مواد شوینده ملایم استفاده کنید.",
  },
  {
    id: 6,
    question: "رنگ‌بندی دیگه‌ای هم داره؟",
    answer:
      "بله، این مدل در چند رنگ مختلف موجود است که در صفحه محصول قابل انتخاب است.",
  },
  {
    id: 7,
    question: "زیره کفش سر نیست روی سرامیک خیس؟",
    answer:
      "زیره از جنس PU ضد لغزش است، اما روی سطوح بسیار خیس همیشه با احتیاط راه بروید.",
  },
];

/* ============================================================
   CONSTANTS & HELPERS
   ============================================================ */

const MAX_COLLAPSED_ITEMS = 5;

const NAME_MAX = 40;
const TEXT_MIN = 10;
const TEXT_MAX = 600;

const QUESTION_MIN = 5;
const QUESTION_MAX = 300;

const RATING_LABELS = ["", "خیلی بد", "بد", "متوسط", "خوب", "عالی"];

const EMPTY_FORM = { name: "", rating: 0, text: "" };

const toFa = (value) => Number(value || 0).toLocaleString("fa-IR");

/** تاریخ امروز به شمسی با ارقام لاتین (مثل دیدگاه‌های نمونه: 1402/05/01) */
function todayJalali() {
  try {
    return new Date().toLocaleDateString("fa-IR-u-ca-persian-nu-latn", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  } catch {
    return new Date().toLocaleDateString("fa-IR");
  }
}

function storageKey(productId, kind = "reviews") {
  return `product-${kind}:${productId}`;
}

function loadStored(productId, kind = "reviews") {
  if (productId === undefined || productId === null) return [];

  try {
    const raw = window.localStorage.getItem(storageKey(productId, kind));
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function validate({ name, rating, text }) {
  const errors = {};

  if (name.trim().length < 2) errors.name = "نام خود را وارد کنید.";
  if (!rating) errors.rating = "لطفاً امتیاز خود را انتخاب کنید.";

  const length = text.trim().length;
  if (length < TEXT_MIN) {
    errors.text = `متن دیدگاه باید حداقل ${toFa(TEXT_MIN)} حرف باشد.`;
  }

  return errors;
}

function validateQuestion(text) {
  const length = text.trim().length;

  if (length < QUESTION_MIN) {
    return `متن پرسش باید حداقل ${toFa(QUESTION_MIN)} حرف باشد.`;
  }

  return "";
}

/* ============================================================
   STAR RATING INPUT
   ============================================================ */

function StarRatingInput({ value, onChange, hasError, firstStarRef }) {
  const [hover, setHover] = useState(0);
  const shown = hover || value;

  return (
    <div className="rv__starInputWrap">
      <div
        className="rv__starInput"
        role="radiogroup"
        aria-label="امتیاز شما"
        aria-invalid={hasError || undefined}
        onMouseLeave={() => setHover(0)}
      >
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            ref={star === 1 ? firstStarRef : undefined}
            type="button"
            role="radio"
            aria-checked={value === star}
            aria-label={`${toFa(star)} ستاره – ${RATING_LABELS[star]}`}
            className={`rv__starBtn ${star <= shown ? "is-on" : ""}`}
            onMouseEnter={() => setHover(star)}
            onFocus={() => setHover(star)}
            onBlur={() => setHover(0)}
            onClick={() => onChange(star)}
          >
            ★
          </button>
        ))}
      </div>

      <span className="rv__starHint" aria-live="polite">
        {shown ? RATING_LABELS[shown] : ""}
      </span>
    </div>
  );
}

/* ============================================================
   PRODUCT REVIEWS
   ------------------------------------------------------------
   props:
   - summary / reviews / questions : مثل قبل
   - productId        : (اختیاری) برای ذخیرهٔ دیدگاه‌های کاربر در localStorage
   - onSubmitReview   : (اختیاری) callback(review) برای ارسال به سرور
   - onSubmitQuestion : (اختیاری) callback(question) برای ارسال پرسش به سرور
   ============================================================ */

function ProductReviews({
  summary = SAMPLE_SUMMARY,
  reviews = SAMPLE_REVIEWS,
  questions = SAMPLE_QUESTIONS,
  productId,
  onSubmitReview,
  onSubmitQuestion,
}) {
  const [activeTab, setActiveTab] = useState("reviews"); // تب فعال
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [showAllQuestions, setShowAllQuestions] = useState(false);

  /* ---------- Review form state ---------- */
  const [userReviews, setUserReviews] = useState(() => loadStored(productId, "reviews"));
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  /* ---------- Question form state ---------- */
  const [userQuestions, setUserQuestions] = useState(() => loadStored(productId, "questions"));
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [questionText, setQuestionText] = useState("");
  const [questionError, setQuestionError] = useState("");
  const [questionSubmitted, setQuestionSubmitted] = useState(false);

  const nameRef = useRef(null);
  const starRef = useRef(null);
  const textRef = useRef(null);
  const questionRef = useRef(null);

  // ذخیرهٔ دیدگاه‌ها و پرسش‌های کاربر
  useEffect(() => {
    if (productId === undefined || productId === null) return;

    try {
      window.localStorage.setItem(storageKey(productId, "reviews"), JSON.stringify(userReviews));
    } catch {
      /* حافظه پر یا غیرفعال است؛ دیدگاه فقط تا بستن صفحه می‌ماند */
    }
  }, [userReviews, productId]);

  useEffect(() => {
    if (productId === undefined || productId === null) return;

    try {
      window.localStorage.setItem(storageKey(productId, "questions"), JSON.stringify(userQuestions));
    } catch {
      /* حافظه پر یا غیرفعال است؛ پرسش فقط تا بستن صفحه می‌ماند */
    }
  }, [userQuestions, productId]);

  // پیام‌های موفقیت بعد از چند ثانیه محو می‌شوند
  useEffect(() => {
    if (!submitted) return;

    const timer = window.setTimeout(() => setSubmitted(false), 6000);
    return () => window.clearTimeout(timer);
  }, [submitted]);

  useEffect(() => {
    if (!questionSubmitted) return;

    const timer = window.setTimeout(() => setQuestionSubmitted(false), 6000);
    return () => window.clearTimeout(timer);
  }, [questionSubmitted]);

  // فوکوس روی اولین فیلد هنگام باز شدن فرم‌ها
  useEffect(() => {
    if (showForm) nameRef.current?.focus({ preventScroll: true });
  }, [showForm]);

  useEffect(() => {
    if (showQuestionForm) questionRef.current?.focus({ preventScroll: true });
  }, [showQuestionForm]);

  /* ---------- Merge user reviews into stats ---------- */
  const allReviews = useMemo(() => [...userReviews, ...reviews], [userReviews, reviews]);
  const allQuestions = useMemo(() => [...userQuestions, ...questions], [userQuestions, questions]);

  const stats = useMemo(() => {
    const baseTotal = Number(summary?.total || reviews.length || 0);
    const baseAverage = Number(summary?.average || 0);

    const baseBreakdown = [5, 4, 3, 2, 1].map((stars) => ({
      stars,
      count: summary?.breakdown?.find((b) => b.stars === stars)?.count ?? 0,
    }));

    if (!userReviews.length) {
      return { average: baseAverage, total: baseTotal, breakdown: baseBreakdown };
    }

    const extraSum = userReviews.reduce((sum, r) => sum + r.rating, 0);
    const total = baseTotal + userReviews.length;
    const average = total ? (baseAverage * baseTotal + extraSum) / total : 0;

    const breakdown = baseBreakdown.map((row) => ({
      stars: row.stars,
      count: row.count + userReviews.filter((r) => r.rating === row.stars).length,
    }));

    return { average, total, breakdown };
  }, [summary, reviews, userReviews]);

  const avgDisplay = Number(stats.average.toFixed(1)).toLocaleString("fa-IR");
  const maxScoreDisplay = toFa(5);
  const totalReviews = stats.total;
  const totalQuestions = allQuestions.length;

  const filledStars = Math.round(stats.average);
  const maxCount = Math.max(1, ...stats.breakdown.map((b) => b.count));

  const hasMoreReviews = allReviews.length > MAX_COLLAPSED_ITEMS;
  const visibleReviews =
    hasMoreReviews && !showAllReviews
      ? allReviews.slice(0, MAX_COLLAPSED_ITEMS)
      : allReviews;

  const hasMoreQuestions = allQuestions.length > MAX_COLLAPSED_ITEMS;
  const visibleQuestions =
    hasMoreQuestions && !showAllQuestions
      ? allQuestions.slice(0, MAX_COLLAPSED_ITEMS)
      : allQuestions;

  /* ---------- Form handlers ---------- */

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));

    // خطای همان فیلد با شروع اصلاح پاک می‌شود
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const toggleForm = () => {
    setSubmitted(false);
    setShowForm((open) => !open);
  };

  const cancelForm = () => {
    setShowForm(false);
    setErrors({});
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const nextErrors = validate(form);
    setErrors(nextErrors);

    if (nextErrors.name) {
      nameRef.current?.focus();
      return;
    }
    if (nextErrors.rating) {
      starRef.current?.focus();
      return;
    }
    if (nextErrors.text) {
      textRef.current?.focus();
      return;
    }

    const review = {
      id: `user-${Date.now()}`,
      name: form.name.trim(),
      date: todayJalali(),
      rating: form.rating,
      text: form.text.trim(),
      isUser: true,
    };

    setUserReviews((prev) => [review, ...prev]);
    setShowAllReviews(false);

    if (typeof onSubmitReview === "function") {
      onSubmitReview(review);
    }

    setForm(EMPTY_FORM);
    setErrors({});
    setShowForm(false);
    setSubmitted(true);
  };

  /* ---------- Question handlers ---------- */

  const toggleQuestionForm = () => {
    setQuestionSubmitted(false);
    setQuestionError("");
    setShowQuestionForm((open) => !open);
  };

  const cancelQuestionForm = () => {
    setShowQuestionForm(false);
    setQuestionError("");
  };

  const handleQuestionSubmit = (event) => {
    event.preventDefault();

    const error = validateQuestion(questionText);
    setQuestionError(error);

    if (error) {
      questionRef.current?.focus();
      return;
    }

    const question = {
      id: `user-q-${Date.now()}`,
      question: questionText.trim(),
      answer: "",
      date: todayJalali(),
      isUser: true,
    };

    setUserQuestions((prev) => [question, ...prev]);
    setShowAllQuestions(false);

    if (typeof onSubmitQuestion === "function") {
      onSubmitQuestion(question);
    }

    setQuestionText("");
    setQuestionError("");
    setShowQuestionForm(false);
    setQuestionSubmitted(true);
  };

  return (
    <section dir="rtl" className="pd2-wrap rv">
      <div className="pd2-panel rv__panel">
        {/* تب‌های بالا */}
        <div className="rv__top">
          <div
            className="rv__tabs"
            role="tablist"
            aria-label="دیدگاه‌ها و پرسش‌ها"
          >
            <button
              type="button"
              className={`rv__tab ${
                activeTab === "reviews" ? "is-active" : ""
              }`}
              onClick={() => setActiveTab("reviews")}
              role="tab"
              aria-selected={activeTab === "reviews"}
            >
              <span>دیدگاه‌ها</span>
              <span className="rv__tabCount">({toFa(totalReviews)})</span>
            </button>

            <button
              type="button"
              className={`rv__tab ${
                activeTab === "questions" ? "is-active" : ""
              }`}
              onClick={() => setActiveTab("questions")}
              role="tab"
              aria-selected={activeTab === "questions"}
            >
              <span>پرسش‌ها</span>
              <span className="rv__tabCount">({toFa(totalQuestions)})</span>
            </button>
          </div>
        </div>

        {/* گرید اصلی */}
        <div className="rv__grid">
          {/* ستون راست: امتیاز و دیدگاه خریداران */}
          <div className="rv__col rv__col--reviews">
            <div className="pd2-box rv__box">
              <div className="rv__scoreMain">
                <div className="rv__scoreNumber">
                  {avgDisplay}/{maxScoreDisplay}
                </div>
                <div
                  className="rv__scoreStars"
                  aria-label={`${avgDisplay} از ${maxScoreDisplay} ستاره`}
                >
                  {"★".repeat(filledStars)}
                  {"☆".repeat(5 - filledStars)}
                </div>
                <div className="rv__scoreMeta">
                  بر اساس {toFa(totalReviews)} دیدگاه خریداران
                </div>
              </div>

              <div className="rv__scoreBars">
                {stats.breakdown.map((row) => {
                  const ratio = maxCount ? row.count / maxCount : 0;
                  return (
                    <div key={row.stars} className="rv__barRow">
                      <span className="rv__barLabel">{toFa(row.stars)} ستاره</span>
                      <div className="rv__barTrack">
                        <div
                          className="rv__barFill"
                          style={{
                            transform: `scaleX(${Math.max(0.001, ratio)})`,
                          }}
                        />
                      </div>
                      <span className="rv__barCount">{toFa(row.count)}</span>
                    </div>
                  );
                })}
              </div>

              {submitted && (
                <p className="rv__success" role="status">
                  ✓ دیدگاه شما ثبت شد. از اینکه نظرتان را با ما در میان گذاشتید سپاسگزاریم.
                </p>
              )}

              <button
                type="button"
                className={showForm ? "rv__ghostBtn" : "rv__primaryBtn"}
                onClick={toggleForm}
                aria-expanded={showForm}
                aria-controls="review-form"
              >
                {showForm ? "انصراف" : "ثبت دیدگاه"}
              </button>

              {/* فرم ثبت دیدگاه (درون‌صفحه‌ای) */}
              {showForm && (
                <form
                  id="review-form"
                  className="rv__form"
                  onSubmit={handleSubmit}
                  noValidate
                  aria-label="فرم ثبت دیدگاه"
                >
                  <div className="rv__field">
                    <label htmlFor="rv-name" className="rv__label">
                      نام شما
                    </label>
                    <input
                      id="rv-name"
                      ref={nameRef}
                      type="text"
                      className={`rv__input ${errors.name ? "has-error" : ""}`}
                      value={form.name}
                      maxLength={NAME_MAX}
                      autoComplete="name"
                      placeholder="مثلاً: علی رضایی"
                      aria-invalid={Boolean(errors.name)}
                      aria-describedby={errors.name ? "rv-name-error" : undefined}
                      onChange={(e) => updateField("name", e.target.value)}
                    />
                    {errors.name && (
                      <p id="rv-name-error" className="rv__error" role="alert">
                        {errors.name}
                      </p>
                    )}
                  </div>

                  <div className="rv__field">
                    <span className="rv__label" id="rv-rating-label">
                      امتیاز شما
                    </span>
                    <StarRatingInput
                      value={form.rating}
                      hasError={Boolean(errors.rating)}
                      firstStarRef={starRef}
                      onChange={(value) => updateField("rating", value)}
                    />
                    {errors.rating && (
                      <p className="rv__error" role="alert">
                        {errors.rating}
                      </p>
                    )}
                  </div>

                  <div className="rv__field">
                    <label htmlFor="rv-text" className="rv__label">
                      دیدگاه شما
                    </label>
                    <textarea
                      id="rv-text"
                      ref={textRef}
                      className={`rv__input rv__textarea ${
                        errors.text ? "has-error" : ""
                      }`}
                      rows={4}
                      value={form.text}
                      maxLength={TEXT_MAX}
                      placeholder="تجربهٔ خود از کیفیت، راحتی و سایز محصول را بنویسید..."
                      aria-invalid={Boolean(errors.text)}
                      aria-describedby={errors.text ? "rv-text-error" : undefined}
                      onChange={(e) => updateField("text", e.target.value)}
                    />
                    <div className="rv__fieldMeta">
                      {errors.text ? (
                        <p id="rv-text-error" className="rv__error" role="alert">
                          {errors.text}
                        </p>
                      ) : (
                        <span />
                      )}
                      <span className="rv__counter">
                        {toFa(form.text.length)}/{toFa(TEXT_MAX)}
                      </span>
                    </div>
                  </div>

                  <div className="rv__formActions">
                    <button type="submit" className="rv__primaryBtn">
                      ارسال دیدگاه
                    </button>
                    <button type="button" className="rv__ghostBtn" onClick={cancelForm}>
                      انصراف
                    </button>
                  </div>
                </form>
              )}
            </div>

            <div className="pd2-box rv__box">
              {visibleReviews.map((r) => (
                <article key={r.id} className="rv__reviewItem">
                  <div className="rv__reviewMeta">
                    <span className="rv__reviewName">
                      {r.name}
                      {r.isUser && <span className="rv__userBadge">دیدگاه شما</span>}
                    </span>
                    <span className="rv__reviewDate">{r.date}</span>
                  </div>
                  <div className="rv__reviewStars">
                    {"★".repeat(r.rating)}
                    {"☆".repeat(5 - r.rating)}
                  </div>
                  <p className="rv__reviewText">{r.text}</p>
                </article>
              ))}

              {hasMoreReviews && (
                <button
                  type="button"
                  className="rv__moreBtn"
                  onClick={() => setShowAllReviews((v) => !v)}
                >
                  {showAllReviews ? "نمایش کمتر دیدگاه‌ها" : "نمایش بیشتر دیدگاه‌ها"}
                </button>
              )}
            </div>
          </div>

          {/* ستون چپ: پرسش و پاسخ – با باز/بسته شدن نرم */}
          <div
            className={
              "rv__col rv__col--qna" +
              (activeTab === "questions" ? " rv__col--qna--visible" : "")
            }
          >
            <div className="pd2-box rv__box">
              <header className="rv__qHead">
                <h3 className="rv__qHeadTitle">پرسش و پاسخ</h3>
                <p className="rv__qHeadSub">
                  پاسخ پرسش‌ها درباره سایز، جنس و نحوه استفاده از محصول
                </p>
              </header>

              <div className="rv__qList">
                {visibleQuestions.map((q) => (
                  <div key={q.id} className="rv__qItem">
                    <div className="rv__qQuestion">
                      <span>{q.question}</span>
                      <span className="rv__qBadge">
                        {q.isUser ? "پرسش شما" : "پرسش"}
                      </span>
                    </div>

                    {q.answer ? (
                      <div className="rv__qAnswer">
                        <span className="rv__qBadge rv__qBadge--answer">
                          پاسخ فروشگاه
                        </span>
                        <div>{q.answer}</div>
                      </div>
                    ) : (
                      <div className="rv__qPending">در انتظار پاسخ فروشگاه…</div>
                    )}
                  </div>
                ))}
              </div>

              {hasMoreQuestions && (
                <button
                  type="button"
                  className="rv__moreBtn rv__moreBtn--q"
                  onClick={() => setShowAllQuestions((v) => !v)}
                >
                  {showAllQuestions ? "نمایش کمتر پرسش‌ها" : "نمایش بیشتر پرسش‌ها"}
                </button>
              )}

              {questionSubmitted && (
                <p className="rv__success" role="status">
                  ✓ پرسش شما ثبت شد. پس از پاسخ فروشگاه، پاسخ در همین بخش نمایش داده می‌شود.
                </p>
              )}

              <button
                type="button"
                className="rv__ghostBtn"
                onClick={toggleQuestionForm}
                aria-expanded={showQuestionForm}
                aria-controls="question-form"
              >
                {showQuestionForm ? "انصراف" : "ثبت پرسش"}
              </button>

              {/* فرم ثبت پرسش (درون‌صفحه‌ای) */}
              {showQuestionForm && (
                <form
                  id="question-form"
                  className="rv__form"
                  onSubmit={handleQuestionSubmit}
                  noValidate
                  aria-label="فرم ثبت پرسش"
                >
                  <div className="rv__field">
                    <label htmlFor="rv-question" className="rv__label">
                      پرسش شما
                    </label>
                    <textarea
                      id="rv-question"
                      ref={questionRef}
                      className={`rv__input rv__textarea ${questionError ? "has-error" : ""}`}
                      rows={3}
                      value={questionText}
                      maxLength={QUESTION_MAX}
                      placeholder="مثلاً: این مدل برای سایز ۴۱ هم موجود است؟"
                      aria-invalid={Boolean(questionError)}
                      aria-describedby={questionError ? "rv-question-error" : undefined}
                      onChange={(e) => {
                        setQuestionText(e.target.value);
                        if (questionError) setQuestionError("");
                      }}
                    />
                    <div className="rv__fieldMeta">
                      {questionError ? (
                        <p id="rv-question-error" className="rv__error" role="alert">
                          {questionError}
                        </p>
                      ) : (
                        <span />
                      )}
                      <span className="rv__counter">
                        {toFa(questionText.length)}/{toFa(QUESTION_MAX)}
                      </span>
                    </div>
                  </div>

                  <div className="rv__formActions">
                    <button type="submit" className="rv__primaryBtn">
                      ارسال پرسش
                    </button>
                    <button type="button" className="rv__ghostBtn" onClick={cancelQuestionForm}>
                      انصراف
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default memo(ProductReviews);
