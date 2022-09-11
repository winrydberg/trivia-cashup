const Sequelize = require("sequelize");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const moment = require("moment");
const models = require("../../models");
const config = require("../../config/myconfig");
const Op = Sequelize.Op;
const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);

//=====================================================================
// ADMIN DASHBOARD
//=====================================================================
exports.getAllCredits = async (req, res, next) => {
  try {
    let startdate =
      req.query.startdate == undefined ? new Date() : req.query.startdate;
    let enddate =
      req.query.enddate == undefined
        ? new Date().setHours(24, 59, 59, 0)
        : req.query.enddate;

    console.log(req.query.startdate, req.query.enddate);
    if (startdate == undefined && enddate == undefined) {
      transactions = [];
      return res.render("credittransactions", { transactions });
    }
    models.Transaction.findAll({
      where: {
        createdAt: { [Op.between]: [startdate, enddate] },
      },
    })
      .then(async (transactions) => {
        for (var i = 0; i < transactions.length; i++) {
          let credit = await models.Credit.findOne({
            where: {
              id: transactions[i].credit,
            },
          });
          let user = await models.User.findOne({
            where: {
              id: transactions[i].userid,
            },
          });

          transactions[i].creditname = credit.name;
          transactions[i].creditamt = credit.amount;
          transactions[i].username = user.username;
        }

        console.log(transactions);
        res.render("credittransactions", { transactions });
      })
      .catch((error) => {
        req.flash(
          "error",
          "Something went wrong. Unable to get credit transactions"
        );
        res.render("back");
      });
  } catch (error) {
    console.log(error);
    res.render("back");
  }
};
