"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Users", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      username: {
        type: Sequelize.STRING,
      },
      email: {
        type: Sequelize.STRING,
      },
      phoneno: {
        type: Sequelize.STRING,
      },
      credit: {
        type: Sequelize.INTEGER,
      },
      active: {
        type: Sequelize.BOOLEAN,
      },
      image: {
        type: Sequelize.STRING,
      },
      registrationtoken: {
        type: Sequelize.TEXT,
      },
      password: {
        type: Sequelize.STRING,
      },
      todaypoint: {
        type: Sequelize.INTEGER,
      },
      weekpoint: {
        type: Sequelize.INTEGER,
      },
      monthpoint: {
        type: Sequelize.INTEGER,
      },
      overallpoint: {
        type: Sequelize.INTEGER,
      },
      referalcode: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Users");
  },
};
