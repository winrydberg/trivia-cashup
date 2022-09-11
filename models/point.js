"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Point extends Model {
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
  Point.init(
    {
      value: DataTypes.INTEGER,
      userid: DataTypes.INTEGER,
      quizid: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Point",
    }
  );
  return Point;
};
