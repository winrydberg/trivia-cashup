const Sequelize = require("sequelize");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const models = require("../../models");
const config = require("../../config/myconfig");
const Op = Sequelize.Op;
const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);

//=====================================================================
// ADMIN DASHBOARD
//=====================================================================
exports.getQuizReports = async (req, res, next) => {
  let quizId = req.query.quizid;
  console.log("==============================");
  console.log(quizId);
  models.Point.findAll({
    where: {
      quizid: quizId,
    },
    limit: 10,
    include: ["User", "Quiz"],
    order: [["value", "DESC"]],
  })
    .then(async (points) => {
      // let quiz = await models.Quiz.findOne({
      //   where: {
      //     id: quizId,
      //   },
      // });

      // quizpoints = [];
      // for (var i = 0; i < points.length; i++) {
      //   let user = await models.User.findOne({
      //     where: {
      //       id: points[i].userid,
      //     },
      //   });
      //   points[i].setDataValue("user", user);
      //   quizpoints.push(points[i]);
      // }

      // console.log(quizpoints);
      res.render("quizreports", {
        status: "success",
        points: points,
      });
    })
    .catch((error) => {
      console.log(error);
      req.flash("error", "Ooops Unable to get points");
      res.render("quizreports");
    });
};
