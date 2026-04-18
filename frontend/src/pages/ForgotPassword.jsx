import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { apiUrl } from "../lib/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(apiUrl("/api/auth/reset-password"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, fullName, newPassword })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.message || "Failed to reset password");
        return;
      }

      setSuccess(true);
    } catch (err) {
      setError("Server error. Please try again later.");
    }
  };

  if (success) {
    return (
      <div style={{ padding: 40, maxWidth: 400, margin: "0 auto", textAlign: "center" }}>
        <h2>Password Reset</h2>
        <div style={{ padding: 16, marginBottom: 24, background: "#e8f5e9", color: "#2e7d32", borderRadius: 8 }}>
          Your password has been successfully updated!
        </div>
        <button
          onClick={() => navigate("/login")}
          style={{
            padding: 14, background: "#111", color: "#fff", border: "none",
            borderRadius: 8, fontWeight: "bold", cursor: "pointer", width: "100%"
          }}
        >
          Return to Log In
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: 40, maxWidth: 400, margin: "0 auto", textAlign: "center" }}>
      <h2>Reset Password</h2>
      <p style={{ opacity: 0.7, marginBottom: 24 }}>Enter your email, full name, and new desired password.</p>

      {error && (
        <div style={{ padding: 12, marginBottom: 16, background: "#ffebee", color: "#c62828", borderRadius: 8 }}>
          {error}
        </div>
      )}

      <form onSubmit={handleReset} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ padding: 12, borderRadius: 8, border: "1px solid #ccc" }}
        />
        <input
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
          style={{ padding: 12, borderRadius: 8, border: "1px solid #ccc" }}
        />
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          style={{ padding: 12, borderRadius: 8, border: "1px solid #ccc" }}
        />
        
        <button
          type="submit"
          style={{
            padding: 14, background: "#111", color: "#fff", border: "none",
            borderRadius: 8, fontWeight: "bold", cursor: "pointer", marginTop: 8
          }}
        >
          Update Password
        </button>
      </form>

      <div style={{ marginTop: 24 }}>
        Remembered it? <Link to="/login" style={{ color: "#111", fontWeight: "bold" }}>Log In</Link>
      </div>
    </div>
  );
}
