import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

import { apiUrl } from "../lib/api";
export default function Customers() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    fullName: "",
    email: "",
    role: "customer",
    address: "",
    city: "",
    postalCode: "",
    cardLast4: ""
  });

  const loadCustomers = () => {
    fetch(apiUrl("/api/users"))
      .then((res) => res.json())
      .then((data) => {
        setCustomers(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load customers", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/");
      return;
    }

    loadCustomers();
  }, [user, navigate]);

  const startEdit = (customer) => {
    setEditingId(customer.id);
    setEditForm({
      fullName: customer.fullName || "",
      email: customer.email || "",
      role: customer.role || "customer",
      address: customer.address || "",
      city: customer.city || "",
      postalCode: customer.postalCode || "",
      cardLast4: customer.cardLast4 || ""
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({
      fullName: "",
      email: "",
      role: "customer",
      address: "",
      city: "",
      postalCode: "",
      cardLast4: ""
    });
  };

  const saveEdit = async (id) => {
    try {
      const res = await fetch(apiUrl(`/api/users/${id}`), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(editForm)
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        alert(data.message || "Failed to update user");
        return;
      }

      setCustomers((prev) =>
        prev.map((customer) => (customer.id === id ? data.user : customer))
      );

      cancelEdit();
    } catch (err) {
      console.error("Failed to update customer", err);
      alert("Failed to update user");
    }
  };

  if (!user || user.role !== "admin") return null;

  return (
    <div style={{ padding: 20, maxWidth: 1200, margin: "0 auto" }}>
      <div style={{ marginBottom: 16 }}>
        <Link to="/">⬅ Back to Store</Link>
      </div>

      <h1 style={{ marginBottom: 20 }}>Customer Accounts</h1>

      {loading ? (
        <p>Loading accounts...</p>
      ) : customers.length === 0 ? (
        <p>No customers found.</p>
      ) : (
        <div style={{ display: "grid", gap: 16 }}>
          {customers.map((customer) => (
            <div
              key={customer.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: 12,
                padding: 16
              }}
            >
              <div style={{ marginBottom: 12 }}>
                <strong>ID:</strong> {customer.id}
              </div>

              {editingId === customer.id ? (
                <>
                  <input
                    value={editForm.fullName}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        fullName: e.target.value
                      }))
                    }
                    placeholder="Full name"
                    style={{ width: "100%", padding: 10, marginBottom: 10 }}
                  />

                  <input
                    value={editForm.email}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        email: e.target.value
                      }))
                    }
                    placeholder="Email"
                    style={{ width: "100%", padding: 10, marginBottom: 10 }}
                  />

                  <select
                    value={editForm.role}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        role: e.target.value
                      }))
                    }
                    style={{ width: "100%", padding: 10, marginBottom: 10 }}
                  >
                    <option value="customer">customer</option>
                    <option value="admin">admin</option>
                  </select>

                  <input
                    value={editForm.address}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        address: e.target.value
                      }))
                    }
                    placeholder="Address"
                    style={{ width: "100%", padding: 10, marginBottom: 10 }}
                  />

                  <input
                    value={editForm.city}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        city: e.target.value
                      }))
                    }
                    placeholder="City"
                    style={{ width: "100%", padding: 10, marginBottom: 10 }}
                  />

                  <input
                    value={editForm.postalCode}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        postalCode: e.target.value
                      }))
                    }
                    placeholder="Postal Code"
                    style={{ width: "100%", padding: 10, marginBottom: 10 }}
                  />

                  <input
                    value={editForm.cardLast4}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        cardLast4: e.target.value.replace(/\D/g, "").slice(0, 4)
                      }))
                    }
                    placeholder="Card Last 4"
                    style={{ width: "100%", padding: 10, marginBottom: 10 }}
                  />

                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      onClick={() => saveEdit(customer.id)}
                      style={{
                        padding: "8px 12px",
                        border: "none",
                        borderRadius: 8,
                        background: "#111",
                        color: "white",
                        cursor: "pointer"
                      }}
                    >
                      Save
                    </button>

                    <button
                      onClick={cancelEdit}
                      style={{
                        padding: "8px 12px",
                        border: "1px solid #ccc",
                        borderRadius: 8,
                        background: "white",
                        cursor: "pointer"
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p><strong>Name:</strong> {customer.fullName}</p>
                  <p><strong>Email:</strong> {customer.email}</p>
                  <p><strong>Role:</strong> {customer.role}</p>
                  <p><strong>Address:</strong> {customer.address || "-"}</p>
                  <p><strong>City:</strong> {customer.city || "-"}</p>
                  <p><strong>Postal Code:</strong> {customer.postalCode || "-"}</p>
                  <p><strong>Card Last 4:</strong> {customer.cardLast4 || "-"}</p>
                  <p>
                    <strong>Joined:</strong>{" "}
                    {new Date(customer.createdAt).toLocaleDateString()}
                  </p>

                  <button
                    onClick={() => startEdit(customer)}
                    style={{
                      padding: "8px 12px",
                      border: "1px solid #111",
                      borderRadius: 8,
                      background: "white",
                      cursor: "pointer"
                    }}
                  >
                    Edit
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}