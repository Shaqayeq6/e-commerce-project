import { Link, useLocation } from "react-router-dom";

export default function Confirmation() {
  const location = useLocation();
  const data = location.state;

  if (!data) {
    return (
      <div style={{ padding: 20 }}>
        <h1>Order Confirmation</h1>
        <p>No order data found. Please checkout first.</p>
        <Link to="/">Go to Store</Link>
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>✅ Order Confirmed!</h1>
      <p><strong>Order ID:</strong> {data.orderId}</p>
      <p><strong>Name:</strong> {data.customer.fullName}</p>
      <p><strong>Email:</strong> {data.customer.email}</p>
      <p><strong>Total Paid:</strong> ${Number(data.total).toFixed(2)}</p>

      {data.confirmationEmail && (
        <div style={{ marginTop: 16, padding: 12, borderRadius: 10, background: "#f6f8fa", border: "1px solid #d0d7de" }}>
          <p style={{ margin: 0, fontWeight: 600 }}>Confirmation email sent</p>
          <p style={{ margin: "6px 0 0" }}>
            We sent your order confirmation to <strong>{data.confirmationEmail.to}</strong>.
          </p>
          <p style={{ margin: "6px 0 0", fontSize: 14, color: "#57606a" }}>
            Subject: {data.confirmationEmail.subject}
          </p>
        </div>
      )}

      <div style={{ marginTop: 14 }}>
        <Link to="/">Back to Store</Link>
      </div>
    </div>
  );
}