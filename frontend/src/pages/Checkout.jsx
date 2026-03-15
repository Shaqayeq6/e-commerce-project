import { useContext, useMemo, useState } from "react";
import { CartContext } from "../context/CartContext";
import { Link, useNavigate } from "react-router-dom";

export default function Checkout() {
  const { cart, totalPrice, clearCart } = useContext(CartContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    address: "",
    city: "",
    postalCode: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const canPlaceOrder = useMemo(() => {
    return (
      cart.length > 0 &&
      form.fullName.trim() &&
      form.email.trim() &&
      form.address.trim() &&
      form.city.trim() &&
      form.postalCode.trim()
    );
  }, [cart, form]);

  const onChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

 const placeOrder = async () => {
  console.log("Place Order clicked");

  const orderPayload = {
    customer: form,
    items: [...cart],
    total: totalPrice
  };

  console.log("Sending payload:", orderPayload);

  try {
    const res = await fetch("http://127.0.0.1:5000/api/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(orderPayload)
    });

    console.log("Response status:", res.status);

    const text = await res.text();
    console.log("Raw response text:", text);

    const data = JSON.parse(text);

    if (!res.ok || !data.success) {
      alert(data.message || "Checkout failed");
      return;
    }

    clearCart();

    navigate("/confirmation", {
      state: {
        orderId: data.orderId,
        customer: form,
        total: totalPrice,
        items: [...cart]
      }
    });
  } catch (err) {
    console.error("Checkout fetch error:", err);
    alert("Could not reach backend on port 5000");
  }
};

  return (
    <div style={{ padding: 20 }}>
      <Link to="/cart">⬅ Back to Cart</Link>
      <h1 style={{ marginTop: 10 }}>Checkout</h1>

      {cart.length === 0 ? (
        <p>Your cart is empty. Add items before checkout.</p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          {/* Form */}
          <div style={{ border: "1px solid #ddd", borderRadius: 12, padding: 16 }}>
            <h2>Shipping Info</h2>

            <label>Full Name</label>
            <input name="fullName" value={form.fullName} onChange={onChange} style={{ width: "100%", padding: 10, margin: "6px 0 12px" }} />

            <label>Email</label>
            <input name="email" value={form.email} onChange={onChange} style={{ width: "100%", padding: 10, margin: "6px 0 12px" }} />

            <label>Address</label>
            <input name="address" value={form.address} onChange={onChange} style={{ width: "100%", padding: 10, margin: "6px 0 12px" }} />

            <label>City</label>
            <input name="city" value={form.city} onChange={onChange} style={{ width: "100%", padding: 10, margin: "6px 0 12px" }} />

            <label>Postal Code</label>
            <input name="postalCode" value={form.postalCode} onChange={onChange} style={{ width: "100%", padding: 10, margin: "6px 0 12px" }} />

            <button
              disabled={!canPlaceOrder}
              onClick={placeOrder}
              style={{
                padding: "10px 14px",
                borderRadius: 10,
                border: "1px solid #111",
                background: canPlaceOrder ? "#111" : "#888",
                color: "white",
                cursor: canPlaceOrder ? "pointer" : "not-allowed",
                width: "100%",
                marginTop: 8
              }}
            >
              Place Order
            </button>
          </div>

          {/* Summary */}
          <div style={{ border: "1px solid #ddd", borderRadius: 12, padding: 16 }}>
            <h2>Order Summary</h2>
            {cart.map((item) => (
              <div key={item.key} style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                <div>
                  <div style={{ fontWeight: "bold" }}>{item.name}</div>
                  <div style={{ fontSize: 13, opacity: 0.8 }}>
                    {item.category} • {item.brand} • {item.type}
                    {item.selectedSize ? ` • Size ${item.selectedSize}` : ""}
                  </div>
                  <div style={{ fontSize: 13 }}>Qty: {item.quantity}</div>
                </div>
                <div>${(item.price * item.quantity).toFixed(2)}</div>
              </div>
            ))}
            <hr />
            <h3>Total: ${totalPrice.toFixed(2)}</h3>
          </div>
        </div>
      )}
    </div>
  );
}