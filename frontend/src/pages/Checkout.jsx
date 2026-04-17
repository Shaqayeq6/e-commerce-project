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
  const { user, login, updateUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [authMode, setAuthMode] = useState("register");
  const [authForm, setAuthForm] = useState({ email: "", password: "" });
  const [authError, setAuthError] = useState("");

  const [useSavedInfo, setUseSavedInfo] = useState(true);

  const [form, setForm] = useState({
    fullName: "", email: "", phone: "", address: "", city: "", postalCode: ""
  });

  const [payment, setPayment] = useState({
    cardNumber: "", nameOnCard: "", expiry: "", cvv: ""
  });

  const [paymentError, setPaymentError] = useState("");
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (user) {
      if (useSavedInfo) {
        setForm({
          fullName: user.fullName || "", email: user.email || "", phone: user.phone || "",
          address: user.address || "", city: user.city || "", postalCode: user.postalCode || ""
        });
        setPayment({
          cardNumber: user.cardNumber || "", nameOnCard: user.nameOnCard || "",
          expiry: user.expiry || "", cvv: user.cvv || ""
        });
      } else {
        setForm({ fullName: user.fullName || "", email: user.email || "", phone: user.phone || "", address: "", city: "", postalCode: "" });
        setPayment({ cardNumber: "", nameOnCard: "", expiry: "", cvv: "" });
      }
    }
  }, [user, useSavedInfo]);

  const onShippingChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onPaymentChange = (e) => {
    let { name, value } = e.target;
    if (name === "cardNumber") value = value.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
    if (name === "expiry") {
      value = value.replace(/\D/g, "").slice(0, 4);
      if (value.length >= 3) value = value.slice(0, 2) + "/" + value.slice(2);
    }
    if (name === "cvv") value = value.replace(/\D/g, "").slice(0, 3);
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
      cart.length > 0 && form.fullName.trim() && form.email.trim() && form.phone.trim() &&
      form.address.trim() && form.city.trim() && form.postalCode.trim()
    );
  }, [cart, form]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError("");
    try {
      const res = await fetch("http://localhost:5001/api/auth/login", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(authForm)
      });
      const data = await res.json();
      if (!res.ok || !data.success) return setAuthError(data.message || "Login failed");
      login(data.user);
    } catch { setAuthError("Server error."); }
  };

  const placeOrder = async () => {
    const payErr = validatePayment();
    if (payErr) {
      setPaymentError(payErr);
      return;
    }

    setProcessing(true);

    if (!user) {
      if (!authForm.password) {
        setPaymentError("Password is required to create an account.");
        setProcessing(false);
        return;
      }
      try {
        const res = await fetch("http://localhost:5001/api/auth/register", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fullName: form.fullName, email: form.email, password: authForm.password, phone: form.phone,
            address: form.address, city: form.city, postalCode: form.postalCode,
            cardNumber: payment.cardNumber, nameOnCard: payment.nameOnCard, expiry: payment.expiry, cvv: payment.cvv
          })
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          setPaymentError(data.message || "Failed to create account");
          setProcessing(false);
          return;
        }
        login(data.user);
      } catch (err) {
        setPaymentError("Server error during registration.");
        setProcessing(false);
        return;
      }
    } else {
      const isFirstTime = !user.address && !user.cardNumber;
      if (!useSavedInfo || isFirstTime) {
        try {
          const res = await fetch(`http://localhost:5001/api/users/${user.id}`, {
             method: "PUT", headers: {"Content-Type": "application/json"},
             body: JSON.stringify({
                phone: form.phone, address: form.address, city: form.city, postalCode: form.postalCode,
                cardNumber: payment.cardNumber, nameOnCard: payment.nameOnCard, 
                expiry: payment.expiry, cvv: payment.cvv
             })
          });
          const updateData = await res.json();
          if (res.ok && updateData.success) {
            updateUser(updateData.user);
          }
        } catch (err) {
          console.error("Failed to update user profile", err);
        }
      }
    }

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
        setPaymentError(data.message || "Checkout failed");
        setProcessing(false);
        return;
      }

      clearCart();
      navigate("/confirmation", {
        state: {
          orderId: data.orderId, customer: form, total: totalPrice, items: [...cart],
          last4: payment.cardNumber.replace(/\s/g, "").slice(-4),
          confirmationEmail: data.confirmationEmail
        }
      });
    } catch (err) {
      setPaymentError("Could not reach backend. Is the server running?");
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
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, alignItems: "start" }}>
          
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {!user && authMode === "login" ? (
              <div style={{ border: "1px solid #ddd", borderRadius: 12, padding: 20 }}>
                <h2>Log In to Checkout</h2>
                <p>Or <span style={{color: "blue", cursor: "pointer", textDecoration: "underline"}} onClick={() => setAuthMode("register")}>Create a new account</span>.</p>
                <div style={{marginTop: 16}}>
                  <input name="email" type="email" placeholder="Email" value={authForm.email} onChange={(e) => setAuthForm({...authForm, email: e.target.value})} style={inputStyle} required />
                  <input name="password" type="password" placeholder="Password" value={authForm.password} onChange={(e) => setAuthForm({...authForm, password: e.target.value})} style={inputStyle} required />
                  {authError && <p style={{color: "red"}}>{authError}</p>}
                  <button onClick={handleLogin} style={{ padding: "10px 16px", background: "#111", color: "#fff", borderRadius: 8, cursor: "pointer", border: "none" }}>Log In</button>
                </div>
              </div>
            ) : (
              <>
                <div style={{ border: "1px solid #ddd", borderRadius: 12, padding: 20 }}>
                  <h2 style={{ marginBottom: 16 }}>📦 Shipping Info</h2>
                  
                  {!user && (
                    <p style={{marginBottom: 16}}>Creating a new account. <span style={{color: "blue", cursor: "pointer", textDecoration: "underline"}} onClick={() => setAuthMode("login")}>Log In instead</span>.</p>
                  )}

                  {user && (
                    <div style={{ marginBottom: 16 }}>
                      <label style={{cursor: "pointer", display: "flex", alignItems: "center", gap: 8}}>
                        <input type="checkbox" checked={useSavedInfo} onChange={(e) => setUseSavedInfo(e.target.checked)} />
                        Use Saved Info
                      </label>
                    </div>
                  )}

                  <label style={labelStyle}>Full Name</label>
                  <input name="fullName" value={form.fullName} onChange={onShippingChange} style={inputStyle} />

                  <label style={labelStyle}>Phone Number</label>
                  <input name="phone" value={form.phone} onChange={onShippingChange} style={inputStyle} placeholder="(123) 456-7890" />

                  <label style={labelStyle}>Email</label>
                  <input
                    name="email" value={form.email} onChange={onShippingChange}
                    disabled={!!user}
                    style={{ ...inputStyle, background: user ? "#f5f5f5" : "#fff" }}
                  />

                  {!user && (
                    <>
                      <label style={labelStyle}>Password (For new account)</label>
                      <input name="password" type="password" placeholder="Must be at least 6 characters" value={authForm.password} onChange={(e) => setAuthForm({...authForm, password: e.target.value})} style={inputStyle} required />
                    </>
                  )}

                  <label style={labelStyle}>Address</label>
                  <input name="address" value={form.address} onChange={onShippingChange} style={inputStyle} />

                  <label style={labelStyle}>City</label>
                  <input name="city" value={form.city} onChange={onShippingChange} style={inputStyle} />

                  <label style={labelStyle}>Postal Code</label>
                  <input name="postalCode" value={form.postalCode} onChange={onShippingChange} style={inputStyle} />
                </div>

                <div style={{ border: "1px solid #ddd", borderRadius: 12, padding: 20 }}>
                  <h2>💳 Payment & Billing</h2>

                  <label style={labelStyle}>Card Number</label>
                  <input name="cardNumber" value={payment.cardNumber} onChange={onPaymentChange} style={inputStyle} placeholder="1234 5678 1234 5678" />

                  <label style={labelStyle}>Name on Card</label>
                  <input name="nameOnCard" value={payment.nameOnCard} onChange={onPaymentChange} style={inputStyle} placeholder="John Doe" />

                  <label style={labelStyle}>Expiry</label>
                  <input name="expiry" value={payment.expiry} onChange={onPaymentChange} style={inputStyle} placeholder="MM/YY" />

                  <label style={labelStyle}>CVV</label>
                  <input name="cvv" value={payment.cvv} onChange={onPaymentChange} style={inputStyle} placeholder="123" />

                  {paymentError && <p style={{ color: "#d32f2f", fontWeight: "bold", background: "#ffebee", padding: 12, borderRadius: 8, marginTop: 8 }}>{paymentError}</p>}

                  <button
                    disabled={!canPlaceOrder || processing}
                    onClick={placeOrder}
                    style={{
                      width: "100%", padding: 14, marginTop: 8,
                      background: canPlaceOrder && !processing ? "#111" : "#888",
                      color: "#fff", border: "none", borderRadius: 10,
                      cursor: canPlaceOrder && !processing ? "pointer" : "not-allowed",
                      fontWeight: "bold"
                    }}
                  >
                    {processing ? "Processing..." : `Confirm Order · $${totalPrice.toFixed(2)}`}
                  </button>
                </div>
              </>
            )}
          </div>

          <div style={{ border: "1px solid #ddd", borderRadius: 12, padding: 20 }}>
            <h2>🧾 Order Summary</h2>

            {cart.map((item) => (
              <div key={item.key} style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                <div>
                  <div style={{fontWeight: "bold"}}>{item.name}</div>
                  <div style={{ fontSize: 13, color: "#666" }}>
                    {item.brand} • {item.type}
                  </div>
                  <div style={{ fontSize: 13, color: "#666" }}>Qty: {item.quantity}</div>
                </div>
                <div style={{fontWeight: "bold"}}>${(item.price * item.quantity).toFixed(2)}</div>
              </div>
            ))}

            <hr style={{margin: "16px 0", border: "none", borderTop: "1px solid #ddd"}} />
            <h3>Total: ${totalPrice.toFixed(2)}</h3>
          </div>

        </div>
      )}
    </div>
  );
}