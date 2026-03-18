import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Customers() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Only admins can see this page
    if (!user || user.role !== "admin") {
      navigate("/");
      return;
    }

    fetch("http://localhost:5001/api/users")
      .then(res => res.json())
      .then(data => {
        setCustomers(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load customers", err);
        setLoading(false);
      });
  }, [user, navigate]);

  if (!user || user.role !== "admin") return null;

  return (
    <div style={{ padding: 20, maxWidth: 1000, margin: "0 auto" }}>
      <div style={{ marginBottom: 16 }}>
        <Link to="/">⬅ Back to Store</Link>
      </div>

      <h1 style={{ marginBottom: 20 }}>Customer Accounts</h1>

      {loading ? (
        <p>Loading accounts...</p>
      ) : customers.length === 0 ? (
        <p>No customers found.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr style={{ background: "#f3f3f3", borderBottom: "2px solid #ddd" }}>
              <th style={{ padding: 12 }}>ID</th>
              <th style={{ padding: 12 }}>Name</th>
              <th style={{ padding: 12 }}>Email</th>
              <th style={{ padding: 12 }}>Role</th>
              <th style={{ padding: 12 }}>Joined</th>
            </tr>
          </thead>
          <tbody>
            {customers.map(c => (
              <tr key={c.id} style={{ borderBottom: "1px solid #eee" }}>
                <td style={{ padding: 12 }}>{c.id}</td>
                <td style={{ padding: 12, fontWeight: "bold" }}>{c.fullName}</td>
                <td style={{ padding: 12 }}>{c.email}</td>
                <td style={{ padding: 12 }}>
                  <span style={{
                    padding: "4px 8px",
                    borderRadius: 12,
                    fontSize: 12,
                    background: c.role === 'admin' ? '#e3f2fd' : '#f5f5f5',
                    color: c.role === 'admin' ? '#1565c0' : '#333'
                  }}>
                    {c.role}
                  </span>
                </td>
                <td style={{ padding: 12 }}>{new Date(c.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
