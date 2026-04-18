const nodemailer = require("nodemailer");

function createMailTransport() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_SECURE } = process.env;

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    return null;
  }

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: SMTP_SECURE === "true" || Number(SMTP_PORT) === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS
    }
  });
}

async function sendOrderConfirmationEmail(order) {
  const transporter = createMailTransport();
  const from = process.env.SMTP_FROM || process.env.SMTP_USER;
  const subject = `StepStyle Order Confirmation #${order.orderId}`;

  if (!transporter || !from) {
    return {
      to: order.customer.email,
      from: from || null,
      subject,
      sentAt: null,
      status: "not_configured"
    };
  }

  const itemLines = order.items
    .map(
      (item) =>
        `- ${item.name} x${item.quantity}: $${(
          Number(item.price) * Number(item.quantity)
        ).toFixed(2)}`
    )
    .join("\n");

  const text = [
    `Hi ${order.customer.fullName},`,
    "",
    "Thanks for your order at StepStyle.",
    `Order ID: ${order.orderId}`,
    `Total Paid: $${Number(order.total).toFixed(2)}`,
    "",
    "Items:",
    itemLines,
    "",
    `Shipping to: ${order.customer.address}, ${order.customer.city}, ${order.customer.postalCode}`,
    "",
    "We will notify you when your order ships."
  ].join("\n");

  try {
    const info = await transporter.sendMail({
      from,
      to: order.customer.email,
      subject,
      text
    });

    return {
      to: order.customer.email,
      from,
      subject,
      sentAt: new Date().toISOString(),
      status: "sent",
      messageId: info.messageId || null
    };
  } catch (error) {
    return {
      to: order.customer.email,
      from,
      subject,
      sentAt: null,
      status: "failed",
      error: error.message
    };
  }
}

module.exports = {
  sendOrderConfirmationEmail
};
