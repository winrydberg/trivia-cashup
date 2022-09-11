"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // models.Transaction.belongsTo(models.User);
      // models.Transaction.belongsTo(models.Credit);
      this.belongsTo(models.User, { foreignKey: "userid", as: "User" });
    }
  }
  Transaction.init(
    {
      userid: DataTypes.INTEGER,
      amount: DataTypes.DECIMAL,
      credit: DataTypes.INTEGER,
      completed: DataTypes.BOOLEAN,
      status: DataTypes.BOOLEAN,
      xreference: DataTypes.STRING,
      apiresponse: DataTypes.TEXT,
      verifyresponse: DataTypes.TEXT,
      momoinfo: DataTypes.STRING,
      usercredited: DataTypes.BOOLEAN,
      financialtransactionId: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Transaction",
    }
  );
  return Transaction;
};
