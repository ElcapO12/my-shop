import React, {
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  // اضافه کردن به سبد
  const addItem = (item) => {
    setItems((prev) => {
      const key = `${item.id}-${item.color || ""}-${item.size || ""}`;

      const index = prev.findIndex(
        (it) =>
          `${it.id}-${it.color || ""}-${it.size || ""}` === key
      );

      if (index === -1) {
        return [...prev, { ...item }];
      }

      const next = [...prev];
      next[index] = {
        ...next[index],
        quantity: next[index].quantity + item.quantity,
      };
      return next;
    });

    setIsOpen(true); // بعد از افزودن، سبد باز شود (بعداً برای UI استفاده می‌کنیم)
  };

  // حذف یک آیتم
  const removeItem = (id, color, size) => {
    setItems((prev) =>
      prev.filter(
        (it) =>
          !(
            it.id === id &&
            (it.color || "") === (color || "") &&
            (it.size || "") === (size || "")
          )
      )
    );
  };

  // تغییر تعداد
  const updateQuantity = (id, color, size, quantity) => {
    setItems((prev) =>
      prev
        .map((it) => {
          if (
            it.id === id &&
            (it.color || "") === (color || "") &&
            (it.size || "") === (size || "")
          ) {
            return { ...it, quantity };
          }
          return it;
        })
        .filter((it) => it.quantity > 0)
    );
  };

  const clearCart = () => setItems([]);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);
  const toggleCart = () => setIsOpen((v) => !v);

  const totalCount = items.reduce(
    (sum, it) => sum + it.quantity,
    0
  );
  const totalPrice = items.reduce(
    (sum, it) => sum + it.quantity * it.price,
    0
  );

  const value = useMemo(
    () => ({
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      totalCount,
      totalPrice,
      isOpen,
      openCart,
      closeCart,
      toggleCart,
    }),
    [items, totalCount, totalPrice, isOpen]
  );

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error(
      "useCart must be used within <CartProvider>"
    );
  }
  return ctx;
}