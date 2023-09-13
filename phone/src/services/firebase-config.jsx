import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyCNBQyE1UdAhdQqpYtDrqdPDEBoyb7wGvE",
  authDomain: "fooddelivery-43f89.firebaseapp.com",
  projectId: "fooddelivery-43f89",
  storageBucket: "fooddelivery-43f89.appspot.com",
  messagingSenderId: "488687197092",
  appId: "1:488687197092:web:6a135a4249988f40947f31",
  measurementId: "G-HKQF92NSQM",
};

const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
export const authentication = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
