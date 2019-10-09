'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("dailies", {
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
      open: {
        allowNull: false,
        type: Sequelize.DECIMAL(12, 4)
      },
      close: {
        allowNull: false,
        type: Sequelize.DECIMAL(12, 4)
      },
      high: {
        allowNull: false,
        type: Sequelize.DECIMAL(12, 4)
      },
      low: {
        allowNull: false,
        type: Sequelize.DECIMAL(12, 4)
      },
      volume: {
        allowNull: false,
        type: Sequelize.BIGINT
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
    return queryInterface.dropTable("dailies");
  }
};
