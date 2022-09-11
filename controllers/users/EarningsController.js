const Sequelize = require("sequelize");
const models = require("../../models");
const Op = Sequelize.Op;

exports.getUserEarnings = async (req, res, next) => {
  try {
    const earnings = await models.Earning.findAll({
      where: {
        userid: req.body.userid,
      },
      include: ["User", "Quiz"],
    });

    return res.json({
      status: "success",
      earnings: earnings,
    });
  } catch (error) {
    console.log(error);
    return res.json({
      status: "error",
      message: "Oops something went wrong. Please try again",
    });
  }
};
