importScripts('https://www.gstatic.com/firebasejs/9.22.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.1/firebase-database-compat.js');

firebase.initializeApp({
    apiKey: "YOUR_FIREBASE_API_KEY",
    authDomain: "YOUR_FIREBASE_AUTH_DOMAIN",
    databaseURL: "YOUR_FIREBASE_DATABASE_URL",
    projectId: "YOUR_FIREBASE_PROJECT_ID",
    storageBucket: "YOUR_FIREBASE_STORAGE_BUCKET",
    messagingSenderId: "YOUR_FIREBASE_MESSAGING_SENDER_ID",
    appId: "YOUR_FIREBASE_APP_ID"
});

const database = firebase.database();
const pageLoadTime = Date.now();

database.ref('stories').limitToLast(1).on('child_added', (snapshot) => {
    const story = snapshot.val();
    if (story && story.timestamp > pageLoadTime) {
        self.registration.showNotification("Yeni Bir Hikaye Eklendi! 💖", {
            body: story.title,
            icon: "data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22512%22%20height%3D%22512%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22%23070405%22%2F%3E%3Cpath%20d%3D%22M256%20448l-30-28C120%20334%2054%20274%2054%20200%2054%20140%20100%2094%20160%2094c34%200%2066%2016%2086%2041%2020-25%2052-41%2086-41%2060%200%20106%2046%20106%20106%200%2074-66%20134-172%20220l-30%2028z%22%20fill%3D%22%23ff3b6b%22%2F%3E%3C%2Fsvg%3E"
        });
    }
});

database.ref('gallery').limitToLast(1).on('child_added', (snapshot) => {
    const photo = snapshot.val();
    if (photo && photo.timestamp > pageLoadTime) {
        self.registration.showNotification("Galeriye Yeni Fotoğraf Eklendi! 📸", {
            body: photo.caption,
            icon: "data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22512%22%20height%3D%22512%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22%23070405%22%2F%3E%3Cpath%20d%3D%22M256%20448l-30-28C120%20334%2054%20274%2054%20200%2054%20140%20100%2094%20160%2094c34%200%2066%2016%2086%2041%2020-25%2052-41%2086-41%2060%200%20106%2046%20106%20106%200%2074-66%20134-172%20220l-30%2028z%22%20fill%3D%22%23ff3b6b%22%2F%3E%3C%2Fsvg%3E"
        });
    }
});

database.ref('specialNote').on('value', (snapshot) => {
    const data = snapshot.val();
    if (data && data.timestamp > pageLoadTime) {
        self.registration.showNotification("Sana Özel Bir Not Var! ✉️", {
            body: data.message,
            icon: "data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22512%22%20height%3D%22512%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22%23070405%22%2F%3E%3Cpath%20d%3D%22M256%20448l-30-28C120%20334%2054%20274%2054%20200%2054%20140%20100%2094%20160%2094c34%200%2066%2016%2086%2041%2020-25%2052-41%2086-41%2060%200%20106%2046%20106%20106%200%2074-66%20134-172%20220l-30%2028z%22%20fill%3D%22%23ff3b6b%22%2F%3E%3C%2Fsvg%3E"
        });
    }
});

database.ref('customNotification').on('value', (snapshot) => {
    const data = snapshot.val();
    if (data && data.timestamp > pageLoadTime) {
        self.registration.showNotification(data.title, {
            body: data.body,
            icon: "data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22512%22%20height%3D%22512%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22%23070405%22%2F%3E%3Cpath%20d%3D%22M256%20448l-30-28C120%20334%2054%20274%2054%20200%2054%20140%20100%2094%20160%2094c34%200%2066%2016%2086%2041%2020-25%2052-41%2086-41%2060%200%20106%2046%20106%20106%200%2074-66%20134-172%20220l-30%2028z%22%20fill%3D%22%23ff3b6b%22%2F%3E%3C%2Fsvg%3E"
        });
    }
});