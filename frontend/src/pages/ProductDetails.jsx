import { useEffect, useState, useContext, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";

export default function ProductDetails() {
  const { id } = useParams();
  const { addToCart, cart } = useContext(CartContext);

  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [qty, setQty] = useState(1);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch(`http://localhost:5001/api/products/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Product not found");
        return res.json();
      })
      .then((data) => {
        setProduct(data);

        if (data.sizes && data.sizes.length > 0) {
          setSelectedSize(String(data.sizes[0]));
        }
      })
      .catch((err) => {
        console.error(err);
        setProduct(null);
      });
  }, [id]);

  // Hooks MUST be before any return
  const currentInCart = useMemo(() => {
    if (!product) return 0;

    return cart
      .filter(
        (item) =>
          item.id === product.id &&
          String(item.selectedSize || "") === String(selectedSize || "")
      )
      .reduce((sum, item) => sum + item.quantity, 0);
  }, [cart, product, selectedSize]);

  // ✅ Safe to return after hooks
  if (!product) {
    return (
      <div style={{ padding: 20 }}>
        <Link to="/">⬅ Back to Store</Link>
        <p style={{ marginTop: 12 }}>Loading product...</p>
      </div>
    );
  }

  const sizes = product.sizes?.length ? product.sizes : [];
  const maxAvailable = product.quantity - currentInCart;

  const increase = () => {
    if (qty < maxAvailable) {
      setQty((prev) => prev + 1);
    }
  };

  const decrease = () => {
    if (qty > 1) {
      setQty((prev) => prev - 1);
    }
  };

  const handleAdd = () => {
    if (maxAvailable <= 0) {
      setMessage("No more stock available for this selection.");
      return;
    }

    const itemToAdd = sizes.length
      ? { ...product, selectedSize }
      : { ...product };

    addToCart(itemToAdd, qty);

    setMessage("Added to cart!");
    setQty(1);
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

          {/* Stock display */}
          <div style={{ marginBottom: 10 }}>
            {product.quantity === 0 ? (
              <span style={{ color: "red", fontWeight: "bold" }}>
                Out of Stock
              </span>
            ) : product.quantity <= 3 ? (
              <span style={{ color: "#d97706", fontWeight: "bold" }}>
                Only {product.quantity} left!
              </span>
            ) : (
              <span style={{ opacity: 0.7 }}>
                {product.quantity} in stock
              </span>
            )}
          </div>

          <p style={{ lineHeight: 1.5 }}>{product.description}</p>

          {/* Size selector */}
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

          {/* Quantity selector */}
          <div style={{ marginTop: 14 }}>
            <label style={{ display: "block", marginBottom: 6 }}>
              Quantity:
            </label>

            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <button
                onClick={decrease}
                disabled={qty <= 1}
                style={{
                  padding: "6px 10px",
                  borderRadius: 6,
                  border: "1px solid #ccc",
                  cursor: qty <= 1 ? "not-allowed" : "pointer"
                }}
              >
                -
              </button>

              <div style={{ minWidth: 30, textAlign: "center" }}>{qty}</div>

              <button
                onClick={increase}
                disabled={qty >= maxAvailable}
                style={{
                  padding: "6px 10px",
                  borderRadius: 6,
                  border: "1px solid #ccc",
                  cursor: qty >= maxAvailable ? "not-allowed" : "pointer"
                }}
              >
                +
              </button>

              <span style={{ fontSize: 13, opacity: 0.7 }}>
                {maxAvailable} available
              </span>
            </div>
          </div>

          {/* Actions */}
          <div style={{ marginTop: 16, display: "flex", gap: 12 }}>
            <button
              onClick={handleAdd}
              disabled={product.quantity === 0 || maxAvailable === 0}
              style={{
                padding: "10px 14px",
                borderRadius: 10,
                border: "1px solid #111",
                background:
                  product.quantity === 0 || maxAvailable === 0
                    ? "#888"
                    : "#111",
                color: "white",
                cursor:
                  product.quantity === 0 || maxAvailable === 0
                    ? "not-allowed"
                    : "pointer"
              }}
            >
              {product.quantity === 0
                ? "Out of Stock"
                : maxAvailable === 0
                ? "Max in Cart"
                : "Add to Cart"}
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

          {/* Feedback */}
          {message && (
            <div
              style={{
                marginTop: 12,
                color: "#065f46",
                background: "#d1fae5",
                padding: "8px 12px",
                borderRadius: 8
              }}
            >
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}