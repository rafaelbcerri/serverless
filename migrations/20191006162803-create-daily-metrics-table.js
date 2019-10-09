'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("daily_metrics", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      stockId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'stocks',
          key: 'id'
        }
      },
      date: {
        allowNull: false,
        type: Sequelize.DATEONLY
      },
      sma: {
        type: Sequelize.DECIMAL(12, 4)
      },
      ema: {
        type: Sequelize.DECIMAL(12, 4)
      },
      macd: {
        type: Sequelize.DECIMAL(12, 4)
      },
      macdHist: {
        type: Sequelize.DECIMAL(12, 4)
      },
      macdSignal: {
        type: Sequelize.DECIMAL(12, 4)
      },
      slowK: {
        type: Sequelize.DECIMAL(12, 4)
      },
      slowD: {
        type: Sequelize.DECIMAL(12, 4)
      },
      rsi: {
        type: Sequelize.DECIMAL(12, 4)
      },
      adx: {
        type: Sequelize.DECIMAL(12, 4)
      },
      aroonDown: {
        type: Sequelize.DECIMAL(12, 4)
      },
      aroonUp: {
        type: Sequelize.DECIMAL(12, 4)
      },
      realMiddleBand: {
        type: Sequelize.DECIMAL(12, 4)
      },
      realLowerBand: {
        type: Sequelize.DECIMAL(12, 4)
      },
      realUpperBand: {
        type: Sequelize.DECIMAL(12, 4)
      },
      obv: {
        type: Sequelize.DECIMAL(12, 4)
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("daily_metrics");
  }
};
