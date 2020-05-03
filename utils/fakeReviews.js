// utils/fakeReviews.js

const faker = require('faker');
const fs = require('fs');

/**
 * Generate mock reviews records.
 * @param {Number} numItems - the number of orders records in the database.
 */
const generateFakeReviews = function(numItems) {
  let itemReviews = [];
  for (let item = 1; item <= numItems; item++) {
    const numReviews = Math.floor(Math.random() * 50);
    if (numReviews > 0) {
      const newItemReviews = [];
      for (let review = 1; review <= numReviews; review++) {
        const userId = generateRandomString(16);
        const rating = Math.ceil(Math.random() * 5);
        newItemReviews.push([ `'${userId}'`, item, rating ]);
      }
      itemReviews = itemReviews.concat(newItemReviews);
    }
  }
  return itemReviews;
};

/**
 * Generates a unique alphanumeric id of a given length.
 * @param {number} length
 */
const generateRandomString = (length) => {
  const alphaChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let randomString = '';
  for (let i = 0; i < length; i++) {
    const index = Math.floor(Math.random() * alphaChars.length);
    randomString += alphaChars[index];
  }
  return randomString;
};

/**
 * Save order data to a file.
 * @param {String} fileName - File name data is to be saved to.
 * @param {Array} data - An array of randomly generated order data.
 */
const outputData = function(fileName, data) {
  let text = '-- item_reviews table seeds here\n\nINSERT INTO item_reviews (visitor_id, item_id, rating) VALUES\n';
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
  const orderExtras = generateFakeReviews(10);
  outputData('item_reviews.sql', orderExtras);
} else {
  module.exports = generateFakeReviews;
}
