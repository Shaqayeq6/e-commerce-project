import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { Link } from "react-router-dom";

export default function Cart() {
  const { cart, removeFromCart, increaseQty, decreaseQty, totalPrice } =
    useContext(CartContext);

  return (
    <div style={{ padding: "20px" }}>
      <Link to="/">⬅ Back to Store</Link>
      <h1 style={{ marginTop: 10 }}>Your Cart</h1>

      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          {cart.map((item) => (
            <div
              key={item.key}
              style={{
                display: "flex",
                gap: 14,
                alignItems: "center",
                border: "1px solid #ddd",
                padding: 12,
                marginBottom: 12,
                borderRadius: 12
              }}
            >
              <img
                src={item.image}
                alt={item.name}
                style={{
                  width: 90,
                  height: 90,
                  borderRadius: 10,
                  objectFit: "cover"
                }}
              />

              <div style={{ flex: 1 }}>
                <h2 style={{ margin: "0 0 6px" }}>{item.name}</h2>

                <div style={{ fontSize: 14, opacity: 0.8 }}>
                  {item.category} • {item.brand} • {item.type}
                </div>

                {item.selectedSize && (
                  <div style={{ marginTop: 6, fontSize: 14 }}>
                    <strong>Size:</strong> {item.selectedSize}
                  </div>
                )}

                <div style={{ marginTop: 6 }}>
                  <strong>${item.price.toFixed(2)}</strong>
                  <span style={{ marginLeft: 10, opacity: 0.85 }}>
                    Item total: ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <button onClick={() => decreaseQty(item.key)}>-</button>
                  <div style={{ minWidth: 24, textAlign: "center" }}>
                    {item.quantity}
                  </div>
                  <button onClick={() => increaseQty(item.key)}>+</button>
                </div>

                <button
                  onClick={() => removeFromCart(item.key)}
                  style={{
                    padding: "8px 10px",
                    borderRadius: 10,
                    border: "1px solid #c00",
                    background: "white",
                    color: "#c00",
                    cursor: "pointer"
                  }}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          <h2>Total: ${totalPrice.toFixed(2)}</h2>
       <Link to="/checkout" style={{ textDecoration: "none" }}>
      <button
          style={{
            marginTop: 15,
            padding: "12px 18px",
            borderRadius: 12,
            border: "none",
            background: "#111",
            color: "white",
            fontSize: "16px",
            fontWeight: "bold",
            cursor: "pointer"
          }}
        >
          Proceed to Checkout →
      </button>
      </Link>
        </>
      )}
    </div>
  );
}