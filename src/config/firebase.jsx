import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDfAiekC8evqpazRAFCHPl_SbCvC8uxZ1o",
  authDomain: "sanction-automation-system.firebaseapp.com",
  projectId: "sanction-automation-system",
  storageBucket: "sanction-automation-system.firebasestorage.app",
  messagingSenderId: "767320908566",
  appId: "1:767320908566:web:1955541a7b1e6fc237a637",
  measurementId: "G-X9LT7QSVS7"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export {app,analytics};