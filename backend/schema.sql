CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'customer',
  phone TEXT NOT NULL DEFAULT '',
  address TEXT NOT NULL DEFAULT '',
  city TEXT NOT NULL DEFAULT '',
  postal_code TEXT NOT NULL DEFAULT '',
  card_last4 TEXT NOT NULL DEFAULT '',
  card_number TEXT NOT NULL DEFAULT '',
  name_on_card TEXT NOT NULL DEFAULT '',
  expiry TEXT NOT NULL DEFAULT '',
  cvv TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  brand TEXT NOT NULL,
  category TEXT NOT NULL,
  type TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 0,
  sizes JSONB NOT NULL DEFAULT '[]'::jsonb,
  image TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT ''
);

CREATE TABLE IF NOT EXISTS orders (
  order_id INTEGER PRIMARY KEY,
  customer_full_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL DEFAULT '',
  customer_address TEXT NOT NULL,
  customer_city TEXT NOT NULL,
  customer_postal_code TEXT NOT NULL,
  total NUMERIC(10, 2) NOT NULL,
  payment_last4 TEXT NOT NULL DEFAULT '',
  payment_name_on_card TEXT NOT NULL DEFAULT '',
  confirmation_email JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER NOT NULL REFERENCES orders(order_id) ON DELETE CASCADE,
  product_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  brand TEXT NOT NULL,
  category TEXT NOT NULL,
  type TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  quantity INTEGER NOT NULL,
  sizes JSONB NOT NULL DEFAULT '[]'::jsonb,
  image TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  selected_size TEXT NOT NULL DEFAULT '',
  item_key TEXT NOT NULL DEFAULT '',
  stock INTEGER
);
