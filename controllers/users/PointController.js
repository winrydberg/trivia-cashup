const Sequelize = require("sequelize");
const { sequelize } = require("../../models");
const models = require("../../models");
const Op = Sequelize.Op;

exports.savePoint = async (req, res, next) => {
  try {
    let quizId = req.body.quizid;
    let userid = req.body.userid;
    let value = req.body.value;
    let totalquestion = req.body.totalquestion;
    let lastqid = req.body.lastqid;

    const tracker = await models.Tracker.findOne({
      where: {
        trackercode: req.body.trackercode,
      },
    });
    if (tracker == null || tracker == undefined) {
      return res.json({
        status: "error",
        message: "Cannot process your request. Tracker code missing",
      });
    }

    tracker.update({
      codeused: true,
    });

    const TODAY_START = new Date().setHours(0, 0, 0, 0);
    const NOW = new Date();

    const point = await models.Point.findOne({
      where: {
        [Op.and]: {
          userid: userid,
          quizid: quizId,
          createdAt: {
            [Op.gt]: TODAY_START,
            [Op.lt]: NOW,
          },
        },
      },
    });

    // return res.json({
    //   status: "success",
    //   point: point,
    //   message: "Your point has already been logged into the system",
    // });

    const user = await models.User.findOne({
      where: {
        id: userid,
      },
    });

    let newCredit = 0;
    if (user) {
      newCredit = +user.credit - +totalquestion;
      if (newCredit < 0) {
        newCredit = 0;
      }
      user.update({
        credit: newCredit,
        todaypoint: user.todaypoint + value,
      });
    }

    if (point) {
      point.update({
        value: point.value + value,
      });
      return res.json({
        user: user,
        status: "success",
        message:
          "Points have been saved. Contrinue playing to win the ultimate prize.",
      });
    } else {
      const point = await models.Point.create({
        value: value,
        userid: userid,
        quizid: quizId,
      });

      //deduct credit

      return res.json({
        status: "success",
        user: user,
        deduction: newCredit,
        message: "Heyaa!!!. You have successfully submitted your points",
      });
    }
  } catch (error) {
    console.log(error);
    return res.json({
      status: "error",
      message: "Oops something went wrong. Please try again",
    });
  }
};

exports.savePracticePoint = async (req, res, next) => {
  try {
    let quizId = req.body.quizid;
    let userid = req.body.userid;
    let value = req.body.value;

    const point = await models.Point.findOne({
      where: {
        [Op.and]: {
          userid: userid,
          quizid: quizId,
        },
      },
    });

    if (point) {
      await point.increment({ value: value });
    } else {
      const point = await models.Point.create({
        value: value,
        userid: userid,
        quizid: quizId,
      });
    }

    return res.json({
      status: "success",
      message:
        "Heyaa!!!. You have successfully submitted your points. Play more to increase your chances of winning.",
    });
  } catch (error) {
    console.log(error);
    return res.json({
      status: "error",
      message: "Oops something went wrong. Please try again",
    });
  }
};

exports.getPoints = async (req, res, next) => {
  try {
    const START_DAY = new Date().setHours(0, 0, 0, 0);
    const NOW = new Date();
    models.Point.findAll({
      where: {
        [Op.and]: [
          { userid: req.body.userid },
          {
            createdAt: {
              [Op.between]: [START_DAY, NOW],
            },
          },
        ],
      },
      include: ["User", "Quiz"],
      attributes: [
        "quizid",
        [sequelize.fn("sum", sequelize.col("value")), "totalpoint"],
      ],
      group: ["quizid"],
    })
      .then((data) => {
        return res.json({
          date: new Date().toLocaleDateString(),
          status: "success",
          points: data,
        });
      })
      .catch((error) => {
        return res.json({
          date: new Date().toLocaleDateString(),
          status: "error",
          error: error,
        });
      });
  } catch (error) {
    return res.json({
      status: "error",
      error: error.message,
      points: 0,
      message: "Unable to get points",
    });
  }
};

exports.getAllUserPoints = async (req, res, next) => {
  try {
    models.Point.findAll({
      where: {
        [Op.and]: [{ userid: req.body.userid }],
      },
      include: ["User", "Quiz"],
      order: [["id", "desc"]],
      attributes: [
        "quizid",
        [sequelize.fn("sum", sequelize.col("value")), "totalpoint"],
      ],

      group: ["quizid"],
    })
      .then((data) => {
        return res.json({
          status: "success",
          points: data,
        });
      })
      .catch((error) => {
        console.log(error);
        return res.json({
          status: "error",
          error: error,
        });
      });
  } catch (error) {
    return res.json({
      status: "error",
      // error: error.message,
      points: 0,
      message: "Unable to get points",
    });
  }
};
