import { useContext } from "react";
import { Link } from "react-router-dom";
import { WishlistContext } from "../context/WishlistContext";
import { CartContext } from "../context/CartContext";

export default function Wishlist() {
  const { wishlist, removeFromWishlist } = useContext(WishlistContext);
  const { addToCart } = useContext(CartContext);

  const moveToCart = (item) => {
    addToCart(item, 1);
    removeFromWishlist(item.id);
  };

  return (
    <div style={{ padding: 24 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24
        }}
      >
        <div>
          <h1 style={{ margin: 0 }}>My Wishlist</h1>
          <p style={{ margin: "8px 0 0", color: "#666" }}>
            Keep track of saved pairs and move them into your cart when you're ready.
          </p>
        </div>
        <Link
          to="/"
          style={{
            color: "#111",
            textDecoration: "none",
            border: "1px solid #111",
            borderRadius: 10,
            padding: "10px 14px",
            background: "#fff",
            fontWeight: 600
          }}
        >
          Continue Shopping
        </Link>
      </div>

      {wishlist.length === 0 ? (
        <div
          style={{
            border: "1px dashed #ccc",
            borderRadius: 16,
            padding: 24,
            background: "#fafafa"
          }}
        >
          <p style={{ marginTop: 0, fontSize: 18, fontWeight: 600 }}>
            Your wishlist is empty.
          </p>
          <p style={{ marginBottom: 0, opacity: 0.75 }}>
            Save products here so you can come back to them later!
          </p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
            gap: 18
          }}
        >
          {wishlist.map((item) => (
            <div
              key={item.id}
              style={{
                border: "1px solid #e5e5e5",
                borderRadius: 18,
                padding: 16,
                display: "flex",
                flexDirection: "column",
                gap: 10,
                background: "#fff",
                boxShadow: "0 12px 28px rgba(15, 23, 42, 0.06)"
              }}
            >
              <img
                src={item.image}
                alt={item.name}
                style={{
                  width: "100%",
                  height: 220,
                  objectFit: "cover",
                  borderRadius: 14,
                  background: "#f3f3f3"
                }}
              />

              <div style={{ fontSize: 13, opacity: 0.62, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                {item.category} • {item.brand}
              </div>

              <h3 style={{ margin: 0, lineHeight: 1.35 }}>{item.name}</h3>
              <div style={{ fontSize: 20, fontWeight: 700 }}>
                ${Number(item.price).toFixed(2)}
              </div>

              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: "auto" }}>
                <Link
                  to={`/product/${item.id}`}
                  style={{
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

                <button
                  onClick={() => moveToCart(item)}
                  style={{
                    padding: "10px 14px",
                    borderRadius: 10,
                    border: "1px solid #111",
                    background: "#fff",
                    color: "#111",
                    cursor: "pointer",
                    fontWeight: 600
                  }}
                >
                  Move to Cart
                </button>

                <button
                  onClick={() => removeFromWishlist(item.id)}
                  style={{
                    padding: "10px 14px",
                    borderRadius: 10,
                    border: "1px solid #c53030",
                    background: "#fff5f5",
                    color: "#c53030",
                    cursor: "pointer",
                    fontWeight: 600
                  }}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
