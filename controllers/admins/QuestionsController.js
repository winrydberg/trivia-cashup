const Sequelize = require("sequelize");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const models = require("../../models");
const db = require("../../models");
const config = require("../../config/myconfig");
const Op = Sequelize.Op;
var multer = require("multer");
var mkdirp = require("mkdirp");
var xlstojson = require("xls-to-json-lc");
var xlsxtojson = require("xlsx-to-json-lc");

// var upload = multer({ dest: 'uploads/' })
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    var dest = "./public/questions/";
    mkdirp.sync(dest);
    cb(null, dest);
  },
  filename: function (req, file, cb) {
    cb(
      null,
      new Date().toISOString().replace(/:/g, "-") + "_" + file.originalname
    );
  },
});

const fileFilter = (req, file, callback) => {
  if (
    ["xls", "xlsx"].indexOf(
      file.originalname.split(".")[file.originalname.split(".").length - 1]
    ) === -1
  ) {
    return callback(new Error("Wrong extension type"));
  }
  callback(null, true);
};
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
}).single("excelfile");

//=====================================================================
// TO ADD NEW QUESTION(S)
//=====================================================================
exports.newQuestion = async (req, res, next) => {
  let quizes = await models.Quiz.findAll({
    where: {
      status: 1
    }
  });
  console.log(quizes);
  res.render("newquestions", {
    status: "success",
    quizes: quizes,
  });
};

//=====================================================================
// ADD A SINGLE QUESTION
//=====================================================================
exports.saveSingleQuestion = async (req, res) => {
  try {
    let quiz = await models.Quiz.findOne({
      where: {
        id: req.body.quiz,
      },
    });
    if (quiz) {
      db.sequelize
        .query(
          "INSERT INTO " +
            quiz.tblquestions +
            "questions ( `questions`, `url`, `a`, `b`, `c`, `d`,`ca`, `capoint`, `wapoint` ) VALUES ('" +
            req.body.question +
            "', '" +
            null +
            "', '" +
            req.body.a +
            "', '" +
            req.body.b +
            "', '" +
            req.body.c +
            "','" +
            req.body.d +
            "','" +
            req.body.ca +
            "'," +
            req.body.capoint +
            "," +
            req.body.wapoint +
            ")"
        )
        .then(([results, metadata]) => {
          //   console.log("===============sucesssss=================");
          //   console.log(results);
          req.flash("ssuccess", "Question has been saved to database");
          res.redirect("back");
        })
        .catch((error) => {
          req.flash("serror", "Ooops unable to save question");
          res.redirect("back");
        });
    } else {
      req.flash("serror", "Ooops unable to save question");
      res.redirect("back");
    }
  } catch (error) {
    res.redirect("back");
  }
};

/**
 * ===================================================================================
 *  UPLOAD EXCEL FILE
 * ===================================================================================
 */

exports.uploadQuestions = (req, res, next) => {
  var exceltojson;
  var success = false;
  upload(req, res, function (err) {
    if (err) {
      //  res.json({error_code:1,err_desc:err});
      //  return;
      req.flash("error", err);
      res.redirect("/admin/add-question");
    }
    /** Multer gives us file info in req.file object */
    if (!req.file) {
      // res.json({error_code:1,err_desc:"No file passed"});
      // return;
      req.flash("error", "Please select a file for upload");
      return res.redirect("/admin/add-question");
    }
    /** Check the extension of the incoming file and
     *  use the appropriate module
     */
    if (
      req.file.originalname.split(".")[
        req.file.originalname.split(".").length - 1
      ] === "xlsx"
    ) {
      exceltojson = xlsxtojson;
    } else {
      exceltojson = xlstojson;
    }
    try {
      exceltojson(
        {
          input: req.file.path,
          output: null, //since we don't need output.json
          lowerCaseHeaders: true,
        },
        function (err, result) {
          if (err) {
            req.flash("error", "Oops Something went wrong. Please try again.");
            return res.redirect("/admin/add-question");
          }
          models.Quiz.findOne({
            where: {
              id: req.body.quiz,
            },
          }).then(async (quiz) => {
            const hacks = result.map((d) => {
              return db.sequelize.query(
                "INSERT INTO " +
                  quiz.tblquestions +
                  "questions ( `questions`, `a`, `b`, `c`, `d`,`ca`, `capoint`, `wapoint` ) VALUES ('" +
                  d.question +
                  "', '" +
                  d.a +
                  "', '" +
                  d.b +
                  "', '" +
                  d.c +
                  "','" +
                  d.d +
                  "','" +
                  d.ca +
                  "'," +
                  d.capoint +
                  "," +
                  d.wapoint +
                  ")"
              );
            });

            Promise.all(hacks).then((allress) => {
              req.flash("success", "Question uploaded to category");
              res.redirect("/admin/add-question");
            });
          });
        }
      );
    } catch (e) {
      req.flash("error", "All fields are required!");
      return res.redirect("/admin/add-question");
    }
  });
};

// module.exports.testQ = () => {

// }

exports.getQuizQuestions = async (req, res, next) => {
  let quizId = req.query.quizid;

  if (quizId == null || quizId == undefined) {
    res.redirect("back");
  } else {
    let quiz = await models.Quiz.findOne({
      where: {
        id: quizId,
      },
    });

    if (quiz == null || quiz == undefined) {
      res.redirect("back");
    }

    db.sequelize
      .query("SELECT * FROM " + quiz.tblquestions + "questions")
      .then(([results, metadata]) => {
        res.render("quizquestions", { quests: results });
      })
      .catch((error) => {
        res.redirect("back");
      });
  }
};
