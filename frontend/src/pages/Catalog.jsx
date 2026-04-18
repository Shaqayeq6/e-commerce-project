import { useContext, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { WishlistContext } from "../context/WishlistContext";
import { RecentlyViewedContext } from "../context/RecentlyViewedContext";

export default function Catalog() {
  const { isInWishlist, toggleWishlist } = useContext(WishlistContext);
  const { recentlyViewed } = useContext(RecentlyViewedContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [brand, setBrand] = useState("All");
  const [sort, setSort] = useState("none");

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        setError("");

        const res = await fetch("http://localhost:5001/api/products");

        if (!res.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await res.json();
        setProducts(data);
      } catch (err) {
        setError("Could not load products. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.category).filter(Boolean));
    return ["All", ...Array.from(set).sort()];
  }, [products]);

  const brands = useMemo(() => {
    const set = new Set(products.map((p) => p.brand).filter(Boolean));
    return ["All", ...Array.from(set).sort()];
  }, [products]);

  const filtered = useMemo(() => {
    let result = [...products];

    const q = search.trim().toLowerCase();
    if (q) {
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    if (category !== "All") {
      result = result.filter((p) => p.category === category);
    }

    if (brand !== "All") {
      result = result.filter((p) => p.brand === brand);
    }

    if (sort === "price_asc") {
      result.sort((a, b) => a.price - b.price);
    }

    if (sort === "price_desc") {
      result.sort((a, b) => b.price - a.price);
    }

    if (sort === "name_asc") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    if (sort === "name_desc") {
      result.sort((a, b) => b.name.localeCompare(a.name));
    }

    return result;
  }, [products, search, category, brand, sort]);

  return (
    <div style={{ padding: 24 }}>
      <div
        style={{
          marginBottom: 28,
          padding: "8px 0 0"
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: 14,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            opacity: 0.65
          }}
        >
          Shoe Store
        </p>
        <h1 style={{ margin: "10px 0 0", fontSize: "3.4rem" }}>ShaqaWear Shoes</h1>
        <p style={{ marginTop: 10, maxWidth: 640, opacity: 0.78, lineHeight: 1.6 }}>
          Browse everyday sneakers, statement streetwear pairs, and clean essentials for men, women, and kids.
        </p>
      </div>

      <div
        style={{
          display: "flex",
          gap: 12,
          flexWrap: "wrap",
          marginBottom: 30,
          alignItems: "center",
          padding: 16,
          border: "1px solid #ececec",
          borderRadius: 18,
          background: "#fbfbfb"
        }}
      >
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="🔎 Search shoes, brand, or category..."
          style={{
            padding: 12,
            minWidth: 240,
            borderRadius: 10,
            border: "1px solid #d7d7d7",
            background: "#fff"
          }}
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{ padding: 12, borderRadius: 10, border: "1px solid #d7d7d7", background: "#fff" }}
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c === "All" ? "All Categories" : c}
            </option>
          ))}
        </select>

        <select
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          style={{ padding: 12, borderRadius: 10, border: "1px solid #d7d7d7", background: "#fff" }}
        >
          {brands.map((b) => (
            <option key={b} value={b}>
              {b === "All" ? "All Brands" : b}
            </option>
          ))}
        </select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          style={{ padding: 12, borderRadius: 10, border: "1px solid #d7d7d7", background: "#fff" }}
        >
          <option value="none">Sort: None</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="name_asc">Name: A to Z</option>
          <option value="name_desc">Name: Z to A</option>
        </select>

        <Link
          to="/cart"
          style={{
            padding: "12px 16px",
            textDecoration: "none",
            border: "1px solid #111",
            borderRadius: 10,
            color: "#111",
            background: "#fff",
            fontWeight: 600
          }}
        >
          Go to Cart
        </Link>
      </div>

      {loading && <p>Loading products...</p>}

      {!loading && error && <p style={{ color: "crimson" }}>{error}</p>}

      {!loading && !error && filtered.length === 0 && (
        <p>No products match your search or filters.</p>
      )}

      {!loading && !error && filtered.length > 0 && (
        <>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, 240px)",
              gap: 18,
              justifyContent: "start"
            }}
          >
            {filtered.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isInWishlist={isInWishlist}
                toggleWishlist={toggleWishlist}
              />
            ))}
          </div>

          {recentlyViewed.length > 0 && (
            <div
              style={{
                marginTop: 44,
                paddingTop: 28,
                borderTop: "1px solid #ededed"
              }}
            >
              <div style={{ marginBottom: 16 }}>
                <h2 style={{ margin: 0, fontSize: "1.8rem" }}>Recently Viewed</h2>
                <p style={{ margin: "6px 0 0", color: "#666" }}>
                  Pick up where you left off.
                </p>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 220px))",
                  gap: 14,
                  justifyContent: "start"
                }}
              >
                {recentlyViewed.slice(0, 4).map((product) => (
                  <RecentProductCard
                    key={`recent-${product.id}`}
                    product={product}
                    isInWishlist={isInWishlist}
                    toggleWishlist={toggleWishlist}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function ProductCard({ product, isInWishlist, toggleWishlist }) {
  const stockBadge =
    product.quantity === 0
      ? { label: "Out of Stock", background: "#fef2f2", color: "#b91c1c" }
      : product.quantity <= 3
      ? {
          label: `Almost Gone • ${product.quantity} left`,
          background: "#fffbeb",
          color: "#b45309"
        }
      : null;

  return (
    <div
      style={{
        border: "1px solid #e5e5e5",
        borderRadius: 18,
        padding: 16,
        display: "flex",
        flexDirection: "column",
        gap: 10,
        background: "#fff",
        boxShadow: "0 12px 28px rgba(15, 23, 42, 0.06)",
        position: "relative",
        transition: "transform 180ms ease, box-shadow 180ms ease"
      }}
    >
      <button
        onClick={() => toggleWishlist(product)}
        aria-label={
          isInWishlist(product.id)
            ? `Remove ${product.name} from wishlist`
            : `Add ${product.name} to wishlist`
        }
        title={
          isInWishlist(product.id)
            ? "Remove from wishlist"
            : "Add to wishlist"
        }
        style={{
          position: "absolute",
          top: 14,
          right: 14,
          width: 40,
          height: 40,
          borderRadius: "50%",
          border: isInWishlist(product.id) ? "1px solid #be123c" : "1px solid #ddd",
          background: isInWishlist(product.id) ? "#fff1f2" : "#fff",
          color: isInWishlist(product.id) ? "#be123c" : "#444",
          fontSize: 18,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)"
        }}
      >
        {isInWishlist(product.id) ? "♥" : "♡"}
      </button>

      <img
          src={product.image}
          alt={product.name}
          style={{
            width: "100%",
            height: 220,
            objectFit: "cover",  
            borderRadius: 14,
            background: "#f3f3f3"
          }}
        />

      <div
        style={{
          fontSize: 13,
          opacity: 0.62,
          textTransform: "uppercase",
          letterSpacing: "0.05em"
        }}
      >
        {product.category} • {product.brand}
      </div>

      {stockBadge && (
        <div
          style={{
            display: "inline-flex",
            alignSelf: "flex-start",
            padding: "6px 10px",
            borderRadius: 999,
            background: stockBadge.background,
            color: stockBadge.color,
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: "0.02em"
          }}
        >
          {stockBadge.label}
        </div>
      )}

      <h3 style={{ margin: 0, minHeight: 52, lineHeight: 1.35 }}>{product.name}</h3>

      <p style={{ margin: 0, fontSize: 14, opacity: 0.72, lineHeight: 1.5 }}>
        {product.description}
      </p>

      <div style={{ marginTop: "auto" }}>
        <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.02em" }}>
          ${Number(product.price).toFixed(2)}
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 10 }}>
          <Link
            to={`/product/${product.id}`}
            style={{
              display: "inline-block",
              padding: "10px 14px",
              textDecoration: "none",
              background: "#111",
              color: "#fff",
              borderRadius: 10,
              fontWeight: 600
            }}
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}

function RecentProductCard({ product, isInWishlist, toggleWishlist }) {
  return (
    <div
      style={{
        border: "1px solid #e5e5e5",
        borderRadius: 16,
        padding: 12,
        display: "flex",
        flexDirection: "column",
        gap: 8,
        background: "#fff",
        boxShadow: "0 8px 18px rgba(15, 23, 42, 0.05)",
        position: "relative"
      }}
    >
      <button
        onClick={() => toggleWishlist(product)}
        aria-label={
          isInWishlist(product.id)
            ? `Remove ${product.name} from wishlist`
            : `Add ${product.name} to wishlist`
        }
        title={
          isInWishlist(product.id)
            ? "Remove from wishlist"
            : "Add to wishlist"
        }
        style={{
          position: "absolute",
          top: 10,
          right: 10,
          width: 34,
          height: 34,
          borderRadius: "50%",
          border: isInWishlist(product.id) ? "1px solid #be123c" : "1px solid #ddd",
          background: isInWishlist(product.id) ? "#fff1f2" : "#fff",
          color: isInWishlist(product.id) ? "#be123c" : "#444",
          fontSize: 16,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        {isInWishlist(product.id) ? "♥" : "♡"}
      </button>

      <img
        src={product.image}
        alt={product.name}
        style={{
          width: "100%",
          height: 140,
          objectFit: "cover",
          borderRadius: 12,
          background: "#f3f3f3"
        }}
      />

      <div
        style={{
          fontSize: 12,
          opacity: 0.62,
          textTransform: "uppercase",
          letterSpacing: "0.05em"
        }}
      >
        {product.brand}
      </div>

      <div style={{ fontWeight: 700, lineHeight: 1.35 }}>{product.name}</div>

      <div style={{ fontSize: 17, fontWeight: 700 }}>
        ${Number(product.price).toFixed(2)}
      </div>

      <Link
        to={`/product/${product.id}`}
        style={{
          display: "inline-block",
          padding: "8px 12px",
          textDecoration: "none",
          background: "#111",
          color: "#fff",
          borderRadius: 10,
          fontWeight: 600,
          alignSelf: "flex-start"
        }}
      >
        View
      </Link>
    </div>
  );
}
