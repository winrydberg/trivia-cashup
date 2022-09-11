var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const flash = require("express-flash");
var bodyParser = require("body-parser");
var cors = require("cors");
var hbs = require("hbs");
var expressSession = require("express-session");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/api/users");
var adminRouter = require("./routes/api/admins");

var app = express();

// serverAdapter.setBasePath("/admins/queues");
// app.use("/admins/queues", serverAdapter.getRouter());

// app.engine(
//   "hbs",
//   hbs({
//     extname: "hbs",
//     defaultLayout: "layout",
//     layoutsDir: __dirname + "/views/",
//   })
// );

app.set("views", path.join(__dirname, "views"));
hbs.registerPartials(__dirname + "/views/partials");
hbs.registerHelper("json", function (context) {
  return JSON.stringify(context);
});
hbs.registerHelper("ifEquals", function (arg1, arg2, options) {
  return arg1 == arg2 ? options.fn(this) : options.inverse(this);
});
app.set("view engine", "hbs");

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

const oneDay = 1000 * 60 * 60 * 24;
app.use(
  expressSession({
    secret: "Edwin",
    saveUninitialized: true,
    resave: false,
    cookie: { maxAge: oneDay },
    // store:
  })
);
app.use(flash());

app.use("/api", usersRouter);
app.use("/admin", adminRouter);
app.use("/", indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// processtransactionService();

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({
    status: "error",
    error: err.message,
    message: "Oops something went wrong.",
  });
});

module.exports = app;
