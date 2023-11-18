// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCFfZVVTVeXt7mmkhFwqJIhX1zZTX37OEc",
  authDomain: "peerprep-691a3.firebaseapp.com",
  projectId: "peerprep-691a3",
  storageBucket: "peerprep-691a3.appspot.com",
  messagingSenderId: "725552918453",
  appId: "1:725552918453:web:ff04ce74913b92cecdb3fc",
  measurementId: "G-W48GCE85G0",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const auth = getAuth(app);

export {
  // analytics,
  auth,
};

export default app;
