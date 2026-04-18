const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
const { getPool } = require("./db");
const { ensureDirAndFiles, readJson } = require("./config/jsonStore");

dotenv.config({ path: path.join(__dirname, ".env") });

async function seed() {
  ensureDirAndFiles();

  const pool = getPool();
  if (!pool) {
    throw new Error("Postgres is not configured. Set DATABASE_URL or PG* variables first.");
  }

  const schema = fs.readFileSync(path.join(__dirname, "schema.sql"), "utf-8");
  await pool.query(schema);

  const users = readJson("users");
  const products = readJson("products");
  const orders = readJson("orders");

  await pool.query("BEGIN");

  try {
    await pool.query("TRUNCATE order_items, orders, products, users RESTART IDENTITY CASCADE");

    for (const user of users) {
      await pool.query(
        `INSERT INTO users (
          id, full_name, email, password, role, phone, address, city, postal_code,
          card_last4, card_number, name_on_card, expiry, cvv, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)`,
        [
          user.id,
          user.fullName,
          user.email,
          user.password,
          user.role,
          user.phone || "",
          user.address || "",
          user.city || "",
          user.postalCode || "",
          user.cardLast4 || "",
          user.cardNumber || "",
          user.nameOnCard || "",
          user.expiry || "",
          user.cvv || "",
          user.createdAt
        ]
      );
    }

    for (const product of products) {
      await pool.query(
        `INSERT INTO products (
          id, name, brand, category, type, price, quantity, sizes, image, description
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8::jsonb, $9, $10)`,
        [
          product.id,
          product.name,
          product.brand,
          product.category,
          product.type,
          Number(product.price),
          Number(product.quantity),
          JSON.stringify(product.sizes || []),
          product.image,
          product.description || ""
        ]
      );
    }

    for (const order of orders) {
      await pool.query(
        `INSERT INTO orders (
          order_id, customer_full_name, customer_email, customer_phone, customer_address,
          customer_city, customer_postal_code, total, payment_last4,
          payment_name_on_card, confirmation_email, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11::jsonb, $12)`,
        [
          order.orderId,
          order.customer.fullName,
          order.customer.email,
          order.customer.phone || "",
          order.customer.address,
          order.customer.city,
          order.customer.postalCode,
          Number(order.total),
          order.paymentMethod?.last4 || "",
          order.paymentMethod?.nameOnCard || "",
          JSON.stringify(order.confirmationEmail || null),
          order.createdAt
        ]
      );

      for (const item of order.items) {
        await pool.query(
          `INSERT INTO order_items (
            order_id, product_id, name, brand, category, type, price, quantity,
            sizes, image, description, selected_size, item_key, stock
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9::jsonb, $10, $11, $12, $13, $14)`,
          [
            order.orderId,
            item.id,
            item.name,
            item.brand,
            item.category,
            item.type,
            Number(item.price),
            Number(item.quantity),
            JSON.stringify(item.sizes || []),
            item.image,
            item.description || "",
            item.selectedSize || "",
            item.key || "",
            item.stock ?? null
          ]
        );
      }
    }

    await pool.query("COMMIT");
    console.log("Seeded PostgreSQL from JSON data.");
  } catch (error) {
    await pool.query("ROLLBACK");
    throw error;
  } finally {
    await pool.end();
  }
}

seed().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
