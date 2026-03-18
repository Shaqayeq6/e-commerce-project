<<<<<<< HEAD
import { useContext, useMemo, useState } from "react";
import { CartContext } from "../context/CartContext";
import { Link, useNavigate } from "react-router-dom";

export default function Checkout() {
  const { cart, totalPrice, clearCart } = useContext(CartContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
=======
import { useContext, useMemo, useState, useEffect } from "react";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const inputStyle = {
  width: "100%",
  padding: 10,
  margin: "6px 0 14px",
  borderRadius: 8,
  border: "1px solid #ccc",
  fontSize: 14,
  boxSizing: "border-box"
};

const labelStyle = {
  fontWeight: "600",
  fontSize: 13,
  color: "#444"
};

export default function Checkout() {
  const { cart, totalPrice, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  /* ── Shipping form ── */
  const [form, setForm] = useState({
    fullName: user ? user.fullName : "",
    email: user ? user.email : "",
>>>>>>> fc1a1d91797f588c2457599d245a0e8c297f02b7
    address: "",
    city: "",
    postalCode: ""
  });
<<<<<<< HEAD
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
=======

  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        fullName: prev.fullName || user.fullName,
        email: user.email
      }));
    }
  }, [user]);

  /* ── Payment form ── */
  const [payment, setPayment] = useState({
    cardNumber: "",
    nameOnCard: "",
    expiry: "",
    cvv: ""
  });
  const [paymentError, setPaymentError] = useState("");
  const [processing, setProcessing] = useState(false);

  const onShippingChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onPaymentChange = (e) => {
    let { name, value } = e.target;

    // Auto-format card number with spaces: 1234 5678 9012 3456
    if (name === "cardNumber") {
      value = value.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
    }

    // Auto-format expiry: MM/YY
    if (name === "expiry") {
      value = value.replace(/\D/g, "").slice(0, 4);
      if (value.length >= 3) value = value.slice(0, 2) + "/" + value.slice(2);
    }

    // CVV max 3 digits
    if (name === "cvv") {
      value = value.replace(/\D/g, "").slice(0, 3);
    }

    setPayment((prev) => ({ ...prev, [name]: value }));
    setPaymentError("");
  };

  const validatePayment = () => {
    const raw = payment.cardNumber.replace(/\s/g, "");
    if (raw.length !== 16) return "Card number must be 16 digits.";
    if (!payment.nameOnCard.trim()) return "Name on card is required.";
    if (!/^\d{2}\/\d{2}$/.test(payment.expiry)) return "Expiry must be in MM/YY format.";
    if (payment.cvv.length !== 3) return "CVV must be 3 digits.";
    return null;
  };
>>>>>>> fc1a1d91797f588c2457599d245a0e8c297f02b7

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

<<<<<<< HEAD
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
=======
  const placeOrder = async () => {
    const payErr = validatePayment();
    if (payErr) {
      setPaymentError(payErr);
      return;
    }

    setProcessing(true);

    const orderPayload = {
      customer: form,
      items: [...cart],
      total: totalPrice,
      paymentMethod: {
        last4: payment.cardNumber.replace(/\s/g, "").slice(-4),
        nameOnCard: payment.nameOnCard
      }
    };

    try {
      const res = await fetch("http://localhost:5001/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload)
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        alert(data.message || "Checkout failed");
        setProcessing(false);
        return;
      }

      clearCart();
      navigate("/confirmation", {
        state: {
          orderId: data.orderId,
          customer: form,
          total: totalPrice,
          items: [...cart],
          last4: payment.cardNumber.replace(/\s/g, "").slice(-4)
        }
      });
    } catch (err) {
      console.error("Checkout fetch error:", err);
      alert("Could not reach backend. Is the server running?");
      setProcessing(false);
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 1100, margin: "0 auto" }}>
      <Link to="/cart">⬅ Back to Cart</Link>
      <h1 style={{ marginTop: 10, marginBottom: 24 }}>Checkout</h1>
