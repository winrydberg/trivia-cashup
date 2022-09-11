const Sequelize = require("sequelize");
const models = require("../../models");
const Op = Sequelize.Op;
var admin = require("firebase-admin");

var serviceAccount = require("./quizon-4e9fa-firebase-adminsdk-hrzdr-12ebde5870.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

exports.notification = async (req, res, next) => {
  try {
    // let quizes = await models.Quiz.findAll();
    let users = await models.User.findAll();
    res.render("sendnotification", { users: users });
  } catch (error) {
    res.redirect("back");
  }
};

//=====================================================================
// SEND NOTIFICATION
//=====================================================================
exports.sendPushNotification = async (req, res, next) => {
  let to = req.body.to;

  let topic = "trivicashup";

  if (to != "0" || to != 0) {
    let userid = req.body.userid;

    const user = await models.User.findOne({
      where: {
        id: userid,
      },
    });

    if (user != null) {
      //compose message
      const notification = await models.Notification.create({
        title: req.body.title,
        message: req.body.message,
        read: "0",
        userid: user.id,
      });
      const message = {
        data: {
          title: notification.title.toString(),
          message: notification.message.toString(),
          read: "1",
          userid: notification.userid.toString(),
          createdAt: new Date().toDateString(),
        },
        notification: { title: req.body.title, body: req.body.message },
        token: user.registrationtoken,
      };

      const response = await sendNotificationToUser(message);

      if (response.status == "success") {
        req.flash("success", "message has been sent to user " + user.username);
        return res.redirect("back");
      } else {
        notification.destroy();
        req.flash("error", "Unable to send message to user");
        return res.redirect("back");
      }
    } else {
      req.flash("error", "User account not found");
      return res.redirect("back");
    }
  } else {
    // send messge to topic for all users
    const notification = await models.Notification.create({
      title: req.body.title,
      message: req.body.message,
      read: "0",
      userid: null,
    });
    const message = {
      data: {
        title: notification.title.toString(),
        message: notification.message.toString(),
        read: "0",
        userid: "null",
        createdAt: new Date().toDateString(),
      },
      notification: { title: req.body.title, body: req.body.message },
    };

    const response = await sendNotificationToTopic(topic, message);
    if (response.status == "success") {
      req.flash("success", "Message has sent to topic " + topic);
      return res.redirect("back");
    } else {
      notification.destroy();
      req.flash("success", "Unable to send message to topic " + topic);
      return res.redirect("back");
    }
  }
};

async function sendNotificationToTopic(topic, payload) {
  return admin
    .messaging()
    .sendToTopic(topic, payload)
    .then(function (response) {
      return {
        status: "success",
        message: "Notification sent successfully",
      };
    })
    .catch(function (error) {
      return {
        status: "error",
        message: "Unable to send notification",
      };
    });
}

async function sendNotificationToUser(payload) {
  return admin
    .messaging()
    .send(payload)
    .then((response) => {
      // Response is a message ID string.
      console.log("Successfully sent message:", response);
      return {
        status: "success",
        response: response,
      };
    })
    .catch((error) => {
      console.log("Error sending message:", error);
      return {
        status: "error",
        response: error,
      };
    });
}

exports.sendUserNotification = (req, res, next) => {
  // This registration token comes from the client FCM SDKs.
  const registrationToken =
    "ebTR937rSXOMXLj68JvoNB:APA91bEtGUZt2hQQhwBAYReeucY-0L3ZP8BqDL-IPiyc-Pi2Ic72d9I4RKR1IPVyPL3CcwJ4P9l0CfJbvUCcnsLs3FYkVyF64MXvHwHsU8JW3kuLlZqKvf4D95_ZRT1BNRPOq6wJK9gQ";
  const message = {
    data: {
      id: 1,
      time: "2:45",
    },
    notification: { title: "Price drop", body: "2% off all books" },
    token: registrationToken,
  };

  // Send a message to the device corresponding to the provided
  // registration token.
  admin
    .messaging()
    .send(message)
    .then((response) => {
      // Response is a message ID string.
      console.log("Successfully sent message:", response);
      return res.json({
        status: "success",
        response: response,
      });
    })
    .catch((error) => {
      console.log("Error sending message:", error);
      return res.json({
        status: "error",
        response: error,
      });
    });
};
