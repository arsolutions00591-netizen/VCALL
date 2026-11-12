import {
  doc,
  serverTimestamp,
  setDoc,
} from "@react-native-firebase/firestore";
import { firestoreDb } from "../config/firebase";

export type VCallUserProfile = {
  uid: string;
  name: string;
  phone: string;
};

/** Save the signed-in user's profile in users/{uid}. */
export async function saveUserProfile({
  uid,
  name,
  phone,
}: VCallUserProfile): Promise<void> {
  const cleanName = name.trim();
  const cleanPhone = phone.trim();

  if (!uid) throw new Error("A signed-in Firebase user is required.");
  if (!cleanName) throw new Error("Please enter your name.");
  if (!/^\+[1-9]\d{7,14}$/.test(cleanPhone)) {
    throw new Error("A verified phone number is required.");
  }

  await setDoc(
    doc(firestoreDb, "users", uid),
    {
      name: cleanName,
      phone: cleanPhone,
      status: "active",
      timestamp: serverTimestamp(),
    },
    { merge: true }
  );
}
