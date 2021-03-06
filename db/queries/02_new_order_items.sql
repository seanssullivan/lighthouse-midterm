-- Select all unconfirmed orders by the time they were submitted

SELECT
  orders.id,
  orders.name,
  orders.phone,
  orders.email,
  orders.ordered_at,
  COUNT(order_items.id) AS menu_items,
  SUM(order_items.quantity) AS total_items,
  SUM(ROUND(order_items.quantity * menu_items.cost * 100) / 100) AS total_cost
FROM orders
JOIN order_items ON order_id = orders.id
JOIN menu_items ON menu_items.id = order_items.item_id
WHERE orders.confirmed_at IS NULL
GROUP BY orders.id, orders.name, orders.phone, orders.email, ordered_at
ORDER BY orders.ordered_at ASC;
