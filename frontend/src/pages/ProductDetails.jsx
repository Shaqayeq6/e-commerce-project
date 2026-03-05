import { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";

export default function ProductDetails() {
  const { id } = useParams();
  const { addToCart } = useContext(CartContext);

  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");

  useEffect(() => {
    fetch(`http://localhost:5000/api/products/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Product not found");
        return res.json();
      })
      .then((data) => {
        setProduct(data);
        // auto-pick first size if exists
        if (data.sizes && data.sizes.length > 0) {
          setSelectedSize(String(data.sizes[0]));
        }
      })
      .catch((err) => {
        console.error(err);
        setProduct(null);
      });
  }, [id]);

  if (!product) {
    return (
      <div style={{ padding: 20 }}>
        <Link to="/">⬅ Back to Store</Link>
        <p style={{ marginTop: 12 }}>Product not found.</p>
      </div>
    );
  }

  const sizes = product.sizes && product.sizes.length > 0 ? product.sizes : [];

  const handleAdd = () => {
    // Store size in cart item (so it feels like real shoe buying)
    const itemToAdd = sizes.length
      ? { ...product, selectedSize }
      : { ...product };

    addToCart(itemToAdd);
  };

  return (
    <div style={{ padding: 20 }}>
      <Link to="/">⬅ Back to Store</Link>

      <div
        style={{
          marginTop: 14,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 20,
          alignItems: "start"
        }}
      >
        {/* Image */}
        <div style={{ border: "1px solid #ddd", borderRadius: 12, padding: 14 }}>
          <img
            src={product.image}
            alt={product.name}
            style={{ width: "100%", borderRadius: 12 }}
          />
        </div>

        {/* Details */}
        <div>
          <h1 style={{ margin: "0 0 6px" }}>{product.name}</h1>

          <div style={{ opacity: 0.85, marginBottom: 10 }}>
            {product.category} • {product.brand} • {product.type}
          </div>

          <div style={{ fontSize: 22, fontWeight: "bold", marginBottom: 10 }}>
            ${product.price.toFixed(2)}
          </div>

          <p style={{ lineHeight: 1.5 }}>{product.description}</p>

          {/* Size selector (optional) */}
          {sizes.length > 0 && (
            <div style={{ marginTop: 14 }}>
              <label style={{ display: "block", marginBottom: 6 }}>
                Select size:
              </label>
              <select
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                style={{ padding: 10, minWidth: 180 }}
              >
                {sizes.map((s) => (
                  <option key={s} value={String(s)}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Actions */}
          <div style={{ marginTop: 16, display: "flex", gap: 12 }}>
            <button
              onClick={handleAdd}
              style={{
                padding: "10px 14px",
                borderRadius: 10,
                border: "1px solid #111",
                background: "#111",
                color: "white",
                cursor: "pointer"
              }}
            >
              Add to Cart
            </button>

            <Link
              to="/cart"
              style={{
                padding: "10px 14px",
                borderRadius: 10,
                border: "1px solid #111",
                textDecoration: "none",
                color: "#111"
              }}
            >
              Go to Cart
            </Link>
          </div>

          <div style={{ marginTop: 12, opacity: 0.75 }}>
            Tip: Try adding the same shoe twice to see quantity increase.
          </div>
        </div>
      </div>
    </div>
  );
}