import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";

const firebaseConfig ={
  apiKey: `${import.meta.env.VITE_FCM_API_KEY}`,
  authDomain: "student-leave-management.firebaseapp.com",
  projectId: "student-leave-management",
  storageBucket: "student-leave-management.firebasestorage.app",
  messagingSenderId: `${import.meta.env.VITE_FCM_MESSAGING_SENDER_ID}`,
  appId: `${import.meta.env.VITE_FCM_APP_ID}`,
  measurementId: `${import.meta.env.VITE_FCM_MEASUREMENT_ID}`
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

const generateToken = async () => {
  const permission = await Notification.requestPermission();
  console.log(permission);
  if(permission === 'granted') {
    try {
      const token = await getToken(messaging, {vapidKey: `${import.meta.env.VITE_FCM_VAPID_KEY}`});
      console.log(token);
      return token;
    } catch (err) {
      console.error("Error while generationg FCM token",err);
    } 
  }
}

export {generateToken, messaging};
