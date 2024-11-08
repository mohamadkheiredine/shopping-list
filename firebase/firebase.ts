
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDO24z2Y4RCTCD0SLUmEHVkm707-h7l3j4",
  authDomain: "shopping-list-f9f75.firebaseapp.com",
  projectId: "shopping-list-f9f75",
  storageBucket: "shopping-list-f9f75.firebasestorage.app",
  messagingSenderId: "188182552175",
  appId: "1:188182552175:web:a085901f9a7d639118379a",
  measurementId: "G-3680Y56H77"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default db;
