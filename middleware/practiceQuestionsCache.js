const { redis } = require("../config/redis");

exports.redisPraacticeCacheMiddleware = (req, res, next) => {
  let key = "practice";
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
