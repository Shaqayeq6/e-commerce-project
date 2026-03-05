import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

export default function Catalog() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [brand, setBrand] = useState("All");
  const [sort, setSort] = useState("none");

  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch(console.error);
  }, []);

  const brands = useMemo(() => {
    const set = new Set(products.map((p) => p.brand));
    return ["All", ...Array.from(set).sort()];
  }, [products]);

  const filtered = useMemo(() => {
    let result = [...products];

    // search
    const q = search.trim().toLowerCase();
    if (q) {
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q)
      );
    }

    // category filter
    if (category !== "All") {
      result = result.filter((p) => p.category === category);
    }

    // brand filter
    if (brand !== "All") {
      result = result.filter((p) => p.brand === brand);
    }

    // sort
    if (sort === "price_asc") result.sort((a, b) => a.price - b.price);
    if (sort === "price_desc") result.sort((a, b) => b.price - a.price);
    if (sort === "name_asc") result.sort((a, b) => a.name.localeCompare(b.name));
    if (sort === "name_desc") result.sort((a, b) => b.name.localeCompare(a.name));

    return result;
  }, [products, search, category, brand, sort]);

  return (
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

        <Link to="/cart" style={{ padding: 10, textDecoration: "none" }}>Go to Cart →</Link>
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
          <div key={p.id} style={{ border: "1px solid #ddd", borderRadius: 12, padding: 14 }}>
            <img src={p.image} alt={p.name} style={{ width: "100%", borderRadius: 10 }} />
            <h3 style={{ margin: "10px 0 4px" }}>{p.name}</h3>
            <div style={{ fontSize: 14, opacity: 0.8 }}>
              {p.category} • {p.brand} • {p.type}
            </div>
            <div style={{ marginTop: 8, fontWeight: "bold" }}>${p.price.toFixed(2)}</div>

            <div style={{ marginTop: 10 }}>
              <Link to={`/product/${p.id}`}>View Details</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}