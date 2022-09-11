const Sequelize = require("sequelize");
const { v4: uuidv4 } = require("uuid");
const axios = require("axios");

const models = require("../../models");
const config = require("../../config/myconfig");

require("dotenv").config({ path: "./conf.env" });

const {
  creditQueue,
  sendCreditPurchaseRequest,
} = require("../../queues/credit.queue");

const Op = Sequelize.Op;

exports.getCredits = (req, res, next) => {
  try {
    models.Credit.findAll()
      .then((credits) => {
        return res.json({
          status: "success",
          credits: credits,
        });
      })
      .catch((error) => {
        res.json({
          error: "error",
          message: "Oops unable to get credits now. Please try again",
        });
      });
  } catch (error) {
    console.log(error);
    res.json({
      status: "error",
      message: "Oops something went wrong. Please try again",
    });
  }
};

exports.buyCredit = async (req, res, next) => {
  try{
  const credit = await models.Credit.findOne({
    where: {
      id: req.body.id,
    },
  });
  if (!credit) {
    res.json({
      status: "error",
      message: "Credit type not found. Please select available credit types",
    });
  }
  const newtransaction = await models.Transaction.create({
    userid: req.body.userid,
    amount: credit.amount,
    credit: credit.id,
    completed: false,
    xreference: uuidv4(),
    momoinfo: JSON.stringify({
      network: req.body.network,
      msisdn: req.body.phoneno,
    }),
  });

  if (newtransaction) {
    res.json({
      status: "success",
      xreference: newtransaction.xreference,
      message: "Request received. Please proceed to complete payment",
    });
  }else{
    res.json({
      status: "error",
      xreference: null,
      message: "Oops something went wrong. Please try again",
    })
  }

}catch(error){
  console.log("========="+error.message)
  res.json({
    status: "error",
    message: error.message,
    message: "Oops something went wrong. Please try again",
  })
}


  // if (newtransaction) {
  //   //send request to mtn/slydepay for payment
  //   console.log("=================================");
  //   console.log("================QUEUNG 123445=================");

  //   //add to queue for processing
  //   sendCreditPurchaseRequest(newtransaction);

  //   res.json({
  //     status: "success",
  //     message: "Request received. Please complete payment to continue",
  //   });
  // } else {
  //   console.log("No transaction");
  //   res.json({
  //     status: "error",
  //     message: "Oops transaction failed. Please try again",
  //   });
  // }
};

// exports.getPaymentMethods = (req, res, next) => {
//   try {
//     models.PaymentMethod.findAll()
//       .then((modes) => {
//         return res.json({
//           status: "success",
//           paymentmethods: modes,
//         });
//       })
//       .catch((error) => {
//         res.json({
//           error: "error",
//           message: "Oops unable to get payment methods now. Please try again",
//         });
//       });
//   } catch (error) {
//     console.log(error);
//     res.json({
//       status: "error",
//       message: "Oops something went wrong. Please try again",
//     });
//   }
// };

async function checkPayStacktransactionStatus(reference) {
  let response = await axios.get(
    config.baseURL + "transaction/verify/" + reference,
    {
      headers: {
        Authorization: "Bearer " + process.env.SECRET_KEY,
      },
    }
  );
  return response;
}

exports.verifyPayment = async (req, res, next) => {
  let transaction = await models.Transaction.findOne({
    where: {
      xreference: req.body.reference,
      userid: req.body.userid,
    },
  });

  let credit = await models.Credit.findOne({
    where: { id: req.body.creditid },
  });

  /**
   * check if transaction has already been registered and credit given
   */
  if (transaction != null) {
    if (transaction.status == true) {
      if (transaction.usercredited) {
        res.json({
          status: "success",
          message: "You have already been credited for transaction",
        });
      } else {
        let response = await checkPayStacktransactionStatus(req.body.reference);
        if (response.data.status == true) {
          await models.User.increment(
            { credit: credit.value },
            { where: { id: req.body.userid } }
          );
          await transaction.update({
            completed: true,
            status: true,
            usercredited: true,
            verifyresponse: JSON.stringify(response.data),
          });

          let user = await models.User.findOne({
            where: {
              id: req.body.userid,
            },
          });

          res.json({
            status: "success",
            user: user,
            message: "Your account has been credited",
          });
        } else {
          res.json({
            status: "error",
            message: "Ooops transaction failed 1. Please try a new transaction",
          });
        }
      }
    } else {
      res.json({
        status: "error",
        message:
          "Oops transaction not completed 3. Please try a new transaction",
      });
    }
  } else {
    /**
     * transaction not registered on my server yet so create a new transaction and give credit
     */
    let newtransaction = await models.Transaction.create({
      userid: 1,
      amount: credit.amount,
      credit: credit.id,
      completed: false,
      xreference: req.body.reference,
      apiresponse: JSON.stringify(req.body.apiresponse),
      momoinfo: JSON.stringify({
        network: req.body.network,
        msisdn: req.body.phoneno,
      }),
    });

    axios
      .get(config.baseURL + "transaction/verify/" + req.body.reference, {
        headers: {
          Authorization: "Bearer " + process.env.SECRET_KEY,
        },
      })
      .then(async (response) => {
        if (response.data.status == true) {
          await models.User.increment(
            { credit: credit.value },
            { where: { id: req.body.userid } }
          );

          await newtransaction.update({
            amount: response.data.data.amount, //parseInt(response.data.data.amount)/100,
            completed: true,
            status: true,
            usercredited: true,
            verifyresponse: JSON.stringify(response.data),
          });

          let user = await models.User.findOne({
            where: {
              id: req.body.userid,
            },
          });

          res.json({
            status: "success",
            user: user,
            message: "Credit successfully purchased",
          });
        } else {
          return res.json({
            status: "error",
            message:
              "Transaction for successful. Please complete transaction to buy credit",
          });
        }
      })
      .catch((error) => {
        console.log(error);
        return {
          status: "error",
          error: error,
          message: "Oops something went wr",
        };
      });
  }
};
// exports.newQuiz = (req, res, next) => {};
