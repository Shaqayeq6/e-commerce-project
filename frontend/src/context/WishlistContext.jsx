import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { AuthContext } from "./AuthContext";

export const WishlistContext = createContext();

function getStorageKey(user) {
  return user?.email ? `wishlist:${user.email}` : "wishlist:guest";
}

export function WishlistProvider({ children }) {
  const { user } = useContext(AuthContext);
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const savedWishlist = localStorage.getItem(getStorageKey(user));
    setWishlist(savedWishlist ? JSON.parse(savedWishlist) : []);
  }, [user]);

  useEffect(() => {
    localStorage.setItem(getStorageKey(user), JSON.stringify(wishlist));
  }, [wishlist, user]);

  const isInWishlist = (productId) => {
    return wishlist.some((item) => item.id === productId);
  };

  const addToWishlist = (product) => {
    setWishlist((prev) => {
      if (prev.some((item) => item.id === product.id)) {
        return prev;
      }

      return [...prev, product];
    });
  };

  const removeFromWishlist = (productId) => {
    setWishlist((prev) => prev.filter((item) => item.id !== productId));
  };

  const toggleWishlist = (product) => {
    setWishlist((prev) => {
      if (prev.some((item) => item.id === product.id)) {
        return prev.filter((item) => item.id !== product.id);
      }

      return [...prev, product];
    });
  };

  const wishlistCount = useMemo(() => wishlist.length, [wishlist]);

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistCount,
        isInWishlist,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}
