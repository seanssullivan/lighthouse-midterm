-- Select all items for an order

SELECT
  menu_items.name,
  order_items.quantity
FROM order_items
JOIN menu_items ON menu_items.id = item_id
WHERE order_id = 1
ORDER BY menu_items.id;
