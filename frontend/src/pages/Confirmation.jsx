import { Link, useLocation } from "react-router-dom";

export default function Confirmation() {
  const location = useLocation();
  const data = location.state;
  const emailStatus = data?.confirmationEmail?.status;
  const emailStatusTitle =
    emailStatus === "sent"
      ? "Confirmation email sent"
      : emailStatus === "failed"
        ? "Confirmation email failed"
        : "Confirmation email not configured";
  const emailStatusText =
    emailStatus === "sent"
      ? `We sent your order confirmation to ${data.confirmationEmail.to}.`
      : emailStatus === "failed"
        ? `We could not send the confirmation email to ${data.confirmationEmail.to}.`
        : "SMTP email credentials are not configured yet, so no real email was sent.";
  const emailStatusColor =
    emailStatus === "sent"
      ? { background: "#f0fff4", border: "1px solid #9ae6b4" }
      : { background: "#fff5f5", border: "1px solid #feb2b2" };

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
        <div
          style={{
            marginTop: 16,
            padding: 12,
            borderRadius: 10,
            ...emailStatusColor
          }}
        >
          <p style={{ margin: 0, fontWeight: 600 }}>{emailStatusTitle}</p>
          <p style={{ margin: "6px 0 0" }}>
            {emailStatusText.split(data.confirmationEmail.to).map((part, index, parts) => (
              index < parts.length - 1 ? (
                <span key={index}>
                  {part}
                  <strong>{data.confirmationEmail.to}</strong>
                </span>
              ) : (
                <span key={index}>{part}</span>
              )
            ))}
          </p>
          <p style={{ margin: "6px 0 0", fontSize: 14, color: "#57606a" }}>
            Subject: {data.confirmationEmail.subject}
          </p>
          {data.confirmationEmail.error && (
            <p style={{ margin: "6px 0 0", fontSize: 14, color: "#b42318" }}>
              Error: {data.confirmationEmail.error}
            </p>
          )}
        </div>
      )}

      <div style={{ marginTop: 14 }}>
        <Link to="/">Back to Store</Link>
      </div>
    </div>
  );
}
