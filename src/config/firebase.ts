import { getFirestore } from "@react-native-firebase/firestore";

/**
 * Native Firebase Firestore instance.
 * Authentication and Firestore both use React Native Firebase.
 */
export const firestoreDb = getFirestore();
export const isFirebaseConfigured = true;
