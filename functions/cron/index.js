"use strict";

const sequelize = require('sequelize');
const connectToDatabase = require('../../models');
const { buildResponse, splitArrayIntoBatches } = require('../../helpers');

const sqs = new aws.SQS({
  apiVersion: '2012-11-05',
  region: process.env.AWS_REGION,
  endpoint: process.env.AWS_ENDPOINT_URL,
  sslEnabled: false
});

const QUEUE_URL = `${process.env.AWS_ENDPOINT_URL}/queue/DailyPopulateQueue`;

const dailyPopulate = async (event, context, callback) => {
  const { Dailies, Stocks } = await connectToDatabase();
  const stocks = await Stocks.findAll({
    attributes: ['id', 'symbol', [sequelize.fn('max', sequelize.col('dailies.date')), 'date']],
    include: [{
      model: Dailies,
      attributes: []
    }],
    raw: true,
    group: ['stocks.id'],
  });

  sendMessageBatch(stocks)
    .then(console.log)
    .catch(console.error);
};

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

module.exports = {
  dailyPopulate
}