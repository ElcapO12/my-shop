import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";

export default function CartDrawer() {
  const navigate = useNavigate();

  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    totalPrice,
    totalCount,
  } = useCart();

  // رفتن به صفحه جدید (تکمیل خرید)
  const handleGoToCheckout = () => {
    closeCart();
    navigate("/checkout");
  };

  // فرمت قیمت
  const formatPrice = (price) => {
    return Number(price).toLocaleString("fa-IR");
  };

  // اگر سبد بسته باشد، چیزی نمایش نده
  if (!isOpen) return null;

  return (
    <>
      {/* پس‌زمینه تیره */}
      <div className="cart-overlay" onClick={closeCart} />

      {/* پنل سبد خرید */}
      <aside className="cart-drawer" dir="rtl">
        {/* هدر سبد خرید */}
        <div className="cart-header">
          <h2>سبد خرید ({totalCount})</h2>

          <button
            type="button"
            onClick={closeCart}
            aria-label="بستن سبد خرید"
          >
            ✕
          </button>
        </div>

        {/* محصولات داخل سبد */}
        <div className="cart-body">
          {items.length === 0 ? (
            <div className="cart-empty">
              <p>سبد خرید شما خالی است.</p>

              {/* این دکمه هم می‌تواند به صفحه جدید برود */}
              <button type="button" onClick={handleGoToCheckout}>
                ادامه فرآیند خرید
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                className="cart-item"
                key={`${item.id}-${item.color || ""}-${item.size || ""}`}
              >
                {/* تصویر محصول */}
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.title}
                    className="cart-item-image"
                  />
                )}

                <div className="cart-item-info">
                  <h3>{item.title}</h3>

                  {item.color && <p>رنگ: {item.color}</p>}
                  {item.size && <p>سایز: {item.size}</p>}

                  <p>{formatPrice(item.price)} تومان</p>

                  {/* تغییر تعداد */}
                  <div className="cart-quantity">
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(
                          item.id,
                          item.color,
                          item.size,
                          item.quantity - 1
                        )
                      }
                    >
                      −
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(
                          item.id,
                          item.color,
                          item.size,
                          item.quantity + 1
                        )
                      }
                    >
                      +
                    </button>
                  </div>

                  {/* حذف محصول */}
                  <button
                    type="button"
                    className="remove-item-btn"
                    onClick={() => removeItem(item.id, item.color, item.size)}
                  >
                    حذف محصول
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* فوتر سبد خرید */}
        {items.length > 0 && (
          <div className="cart-footer">
            <div className="cart-total">
              <span>مجموع سبد خرید:</span>
              <strong>{formatPrice(totalPrice)} تومان</strong>
            </div>

            {/* دکمه ادامه فرآیند خرید => صفحه جدید */}
            <button
              type="button"
              className="continue-shopping-btn"
              onClick={handleGoToCheckout}
            >
              ادامه فرآیند خرید
            </button>
          </div>
        )}
      </aside>
    </>
  );
}