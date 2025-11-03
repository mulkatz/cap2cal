import { initializeApp } from "firebase/app";

// TODO: Update with your Cap2Cal Firebase project configuration
// https://firebase.google.com/docs/web/setup#available-libraries
// If you're still using the mailhook Firebase project, these values are correct
// Otherwise, replace with your new Cap2Cal Firebase project credentials

const firebaseConfig = {
  apiKey: "***REMOVED***",
  authDomain: "mailhook-50852.firebaseapp.com", // TODO: Update if using new Firebase project
  projectId: "mailhook-50852", // TODO: Update if using new Firebase project
  storageBucket: "mailhook-50852.firebasestorage.app", // TODO: Update if using new Firebase project
  messagingSenderId: "720768264492",
  appId: "***REMOVED***"
};

const app = initializeApp(firebaseConfig);