const Redis = require("ioredis");
const redis = new Redis(6379);

module.exports = { redis };
