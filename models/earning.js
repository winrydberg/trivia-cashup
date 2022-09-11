"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Earning extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.User, { foreignKey: "userid", as: "User" });
      this.belongsTo(models.Quiz, { foreignKey: "quizid", as: "Quiz" });
    }
  }
  Earning.init(
    {
      userid: DataTypes.INTEGER,
      quizid: DataTypes.INTEGER,
      prize: DataTypes.TEXT,
      paid: DataTypes.BOOLEAN,
      position: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Earning",
    }
  );
  return Earning;
};
