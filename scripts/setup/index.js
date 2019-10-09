'use strict';

const aws = require('aws-sdk');
// const alpha = require('alphavantage')({ key: process.env.ALPHA_KEY });

const connectToDatabase = require('../../models/');
const stocksJson = require("./stocks.json");

const sqs = new aws.SQS({
  apiVersion: '2012-11-05',
  region: process.env.AWS_REGION,
  endpoint: process.env.AWS_ENDPOINT_URL,
  sslEnabled: false
});
const queueUrl = `${process.env.AWS_ENDPOINT_URL}/queue/PopulateDaily`;

;(async () => {
  console.log("Connecting to Database");
  const { Stocks } = await connectToDatabase();

  console.log("Creating stocks");
  // const stocks = await Stocks.bulkCreate(stocksJson);  // to create stocks
  const stocks = await Stocks.findAll(); // use this if stocks are already created
  const stockMessages = stocks.map(({ id, symbol }) => ({ id, symbol }));

  console.log("Sending stocks to SQS");
  sendMessageBatch(stockMessages, 0);
})();


function sendMessageBatch(messages, delay) {
  if (!messages.length) { return []; }
  const messagesToSend = messages.splice(0, 7);

  const params = {
    MessageBody: JSON.stringify(messagesToSend),
    DelaySeconds: delay,
    QueueUrl: queueUrl
  };

  sqs.sendMessage(params, function (err, data) {
    if (err) {
      console.log('error:', 'Fail Send Message' + err);
    } else {
      console.log('data:', data.MessageId);
    }
  });

  return sendMessageBatch(messages, delay + 60);
}
