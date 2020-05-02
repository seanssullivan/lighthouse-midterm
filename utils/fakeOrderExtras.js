// utils/fakeOrderExtras.js

const faker = require('faker');
const fs = require('fs');

/**
 * Generate mock order extras records.
 * @param {Number} numOrders - the number of orders records in the database.
 * @param {Number} numExtras - the number of extras records in the database.
 */
const generateFakeOrderExtras = function(numOrderItems, numExtras) {
  let orderExtras = [];
  for (let item = 1; item <= numOrderItems; item++) {
    const newOrderExtras = [];
    for (let extra = 1; extra <= numExtras; extra++) {
      if (Math.random() > 0.90) {
        newOrderExtras.push([item, Math.ceil(Math.random() * numExtras)]);
      }
    }
    if (newOrderExtras.length > 0) {
      orderExtras = orderExtras.concat(newOrderExtras);
    }
  }
  return orderExtras;
};

/**
 * Save order data to a file.
 * @param {String} fileName - File name data is to be saved to.
 * @param {Array} data - An array of randomly generated order data.
 */
const outputData = function(fileName, data) {
  let text = '-- order_extras table seeds here\n\nINSERT INTO order_extras (order_item_id, extra_id) VALUES\n';
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
  const orderExtras = generateFakeOrderExtras(29623, 4);
  outputData('order_extras.sql', orderExtras);
} else {
  module.exports = generateFakeOrderExtras;
}
