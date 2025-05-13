import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";

const firebaseConfig ={
  apiKey: "AIzaSyBHURttMZmcpughDt3OEfKcG6jrvVwbAKs",
  authDomain: "student-leave-management.firebaseapp.com",
  projectId: "student-leave-management",
  storageBucket: "student-leave-management.firebasestorage.app",
  messagingSenderId: "468252728992",
  appId: "1:468252728992:web:fc14258e26351f21a173c5",
  measurementId: "G-WBC97V6B6E"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

const generateToken = async () => {
  const permission = await Notification.requestPermission();
  console.log(permission);
  if(permission === 'granted') {
    try {
      const token = await getToken(messaging, {vapidKey: "BHjFieWeFaiSS2Q4T-zmHU-000TdW4AVkY-lKEEC6QU-YhphYnOLe3QLOPTgkD51EcBdkAuAA9EwBU2ALMF6k3M"});
      console.log(token);
      return token;
    } catch (err) {
      console.error("Error while generationg FCM token",err);
    } 
  }
}

export {generateToken, messaging};
