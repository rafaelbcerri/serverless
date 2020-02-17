"use strict";

const sequelize = require('sequelize');
const connectToDatabase = require('../../models');
const { sendMessageBatch } = require('../../helpers');

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

  const queueUrl = `${process.env.AWS_ENDPOINT_URL}/queue/DailyPopulateQueue`;

  // sendMessageBatch(stocks, QUEUE_URL, 7, 60)
  // 15, 28, 37
  sendMessageBatch(stocks.slice(28), queueUrl, 1)
    .then(console.log)
    .then(() => context.done(null, 'Terminado'))
    .catch(console.error);
};

module.exports = {
  dailyPopulate
}