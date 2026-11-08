# VCALL

**Connect Clearly. Stay Closer.**

VCALL is a native Android-first video calling and messaging application built with React Native, Expo, and TypeScript.

## Current project status

This repository contains the initial Expo application scaffold and a first-pass welcome/sign-in interface.

### Included
- Expo SDK 58 project configuration
- React Native + TypeScript
- VCALL branding and blue/purple theme
- Welcome, sign-in, and create-account UI screens
- Android application identifier: `com.arsolutions.vcall`

### Foundation added in this phase
- Firebase client configuration scaffold using Expo public environment variables
- Environment-variable example file (no private credentials committed)
- Firestore rules that deny access by default until reviewed, authenticated rules are added

### Not connected yet
- Real authentication (email/password or phone)
- User profiles and contacts
- Messaging and media storage
- WebRTC voice/video calling and call signaling
- Push notifications, database, and security rules

These features will be implemented and tested in later phases. The current sign-in form is a visual scaffold and does not create accounts or authenticate users.

## Requirements

- Node.js 22.13 or newer
- npm
- Android device with Expo Go for an early preview, or Android Studio for native development builds

## Firebase setup (required before backend features)

1. Create a Firebase project in the Firebase Console.
2. Register an Android app with package name `com.arsolutions.vcall`.
3. Enable the required Firebase products only after reviewing billing and regional availability.
4. Copy the keys from `.env.example` into a local `.env` file. Never commit real credentials or service-account keys.
5. Review `firestore.rules` before deploying. The starter rules intentionally deny all reads and writes until secure per-user rules are implemented.

The Firebase client scaffold is not authentication. Phone OTP requires a supported verification flow and real-device testing before it can be enabled.

## Run locally

```bash
npm install
npx expo install --fix
npx expo start
```

For an Android development build, configure EAS Build after the native dependencies and app credentials are selected.

## Roadmap

1. Project foundation and navigation
2. Backend selection, authentication, profiles, and contacts
3. Real-time chat and media sharing
4. Voice calling
5. WebRTC video calling
6. Notifications, privacy, and settings
7. Device testing, security review, and Android release build

**Important:** No feature is considered production-ready until it has been implemented, exercised on Android devices, and verified.
