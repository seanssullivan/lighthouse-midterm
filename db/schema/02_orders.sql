-- Drop and recreate orders table

DROP TABLE IF EXISTS orders CASCADE;

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
