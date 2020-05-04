// randomString.js

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

module.exports = {
  generateRandomString
};
