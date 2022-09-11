const Sequelize = require("sequelize");
const bcrypt = require("bcryptjs");
const moment = require('moment');
const jwt = require("jsonwebtoken");
const models = require("../../models");
const config = require("../../config/myconfig");
const transaction = require("../../models/transaction");
const Op = Sequelize.Op;
const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);

//=====================================================================
// ADMIN DASHBOARD
//=====================================================================
exports.adminDashboard = async (req, res, next) => {
  try {
    const quizCount = await models.Quiz.findAndCountAll();
    const userCount = await models.User.findAndCountAll();

    const creditPurchaseCount = await models.Transaction.findAndCountAll({
      where: {
        createdAt: {
          [Op.lt]: new Date(),
          [Op.gt]: new Date(new Date() - 24 * 60 * 60 * 1000),
        },
      },
    });

    //get users  with higihest purchasing credit for the week
    var startOfWeek = moment().startOf('week').toDate();
    var endOfWeek   = moment().endOf('week').toDate();
    let transactions = await models.Transaction.findAll({
      where: {
        createdAt: {
          [Op.gte]: startOfWeek,
          [Op.lte]: endOfWeek,
        },
      },
      attributes: [
          'userid',
          [Sequelize.fn('sum', Sequelize.col('amount')), 'amount'],
        ],
      group: ['userid'],
      order: [
            ['amount', 'DESC'],
      ],
      // group: ['userid']
    })

    for (let i = 0; i < transactions.length; i++){
      let user = await models.User.findOne({
        where: {
           id: transactions[i].userid
        }
      })
      transactions[i].user = user;
    }

    res.render("dashboard", {
      status: "success",
      quizCount: quizCount.count,
      userCount: userCount.count,
      creditTodayCount: creditPurchaseCount.count,
      transactions: transactions
    });
  } catch (error) {
    console.log(error);
    res.redirect("back");
  }
};
