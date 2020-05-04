-- Drop and recreate recurring_type and recurring_pattern tables

DROP TABLE IF EXISTS recurring_type CASCADE;
DROP TABLE IF EXISTS recurring_pattern CASCADE;

CREATE TABLE recurring_type (
  id SERIAL PRIMARY KEY NOT NULL,
  name VARCHAR(255) NOT NULL
);

CREATE TABLE recurring_pattern (
  id SERIAL PRIMARY KEY NOT NULL,
  discount_id INTEGER REFERENCES discounts(id) ON DELETE CASCADE,
  recurring_type_id INTEGER REFERENCES recurring_type(id) ON DELETE CASCADE,
  separation_count INTEGER DEFAULT 0,
  max_num_occurrences INTEGER,
  day_of_week INTEGER,
  week_of_month INTEGER,
  day_of_month INTEGER,
  month_of_year INTEGER
);
