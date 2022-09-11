const jwt = require("jsonwebtoken");
const config = require("../config/myconfig");

const userAuth = (req, res, next) => {
  console.log(req.headers);

  //check if authorization header is set in the request
  if (req.headers.authorization != undefined) {
    var token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return res.json({
        status: "EMPTY_TOKEN",
        auth: false,
        message: "No Token provided",
      });
    }
  } else {
    return res.json({
      status: "EMPTY_TOKEN",
      auth: false,
      message: "No Token provided",
    });
  }

  //token exists so verify it
  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      //console.log('=================================jwt-error===============================',err)
      if (err.name == "TokenExpiredError") {
        return res.json({
          status: "EXPIRED_TOKEN",
          auth: false,
          message: "Auth failed",
        });
      } else {
        return res.json({
          status: "AUTH_FAILED",
          auth: false,
          message: "Auth failed",
        });
      }
    }
    if (decoded) {
      req.body.userid = decoded.user.userid;
      next();
    }
  });
};

module.exports = userAuth;