>>>>>>> fc1a1d91797f588c2457599d245a0e8c297f02b7

      {cart.length === 0 ? (
        <p>Your cart is empty. Add items before checkout.</p>
      ) : (
<<<<<<< HEAD
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
=======
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, alignItems: "start" }}>

          {/* ── Left Column: Shipping + Payment ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            {/* Shipping Info */}
            <div style={{ border: "1px solid #ddd", borderRadius: 12, padding: 20 }}>
              <h2 style={{ marginBottom: 16 }}>📦 Shipping Info</h2>

              <label style={labelStyle}>Full Name</label>
              <input name="fullName" value={form.fullName} onChange={onShippingChange} style={inputStyle} />

              <label style={labelStyle}>Email</label>
              <input
                name="email"
                value={form.email}
                onChange={onShippingChange}
                disabled={!!user}
                style={{ ...inputStyle, background: user ? "#f5f5f5" : "#fff" }}
              />

              <label style={labelStyle}>Address</label>
              <input name="address" value={form.address} onChange={onShippingChange} style={inputStyle} placeholder="123 Main St" />

              <label style={labelStyle}>City</label>
              <input name="city" value={form.city} onChange={onShippingChange} style={inputStyle} placeholder="Toronto" />

              <label style={labelStyle}>Postal Code</label>
              <input name="postalCode" value={form.postalCode} onChange={onShippingChange} style={inputStyle} placeholder="M5V 2T6" />
            </div>

            {/* Payment Info */}
            <div style={{ border: "1px solid #ddd", borderRadius: 12, padding: 20 }}>
              <h2 style={{ marginBottom: 4 }}>💳 Payment</h2>
              <p style={{ fontSize: 13, color: "#888", marginBottom: 16 }}>
                Demo store — no real charges will be made.
              </p>

              {/* Card type icons (visual only) */}
              <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
                {["VISA", "MC", "AMEX"].map((t) => (
                  <span
                    key={t}
                    style={{
                      padding: "4px 10px",
                      border: "1px solid #ccc",
                      borderRadius: 6,
                      fontSize: 12,
                      fontWeight: "bold",
                      color: "#555"
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>

              <label style={labelStyle}>Card Number</label>
              <input
                name="cardNumber"
                value={payment.cardNumber}
                onChange={onPaymentChange}
                placeholder="1234 5678 9012 3456"
                style={inputStyle}
                maxLength={19}
              />

              <label style={labelStyle}>Name on Card</label>
              <input
                name="nameOnCard"
                value={payment.nameOnCard}
                onChange={onPaymentChange}
                placeholder="John Smith"
                style={inputStyle}
              />

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={labelStyle}>Expiry (MM/YY)</label>
                  <input
                    name="expiry"
                    value={payment.expiry}
                    onChange={onPaymentChange}
                    placeholder="08/27"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>CVV</label>
                  <input
                    name="cvv"
                    value={payment.cvv}
                    onChange={onPaymentChange}
                    placeholder="123"
                    type="password"
                    style={inputStyle}
                  />
                </div>
              </div>

              {paymentError && (
                <div style={{ color: "#c00", background: "#ffebee", padding: "10px 14px", borderRadius: 8, marginBottom: 12, fontSize: 14 }}>
                  {paymentError}
                </div>
              )}

              <button
                disabled={!canPlaceOrder || processing}
                onClick={placeOrder}
                style={{
                  width: "100%",
                  padding: "14px",
                  borderRadius: 10,
                  border: "none",
                  background: canPlaceOrder && !processing ? "#111" : "#888",
                  color: "white",
                  cursor: canPlaceOrder && !processing ? "pointer" : "not-allowed",
                  fontWeight: "bold",
                  fontSize: 16,
                  marginTop: 4
                }}
              >
                {processing ? "Processing..." : `Place Order · $${totalPrice.toFixed(2)}`}
              </button>

              <p style={{ fontSize: 12, color: "#aaa", marginTop: 10, textAlign: "center" }}>
                🔒 Secure dummy checkout — your card will not be charged.
              </p>
            </div>
          </div>

          {/* ── Right Column: Order Summary ── */}
          <div style={{ border: "1px solid #ddd", borderRadius: 12, padding: 20, position: "sticky", top: 20 }}>
            <h2 style={{ marginBottom: 16 }}>🧾 Order Summary</h2>
            {cart.map((item) => (
              <div key={item.key} style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
                <div>
                  <div style={{ fontWeight: "bold" }}>{item.name}</div>
                  <div style={{ fontSize: 13, opacity: 0.7 }}>
                    {item.brand} • {item.type}
>>>>>>> fc1a1d91797f588c2457599d245a0e8c297f02b7
                    {item.selectedSize ? ` • Size ${item.selectedSize}` : ""}
                  </div>
                  <div style={{ fontSize: 13 }}>Qty: {item.quantity}</div>
                </div>
<<<<<<< HEAD
                <div>${(item.price * item.quantity).toFixed(2)}</div>
              </div>
            ))}
            <hr />
            <h3>Total: ${totalPrice.toFixed(2)}</h3>
          </div>
=======
                <div style={{ fontWeight: "bold" }}>${(item.price * item.quantity).toFixed(2)}</div>
              </div>
            ))}
            <hr />
            <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold", fontSize: 18, marginTop: 12 }}>
              <span>Total</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
          </div>

>>>>>>> fc1a1d91797f588c2457599d245a0e8c297f02b7
        </div>
      )}
    </div>
  );
}