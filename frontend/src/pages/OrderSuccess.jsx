import { Link } from "react-router-dom";

export default function OrderSuccess() {
  return (
    <div className="container" style={{ maxWidth: "700px", margin: "40px auto", padding: "24px", textAlign: "center" }}>
      <h1 style={{ marginBottom: "12px" }}>Order placed successfully 🎉</h1>
      <p style={{ marginBottom: "24px", color: "#555" }}>
        Thank you for your purchase. Your order has been received.
      </p>

      <div style={{ display: "flex", justifyContent: "center", gap: "12px", flexWrap: "wrap" }}>
        <Link to="/catalog">
          <button>Continue Shopping</button>
        </Link>

        <Link to="/cart">
          <button>Go to Cart</button>
        </Link>
      </div>
    </div>
  );
}