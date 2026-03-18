import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

export default function Catalog() {
  const [products, setProducts] = useState([]);
<<<<<<< HEAD
=======
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
>>>>>>> fc1a1d91797f588c2457599d245a0e8c297f02b7
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [brand, setBrand] = useState("All");
  const [sort, setSort] = useState("none");

  useEffect(() => {
<<<<<<< HEAD
    fetch("http://localhost:5000/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch(console.error);
  }, []);

  const brands = useMemo(() => {
    const set = new Set(products.map((p) => p.brand));
=======
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
>>>>>>> fc1a1d91797f588c2457599d245a0e8c297f02b7
    return ["All", ...Array.from(set).sort()];
  }, [products]);

  const filtered = useMemo(() => {
    let result = [...products];

<<<<<<< HEAD
    // search
=======
>>>>>>> fc1a1d91797f588c2457599d245a0e8c297f02b7
    const q = search.trim().toLowerCase();
    if (q) {
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
<<<<<<< HEAD
          p.brand.toLowerCase().includes(q)
      );
    }

    // category filter
=======
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

>>>>>>> fc1a1d91797f588c2457599d245a0e8c297f02b7
    if (category !== "All") {
      result = result.filter((p) => p.category === category);
    }

<<<<<<< HEAD
    // brand filter
=======
>>>>>>> fc1a1d91797f588c2457599d245a0e8c297f02b7
    if (brand !== "All") {
      result = result.filter((p) => p.brand === brand);
    }

<<<<<<< HEAD
    // sort
    if (sort === "price_asc") result.sort((a, b) => a.price - b.price);
    if (sort === "price_desc") result.sort((a, b) => b.price - a.price);
    if (sort === "name_asc") result.sort((a, b) => a.name.localeCompare(b.name));
    if (sort === "name_desc") result.sort((a, b) => b.name.localeCompare(a.name));
=======
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
>>>>>>> fc1a1d91797f588c2457599d245a0e8c297f02b7

    return result;
  }, [products, search, category, brand, sort]);

  return (
<<<<<<< HEAD
    <div style={{ padding: 20 }}>
      <h1>StepStyle Shoes</h1>

      {/* Controls */}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 16 }}>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search shoes or brand..."
          style={{ padding: 10, minWidth: 220 }}
        />

        <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ padding: 10 }}>
          <option value="All">All</option>
          <option value="Women">Women</option>
          <option value="Men">Men</option>
          <option value="Kids">Kids</option>
        </select>

        <select value={brand} onChange={(e) => setBrand(e.target.value)} style={{ padding: 10 }}>
          {brands.map((b) => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>

        <select value={sort} onChange={(e) => setSort(e.target.value)} style={{ padding: 10 }}>
          <option value="none">Sort: None</option>
          <option value="price_asc">Price: Low → High</option>
          <option value="price_desc">Price: High → Low</option>
          <option value="name_asc">Name: A → Z</option>
          <option value="name_desc">Name: Z → A</option>
        </select>

        <Link to="/cart" style={{ padding: 10, textDecoration: "none" }}>
          Go to Cart →
        </Link>
      </div>

      {/* Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 16
        }}
      >
        {filtered.map((p) => (
          <div
            key={p.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: 12,
              padding: 14,
              display: "flex",
              flexDirection: "column",
              gap: 8
            }}
          >
            <img
              src={p.image}
              alt={p.name}
              style={{
                width: "100%",
                height: 220,
                objectFit: "cover",
                borderRadius: 10
              }}
            />

            <h3
              style={{
                margin: "10px 0 4px",
                minHeight: 56
              }}
            >
              {p.name}
            </h3>

            <div style={{ fontSize: 14, opacity: 0.8 }}>
              {p.category} • {p.brand} • {p.type}
            </div>

            <div style={{ marginTop: 8, fontWeight: "bold" }}>
              ${p.price.toFixed(2)}
            </div>

            <div style={{ marginTop: 10 }}>
              <Link to={`/product/${p.id}`}>View Details</Link>
            </div>
          </div>
        ))}
      </div>
=======
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 24 }}>
        <p style={{ margin: 0, fontSize: 14, letterSpacing: "0.08em", textTransform: "uppercase", opacity: 0.7 }}>
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
          placeholder="Search shoes, brand, or category..."
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
          style={{
            padding: 12,
            borderRadius: 10,
            border: "1px solid #ccc"
          }}
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <select
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          style={{
            padding: 12,
            borderRadius: 10,
            border: "1px solid #ccc"
          }}
        >
          {brands.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          style={{
            padding: 12,
            borderRadius: 10,
            border: "1px solid #ccc"
          }}
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

      {!loading && error && (
        <p style={{ color: "crimson", fontWeight: 600 }}>{error}</p>
      )}

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

              <div style={{ fontSize: 13, opacity: 0.7, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                {p.category} • {p.brand}
              </div>

              <h3
                style={{
                  margin: 0,
                  minHeight: 52,
                  fontSize: 20,
                  lineHeight: 1.3
                }}
              >
                {p.name}
              </h3>

              <p
                style={{
                  margin: 0,
                  fontSize: 14,
                  opacity: 0.75,
                  minHeight: 42
                }}
              >
                {p.description}
              </p>

              <div style={{ marginTop: "auto" }}>
                <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>
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
                    borderRadius: 10
                  }}
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
>>>>>>> fc1a1d91797f588c2457599d245a0e8c297f02b7
    </div>
  );
}