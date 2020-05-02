// utils/fakeOrders.js

const faker = require('faker');
const fs = require('fs');

/**
 * Generates a random order for a particular date between 8:00 a.m. and 11:00 a.m.
 * @param {Date} date - Date object with a time set to midnight.
 */
const generateRandomOrder = function(date) {
  // Sets startDate time and endDate time
  const startDate = new Date(date.getTime() + 28800000);  // 8:00 a.m.
  const endDate = new Date(date.getTime() + 39600000);    // 11:00 p.m.

  const newOrderDate = faker.date.between(startDate, endDate);

  const newConfirmDate = new Date(newOrderDate.getTime());
  newConfirmDate.setMinutes(newConfirmDate.getMinutes() + Math.round(Math.random() * 5));

  const newEstimate = Math.round((Math.random() * 40) + 20);

  const newReadyDate = new Date(newOrderDate.getTime());
  newReadyDate.setMinutes(newReadyDate.getMinutes() + Math.round((Math.random() * 50) + 10));

  const newCompleteDate = new Date(newReadyDate.getTime());
  newCompleteDate.setMinutes(newCompleteDate.getMinutes() + Math.round(Math.random() * 15));

  return [
    faker.name.findName(),
    faker.phone.phoneNumber(),
    faker.internet.email(),
    newOrderDate,
    newConfirmDate,
    newEstimate,
    newReadyDate,
    newCompleteDate
  ];
};

/**
 * Generates a random number of orders for one calendar day.
 * @param {Date} date - Date object with a time set to midnight.
 */
const generateRandomOrderList = function(date) {
  // Randomly determine how many orders occurred on this date
  const numOrders = Math.round(Math.random() * 480) + 20;
  let data = [];
  for (let i = 0; i <= numOrders; i++) {
    const newOrder = generateRandomOrder(date);
    if (Math.random() >= 0.90) {
      // Adds a note to some of the orders
      newOrder.push(faker.lorem.sentence());
    } else {
      newOrder.push('');
    }
    data.push(newOrder);
  }
  return data;
};

/**
 * Sort orders by date and time.
 * @param {Array} orders 
 */
const sortOrdersByDate = function(orders) {
  return orders.sort(function(a, b) {
    a = new Date(a[3]);
    b = new Date(b[3]);
    return a<b ? -1 : a>b ? 1 : 0;
  });
};

/**
 * Generate a random number of orders per day between two dates.
 * @param {String} startDateString 
 * @param {String} endDateString 
 */
const generateOrdersForDates = function(startDateString, endDateString) {
  let orderData = [];
  let currentDate = new Date(startDateString);
  const endDate = new Date(endDateString);

  console.log(`Generating orders between ${startDateString} and ${endDateString}`);
  while (currentDate.getTime() <= endDate.getTime()) {
    const newOrders = generateRandomOrderList(currentDate);
    orderData = orderData.concat(newOrders);
    currentDate = new Date(currentDate.getTime() + 86400000);
  }
  console.log(`Generated ${orderData.length} orders.`)
  return sortOrdersByDate(orderData);
};

/**
 * Save order data to a file.
 * @param {String} fileName - File name data is to be saved to.
 * @param {Array} data - An array of randomly generated order data.
 */
const outputData = function(fileName, data) {
  let text = '-- orders table seeds here\n\nINSERT INTO orders (name, phone, email, ordered_at, confirmed_at, estimated_time, ready_at, completed_at, notes) VALUES\n';
  for (let i = 0; i < data.length; i++) {
    if (i !== data.length - 1) {
      text += `('${data[i].join("', '")}'),\n`;
    } else {
      text += `('${data[i].join("', '")}');`;
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
  const orders = generateOrdersForDates('2020-01-01', '2020-04-30');
  outputData('orders.sql', orders);
}
