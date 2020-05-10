-- Drop and recreate extras and order_extras tables

DROP TABLE IF EXISTS extras CASCADE;
DROP TABLE IF EXISTS order_extras CASCADE;

CREATE TABLE extras (
  id SERIAL PRIMARY KEY NOT NULL,
  name VARCHAR(255) NOT NULL
);

CREATE TABLE order_extras (
  order_id INTEGER REFERENCES orders(id),
  item_id INTEGER REFERENCES menu_items(id),
  extra_id INTEGER REFERENCES extras(id),
  quantity INTEGER DEFAULT 1,
  PRIMARY KEY (order_id, item_id, extra_id)
);
