const Sequelize = require("sequelize");
const bcrypt = require("bcryptjs");
const models = require("../../models");
const Op = Sequelize.Op;

exports.newQuiz = (req, res, next) => {
  res.render("newquiz");
};

//================================================
// GET TODAYS QUIZ
//================================================
exports.getTodaysQuizes = (req, res, next) => {
  try {
    models.Quiz.findAll({
      where: {
        startdate: new Date().getDate(),
      },
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

//==================================================
// CREATE A  NEW QUIZ
//==================================================
exports.createNewQuiz = async (req, res, next) => {
  console.log(req.body.startdate);
  // return;
  var quiz_name = req.body.title.replace(/\s+/g, "_").toLowerCase();
  try {
    const [quiz, created] = await models.Quiz.findOrCreate({
      where: {
        [Op.or]: [
          {
            title: req.body.title,
          },
          {
            tblquestions: quiz_name,
          },
        ],
      },
      defaults: {
        title: req.body.title,
        startdate: new Date(),
        enddate: new Date(),
        image: req.file.filename,
        tblquestions: quiz_name,
        // required_credit: req.body.credit,
        description: req.body.description,
        status: false,
        total_players: 0,
        firebasetopic: quiz_name + Math.floor(Math.random() * 10000 + 1),
      },
    });

    if (created) {
      try {
        models.sequelize
          .query(
            "CREATE TABLE IF NOT EXISTS " +
              quiz_name +
              "questions (`id` INTEGER NOT NULL auto_increment,PRIMARY KEY (`id`), `questions` " +
              "TEXT,type INTEGER,`url` TEXT, `a` VARCHAR(255),`b` VARCHAR(255),`c` VARCHAR(255), `d` VARCHAR(255), `ca` VARCHAR(255), `capoint` INTEGER,`wapoint` INTEGER)"
          )
          .then(([results, metadata]) => {
            req.flash("success", "Quiz successfully created");
            res.redirect("/admin/new-quiz");
          })
          .catch((error) => {
            console.log(error);

            req.flash("error", "Ooops Unable to create quiz");
            res.redirect("/admin/new-quiz");
          });
      } catch (error) {
        console.log(error);
        req.flash("error", "Ooops something went wrong. Please try gain 2");
        res.redirect("/admin/new-quiz");
      }
    } else {
      if (quiz) {
        req.flash(
          "error",
          "Quiz with the name already exist. Consider changing the name"
        );
        res.redirect("/admin/new-quiz");
      } else {
        req.flash("error", "Ooops something went wrong. Please try gain 2");
        res.redirect("/admin/new-quiz");
      }
    }
  } catch (error) {
    console.log("==============================");
    console.log(error);
    req.flash("error", "Ooops something went wrong. Please try gain 2");
    res.redirect("/admin/new-quiz");
  }
};

//=================================================
// gGET ALL QUIZES
//=================================================

exports.allQuizes = (req, res, next) => {
  try {
    models.Quiz.findAll({
      attributes: [
        "id",
        "title",
        "status",
        "startdate",
        "enddate",
        "total_players",
        "firebasetopic",
        [
          Sequelize.fn(
            "date_format",
            Sequelize.col("startdate"),
            "%Y-%m-%d %h:%i"
          ),
          "startdate",
        ],
        [
          Sequelize.fn(
            "date_format",
            Sequelize.col("enddate"),
            "%Y-%m-%d %h:%i"
          ),
          "enddate",
        ],
      ],
    })
      .then((quizes) => {
        res.render("quizes", { quizes: quizes });
      })
      .catch((error) => {
        console.log(error);
        req.flash("error", "Oops something went wrong");
        res.redirect("back");
      });
  } catch (error) {
    console.log(error);
    res.redirect("back");
  }
};

exports.activateQuiz = async (req, res, next) => {
  let quizid = req.query.quizid;

  if (quizid === null || quizid === undefined) {
    req.flash("error", "Quiz not found");
    res.redirect("back");
  }

  try {
    await models.Quiz.update({ status: true }, { where: { id: quizid } });
    req.flash("success", "Quiz has been activated");
    res.redirect("back");
  } catch (error) {
    console.log(error);
    req.flash("error", "Oops something went wrong. Please try again");
    return res.redirect("back");
  }
};

exports.deactivateQuiz = async (req, res, next) => {
  let quizid = req.query.quizid;

  if (quizid === null || quizid === undefined) {
    req.flash("error", "Quiz not found");
    res.redirect("back");
  }

  try {
    await models.Quiz.update({ status: false }, { where: { id: quizid } });
    req.flash("success", "Quiz has been archived");
    res.redirect("back");
  } catch (error) {
    console.log(error);
    req.flash("error", "Oops something went wrong. Please try again");
    return res.redirect("back");
  }
};
