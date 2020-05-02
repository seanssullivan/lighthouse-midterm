-- Drop and recreate extras and order_extras tables

DROP TABLE IF EXISTS extras CASCADE;
DROP TABLE IF EXISTS order_extras CASCADE;

CREATE TABLE extras (
  id SERIAL PRIMARY KEY NOT NULL,
  name VARCHAR(255) NOT NULL
);

CREATE TABLE order_extras (
  id SERIAL PRIMARY KEY NOT NULL,
  order_id INTEGER REFERENCES orders(id),
  order_item_id INTEGER REFERENCES order_items(id),
  extra_id INTEGER REFERENCES extras(id)
);
