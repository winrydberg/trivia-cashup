const Sequelize = require("sequelize");
const bcrypt = require("bcryptjs");
const models = require("../../models");
const { redis } = require("../../config/redis");
const Op = Sequelize.Op;

/**
 * GET TODAYS QUIZES
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
exports.getPracticeQuestions = (req, res, next) => {
  try {
    models.sequelize
      .query("SELECT * FROM practicequestions")
      .then(([results, metadata]) => {
        redis.set(`practice`, JSON.stringify(results));
        res.json({
          status: "success",
          questions: results,
        });
      })
      .catch((error) => {
        res.json({
          status: "error",
          message: "Oops unable to get questions. Please try again",
        });
      });
  } catch (error) {
    res.json({
      status: "error",
      message: "Oops something went wrong. Please try again",
    });
  }
};
