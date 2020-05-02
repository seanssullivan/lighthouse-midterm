-- Drop and recreate Users table (Example)

DROP TABLE IF EXISTS menu_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;

CREATE TABLE menu_items (
  id SERIAL PRIMARY KEY NOT NULL,
  name VARCHAR(255) NOT NULL,
  description VARCHAR(255) NOT NULL,
  cost REAL NOT NULL,
  image_url VARCHAR(255) NOT NULL,
  sold_out BOOLEAN DEFAULT FALSE
);

CREATE TABLE orders (
  id SERIAL PRIMARY KEY NOT NULL,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(16) NOT NULL,
  email VARCHAR(255) NOT NULL,
  ordered_at DATE,
  confirmed_at DATE,
  estimated_time DATE,
  ready_at DATE,
  completed_at DATE,
  notes TEXT
);
