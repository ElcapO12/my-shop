// src/data/products.js
// دادهٔ نمونهٔ فهرست محصولات + تنظیمات صفحهٔ هر دسته‌بندی
// category: باید با یکی از id های CATEGORY_PAGES یکی باشد

export const PRODUCTS = [
  { id: "sh1", name: "Air Jordan 1 Blue Phantom", category: "men", price: 2699000, oldPrice: null, rating: 4.8, reviews: 121, sold: 320, createdAt: 3, sizes: [40, 41, 42, 43, 44], colors: ["white", "blue"], inStock: true, image: "/images/shoes/shoe-1.jpg" },
  { id: "sh2", name: "Air Force 1 تمام سفید آراکس", category: "women", price: 2599000, oldPrice: null, rating: 4.7, reviews: 95, sold: 280, createdAt: 5, sizes: [40, 41, 42, 43], colors: ["white"], inStock: true, image: "/images/shoes/shoe-2.jpg" },
  { id: "sh3", name: "New Balance 530 سفید سرمه‌ای (کد ۱۳۵۰)", category: "women", price: 2549000, oldPrice: 2999000, rating: 4.6, reviews: 79, sold: 210, createdAt: 2, sizes: [40, 41, 42, 43, 44], colors: ["white", "navy", "gray"], inStock: true, image: "/images/shoes/shoe-3.jpg" },
  { id: "sh4", name: "Adidas Hyper+ تنی کد (۱۷۱۴)", category: "men", price: 3099000, oldPrice: 3649000, rating: 4.7, reviews: 110, sold: 190, createdAt: 8, sizes: [42, 43, 44, 45, 46], colors: ["blue", "white"], inStock: true, image: "/images/shoes/shoe-4.jpg" },
  { id: "sh5", name: "Nike Air Max", category: "men", price: 3199000, oldPrice: 3639000, rating: 4.8, reviews: 143, sold: 350, createdAt: 1, sizes: [41, 42, 43, 44, 45], colors: ["black", "white", "gray"], inStock: true, image: "/images/shoes/shoe-5.jpg" },
  { id: "sh6", name: "Nike Air Jordan 1 Mid", category: "men", price: 2599000, oldPrice: null, rating: 4.7, reviews: 142, sold: 240, createdAt: 6, sizes: [40, 41, 42, 43, 44, 45], colors: ["navy", "white"], inStock: false, image: "/images/shoes/shoe-6.jpg" },
  { id: "sh7", name: "Nike Dunk Low", category: "women", price: 2699000, oldPrice: null, rating: 4.6, reviews: 149, sold: 300, createdAt: 4, sizes: [40, 41, 42, 43], colors: ["blue", "white"], inStock: true, image: "/images/shoes/shoe-7.jpg" },
  { id: "sh8", name: "Nike Air Force 1 LV8", category: "women", price: 2899000, oldPrice: 3535000, rating: 4.8, reviews: 76, sold: 170, createdAt: 7, sizes: [40, 41, 42, 43, 44], colors: ["white", "yellow", "orange"], inStock: true, image: "/images/shoes/shoe-8.jpg" },
];

export const CATEGORY_PAGES = {
  women: {
    id: "women",
    title: "دمپایی زنانه",
    eyebrow: "کالکشن زنانه",
    heading: "انتخاب بهترین کفش،",
    highlight: "با سلیقهٔ شما",
    text: "مدل‌های شیک و راحت زنانه با ضمانت بازگشت.",
  },
  men: {
    id: "men",
    title: "دمپایی مردانه",
    eyebrow: "کالکشن مردانه",
    heading: "قدم‌های مطمئن،",
    highlight: "با استایل مردانه",
    text: "راحتی و دوام برای استفادهٔ هر روزه.",
  },
  kids: {
    id: "kids",
    title: "دمپایی بچگانه",
    eyebrow: "ویژهٔ کودکان",
    heading: "رنگ و شادی برای",
    highlight: "پاهای کوچک",
    text: "طرح‌های بامزه با کفی ضدلغزش و سبک.",
  },
  sandals: {
    id: "sandals",
    title: "صندل و کفش",
    eyebrow: "کالکشن فصلی",
    heading: "سبک و خنک،",
    highlight: "برای هر فصل",
    text: "صندل و کفش راحت برای روزهای گرم.",
  },
  medical: {
    id: "medical",
    title: "دمپایی طبی",
    eyebrow: "مخصوص راحتی بیشتر",
    heading: "مراقبت از پا،",
    highlight: "با دمپایی طبی",
    text: "کفی طبی و نرم برای استفادهٔ طولانی‌مدت.",
  },
};

export const CATEGORY_LIST = Object.values(CATEGORY_PAGES);
