-- Select all menu items and their average rating

SELECT
  menu_items.id,
  menu_items.name,
  menu_items.description,
  menu_items.cost,
  menu_items.image_url,
  menu_items.sold_out,
  (SELECT ROUND(AVG(rating))
   FROM item_reviews
   WHERE item_reviews.id = menu_items.id
  ) AS average_rating
FROM menu_items;
