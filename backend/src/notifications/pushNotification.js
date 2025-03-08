const admin = require("./firebaseAdmin");

const sendPushNotification = async (token, title, body) => {
  const message = {
    notification: { 
      title: title, 
      body: body 
    },
    webpush: {
      notification: {
        icon: "https://i.postimg.cc/XvZfj0ny/logo.png",
        badge: "https://i.postimg.cc/XvZfj0ny/logo.png",
        requireInteraction: true,
        click_ation: "http://localhost:5173"
      }
    },
    token: token,
  };

  try {
    await admin.messaging().send(message);
    console.log("Push notification sent successfully!");
  } catch (error) {
    console.error("Error sending push notification:", error);
  }
};

module.exports = sendPushNotification;
