const admin = require("./firebaseAdmin");

const sendPushNotification = async (token, title, body, url) => {
  const message = {
    notification: { 
      title: title, 
      body: body 
    },
    webpush: {
      notification: {
        icon: "http://localhost:5000/assets/logo.png",
        badge: "http://localhost:5000/assets/logo.png",
        click_action: url
      }
    },
    data: {
      click_action: url
    },
    token: token,
  };

  try {
    await admin.messaging().send(message);
    console.log("Push notification sent successfully!");
    return true;
  } catch (error) {
    console.error("Error sending push notification:", error);
    return false;
  }
};

module.exports = sendPushNotification;
