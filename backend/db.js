const { Pool } = require("pg");

let pool;

function getDbMode() {
  if (process.env.DB_MODE === "postgres") {
    return "postgres";
  }

  if (process.env.DATABASE_URL || process.env.PGHOST) {
    return "postgres";
  }

  return "json";
}

function getPool() {
  if (getDbMode() !== "postgres") {
    return null;
  }

  if (!pool) {
    const ssl =
      process.env.PGSSLMODE === "require" || process.env.NODE_ENV === "production"
        ? { rejectUnauthorized: false }
        : undefined;

    const config = process.env.DATABASE_URL
      ? {
          connectionString: process.env.DATABASE_URL,
          ssl
        }
      : {
          host: process.env.PGHOST || "localhost",
          port: Number(process.env.PGPORT || 5432),
          user: process.env.PGUSER || "postgres",
          password: process.env.PGPASSWORD || "",
          database: process.env.PGDATABASE || "stepstyle",
          ssl
        };

    pool = new Pool(config);
  }

  return pool;
}

module.exports = {
  getDbMode,
  getPool
};
