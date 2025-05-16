importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js');

firebase.initializeApp({
    apiKey: `${import.meta.env.VITE_FCM_API_KEY}`,
    authDomain: "student-leave-management.firebaseapp.com",
    projectId: "student-leave-management",
    storageBucket: "student-leave-management.firebasestorage.app",
    messagingSenderId: `${import.meta.env.VITE_FCM_MESSAGING_SENDER_ID}`,
    appId: `${import.meta.env.VITE_FCM_APP_ID}`,
    measurementId: `${import.meta.env.VITE_FCM_MEASUREMENT_ID}`
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
