// lib/send_sms.js

// load .env data into process.env
require('dotenv').config();

const twilio = require('twilio');

class TwilioAPI {

  constructor() {
    // Get credentials from env
    this.accountSid = process.env.TWILIO_ACCOUNT_SID;
    this.authToken = process.env.TWILIO_AUTH_TOKEN;
    
    // Start client
    this.client = twilio(this.accountSid, this.authToken);
  }

  /**
   * Sends an SMS message to a provided phone number.
   * @param {String} phoneNumber 
   * @param {String} smsMessage 
   */
  async sendMessage(phoneNumber, smsMessage) {
    this.client.messages
      .create({
        body: smsMessage,
        from: process.env.TWILIO_PHONE_NUM,
        to: phoneNumber
      });
  }

  receiveStatus() {
    // TODO: Create method to handle receiving status codes from Twilio.
    // https://www.twilio.com/docs/sms/tutorials/how-to-confirm-delivery-node-js
  }

  receiveMessage() {
    // TODO: Create method to handle receiving SMS messages.
    // https://www.twilio.com/docs/sms/quickstart/node#receive-and-reply-to-inbound-sms-messages-with-express
  }

}

// Instantiate the SMS client
// const sms = new TwilioAPI();

// Freeze the SMS client object
// Object.freeze(sms);

// Export the SMS client
// module.exports = sms;
