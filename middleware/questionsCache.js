const { redis } = require("../config/redis");

exports.redisQCacheMiddleware = (req, res, next) => {
  let key = req.body.quizname + req.body.quizid;
  redis.get(key, function (err, result) {
    if (err) {
      //   console.error(err);
      next();
    } else {
      if (result !== null) {
        // console.log(result);
        res.json({
          status: "success",
          questions: JSON.parse(result),
        });
      } else {
        next();
      }
    }
  });
};
