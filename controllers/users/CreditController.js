const Sequelize = require("sequelize");
const { v4: uuidv4 } = require("uuid");
const axios = require("axios");

const models = require("../../models");
const config = require("../../config/myconfig");

require("dotenv").config({ path: "./conf.env" });

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
  try {
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
    } else {
      res.json({
        status: "error",
        xreference: null,
        message: "Oops something went wrong. Please try again",
      });
    }
  } catch (error) {
    console.log("=========" + error.message);
    res.json({
      status: "error",
      message: error.message,
      message: "Oops something went wrong. Please try again",
    });
  }
};

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
      xreference: req.body.xreference,
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
          financialtransactionId: req.body.reference,
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
    /**
     * transaction not registered on my server yet so create a new transaction and give credit
     */
    res.json({
      status: "error",
      message:
        "Unable to verify transaction. Create a new transaction today!!!",
    });
  }
};
// exports.newQuiz = (req, res, next) => {};
