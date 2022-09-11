const axios = require("axios");
const config = require("./myconfig");
const axiosinstance = axios.create({
  baseURL: config.baseURL,
  timeout: 1000,
  headers: {
    Authorization: btoa(
      unescape(encodeURIComponent(config.userid + ":" + config.apikey))
    ),
    "Ocp-Apim-Subscription-Key": config.subscriptionkey,
    target: config.target,
  },
});

module.exports = axiosinstance;
