// utils/fakeOrderItems.js

const faker = require('faker');
const fs = require('fs');

/**
 * Generate an order items record.
 * @param {Number} orderId 
 * @param {Number} numMenuItems 
 */
const createOrderItem = function(orderId, numMenuItems) {
  const itemId = Math.ceil(Math.random() * numMenuItems);
  const quantity = Math.ceil(Math.random() * 4);
  return [ orderId, itemId, quantity ];
}

/**
 * Generate mock order items records.
 * @param {Number} numOrders - the number of order records in the database.
 * @param {Number} numMenuItems - the number of menu item records in the database.
 */
const generateFakeOrderItems = function(numOrders, numMenuItems) {
  let orderItems = [];
  for (let order = 1; order <= numOrders; order++) {
    const newOrderItems = [];
    const numOrderItems = Math.ceil(Math.random() * 6);
    for (let item = 1; item <= numOrderItems; item++) {
      newOrderItems.push(createOrderItem(order, numMenuItems));
    }
    orderItems = orderItems.concat(newOrderItems);
  }
  return orderItems;
}

/**
 * Save order data to a file.
 * @param {String} fileName - File name data is to be saved to.
 * @param {Array} data - An array of randomly generated order data.
 */
const outputData = function(fileName, data) {
  let text = '-- order_items table seeds here\n\nINSERT INTO orders (order_id, item_id, quantity) VALUES\n';
  for (let i = 0; i < data.length; i++) {
    if (i !== data.length - 1) {
      text += `(${data[i].join(', ')}),\n`;
    } else {
      text += `(${data[i].join(', ')});`;
    }
  }

  console.log('Saving data to file...');
  fs.writeFile(fileName, text, (err) => {
    if (err) throw err;
    console.log('The file has been saved!');
  });
};

if (require.main === module) {
  console.log('Running faker.js script...');
  const orderItems = generateFakeOrderItems(29623, 10);
  outputData('orderItems.sql', orderItems);
} else {
  module.exports = generateFakeOrderItems;
}
