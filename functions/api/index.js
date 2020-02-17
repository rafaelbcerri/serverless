"use strict";

const sequelize = require('sequelize');
const _ = require('lodash');
const connectToDatabase = require('../../models');
const { buildResponse } = require('../../helpers');

module.exports.todayExplore = async ({ queryStringParameters }, context, callback) => {
  try {
    console.log(queryStringParameters)
    if (!queryStringParameters) {
      return buildResponse(400, { message: "Bad Request. Missing date" });
    }

    const date = new Date(queryStringParameters.date);
    const { Stocks, Dailies, DailyIndicators } = await connectToDatabase();

    const stocks = await Stocks.findAll({
      include: [
        { model: Dailies, where: { date } },
        { model: DailyIndicators, where: { date } },
      ]
    });


    const body = buildExploreBody(stocks);
    return buildResponse(body);
  } catch (error) {
    console.log(error)
    return { error };
  }
};

// function buildDaily(dailies) {
//   return dailies.map(({ date, open, close, high, low }) =>
//     ({[date]: { open, close, high, low }})
//   ).sort((a, b) => Object.keys(a)[0] > Object.keys(b)[0] ? 1 : -1)
// }

// function buildDailyIndicators(dailyIndicators) {
//   return dailyIndicators.map(({ date, adx, rsi, slowK, slowD }) =>
//     ({[date]: { adx, rsi, slowK, slowD }})
//   ).sort((a, b) => a.id > b.id ? 1 : -1)
// }
function buildDaily(dailies) {
  return dailies.map(({ date, open, close, high, low }) =>
    ({date, open, close, high, low })
  ).sort((a, b) => a.date > b.date ? 1 : -1)
}

function buildDailyIndicators(dailyIndicators) {
  return dailyIndicators.map(({ date, adx, rsi, slowK, slowD }) =>
    ({ date, adx, rsi, slowK, slowD })
  ).sort((a, b) => a.date > b.date ? 1 : -1)
}

// function buildExploreBody(stocks) {
//   return stocks.map(({ id, symbol, name, dailies, daily_indicators }) => ({
//     id,
//     symbol,
//     name,
//     close: dailies[0].close,
//     slowk: daily_indicators[0].slowK,
//     slowd: daily_indicators[0].slowD,
//     rsi: daily_indicators[0].rsi,
//     adx: daily_indicators[0].adx,
//   })).sort((a, b) => a.id > b.id ? 1 : -1)
// }

// criação da API

module.exports.getStock = async ( request , context, callback) => {
  const { Dailies, Stocks, DailyIndicators } = await connectToDatabase();
  const { id } = request.pathParameters;

  const results = await Promise.all([
    Stocks.findByPk(id),
    Dailies.findAll({ where: { stockId: id } }).then(buildDaily),
    DailyIndicators.findAll({ where: { stockId: id } }).then(buildDailyIndicators)
  ])

  // ARRUMAR O MERGE

  const response = buildResponse({
    ...results[0].dataValues,
    data: _.merge(results[1], results[2])
  });
  console.log(_.merge(results[1], results[2])[_.merge(results[1], results[2]).length - 1])
  return response;
};

module.exports.getStocks = async ( request , context, callback) => {
  console.log('oi', request)
  console.log('pathParameters', request.pathParameters.id)
  return buildResponse({oi: "banana"})
};