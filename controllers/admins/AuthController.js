const Sequelize = require("sequelize");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const models = require("../../models");
const config = require("../../config/myconfig");
const Op = Sequelize.Op;
const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);

//=====================================================================
// USER LOGIN
//=====================================================================
exports.adminLogin = (req, res, next) => {
  models.Admin.findOne({
    where: {
      email: req.body.email,
    },
  })
    .then((user) => {
      //res.send(user)
      if (user == null) {
        req.flash("error", "Invalid Login Credentials");
        res.redirect("back");
      } else {
        bcrypt.compare(
          req.body.password,
          user.password,
          function (err, result) {
            // res.status(200).send(result)
            if (err) {
              req.flash("error", "Invalid Login Credentials");
              res.redirect("back");
            } else if (result == false) {
              req.flash("error", "Invalid Login Credentials");
              res.redirect("back");
            } else {
              req.session.user = user;
              res.redirect("/admin/dashboard");
            }
          }
        );
      }
    })
    .catch((err) => {
      req.flash("error", "Oops Something went wrong. Contact Administrators");
      res.redirect("back");
    });
};
