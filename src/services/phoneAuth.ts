import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";

/**
 * Starts Firebase's native Android phone verification flow.
 * Use an international phone number, e.g. +919876543210.
 */
export function requestPhoneOtp(
  phoneNumber: string
): Promise<FirebaseAuthTypes.ConfirmationResult> {
  const normalizedPhone = phoneNumber.trim();

  if (!/^\+[1-9]\d{7,14}$/.test(normalizedPhone)) {
    return Promise.reject(
      new Error("Enter a valid phone number with country code, e.g. +91XXXXXXXXXX.")
    );
  }

  return auth().signInWithPhoneNumber(normalizedPhone);
}

/** Confirms the SMS code and returns the authenticated Firebase user. */
export async function confirmPhoneOtp(
  confirmation: FirebaseAuthTypes.ConfirmationResult,
  code: string
): Promise<FirebaseAuthTypes.User> {
  const normalizedCode = code.trim();

  if (!/^\d{6}$/.test(normalizedCode)) {
    throw new Error("Enter the 6-digit OTP.");
  }

  const credential = await confirmation.confirm(normalizedCode);
  if (!credential.user) {
    throw new Error("Phone verification did not return a Firebase user.");
  }

  return credential.user;
}

/** Signs out the current Firebase user. */
export function signOutVCallUser(): Promise<void> {
  return auth().signOut();
}
