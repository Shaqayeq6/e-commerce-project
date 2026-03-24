import { createContext, useEffect, useMemo, useState } from "react";

export const CartContext = createContext();

function getKey(product) {
  const size = product.selectedSize ?? "";
  return `${product.id}-${size}`;
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const clearCart = () => setCart([]);

  // add to cart considering chosen quantity
  const addToCart = (product, qty = 1) => {
    const key = getKey(product);

    setCart((prev) => {
      const existing = prev.find((item) => item.key === key);

      const currentQty = existing ? existing.quantity : 0;
      const stock = product.quantity;

      // check for exceeding stock
      if (currentQty + qty > stock) {
        alert("Cannot add more than available stock");
        return prev;
      }

      if (existing) {
        return prev.map((item) =>
          item.key === key
            ? { ...item, quantity: item.quantity + qty } 
            : item
        );
      }

      return [
        ...prev,
        {
          ...product,
          key,
          quantity: qty, 
          stock
        }
      ];
    });
  };

  //remove from cart
  const removeFromCart = (key) => {
    setCart((prev) => prev.filter((item) => item.key !== key));
  };

  //increase chosen quantity
  const increaseQty = (key) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.key === key) {
          if (item.quantity + 1 > item.stock) {
            alert("Cannot exceed available stock");
            return item;
          }
          return { ...item, quantity: item.quantity + 1 };
        }
        return item;
      })
    );
  };

  const decreaseQty = (key) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.key === key
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const totalPrice = useMemo(() => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [cart]);

  const totalItems = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        increaseQty,
        decreaseQty,
        totalPrice,
        totalItems,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
}