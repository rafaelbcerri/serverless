module.exports = (sequelize, type) => {
  const Dailies = sequelize.define('dailies', {
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
    open: {
      allowNull: false,
      type: type.DECIMAL(12, 4)
    },
    close: {
      allowNull: false,
      type: type.DECIMAL(12, 4)
    },
    high: {
      allowNull: false,
      type: type.DECIMAL(12, 4)
    },
    low: {
      allowNull: false,
      type: type.DECIMAL(12, 4)
    },
    volume: {
      allowNull: false,
      type: type.BIGINT
    }
  }, {});

  Dailies.associate = function (models) {
    Dailies.belongsTo(models.Stocks, { foreignKey: 'stockId', as: 'stocks' })
  };

  return Dailies;
}