var express = require("express");
var router = express.Router();
var multer = require("multer");
var mkdirp = require("mkdirp");
const AuthController = require("../../controllers/admins/AuthController");
const QuizController = require("../../controllers/admins/QuizController");
const DashboardController = require("../../controllers/admins/DashboardController");
const ReportsController = require("../../controllers/admins/ReportsController");
const UsersController = require("../../controllers/admins/UsersController");
const QuestionsController = require("../../controllers/admins/QuestionsController");
const NotificationController = require("../../controllers/admins/NotificationController");
const checkAdminSignIn = require("../../middleware/adminAuth");
const CreditTransactionsController = require("../../controllers/admins/CreditTransactionsController");
const EarningController = require("../../controllers/admins/EarningController");

// var upload = multer({ dest: 'uploads/' })
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    var dest = "./public/images/quizes";
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
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg"
  ) {
    callback(null, true);
  } else {
    callback(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5, // accepts only files sizes less or equal to 5MB
  },
  fileFilter: fileFilter,
});

router.get("/", function (req, res, next) {
  res.render("login", { title: "Online Quiz" });
});

router.get("/login", function (req, res, next) {
  res.render("login", { title: "Online Quiz" });
});

router.post("/login", AuthController.adminLogin);

router.get("/dashboard", checkAdminSignIn, DashboardController.adminDashboard);

router.get("/new-quiz", checkAdminSignIn, QuizController.newQuiz);

router.post(
  "/create-quiz",
  checkAdminSignIn,
  upload.single("image"),
  QuizController.createNewQuiz
);

router.get("/quizes", checkAdminSignIn, QuizController.allQuizes);

router.get("/reports", checkAdminSignIn, ReportsController.getQuizReports);

router.get(
  "/credit-transactions",
  checkAdminSignIn,
  CreditTransactionsController.getAllCredits
);

router.get(
  "/questions",
  checkAdminSignIn,
  QuestionsController.getQuizQuestions
);

router.get(
  "/send-notification",
  checkAdminSignIn,
  NotificationController.notification
);

router.post(
  "/send-notification",
  checkAdminSignIn,
  NotificationController.sendPushNotification
);

router.get("/users", checkAdminSignIn, UsersController.getAllUsers);

router.get("/add-question", checkAdminSignIn, QuestionsController.newQuestion);

router.post(
  "/add-question",
  checkAdminSignIn,
  QuestionsController.saveSingleQuestion
);

router.post(
  "/excel-upload",
  checkAdminSignIn,
  QuestionsController.uploadQuestions
);

router.get("/block-user", checkAdminSignIn, UsersController.blockUser);

router.get("/unblock-user", checkAdminSignIn, UsersController.unBlockUser);

router.get("/activate-quiz", checkAdminSignIn, QuizController.activateQuiz);
router.get("/deactivate-quiz", checkAdminSignIn, QuizController.deactivateQuiz);
router.get("/earnings", checkAdminSignIn, EarningController.getEarning);
router.get("/new-earnings", checkAdminSignIn, EarningController.newEarning);
router.post(
  "/create-earnings",
  checkAdminSignIn,
  EarningController.saveNewEarning
);

router.get("/logout", function (req, res) {
  req.session.destroy(function () {
    console.log("user logged out.");
  });
  res.redirect("/admin");
});

router.get("/notify", NotificationController.sendUserNotification);

// router.get('/earnings', )

module.exports = router;
