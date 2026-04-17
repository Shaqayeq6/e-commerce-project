import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";

export const RecentlyViewedContext = createContext();

function getStorageKey(user) {
  return user?.email ? `recentlyViewed:${user.email}` : "recentlyViewed:guest";
}

export function RecentlyViewedProvider({ children }) {
  const { user } = useContext(AuthContext);
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  useEffect(() => {
    const savedItems = localStorage.getItem(getStorageKey(user));
    setRecentlyViewed(savedItems ? JSON.parse(savedItems) : []);
  }, [user]);

  useEffect(() => {
    localStorage.setItem(getStorageKey(user), JSON.stringify(recentlyViewed));
  }, [recentlyViewed, user]);

  const trackRecentlyViewed = useCallback((product) => {
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((item) => item.id !== product.id);
      return [product, ...filtered].slice(0, 6);
    });
  }, []);

  return (
    <RecentlyViewedContext.Provider
      value={{ recentlyViewed, trackRecentlyViewed }}
    >
      {children}
    </RecentlyViewedContext.Provider>
  );
}
