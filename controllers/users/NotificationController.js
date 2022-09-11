const Sequelize = require("sequelize");
const models = require("../../models");
const Op = Sequelize.Op;

exports.getNotifications = async (req, res, next) => {
  try {
    console.log(req);
    const notifications = await models.Notification.findAll({
      where: {
        userid: req.body.userid,
      },
    });

    return res.json({
      status: "success",
      notifications: notifications,
    });
  } catch (error) {
    console.log(error);
    return res.json({
      status: "error",
      message: "Oops something went wrong. Please try again",
    });
  }
};
