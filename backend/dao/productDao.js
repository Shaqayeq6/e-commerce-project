const { getDbMode, getPool } = require("../db");
const { readJson, writeJson } = require("../config/jsonStore");

function mapProductRow(row) {
  if (!row) return null;

  return {
    id: row.id,
    name: row.name,
    brand: row.brand,
    category: row.category,
    type: row.type,
    price: Number(row.price),
    quantity: Number(row.quantity),
    sizes: row.sizes || [],
    image: row.image,
    description: row.description || ""
  };
}

class ProductDao {
  async getAll() {
    if (getDbMode() === "postgres") {
      const pool = getPool();
      const result = await pool.query("SELECT * FROM products ORDER BY id");
      return result.rows.map(mapProductRow);
    }

    return readJson("products");
  }

  async getById(id) {
    if (getDbMode() === "postgres") {
      const pool = getPool();
      const result = await pool.query("SELECT * FROM products WHERE id = $1", [id]);
      return mapProductRow(result.rows[0]);
    }

    return readJson("products").find((product) => product.id === Number(id)) || null;
  }

  async create(productData) {
    if (getDbMode() === "postgres") {
      const pool = getPool();
      const result = await pool.query(
        `INSERT INTO products (
          name, brand, category, type, price, quantity, sizes, image, description
        ) VALUES ($1, $2, $3, $4, $5, $6, $7::jsonb, $8, $9)
        RETURNING *`,
        [
          productData.name,
          productData.brand,
          productData.category,
          productData.type,
          Number(productData.price),
          Number(productData.quantity),
          JSON.stringify(productData.sizes || []),
          productData.image,
          productData.description || ""
        ]
      );
      return mapProductRow(result.rows[0]);
    }

    const products = readJson("products");
    const newProduct = {
      id: products.length ? Math.max(...products.map((product) => product.id)) + 1 : 1,
      ...productData,
      price: Number(productData.price),
      quantity: Number(productData.quantity),
      sizes: Array.isArray(productData.sizes) ? productData.sizes : []
    };
    products.push(newProduct);
    writeJson("products", products);
    return newProduct;
  }

  async deleteById(id) {
    if (getDbMode() === "postgres") {
      const pool = getPool();
      const result = await pool.query("DELETE FROM products WHERE id = $1 RETURNING id", [id]);
      return Boolean(result.rowCount);
    }

    const products = readJson("products");
    const next = products.filter((product) => product.id !== Number(id));
    if (next.length === products.length) return false;
    writeJson("products", next);
    return true;
  }

  async updateById(id, fields) {
    if (getDbMode() === "postgres") {
      const existing = await this.getById(id);
      if (!existing) return null;
      const next = { ...existing, ...fields };
      const pool = getPool();
      const result = await pool.query(
        `UPDATE products
         SET name = $1, brand = $2, category = $3, type = $4, price = $5,
             quantity = $6, sizes = $7::jsonb, image = $8, description = $9
         WHERE id = $10
         RETURNING *`,
        [
          next.name,
          next.brand,
          next.category,
          next.type,
          Number(next.price),
          Number(next.quantity),
          JSON.stringify(next.sizes || []),
          next.image,
          next.description || "",
          id
        ]
      );
      return mapProductRow(result.rows[0]);
    }

    const products = readJson("products");
    const index = products.findIndex((product) => product.id === Number(id));
    if (index === -1) return null;
    products[index] = { ...products[index], ...fields };
    writeJson("products", products);
    return products[index];
  }
}

module.exports = new ProductDao();
