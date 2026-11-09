import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { firestoreDb } from "../config/firebase";

export type VCallUserProfile = {
  uid: string;
  name: string;
  phone: string;
};

/**
 * Creates or updates the signed-in user's profile.
 * The Firebase Auth UID is the document ID; timestamp is written
 * using the existing Firestore field name and server time.
 */
export async function saveUserProfile({
  uid,
  name,
  phone,
}: VCallUserProfile): Promise<void> {
  const cleanName = name.trim();
  const cleanPhone = phone.trim();

  if (!uid) throw new Error("A signed-in Firebase user is required.");
  if (!cleanName) throw new Error("Please enter your name.");
  if (!cleanPhone) throw new Error("A verified phone number is required.");

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
