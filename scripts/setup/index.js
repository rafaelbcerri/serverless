'use strict';

const aws = require('aws-sdk');

const connectToDatabase = require('../../models/');
const stocksJson = require("./stocks.json");
const { splitArrayIntoBatches } = require('../../helpers/');

const sqs = new aws.SQS({
  apiVersion: '2012-11-05',
  region: process.env.AWS_REGION,
  endpoint: process.env.AWS_ENDPOINT_URL,
  sslEnabled: false
});

const QUEUE_URL = `${process.env.AWS_ENDPOINT_URL}/queue/SetupQueue`;

;(async () => {
  console.log("Connecting to Database");
  const { Stocks } = await connectToDatabase();

  console.log("Creating stocks");
  const stocksInDB = await Stocks.findAll();
  const stocks = (stocksInDB.length === 0) ? await Stocks.bulkCreate(stocksJson) : stocksInDB;
  const stockMessages = stocks.map(({ id, symbol }) => ({ id, symbol }));

  console.log("Sending stocks to SQS");

  sendMessageBatch(stockMessages)
    .then(console.log)
    .catch(console.error);
})();

const sendMessageBatch = (messages) => {
  let delay = 0;
  const messagesBatch = splitArrayIntoBatches(messages, 7);

  return Promise.all(messagesBatch.map(function (batch) {
    const message = createMessage(batch, delay);
    delay += 60;
    return sqs.sendMessage(message).promise();
  }))
    .then(results => results.reduce(
      (memo, item) => memo.concat(item),
      [],
    ));
}

const createMessage = (body, delay) => ({
  MessageBody: JSON.stringify(body),
  DelaySeconds: delay,
  QueueUrl: QUEUE_URL
});