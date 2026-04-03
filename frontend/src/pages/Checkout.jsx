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

  const [form, setForm] = useState({
    fullName: user ? user.fullName : "",
    email: user ? user.email : "",
    address: user?.address || "",
    city: user?.city || "",
    postalCode: user?.postalCode || ""
  });

  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        fullName: user.fullName || prev.fullName,
        email: user.email || prev.email,
        address: user.address || prev.address,
        city: user.city || prev.city,
        postalCode: user.postalCode || prev.postalCode
      }));
    }
  }, [user]);

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

    if (name === "cardNumber") {
      value = value.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
    }

    if (name === "expiry") {
      value = value.replace(/\D/g, "").slice(0, 4);
      if (value.length >= 3) value = value.slice(0, 2) + "/" + value.slice(2);
    }

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

      {cart.length === 0 ? (
        <p>Your cart is empty. Add items before checkout.</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 24,
            alignItems: "start"
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
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
              <input name="address" value={form.address} onChange={onShippingChange} style={inputStyle} />

              <label style={labelStyle}>City</label>
              <input name="city" value={form.city} onChange={onShippingChange} style={inputStyle} />

              <label style={labelStyle}>Postal Code</label>
              <input name="postalCode" value={form.postalCode} onChange={onShippingChange} style={inputStyle} />
            </div>

            <div style={{ border: "1px solid #ddd", borderRadius: 12, padding: 20 }}>
              <h2>💳 Payment</h2>

              <label style={labelStyle}>Card Number</label>
              <input name="cardNumber" value={payment.cardNumber} onChange={onPaymentChange} style={inputStyle} />

              <label style={labelStyle}>Name on Card</label>
              <input name="nameOnCard" value={payment.nameOnCard} onChange={onPaymentChange} style={inputStyle} />

              <label style={labelStyle}>Expiry</label>
              <input name="expiry" value={payment.expiry} onChange={onPaymentChange} style={inputStyle} />

              <label style={labelStyle}>CVV</label>
              <input name="cvv" value={payment.cvv} onChange={onPaymentChange} style={inputStyle} />

              {paymentError && <p style={{ color: "red" }}>{paymentError}</p>}

              <button
                disabled={!canPlaceOrder || processing}
                onClick={placeOrder}
                style={{
                  width: "100%",
                  padding: 14,
                  background: canPlaceOrder && !processing ? "#111" : "#888",
                  color: "#fff",
                  border: "none",
                  borderRadius: 10,
                  cursor: canPlaceOrder && !processing ? "pointer" : "not-allowed"
                }}
              >
                {processing ? "Processing..." : `Place Order · $${totalPrice.toFixed(2)}`}
              </button>
            </div>
          </div>

          <div style={{ border: "1px solid #ddd", borderRadius: 12, padding: 20 }}>
            <h2>🧾 Order Summary</h2>

            {cart.map((item) => (
              <div
                key={item.key}
                style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}
              >
                <div>
                  <div>{item.name}</div>
                  <div style={{ fontSize: 13 }}>
                    {item.brand} • {item.type}
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