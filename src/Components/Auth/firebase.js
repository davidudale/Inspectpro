import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAsMXCIkG1N4yWWQp0QKpkLhf23_eOednU",
  authDomain: "inspectionapp-f5d54.firebaseapp.com",
  projectId: "inspectionapp-f5d54",
  storageBucket: "inspectionapp-f5d54.firebasestorage.app",
  messagingSenderId: "494949815374",
  appId: "1:494949815374:web:c70da823340a29057a9f1f"
}; 

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);