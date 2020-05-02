-- Drop and recreate order_items and item_reviews tables

DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS item_reviews CASCADE;

CREATE TABLE order_items (
  id SERIAL PRIMARY KEY NOT NULL,
  order_id INTEGER REFERENCES orders(id),
  item_id INTEGER REFERENCES menu_items(id),
  quantity INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE item_reviews (
  id SERIAL PRIMARY KEY NOT NULL,
  visitor_id VARCHAR(255) NOT NULL,
  item_id INTEGER REFERENCES menu_items(id),
  rating INTEGER
);
