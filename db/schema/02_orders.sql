-- Drop and recreate orders table

DROP TABLE IF EXISTS orders CASCADE;

CREATE TABLE orders (
  id SERIAL PRIMARY KEY NOT NULL,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(32) NOT NULL,
  email VARCHAR(255) NOT NULL,
  ordered_at TIMESTAMP,
  confirmed_at TIMESTAMP,
  estimated_time INTEGER,
  ready_at TIMESTAMP,
  completed_at TIMESTAMP,
  notes TEXT
);
