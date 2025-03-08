importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js');

firebase.initializeApp({
    apiKey: "AIzaSyDOwQ57bYle3iSjAMxdynVHE1jCnGXDj84",
    authDomain: "studentleavemanagementsys-sbm.firebaseapp.com",
    projectId: "studentleavemanagementsys-sbm",
    storageBucket: "studentleavemanagementsys-sbm.firebasestorage.app",
    messagingSenderId: "906552083972",
    appId: "1:906552083972:web:42a99a69864ca151cd9751",
    measurementId: "G-G5F720KWKZ"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log('Received background message: ', payload);
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: payload.notification.image
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});