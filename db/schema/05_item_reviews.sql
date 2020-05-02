-- Drop and recreate item_reviews table

DROP TABLE IF EXISTS item_reviews CASCADE;

CREATE TABLE item_reviews (
  id SERIAL PRIMARY KEY NOT NULL,
  visitor_id VARCHAR(255) NOT NULL,
  item_id INTEGER REFERENCES menu_items(id),
  rating INTEGER
);