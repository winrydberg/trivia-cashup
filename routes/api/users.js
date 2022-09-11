var express = require("express");
var router = express.Router();
const AuthController = require("../../controllers/users/AuthController");
const QuizController = require("../../controllers/users/QuizController");
const CreditController = require("../../controllers/users/CreditController");
const PointController = require("../../controllers/users/PointController");
const QuestionsController = require("../../controllers/users/QuestionsController");
const NotificationController = require("../../controllers/users/NotificationController");
const ExtraDataController = require("../../controllers/users/ExtraDataController");
const { redisQCacheMiddleware } = require("../../middleware/questionsCache");
const {
  redisPraacticeCacheMiddleware,
} = require("../../middleware/practiceQuestionsCache");
const PracticeController = require("../../controllers/users/PracticeController");
const userAuth = require("../../middleware/userAuth");
const WinnersController = require("../../controllers/users/WinnersController");
const EarningsController = require("../../controllers/users/EarningsController");

/* LOGIN  USER. */
router.post("/login", AuthController.loginUser);

router.post("/check-username", AuthController.checkUsername);

/* REISTER  USER. */
router.post("/register", AuthController.registerUser);

/* GET THE DAYS QUIZES. */
router.get("/quizes", QuizController.getTodaysQuizes);

/* GET THE DAYS QUIZES. */
router.get("/archived-quizes", QuizController.archivedQuizes);

/* SUBSCRIBE TO A QUIZ */
router.post("/subscribe-quiz", QuizController.subcribeToPlay);

/* GET ALL CREDITS. */
router.get("/credits", CreditController.getCredits);

/* GET ALL CREDITS. */
router.get("/user-me", userAuth, AuthController.getUser);

router.post("/get-points", PointController.getPoints);

/* GET ALL CREDITS. */
// router.get("/payment-methods", CreditController.getPaymentMethods);

/* GET aALL CREDITS. */
router.post("/buy-credit", userAuth, CreditController.buyCredit);

/* GET aALL CREDITS. */
router.post("/verify-payment", userAuth, CreditController.verifyPayment);

/* GET aALL CREDITS. */
router.post("/submit-point", PointController.savePoint);

router.post("/save-practice-point", PointController.savePracticePoint);

router.get("/my-points", userAuth, PointController.getAllUserPoints);

router.post("/winners", WinnersController.getQuizWinners);

/* GET QUESTIONS. */
router.post(
  "/get-questions",
  userAuth,
  // redisQCacheMiddleware,
  QuestionsController.getQuizQuestions
);

/* GET aALL CREDITS. */
router.get(
  "/practice",
  // redisPraacticeCacheMiddleware,
  PracticeController.getPracticeQuestions
);

router.get(
  "/howtos",
  // redisPraacticeCacheMiddleware,
  ExtraDataController.getHowTos
);

router.get(
  "/faqs",
  // redisPraacticeCacheMiddleware,
  ExtraDataController.getQaqs
);

router.get(
  "/get-notifications",
  userAuth,
  NotificationController.getNotifications
);

router.get("/user-earnings", userAuth, EarningsController.getUserEarnings);

module.exports = router;
