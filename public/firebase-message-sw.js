// eslint-disable-next-line no-undef
importScripts(
  "https://www.gstatic.com/firebasejs/9.6.1/firebase-app-compat.js"
);
// eslint-disable-next-line no-undef
importScripts(
  "https://www.gstatic.com/firebasejs/9.6.1/firebase-messaging-compat.js"
);

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FCM_API_KEY,
  authDomain: process.env.REACT_APP_FCM_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FCM_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FCM_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FCM_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FCM_APP_ID,
  measurementId: process.env.REACT_APP_FCM_MEASUREMENT_ID,
};

// Firebase 초기화
// eslint-disable-next-line no-undef
firebase.initializeApp(firebaseConfig);
// eslint-disable-next-line no-undef
const messaging = firebase.messaging();

// 백그라운드 푸시 알림 처리
messaging.onBackgroundMessage((payload) => {
  console.log("백그라운드 메시지 수신:", payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/favicon.ico",
  };

  // eslint-disable-next-line no-restricted-globals
  self.registration.showNotification(notificationTitle, notificationOptions);
});

/* eslint-disable no-restricted-globals */
self.addEventListener("install", function (e) {
  console.log("fcm sw install..");
  self.skipWaiting();
});

self.addEventListener("activate", function (e) {
  console.log("fcm sw activate..");
});

self.addEventListener("push", function (e) {
  console.log("push: ", e.data.json());
  if (!e.data.json()) return;

  const resultData = e.data.json().notification;
  const notificationTitle = resultData.title;
  const notificationOptions = {
    body: resultData.body,
    icon: resultData.image,
    tag: resultData.tag,
    vibrate: [200, 100, 200, 100],
    ...resultData,
  };
  console.log("push: ", { resultData, notificationTitle, notificationOptions });

  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener("notificationclick", function (event) {
  console.log("notification click");
  event.preventDefault();
  event.notification.close();

  const url = "https://easyTravel.jomalang/plans";

  //클라이언트에 사이트가 열러있는지 확인
  // eslint-disable-next-line no-undef
  const promiseChain = clients
    .matchAll({
      type: "window",
      includeUncontrolled: true,
    })
    .then(function (windowClients) {
      let matchingClient = null;

      for (let i = 0; i < windowClients.length; i++) {
        const windowClient = windowClients[i];
        if (windowClient.url.includes(url)) {
          matchingClient = windowClient;
          break;
        }
      }

      // 열려있다면 focus, 아니면 새로 open
      if (matchingClient) {
        return matchingClient.focus();
      } else {
        // eslint-disable-next-line no-undef
        return clients.openWindow(url);
      }
    });

  // eslint-disable-next-line no-undef
  event.waitUntil(promiseChain);
});
