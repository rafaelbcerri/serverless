"use strict";

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

function buildExploreBody(stocks) {
  return stocks.map(({ id, symbol, name, dailies, daily_indicators }) => ({
    id,
    symbol,
    name,
    close: dailies[0].close,
    slowk: daily_indicators[0].slowK,
    slowd: daily_indicators[0].slowD,
    rsi: daily_indicators[0].rsi,
    adx: daily_indicators[0].adx,
  })).sort((a, b) => a.id > b.id ? 1 : -1)
}