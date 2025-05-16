importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js');

firebase.initializeApp({
    apiKey: "AIzaSyBHURttMZmcpughDt3OEfKcG6jrvVwbAKs",
    authDomain: "student-leave-management.firebaseapp.com",
    projectId: "student-leave-management",
    storageBucket: "student-leave-management.firebasestorage.app",
    messagingSenderId: "468252728992",
    appId: "1:468252728992:web:fc14258e26351f21a173c5",
    measurementId: "G-WBC97V6B6E"
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

self.addEventListener('notificationclick', function(event) {
    const click_action_url = event.notification.data?.click_action || '/';
    event.notification.close();
    event.waitUntil(clients.openWindow(click_action_url));
});
