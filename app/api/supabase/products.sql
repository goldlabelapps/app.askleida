-- SQL to create the products table
CREATE TABLE IF NOT EXISTS products (
  product_id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Example seed data
INSERT INTO products (name, description, price) VALUES
  ('Widget', 'A useful widget', 19.99),
  ('Gadget', 'A fancy gadget', 29.99),
  ('Thingamajig', 'A mysterious thingamajig', 9.99)
ON CONFLICT DO NOTHING;