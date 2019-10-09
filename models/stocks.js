module.exports = (sequelize, type) => {
  const Stocks = sequelize.define('stocks', {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    symbol: {
      allowNull: false,
      type: type.STRING
    },
    name: {
      allowNull: false,
      type: type.STRING
    },
    description: type.STRING,
    logo: type.STRING
  }, {});

  Stocks.associate = function (models) {
    // Stocks.hasMany(models.Dailies)
    // Stocks.hasMany(models.DailyMetrics)
  };

  return Stocks;
}