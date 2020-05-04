-- Drop and recreate discounts table

DROP TABLE IF EXISTS discounts CASCADE;

CREATE TABLE discounts (
  id SERIAL PRIMARY KEY NOT NULL,
  amount REAL NOT NULL,
  start_date TIMESTAMP DEFAULT NOW(),
  end_date TIMESTAMP,
  is_recurring BOOLEAN DEFAULT FALSE
);
