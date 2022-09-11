const Sequelize = require("sequelize");

const models = require("../../models");
const config = require("../../config/myconfig");
const Op = Sequelize.Op;

//=====================================================================
// ADMIN DASHBOARD
//=====================================================================
exports.saveNewEarning = async (req, res, next) => {
  try {
    const userid = req.body.userid;
    const quizid = req.body.quizid;
    const position = req.body.position;
    const prize = req.body.prize;

    models.Earning.create({
      userid: userid,
      quizid: quizid,
      prize: prize,
      paid: true,
      position: position,
    }).then((earning) => {
      if (earning != null) {
        req.flash("success", "Earnings successfully saved");
        res.redirect("back");
      } else {
        req.flash("error", "Unable to save earnings");
        res.redirect("back");
      }
    });
  } catch (error) {
    req.flash("error", "Oops something went wrong. Unable to save earnings");
    return res.render("earnings");
  }
};

exports.newEarning = async (req, res, next) => {
  const userid = req.query.userid;
  const quizid = req.query.quizid;
  const position = req.query.position;
  models.User.findOne({
    where: {
      id: userid,
    },
  })
    .then(async (user) => {
      const quiz = await models.Quiz.findOne({
        where: {
          id: quizid,
        },
      });
      return res.render("newearnings", {
        status: "success",
        user: user,
        quiz: quiz,
        position: position,
      });
    })
    .catch((error) => {
      req.flash("error", "Unable to get user details");
      return res.render("newearnings", {
        status: "success",
        user: user,
      });
    });
};

exports.getEarning = async (req, res, next) => {
  const users = await models.User.findAll({
    where: {
      active: 1,
    },
  });
  models.Earning.findAll()
    .then((earnings) => {
      return res.render("earnings", {
        status: "success",
        users: users,
        earnings: earnings,
      });
    })
    .catch((error) => {
      console.log(error);
      req.flash("error", "Unable to get earnings");
      return res.render("earnings");
    });
};
