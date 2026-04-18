const { getDbMode, getPool } = require("../db");
const { readJson, writeJson } = require("../config/jsonStore");

function mapUserRow(row) {
  if (!row) return null;

  return {
    id: row.id,
    fullName: row.full_name,
    email: row.email,
    password: row.password,
    role: row.role,
    phone: row.phone || "",
    address: row.address || "",
    city: row.city || "",
    postalCode: row.postal_code || "",
    cardLast4: row.card_last4 || "",
    cardNumber: row.card_number || "",
    nameOnCard: row.name_on_card || "",
    expiry: row.expiry || "",
    cvv: row.cvv || "",
    createdAt: row.created_at
  };
}

class UserDao {
  async getAll() {
    if (getDbMode() === "postgres") {
      const pool = getPool();
      const result = await pool.query("SELECT * FROM users ORDER BY id");
      return result.rows.map(mapUserRow);
    }

    return readJson("users");
  }

  async getById(id) {
    if (getDbMode() === "postgres") {
      const pool = getPool();
      const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
      return mapUserRow(result.rows[0]);
    }

    return readJson("users").find((user) => user.id === Number(id)) || null;
  }

  async getByEmail(email) {
    if (getDbMode() === "postgres") {
      const pool = getPool();
      const result = await pool.query(
        "SELECT * FROM users WHERE LOWER(email) = LOWER($1) LIMIT 1",
        [email]
      );
      return mapUserRow(result.rows[0]);
    }

    return (
      readJson("users").find(
        (user) => user.email.toLowerCase() === String(email).toLowerCase()
      ) || null
    );
  }

  async create(userData) {
    if (getDbMode() === "postgres") {
      const pool = getPool();
      const result = await pool.query(
        `INSERT INTO users (
          full_name, email, password, role, phone, address, city, postal_code,
          card_last4, card_number, name_on_card, expiry, cvv, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
        RETURNING *`,
        [
          userData.fullName,
          userData.email,
          userData.password,
          userData.role,
          userData.phone || "",
          userData.address || "",
          userData.city || "",
          userData.postalCode || "",
          userData.cardLast4 || "",
          userData.cardNumber || "",
          userData.nameOnCard || "",
          userData.expiry || "",
          userData.cvv || "",
          userData.createdAt
        ]
      );

      return mapUserRow(result.rows[0]);
    }

    const users = readJson("users");
    const newUser = {
      id: users.length ? Math.max(...users.map((user) => user.id)) + 1 : 1,
      ...userData
    };
    users.push(newUser);
    writeJson("users", users);
    return newUser;
  }

  async updateById(id, fields) {
    if (getDbMode() === "postgres") {
      const existing = await this.getById(id);
      if (!existing) return null;

      const next = { ...existing, ...fields };
      const pool = getPool();
      const result = await pool.query(
        `UPDATE users
         SET full_name = $1, email = $2, password = $3, role = $4, phone = $5,
             address = $6, city = $7, postal_code = $8, card_last4 = $9,
             card_number = $10, name_on_card = $11, expiry = $12, cvv = $13
         WHERE id = $14
         RETURNING *`,
        [
          next.fullName,
          next.email,
          next.password,
          next.role,
          next.phone || "",
          next.address || "",
          next.city || "",
          next.postalCode || "",
          next.cardLast4 || "",
          next.cardNumber || "",
          next.nameOnCard || "",
          next.expiry || "",
          next.cvv || "",
          id
        ]
      );

      return mapUserRow(result.rows[0]);
    }

    const users = readJson("users");
    const index = users.findIndex((user) => user.id === Number(id));
    if (index === -1) return null;

    users[index] = { ...users[index], ...fields };
    writeJson("users", users);
    return users[index];
  }
}

module.exports = new UserDao();
