const Sequelize = require("sequelize");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const models = require("../../models");
const config = require("../../config/myconfig");
const Op = Sequelize.Op;

//=====================================================================
// GET ALL USERS
//=====================================================================
exports.getQuizWinners = async (req, res, next) => {
  let quizId = req.body.quizid;
  models.Point.findAll({
    where: {
      quizid: quizId,
    },
    limit: 10,
    include: ["User", "Quiz"],
    order: [["value", "DESC"]],
  })
    .then(async (points) => {
      return res.json({
        status: "success",
        points: points,
      });
    })
    .catch((error) => {
      return res.json({
        status: "error",
        message: "Unable to get quiz winners. Please check again later.",
      });
    });
};
