const Sequelize = require("sequelize");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const models = require("../../models");
const config = require("../../config/myconfig");
const { response } = require("../../app");
const Op = Sequelize.Op;
const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);
const refererCredit = 20;
const referedUserCredit = 10;

//=====================================================================
// USER REGISTRATION
//=====================================================================
exports.registerUser = async (req, res, next) => {
  const hash = bcrypt.hashSync(req.body.password, salt);

  try {
    const [user, created] = await models.User.findOrCreate({
      where: {
        [Op.or]: [
          {
            phoneno: req.body.phoneno,
          },
          {
            username: req.body.username,
          },
        ],
      },
      defaults: {
        username: req.body.username,
        phoneno: req.body.phoneno,
        image: null,
        email: req.body.email,
        password: hash,
        active: true,
        credit: 0,
        overallpoint: 0,
        registrationtoken: req.body.registrationtoken,
        referalcode: Math.floor(Math.random() * (99999, 1000)) + 1000,
      },
    });

    if (created) {
      var token = jwt.sign(
        {
          user: {
            username: user.username,
            userid: user.id,
            phoneno: user.phoneno,
          },
        },
        config.secret,
        {
          expiresIn: "365d", // expires in 1year
        }
      );

      //give credit for using referal code
      if (req.body.referalcode != null || req.body.referalcode != undefined) {
        const userreferers = await models.User.findAll({
          where: {
            referalcode: req.body.referalcode,
          },
        });
        userreferers.forEach((referer) => {
          referer.increment({
            credit: refererCredit,
          });
        });

        await user.increment({
          credit: referedUserCredit,
        });

        await user.reload();
      }

      res.json({
        status: "success",
        token: token,
        user: user,
        message: "Account successfully created",
      });
    } else {
      if (user.username.toLowerCase() === req.body.username.toLowerCase()) {
        res.json({
          message: "Username already taken",
          created: created,
          status: "error",
        });
      } else if (
        user.phoneno.toLowerCase() === req.body.phoneno.toLowerCase()
      ) {
        res.json({
          message: "Phone number already taken",
          created: created,
          status: "error",
        });
      } else {
        res.json({
          message: "Ooops Account Creation failed. Please try again",
          created: created,
          status: "error",
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
};

//=====================================================================
// USER LOGIN
//=====================================================================
exports.loginUser = (req, res, next) => {
  try {
    models.User.findOne({
      where: {
        [Op.or]: [
          {
            phoneno: req.body.username,
          },
          {
            username: req.body.username,
          },
        ],
      },
    }).then((user) => {
      if (user === null) {
        res.status(200).json({
          status: "ERROR",
          message: "Invalid login Credentials 1",
        });
      } else {
        bcrypt
          .compare(req.body.password, user.password)
          .then(function (matched) {
            if (matched) {
              var token = jwt.sign(
                {
                  user: {
                    username: user.username,
                    userid: user.id,
                    phoneno: user.phoneno,
                  },
                },
                config.secret,
                {
                  expiresIn: "365d", // expires in 1year
                }
              );
              return res.json({
                status: "SUCCESS",
                user: user,
                token: token,
                message: "Login Successful",
                matched: matched,
              });
            } else {
              return res.json({
                status: "ERROR",
                message: "Invalid login Credentials",
              });
            }
          });
      }
    });
  } catch (error) {
    //log the error
    console.log(error);
  }
};

//=====================================================================
// USER me
//=====================================================================
exports.getUser = (req, res, next) => {
  models.User.findOne({
    where: {
      id: req.body.userid,
    },
  })
    .then((user) => {
      if (user === null) {
        return res.json({
          status: "error",
          message: "User NOT Found",
        });
      } else {
        return res.json({
          status: "success",
          user: user,
        });
      }
    })
    .catch((error) => {
      console.log(error);
      res.json({
        status: "error",
        message: "Unable to get user data",
      });
    });
};

/**
 * CHECK IF USERNAME ALREADY EXISTS
 */
exports.checkUsername = (req, res, next) => {
  try {
    models.User.findOne({
      where: {
        username: req.body.username.trim(),
      },
    }).then((user) => {
      if (user != null) {
        return res.json({
          status: "error",
          message: "Username already taken",
        });
      } else {
        return res.json({
          status: "success",
          message: "Username available",
        });
      }
    });
  } catch (error) {
    console.log(error);
    return res.json({
      status: "error",
      message:
        "Oops something went wrong. Unable to check username availability",
    });
  }
};
