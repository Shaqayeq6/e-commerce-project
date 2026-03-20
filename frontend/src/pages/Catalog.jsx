import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

export default function Catalog() {
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
      <div style={{ marginBottom: 24 }}>
        <p
          style={{
            margin: 0,
            fontSize: 14,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            opacity: 0.7
          }}
        >
          Shoe Store
        </p>
        <h1 style={{ margin: "8px 0 0" }}>ShaqaWear Shoes</h1>
        <p style={{ marginTop: 8, maxWidth: 640, opacity: 0.8 }}>
          Browse everyday sneakers, statement streetwear pairs, and clean essentials for men, women, and kids.
        </p>
      </div>

      <div
        style={{
          display: "flex",
          gap: 12,
          flexWrap: "wrap",
          marginBottom: 24,
          alignItems: "center"
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
            border: "1px solid #ccc"
          }}
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{ padding: 12, borderRadius: 10, border: "1px solid #ccc" }}
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
          style={{ padding: 12, borderRadius: 10, border: "1px solid #ccc" }}
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
          style={{ padding: 12, borderRadius: 10, border: "1px solid #ccc" }}
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
            color: "#111"
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
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
            gap: 18
          }}
        >
          {filtered.map((p) => (
            <div
              key={p.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: 16,
                padding: 16,
                display: "flex",
                flexDirection: "column",
                gap: 10,
                background: "#fff",
                boxShadow: "0 8px 24px rgba(0, 0, 0, 0.06)"
              }}
            >
              <img
                src={p.image}
                alt={p.name}
                style={{
                  width: "100%",
                  height: 220,
                  objectFit: "cover",
                  borderRadius: 12,
                  background: "#f3f3f3"
                }}
              />

              <div
                style={{
                  fontSize: 13,
                  opacity: 0.7,
                  textTransform: "uppercase"
                }}
              >
                {p.category} • {p.brand}
              </div>

              <h3 style={{ margin: 0, minHeight: 52 }}>{p.name}</h3>

              <p style={{ margin: 0, fontSize: 14, opacity: 0.75 }}>
                {p.description}
              </p>

              <div style={{ marginTop: "auto" }}>
                <div style={{ fontSize: 20, fontWeight: 700 }}>
                  ${Number(p.price).toFixed(2)}
                </div>

                <Link
                  to={`/product/${p.id}`}
                  style={{
                    display: "inline-block",
                    padding: "10px 14px",
                    textDecoration: "none",
                    background: "#111",
                    color: "#fff",
                    borderRadius: 10,
                    marginTop: 10
                  }}
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}