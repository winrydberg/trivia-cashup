'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class FailedJobs extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  FailedJobs.init({
    transactiontype: DataTypes.INTEGER,
    retries: DataTypes.INTEGER,
    attempt: DataTypes.INTEGER,
    payload: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'FailedJobs',
  });
  return FailedJobs;
};