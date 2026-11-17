// src/data/product.js
const product = {
  id: 1,
  name: "دمپایی مردانه نایک مدل 2035",

  images: [
    "/images/main-1.jpg",
    "/images/main-2.jpg",
    "/images/main-3.jpg",
    "/images/main-4.jpg",
  ],

  rating: 4.8,
  ratingCount: 48,
  price: 2450000,
  oldPrice: 3650000,
  discountPercent: 32,

  colors: ["#000000", "#1c3b70", "#2b2727"],
  sizes: [40, 41, 42, 43, 44],

  description:
    "این دمپایی مردانه نایک با طراحی ارگونومیک، احساس راحتی، سبکی و دوام بالا را فراهم می‌کند و مناسب برای استفاده روزمره و محیط‌های مختلف است.",

  specs: [
    { label: "برند", value: "نایک" },
    { label: "مدل", value: "2035" },
    { label: "جنس رویه", value: "EVA" },
    { label: "زیره", value: "PU ضد لغزش" },
    { label: "وزن هر لنگه", value: "≈ 350 گرم" },
    { label: "گارانتی", value: "۷ روز بازگشت" },
  ],

  sizeGuide: [
    { eu: 40, length: 25.5 },
    { eu: 41, length: 26.0 },
    { eu: 42, length: 26.5 },
    { eu: 43, length: 27.0 },
    { eu: 44, length: 27.5 },
  ],

  faqs: [
    {
      q: "قالب محصول چطور است؟",
      a: "قالب این مدل استاندارد است. اگر بین دو سایز هستید، یک سایز بزرگ‌تر انتخاب کنید.",
    },
    {
      q: "شرایط مرجوعی چیه؟",
      a: "تا ۷ روز مهلت تست دارید؛ کالا باید در شرایط اولیه باشد.",
    },
    {
      q: "زمان ارسال چقدره؟",
      a: "معمولاً ۲ تا ۵ روز کاری (بسته به شهر مقصد).",
    },
  ],
};

export default product;