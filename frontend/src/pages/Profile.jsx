import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { WishlistContext } from "../context/WishlistContext";

const inputStyle = { width: "100%", padding: 8, margin: "4px 0 12px", borderRadius: 6, border: "1px solid #ccc", boxSizing: "border-box" };

import { apiUrl } from "../lib/api";
export default function Profile() {
  const { user, logout, updateUser } = useContext(AuthContext);
  const { wishlistCount } = useContext(WishlistContext);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) { navigate("/login"); return; }

    setForm({
      fullName: user.fullName || "",
      email: user.email || "",
      phone: user.phone || "",
      address: user.address || "",
      city: user.city || "",
      postalCode: user.postalCode || "",
      role: user.role || "customer",
      cardLast4: user.cardLast4 || ""
    });

    fetch(apiUrl("/api/orders"))
      .then((res) => res.json())
      .then((data) => {
        const myOrders = data.filter((o) => o.customer.email === user.email);
        setOrders(myOrders);
        setLoading(false);
      })
      .catch((err) => { console.error("Failed to load orders for profile", err); setLoading(false); });
  }, [user, navigate]);

  if (!user) return null;

  const handleLogout = () => { logout(); navigate("/"); };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(apiUrl(`/api/users/${user.id}`), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        updateUser(data.user);
        setEditMode(false);
      } else {
        alert("Failed to update profile: " + (data.message || "Unknown error"));
      }
    } catch (e) {
      alert("Error saving profile.");
    }
    setSaving(false);
  };

  return (
    <div style={{ padding: 20, maxWidth: 800, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h1>My Profile</h1>
        <button onClick={handleLogout} style={{ padding: "8px 16px", borderRadius: 8, border: "1px solid #c00", background: "#fff", color: "#c00", cursor: "pointer", fontWeight: "bold" }}>
          Logout
        </button>
      </div>

      <div style={{ background: "#f9f9f9", padding: 20, borderRadius: 12, marginBottom: 32, position: "relative" }}>
        {editMode ? (
          <div>
            <h2>Edit Personal Details</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <label>Full Name</label>
                <input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} style={inputStyle} />
                <label>Email</label>
                <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} style={inputStyle} />
                <label>Phone Number</label>
                <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} style={inputStyle} />

                <h3 style={{ marginTop: 10, fontSize: 16 }}>Shipping Address</h3>
                <label>Address</label>
                <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} style={inputStyle} />
                <label>City</label>
                <input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} style={inputStyle} />
                <label>Postal Code</label>
                <input value={form.postalCode} onChange={(e) => setForm({ ...form, postalCode: e.target.value })} style={inputStyle} />
              </div>
            </div>
            <div style={{ marginTop: 16, display: "flex", gap: 10 }}>
              <button disabled={saving} onClick={handleSave} style={{ padding: "10px 16px", background: "#111", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: "bold" }}>
                {saving ? "Saving..." : "Save Profile"}
              </button>
              <button onClick={() => setEditMode(false)} style={{ padding: "10px 16px", background: "#eee", color: "#333", border: "1px solid #ccc", borderRadius: 6, cursor: "pointer", fontWeight: "bold" }}>
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <button onClick={() => setEditMode(true)} style={{ position: "absolute", top: 20, right: 20, padding: "6px 12px", cursor: "pointer", background: "#111", color: "#fff", borderRadius: 6, border: "none", fontWeight: "bold" }}>
              Edit Profile
            </button>
            <p><strong>Name:</strong> {user.fullName}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Phone:</strong> {user.phone || "Not provided"}</p>
            <p><strong>Role:</strong> {user.role === "admin" ? "Admin" : "Customer"}</p>
            <p><strong>Member Since:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
            <p style={{ marginTop: 8 }}><strong>Address:</strong> {user.address ? `${user.address}, ${user.city} ${user.postalCode}` : "Not provided"}</p>

            <p style={{ marginTop: 8 }}>
              <strong>Wishlist Items:</strong> {wishlistCount}{" "}
              <Link to="/wishlist">View Wishlist</Link>
            </p>
          </>
        )}
      </div>

      <h2>My Orders</h2>
      {loading ? (
        <p>Loading order history...</p>
      ) : orders.length === 0 ? (
        <p>You haven't placed any orders yet. <Link to="/">Start shopping!</Link></p>
      ) : (
        <div style={{ display: "grid", gap: 16, marginTop: 16 }}>
          {orders.slice().reverse().map((order) => (
            <div key={order.orderId} style={{ border: "1px solid #eee", padding: 16, borderRadius: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                <strong>Order #{order.orderId}</strong>
                <span style={{ color: "#666" }}>{new Date(order.createdAt).toLocaleDateString()}</span>
              </div>
              <div style={{ marginBottom: 12 }}>
                {order.items.map((item) => (
                  <div key={item.key} style={{ fontSize: 14 }}>
                    • {item.quantity}x {item.name} (${item.price.toFixed(2)})
                  </div>
                ))}
              </div>
              <div style={{ fontWeight: "bold", borderTop: "1px solid #eee", paddingTop: 8 }}>
                Total: ${Number(order.total).toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
