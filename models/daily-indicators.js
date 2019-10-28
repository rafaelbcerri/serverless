module.exports = (sequelize, type) => {
  const DailyIndicators = sequelize.define('daily_indicators', {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    stockId: {
      allowNull: false,
      type: type.INTEGER,
    },
    date: {
      allowNull: false,
      type: type.DATEONLY
    },
    sma: {
      type: type.DECIMAL(12, 4)
    },
    ema: {
      type: type.DECIMAL(12, 4)
    },
    macd: {
      type: type.DECIMAL(12, 4)
    },
    macdHist: {
      type: type.DECIMAL(12, 4)
    },
    macdSignal: {
      type: type.DECIMAL(12, 4)
    },
    slowK: {
      type: type.DECIMAL(12, 4)
    },
    slowD: {
      type: type.DECIMAL(12, 4)
    },
    rsi: {
      type: type.DECIMAL(12, 4)
    },
    adx: {
      type: type.DECIMAL(12, 4)
    },
    aroonDown: {
      type: type.DECIMAL(12, 4)
    },
    aroonUp: {
      type: type.DECIMAL(12, 4)
    },
    realMiddleBand: {
      type: type.DECIMAL(12, 4)
    },
    realLowerBand: {
      type: type.DECIMAL(12, 4)
    },
    realUpperBand: {
      type: type.DECIMAL(12, 4)
    },
    obv: {
      type: type.DECIMAL(12, 4)
    },
  }, { });

  DailyIndicators.associate = function (models) {
    DailyIndicators.belongsTo(models.Stocks, { foreignKey: 'stockId', as: 'stocks' })
  };
  return DailyIndicators;
}