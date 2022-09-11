const Queue = require("bull");
const { creditProcess } = require("../processes/credit.process");

const creditQueue = new Queue("credit-purchase", {
  redis: {
    host: "127.0.0.1",
    port: 6379,
  },
});

creditQueue.process(creditProcess);
creditQueue.on("completed", function (job, result) {
  console.log(job.data);
});

const sendCreditPurchaseRequest = async (data) => {
  const job = await creditQueue.add(data, {
    attempts: 2,
    delay: 0,
  });
};

// module.exports = creditQueue;

module.exports = { creditQueue, sendCreditPurchaseRequest };
