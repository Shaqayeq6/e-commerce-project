import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Register() {
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:5001/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, username, email, password })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.message || "Failed to register");
        return;
      }

      // Auto login on register
      login(data.user);
      navigate("/");
    } catch (err) {
      setError("Server error. Please try again later.");
    }
  };

  return (
    <div style={{ padding: 40, maxWidth: 400, margin: "0 auto", textAlign: "center" }}>
      <h2>Create Account</h2>
      <p style={{ opacity: 0.7, marginBottom: 24 }}>Join our store today</p>

      {error && (
        <div style={{ padding: 12, marginBottom: 16, background: "#ffebee", color: "#c62828", borderRadius: 8 }}>
          {error}
        </div>
      )}

      <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <input
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
          style={{ padding: 12, borderRadius: 8, border: "1px solid #ccc" }}
        />
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          style={{ padding: 12, borderRadius: 8, border: "1px solid #ccc" }}
        />
        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ padding: 12, borderRadius: 8, border: "1px solid #ccc" }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ padding: 12, borderRadius: 8, border: "1px solid #ccc" }}
        />
        
        <button
          type="submit"
          style={{
            padding: 14,
            background: "#111",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            fontWeight: "bold",
            cursor: "pointer",
            marginTop: 8
          }}
        >
          Sign Up
        </button>
      </form>

      <div style={{ marginTop: 24 }}>
        Already have an account? <Link to="/login" style={{ color: "#111", fontWeight: "bold" }}>Log In</Link>
      </div>
    </div>
  );
}
