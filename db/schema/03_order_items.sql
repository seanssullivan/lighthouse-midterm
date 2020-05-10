-- Drop and recreate order_items table

DROP TABLE IF EXISTS order_items CASCADE;

CREATE TABLE order_items (
  order_id INTEGER REFERENCES orders(id),
  item_id INTEGER REFERENCES menu_items(id),
  quantity INTEGER NOT NULL DEFAULT 1,
  PRIMARY KEY (order_id, item_id)
);
