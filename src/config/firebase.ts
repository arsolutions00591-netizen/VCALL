import { FirebaseApp, getApp, getApps, initializeApp } from "firebase/app";
import {
  Auth,
  getReactNativePersistence,
  initializeAuth,
} from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { Firestore, getFirestore } from "firebase/firestore";

/**
 * Firebase Web app configuration for VCALL.
 * These are client-side identifiers, not service-account credentials.
 * Never add a Firebase Admin SDK private key to the mobile app.
 */
const firebaseConfig = {
  apiKey: "AIzaSyDCawDGOSCs5g4Q5HyG1Dtf8U_dpJYvX-0",
  authDomain: "vcall-f9221.firebaseapp.com",
  projectId: "vcall-f9221",
  storageBucket: "vcall-f9221.firebasestorage.app",
  messagingSenderId: "1055332757275",
  appId: "1:1055332757275:web:760f3e7ae6d4aa16a42dbe",
  measurementId: "G-8PH42ZKVKT",
};

export const firebaseApp: FirebaseApp = getApps().length > 0
  ? getApp()
  : initializeApp(firebaseConfig);

// Persist Firebase JS Auth state across app restarts on React Native.
export const firebaseAuth: Auth = initializeAuth(firebaseApp, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

export const firestoreDb: Firestore = getFirestore(firebaseApp);
export const isFirebaseConfigured = true;
