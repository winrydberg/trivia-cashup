"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Notification extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.User, { foreignKey: "userid", as: "User" });
    }
  }
  Notification.init(
    {
      userid: DataTypes.INTEGER,
      message: DataTypes.TEXT,
      read: DataTypes.BOOLEAN,
      title: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "Notification",
    }
  );
  return Notification;
};
