const Sequelize = require("sequelize");
const models = require("../../models");
const { redis } = require("../../config/redis");
const Op = Sequelize.Op;

exports.getQuizQuestions = async (req, res, next) => {
  let quizId = req.body.quizid;

  if (quizId == null || quizId == undefined) {
    return res.json({
      status: "error",
      message: "Please select a quiz",
    });
  } else {
    let quiz = await models.Quiz.findOne({
      where: {
        id: quizId,
      },
    });

    if (quiz == null || quiz == undefined) {
      return res.json({
        status: "error",
        message: "Ooops quiz not found",
      });
    }

    if (quiz.status == false) {
      return res.json({
        status: "error",
        message: "Quiz not available for playing. Please check again later",
      });
    }

    //check users last questions in tracker
    const latestTracker = await models.Tracker.findOne({
      where: {
        [Op.and]: [
          { userid: req.body.userid },
          { quizid: quiz.id },
          { codeused: true },
        ],
      },
      order: [["id", "desc"]],
    });

    let lastqid = 0;

    if (latestTracker != null) {
      lastqid = latestTracker.lastqid;
    }

    //get user
    let user = await models.User.findOne({
      where: {
        id: req.body.userid,
      },
    });
    const limitquestionQty = user.credit < 20 ? +user.credit : 20;

    models.sequelize
      .query(
        "SELECT * FROM " +
          quiz.tblquestions +
          "questions WHERE id >=" +
          lastqid +
          " LIMIT " +
          limitquestionQty
      )
      .then(async ([results, metadata]) => {
        // redis.set(`${quiz.title}${quiz.id}`, JSON.stringify(results));
        //CREATE A NEW TRACKER
        const trackercode =
          "TKC" + (Math.floor(Math.random() * (9999, 1000)) + 1000);
        await models.Tracker.create({
          userid: req.body.userid,
          quizid: quiz.id,
          lastqid: results[results.length - 1].id,
          trackercode: trackercode,
          codeused: false,
        });
        return res.json({
          status: "success",
          questions: results,
          trackercode: trackercode,
        });
      })
      .catch((error) => {
        console.log(error);
        return res.json({
          status: "error",
          message: "Oops unable to get questions. Please try again",
        });
      });
  }
};
