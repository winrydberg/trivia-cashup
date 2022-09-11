const Sequelize = require("sequelize");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const models = require("../../models");
const config = require("../../config/myconfig");
const Op = Sequelize.Op;

//=====================================================================
// GET ALL USERS
//=====================================================================
exports.getAllUsers = async (req, res, next) => {
  let username = req.query.username;
  let phoneno = req.query.phoneno;
  if (username != undefined && username != "") {
    const users = await models.User.findAll({
      where: {
        [Op.or]: [{ username: username }, { phoneno: phoneno }],
      },
    });
    return res.render("users", {
      status: "success",
      users: users,
    });
  } else {
    return res.render("users", {
      status: "success",
      users: [],
    });
  }
};

exports.blockUser = async (req, res, next) => {
  let userid = req.query.userid;

  if (userid === null || userid === undefined) {
    req.flash("error", "User not found");
    res.redirect("back");
  }

  try {
    await models.User.update({ active: false }, { where: { id: userid } });
    req.flash("success", "User has been blocked");
    res.redirect("back");
  } catch (error) {
    console.log(error);
    req.flash("error", "Oops something went wrong. Please try again");
    return res.redirect("back");
  }

  //   models.User.destroy({
  //     where: {
  //       id: userid,
  //     },
  //   })
  //     .then((result) => {
  //       req.flash("success", "User successfully blocked");
  //       res.redirect("back");
  //     })
  //     .catch((error) => {
  //       req.flash("error", "Oops something went wrong. Unable to block user");
  //       res.redirect("back");
  //     });
};

exports.unBlockUser = async (req, res, next) => {
  let userid = req.query.userid;

  if (userid === null || userid === undefined) {
    req.flash("error", "User not found");
    res.redirect("back");
  }

  try {
    await models.User.update({ active: true }, { where: { id: userid } });
    req.flash("success", "User has been blocked");
    res.redirect("back");
  } catch (error) {
    console.log(error);
    req.flash("error", "Oops something went wrong. Please try again");
    return res.redirect("back");
  }
};
