const { getDbMode, getPool } = require("../db");
const { readJson, writeJson } = require("../config/jsonStore");

function normalizeOrder(order, items) {
  return {
    orderId: order.order_id,
    customer: {
      fullName: order.customer_full_name,
      email: order.customer_email,
      phone: order.customer_phone || "",
      address: order.customer_address,
      city: order.customer_city,
      postalCode: order.customer_postal_code
    },
    items: items.map((item) => ({
      id: item.product_id,
      name: item.name,
      brand: item.brand,
      category: item.category,
      type: item.type,
      price: Number(item.price),
      quantity: Number(item.quantity),
      sizes: item.sizes || [],
      image: item.image,
      description: item.description || "",
      selectedSize: item.selected_size || "",
      key: item.item_key || "",
      stock: item.stock
    })),
    total: Number(order.total),
    paymentMethod: {
      last4: order.payment_last4 || "",
      nameOnCard: order.payment_name_on_card || ""
    },
    confirmationEmail: order.confirmation_email || null,
    createdAt: order.created_at
  };
}

class OrderDao {
  async getAll() {
    if (getDbMode() === "postgres") {
      const pool = getPool();
      const ordersResult = await pool.query("SELECT * FROM orders ORDER BY created_at DESC");
      const itemsResult = await pool.query(
        "SELECT * FROM order_items ORDER BY order_id DESC, id ASC"
      );
      const itemsByOrder = itemsResult.rows.reduce((acc, item) => {
        const key = item.order_id;
        acc[key] = acc[key] || [];
        acc[key].push(item);
        return acc;
      }, {});

      return ordersResult.rows.map((order) =>
        normalizeOrder(order, itemsByOrder[order.order_id] || [])
      );
    }

    return readJson("orders");
  }

  async create(order) {
    if (getDbMode() === "postgres") {
      const pool = getPool();
      await pool.query("BEGIN");

      try {
        await pool.query(
          `INSERT INTO orders (
            order_id, customer_full_name, customer_email, customer_phone,
            customer_address, customer_city, customer_postal_code, total,
            payment_last4, payment_name_on_card, confirmation_email, created_at
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

        await pool.query("COMMIT");
        return order;
      } catch (error) {
        await pool.query("ROLLBACK");
        throw error;
      }
    }

    const orders = readJson("orders");
    orders.push(order);
    writeJson("orders", orders);
    return order;
  }
}

module.exports = new OrderDao();
