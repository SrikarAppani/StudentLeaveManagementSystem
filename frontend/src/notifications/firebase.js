import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";

const firebaseConfig = {
    apiKey: "AIzaSyDOwQ57bYle3iSjAMxdynVHE1jCnGXDj84",
    authDomain: "studentleavemanagementsys-sbm.firebaseapp.com",
    projectId: "studentleavemanagementsys-sbm",
    storageBucket: "studentleavemanagementsys-sbm.firebasestorage.app",
    messagingSenderId: "906552083972",
    appId: "1:906552083972:web:42a99a69864ca151cd9751",
    measurementId: "G-G5F720KWKZ"
  };

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

const generateToken = async () => {
  const permission = await Notification.requestPermission();
  console.log(permission);
  if(permission === 'granted') {
    const token = await getToken(messaging, {vapidKey: "BKP71-h2wN1lgtyQSfTSC5IVXfbTNxVwBrf7C3tKmcwtH52itst6kVSfq0et-gVsupjcGKvKgMSfkCjhDykDJ2A"});
    console.log(token);
  }
}

export {generateToken, messaging};


/* TOKEN REFRESH CODE

import { getMessaging, getToken, onTokenRefresh } from "firebase/messaging";

const messaging = getMessaging();

const checkAndUpdateToken = async (userEmail) => {
  try {
    const token = await getToken(messaging, { vapidKey: "YOUR_VAPID_KEY" });

    if (token) {
      // Send updated token to backend if it's different from stored token
      await fetch("https://yourbackend.com/api/update-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail, fcmToken: token }),
      });

      console.log("FCM Token checked and updated:", token);
    }
  } catch (error) {
    console.error("Error getting FCM token:", error);
  }
};

// Detect token refresh automatically
onTokenRefresh(messaging, async () => {
  console.log("Token refreshed!");
  await checkAndUpdateToken("teacher@example.com");
});

export { checkAndUpdateToken };
 */