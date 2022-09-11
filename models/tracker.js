'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Tracker extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Tracker.init({
    userid: DataTypes.INTEGER,
    quizid: DataTypes.INTEGER,
    lastqid: DataTypes.INTEGER,
    trackercode: DataTypes.STRING,
    codeused: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Tracker',
  });
  return Tracker;
};