const admin = require("./firebaseAdmin");

const sendPushNotification = async (token, title, body, url) => {
  const message = {
    notification: { 
      title: title, 
      body: body 
    },
    webpush: {
      notification: {
        icon: `${process.env.SERVER}/assets/logo.png`,
        badge: `${process.env.SERVER}/assets/logo.png`,
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
    return { success: true };
  } catch (error) {
    console.error("Error sending push notification:", error.message || error);

    if (
      error.code === "messaging/invalid-registration-token" ||
      error.code === "messaging/registration-token-not-registered"
    ) {
      return { success: false, reason: "invalid-token" };
    }

    return { success: false, reason: "unknown-error", error: error.message || error };
  }
};

module.exports = sendPushNotification;
