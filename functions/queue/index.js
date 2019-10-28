const alpha = require('alphavantage')({ key: process.env.ALPHA_KEY });
const _ = require('lodash');
const connectToDatabase = require('../../models/');

const FILTER_DATE = "2014/12/31";

module.exports.setupHandler = async ({ Records }, context, callback) => {
  const { Dailies, DailyIndicators } = await connectToDatabase();
  const { body } = Records[0];
  const stocks = JSON.parse(body);

  Promise.all(
    stocks.map(({symbol, id}) =>
      alpha.data.daily(`${symbol}.SA`, "full")
        .then(data => filterStockData(data, id)),
    )
  )
    .then(_.flattenDeep)
    .then(function (data) { Dailies.bulkCreate(data) });

  const stochFields = { "slowK": "SlowK", "slowD": "SlowD" };
  const rsiFields = { "rsi": "RSI" };
  const adxFields = { "adx": "ADX" };

  Promise.all(
    stocks.map(({ symbol, id }) =>
      Promise.all([
        alpha.technical.stoch(`${symbol}.SA`, "daily")
          .then(data => filterIndicator(data, id, "STOCH", stochFields)),
        alpha.technical.rsi(`${symbol}.SA`, "daily", "14", "open")
          .then(data => filterIndicator(data, id, "RSI", rsiFields)),
        alpha.technical.adx(`${symbol}.SA`, "daily", "14")
          .then(data => filterIndicator(data, id, "ADX", adxFields))
      ])
      .then(_.flattenDeep)
      .then(data => {
        const dataByDate = _.groupBy(data, 'date')
        return Object.keys(dataByDate).map(date =>
          Object.assign({}, ...dataByDate[date])
        );
      })
    )
  )
    .then(_.flattenDeep)
    .then(function (data) { DailyIndicators.bulkCreate(data) });


  context.done(null, 'Terminado');
};


function filterStockData(stock, id) {
  return Object.keys(stock["Time Series (Daily)"])
    .filter(date => new Date(date.replace('-', '/')) > new Date(FILTER_DATE))
    .map(date => ({
      stockId: id,
      date: new Date(date.replace('-', '/')),
      open: parseNumber(stock["Time Series (Daily)"][date]["1. open"]),
      close: parseNumber(stock["Time Series (Daily)"][date]["4. close"]),
      high: parseNumber(stock["Time Series (Daily)"][date]["2. high"]),
      low: parseNumber(stock["Time Series (Daily)"][date]["3. low"]),
      volume: stock["Time Series (Daily)"][date]["5. volume"]
    }));
}
function filterIndicator(data, id, indicator, indicatorFields) {
  return Object.keys(data[`Technical Analysis: ${indicator}`])
    .filter(date => new Date(date.replace('-', '/')) > new Date(FILTER_DATE))
    .map(date => {
      const result = {
        stockId: id,
        date: new Date(date.replace('-', '/')),
      };
      Object.keys(indicatorFields).forEach(field =>
        result[field] = parseNumber(data[`Technical Analysis: ${indicator}`][date][indicatorFields[field]])
      );
      return result
    });
}


function parseNumber(number) {
  return parseFloat(number).toPrecision(3);
}
