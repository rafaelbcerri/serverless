'use strict';

const aws = require('aws-sdk');

const connectToDatabase = require('../../models/');
const stocksJson = require("./stocks.json");
const { sendMessageBatch } = require('../../helpers/');

const sqs = new aws.SQS({
  apiVersion: '2012-11-05',
  region: process.env.AWS_REGION,
  endpoint: process.env.AWS_ENDPOINT_URL,
  sslEnabled: false
});


;(async () => {
  console.log("Connecting to Database");
  const { Stocks } = await connectToDatabase();

  console.log("Creating stocks");
  const stocksInDB = await Stocks.findAll();
  const stocks = (stocksInDB.length === 0) ? await Stocks.bulkCreate(stocksJson) : stocksInDB;
  const stockMessages = stocks.map(({ id, symbol }) => ({ id, symbol }));

  console.log("Sending stocks to SQS");

  const queueUrl = `${process.env.AWS_ENDPOINT_URL}/queue/SetupQueue`;
  sendMessageBatch(stockMessages, queueUrl, 5)
    .then(console.log)
    .catch(console.error);
})();