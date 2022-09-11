const Sequelize = require("sequelize");
const bcrypt = require("bcryptjs");
const models = require("../../models");
const Op = Sequelize.Op;

/**
 * GET TODAYS QUIZES
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
exports.getTodaysQuizes = (req, res, next) => {
  const TODAY_START = new Date().setHours(0, 0, 0, 0);
  const TODAY_END = new Date().setHours(24, 59, 59, 0);

  try {
    models.Quiz.findAll({
      where: {
        // startdate: { [Op.between]: [TODAY_START, TODAY_END] },
        status: true,
      },
      order: [["id", "desc"]],
    })
      .then((quizes) => {
        for (var i = 0; i < quizes.length; i++) {
          var currentdate = new Date();
          var quizstartdate = new Date(quizes[i].startdate);
          if (quizstartdate < currentdate) {
            quizes[i].setDataValue("livestatus", true);
          } else {
            quizes[i].setDataValue("livestatus", false);
          }
        }
        return res.json({
          status: "success",
          quizes: quizes,
        });
      })
      .catch((error) => {
        res.json({
          error: "error",
          message: "Oops unable to get quizes now. Please try again",
        });
      });
  } catch (error) {
    res.json({
      status: "error",
      message: "Oops something went wrong. Please try again",
    });
  }
};

exports.newQuiz = (req, res, next) => {};

/**
 * PASSED QUIZES
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
exports.archivedQuizes = (req, res, next) => {
  try {
    models.Quiz.findAll({
      where: {
        status: false,
      },
      order: [
        ["id", "desc"],
        ["createdAt", "desc"],
      ],
    })
      .then((quizes) => {
        return res.json({
          status: "success",
          quizes: quizes,
        });
      })
      .catch((error) => {
        res.json({
          error: "error",
          message: "Oops unable to get quizes now. Please try again",
        });
      });
  } catch (error) {
    res.json({
      status: "error",
      message: "Oops something went wrong. Please try again",
    });
  }
};

/**
 * SUBSCRIVBE TO PARTICIPATE
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
exports.subcribeToPlay = async (req, res, next) => {
  try {
    let user = await models.User.findOne({
      where: {
        id: req.body.userid,
      },
    });
    let quiz = await models.Quiz.findOne({
      where: {
        id: req.body.quizid,
      },
    });
    let subs = await models.Subscription.findOne({
      where: {
        [Op.and]: [{ userid: user.id }, { quizid: quiz.id }],
      },
    });

    if (quiz.status == false) {
      res.json({
        status: "error",
        message: "Oops, the selected quiz is no more active for play",
      });
    }

    if (subs) {
      res.json({
        status: "error",
        message:
          "You have already subscribed. You will be notified when its time to play",
      });
    } else {
      if (user.credit < quiz.required_credit) {
        res.json({
          status: "error",
          code: "2", //used to redirecto user to credit purchase page on the front page
          message: "You dont have enough credit to subscribe and participate",
        });
      } else {
        let newcredit = parseInt(user.credit) - parseInt(quiz.required_credit);

        models.User.update(
          { credit: newcredit },
          {
            where: {
              id: user.id,
            },
          }
        )
          .then(async (r) => {
            const newsubscription = await models.Subscription.create({
              userid: user.id,
              quizid: quiz.id,
              active: true,
            });

            res.json({
              status: "success",
              message:
                "You have successfully subscribe to play in " +
                quiz.name +
                ". You will be notified 5 minutes to sheduled time. All the best in the quiz.",
            });
          })
          .catch((error) => {
            res.json({
              status: "error",
              message: "Oops something went wrong. Please try again",
            });
          });
      }
    }
  } catch (error) {
    res.json({
      status: "error",
      message: "Ooops something went wrong. Please try again",
    });
  }
};
