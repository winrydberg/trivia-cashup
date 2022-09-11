"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // models.User.hasMany(models.Transaction);
    }
  }
  User.init(
    {
      username: DataTypes.STRING,
      email: DataTypes.STRING,
      phoneno: DataTypes.STRING,
      credit: DataTypes.INTEGER,
      active: DataTypes.BOOLEAN,
      image: DataTypes.STRING,
      registrationtoken: DataTypes.TEXT,
      password: DataTypes.STRING,
      todaypoint: DataTypes.INTEGER,
      weekpoint: DataTypes.INTEGER,
      monthpoint: DataTypes.INTEGER,
      overallpoint: DataTypes.INTEGER,
      referalcode: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
