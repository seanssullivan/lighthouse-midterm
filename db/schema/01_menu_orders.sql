-- Drop and recreate Users table (Example)

DROP TABLE IF EXISTS menu_items CASCADE;

CREATE TABLE menu_items (
  id SERIAL PRIMARY KEY NOT NULL,
  name VARCHAR(255) NOT NULL,
  description VARCHAR(255) NOT NULL,
  cost REAL NOT NULL,
  image_url VARCHAR(255) NOT NULL,
  sold_out BOOLEAN DEFAULT FALSE
);
