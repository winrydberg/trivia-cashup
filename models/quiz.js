"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Quiz extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Quiz.init(
    {
      title: DataTypes.STRING,
      description: DataTypes.TEXT,
      image: DataTypes.STRING,
      tblquestions: DataTypes.STRING,
      startdate: DataTypes.DATE,
      enddate: DataTypes.DATE,
      required_credit: DataTypes.INTEGER,
      status: DataTypes.BOOLEAN,
      total_players: DataTypes.INTEGER,
      firebasetopic: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Quiz",
    }
  );
  return Quiz;
};
