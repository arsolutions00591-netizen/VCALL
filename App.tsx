import React, { useState } from "react";
import {
  Alert, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextInput,
  TouchableOpacity, View,
} from "react-native";
import type { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { confirmPhoneOtp, requestPhoneOtp, signOutVCallUser } from "./src/services/phoneAuth";
import { saveUserProfile } from "./src/services/userProfile";

type Tab = "Home" | "Contacts" | "Calls" | "Profile";
type Screen = "welcome" | "phone" | "otp" | "profile" | "app";

const demoContacts = [
  { name: "Aarav Sharma", phone: "+91 98765 43210", initials: "AS" },
  { name: "Priya Verma", phone: "+91 98765 12340", initials: "PV" },
  { name: "Rahul Kumar", phone: "+91 91234 56780", initials: "RK" },
];

export default function App() {
  const [screen, setScreen] = useState<Screen>("welcome");
  const [tab, setTab] = useState<Tab>("Home");
  const [phone, setPhone] = useState("+91");
  const [otp, setOtp] = useState("");
  const [confirmation, setConfirmation] = useState<FirebaseAuthTypes.ConfirmationResult | null>(null);
  const [verifiedPhone, setVerifiedPhone] = useState("");
  const [verifiedUid, setVerifiedUid] = useState("");
  const [fullName, setFullName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [contactSearch, setContactSearch] = useState("");
  const filteredContacts = demoContacts.filter((person) =>
    `${person.name} ${person.phone}`.toLowerCase().includes(contactSearch.trim().toLowerCase())
  );

  const sendOtp = async () => {
    setError("");
    setBusy(true);
    try {
      const result = await requestPhoneOtp(phone);
      setConfirmation(result);
      setOtp("");
      setScreen("otp");
    } catch (e) {
      console.error("VCALL OTP SEND ERROR:", e);
      if (e instanceof Error) {
        console.error("VCALL OTP SEND STACK:", e.stack);
      }
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  };

  const verifyOtp = async () => {
    if (!confirmation) {
      setError("पहले OTP भेजें।");
      return;
    }
    setError("");
    setBusy(true);
    try {
      const user = await confirmPhoneOtp(confirmation, otp);
      setVerifiedPhone(user.phoneNumber ?? phone.trim());
      setVerifiedUid(user.uid);
      setScreen("profile");
    } catch (e) {
      setError(e instanceof Error ? e.message : "OTP verify नहीं हुआ।");
    } finally {
      setBusy(false);
    }
  };

  const finishProfile = async () => {
    setError("");
    setBusy(true);
    try {
      await saveUserProfile({ uid: verifiedUid, name: fullName, phone: verifiedPhone });
      setScreen("app");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Profile save नहीं हुआ।");
    } finally {
      setBusy(false);
    }
  };

  const logout = async () => {
    setBusy(true);
    try {
      await signOutVCallUser();
      setConfirmation(null);
      setOtp("");
      setVerifiedPhone("");
      setScreen("welcome");
      setTab("Home");
    } catch (e) {
      Alert.alert("Logout नहीं हुआ", e instanceof Error ? e.message : "कृपया दोबारा कोशिश करें।");
    } finally {
      setBusy(false);
    }
  };

  const renderContact = (person: typeof demoContacts[number]) => (
    <View key={person.phone} style={styles.contactRow}>
      <View style={styles.avatar}><Text style={styles.avatarText}>{person.initials}</Text></View>
      <View style={styles.contactInfo}>
        <Text style={styles.contactName}>{person.name}</Text>
        <Text style={styles.muted}>{person.phone}</Text>
      </View>
      <Text style={styles.callMark}>☎</Text>
    </View>
  );

  if (screen !== "app") {
    return (
      <SafeAreaView style={styles.authSafe}>
        <StatusBar barStyle="light-content" />
        <ScrollView contentContainerStyle={styles.authContainer} keyboardShouldPersistTaps="handled">
          <View style={styles.brand}>
            <View style={styles.logo}><Text style={styles.logoText}>V</Text></View>
            <Text style={styles.wordmark}>VCALL</Text>
            <Text style={styles.tagline}>Connect Clearly. Stay Closer.</Text>
          </View>
          <View style={styles.panel}>
            <Text style={styles.heading}>
              {screen === "welcome" ? "Welcome to VCALL" : screen === "phone" ? "Mobile number से लॉगिन" : screen === "otp" ? "OTP verify करें" : "अपना प्रोफाइल बनाएँ"}
            </Text>
            <Text style={styles.subheading}>
              {screen === "welcome"
                ? "अपने लोगों से जुड़े रहने का आसान तरीका।"
                : screen === "phone"
                  ? "Country code के साथ अपना मोबाइल नंबर डालें।"
                  : screen === "otp" ? `हमने ${phone.trim()} पर 6 अंकों का OTP भेजा है।` : "अपना नाम लिखें। यह नाम आपकी VCALL प्रोफाइल में दिखेगा।"}
            </Text>
            {screen === "phone" && (
              <TextInput
                value={phone}
                onChangeText={setPhone}
                placeholder="+919876543210"
                placeholderTextColor="#8793AA"
                keyboardType="phone-pad"
                autoComplete="tel"
                style={styles.input}
              />
            )}
            {screen === "profile" && (
              <TextInput value={fullName} onChangeText={setFullName} placeholder="आपका पूरा नाम" placeholderTextColor="#8793AA" autoCapitalize="words" style={styles.input} />
            )}
            {screen === "otp" && (
              <TextInput
                value={otp}
                onChangeText={(value) => setOtp(value.replace(/\D/g, "").slice(0, 6))}
                placeholder="6-digit OTP"
                placeholderTextColor="#8793AA"
                keyboardType="number-pad"
                maxLength={6}
                textContentType="oneTimeCode"
                style={[styles.input, styles.otpInput]}
              />
            )}
            {!!error && <Text style={styles.error}>{error}</Text>}
            <TouchableOpacity
              disabled={busy}
              style={[styles.primaryButton, busy && styles.disabledButton]}
              onPress={screen === "welcome" ? () => setScreen("phone") : screen === "phone" ? sendOtp : screen === "otp" ? verifyOtp : finishProfile}
            >
              <Text style={styles.primaryText}>
                {busy ? "कृपया प्रतीक्षा करें…" : screen === "welcome" ? "मोबाइल से जारी रखें" : screen === "phone" ? "OTP भेजें" : screen === "otp" ? "OTP verify करें" : "प्रोफाइल सेव करें"}
              </Text>
            </TouchableOpacity>
            {screen === "otp" && (
              <TouchableOpacity disabled={busy} style={styles.secondaryButton} onPress={sendOtp}>
                <Text style={styles.secondaryText}>OTP दोबारा भेजें</Text>
              </TouchableOpacity>
            )}
            {screen !== "welcome" && screen !== "profile" && (
              <TouchableOpacity disabled={busy} onPress={() => { setError(""); setScreen(screen === "otp" ? "phone" : "welcome"); }}>
                <Text style={styles.backLink}>वापस जाएँ</Text>
              </TouchableOpacity>
            )}
            <Text style={styles.note}>सुरक्षित साइन-इन Firebase Phone Authentication से होता है। SMS शुल्क आपके मोबाइल ऑपरेटर के अनुसार लागू हो सकते हैं।</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  const title = tab === "Home" ? "Stay connected" : tab;
  return (
    <SafeAreaView style={styles.appSafe}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.topBar}>
        <View><Text style={styles.smallBrand}>VCALL</Text><Text style={styles.pageTitle}>{title}</Text></View>
        <View style={styles.topAvatar}><Text style={styles.topAvatarText}>V</Text></View>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        {tab === "Home" && <>
          <View style={styles.hero}>
            <Text style={styles.heroEyebrow}>VCALL · CONNECT CLEARLY</Text>
            <Text style={styles.heroTitle}>Closer, with every call.</Text>
            <Text style={styles.heroCopy}>Simple ways to reach the people who matter.</Text>
            <Text style={styles.signedIn}>Signed in: {verifiedPhone}</Text>
          </View>
          <Text style={styles.sectionTitle}>Quick access</Text>
          <View style={styles.quickRow}>
            <TouchableOpacity style={styles.quickCard} onPress={() => setTab("Contacts")}><Text style={styles.quickTitle}>Contacts</Text><Text style={styles.muted}>Find people</Text></TouchableOpacity>
            <TouchableOpacity style={styles.quickCard} onPress={() => setTab("Calls")}><Text style={styles.quickTitle}>Call history</Text><Text style={styles.muted}>Recent activity</Text></TouchableOpacity>
          </View>
        </>}
        {tab === "Contacts" && <>
          <Text style={styles.sectionTitle}>Your contacts</Text>
          <TextInput
            value={contactSearch}
            onChangeText={setContactSearch}
            placeholder="नाम या मोबाइल नंबर खोजें"
            placeholderTextColor="#8793AA"
            autoCapitalize="none"
            style={styles.searchInput}
          />
          <Text style={styles.muted}>अभी ये sample contacts हैं। असली phone contacts अगली development phase में जोड़े जाएँगे।</Text>
          {filteredContacts.length > 0
            ? filteredContacts.map(renderContact)
            : <View style={styles.emptyCard}><Text style={styles.muted}>कोई contact नहीं मिला। दूसरा नाम या नंबर खोजें।</Text></View>}
        </>}
        {tab === "Calls" && <View style={styles.emptyCard}><Text style={styles.sectionTitle}>Call history</Text><Text style={styles.muted}>Missed, received और outgoing calls यहाँ दिखेंगे। Calling service अभी जुड़नी बाकी है।</Text></View>}
        {tab === "Profile" && <View style={styles.emptyCard}><Text style={styles.sectionTitle}>Your VCALL profile</Text><Text style={styles.muted}>Verified number: {verifiedPhone}</Text><TouchableOpacity disabled={busy} style={styles.logoutButton} onPress={logout}><Text style={styles.logoutText}>{busy ? "Please wait…" : "Log out"}</Text></TouchableOpacity></View>}
      </ScrollView>
      <View style={styles.bottomNav}>
        {(["Home", "Contacts", "Calls", "Profile"] as Tab[]).map((item) => (
          <TouchableOpacity key={item} style={styles.navItem} onPress={() => setTab(item)}>
            <Text style={[styles.navLabel, tab === item && styles.navActive]}>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  authSafe: { flex: 1, backgroundColor: "#102A56" },
  authContainer: { flexGrow: 1, justifyContent: "center", padding: 24 },
  brand: { alignItems: "center", marginBottom: 30 },
  logo: { width: 68, height: 68, borderRadius: 22, backgroundColor: "#2F80ED", alignItems: "center", justifyContent: "center", marginBottom: 12 },
  logoText: { color: "#FFFFFF", fontSize: 40, fontWeight: "900" },
  wordmark: { color: "#FFFFFF", fontSize: 29, fontWeight: "800", letterSpacing: 5 },
  tagline: { color: "#C9D9F3", fontSize: 13, marginTop: 7 },
  panel: { backgroundColor: "#FFFFFF", borderRadius: 24, padding: 22 },
  heading: { color: "#152B4E", fontSize: 23, fontWeight: "800", marginBottom: 8 },
  subheading: { color: "#687991", fontSize: 14, lineHeight: 21, marginBottom: 20 },
  searchInput: { backgroundColor: "#FFFFFF", borderColor: "#DFE7F1", borderWidth: 1, borderRadius: 12, color: "#152B4E", paddingHorizontal: 14, paddingVertical: 13, marginTop: 12, marginBottom: 12 },
  input: { backgroundColor: "#F4F7FB", borderColor: "#DFE7F1", borderWidth: 1, borderRadius: 12, color: "#152B4E", paddingHorizontal: 14, paddingVertical: 14, marginBottom: 12 },
  otpInput: { textAlign: "center", letterSpacing: 8, fontSize: 22 },
  primaryButton: { backgroundColor: "#2878E5", borderRadius: 13, paddingVertical: 15, alignItems: "center", marginTop: 5 },
  disabledButton: { opacity: 0.6 },
  primaryText: { color: "#FFFFFF", fontSize: 15, fontWeight: "700" },
  secondaryButton: { borderWidth: 1, borderColor: "#C9D9EE", borderRadius: 13, paddingVertical: 14, alignItems: "center", marginTop: 11 },
  secondaryText: { color: "#2467BC", fontSize: 14, fontWeight: "700" },
  backLink: { color: "#2467BC", textAlign: "center", marginTop: 16 },
  error: { color: "#C62828", fontSize: 13, marginBottom: 10 },
  note: { color: "#8290A5", fontSize: 11, lineHeight: 16, textAlign: "center", marginTop: 18 },
  appSafe: { flex: 1, backgroundColor: "#F5F8FC" },
  topBar: { paddingHorizontal: 22, paddingTop: 14, paddingBottom: 16, flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: "#FFFFFF" },
  smallBrand: { color: "#2878E5", fontSize: 12, fontWeight: "900", letterSpacing: 2 },
  pageTitle: { color: "#152B4E", fontSize: 23, fontWeight: "800", marginTop: 3 },
  topAvatar: { width: 42, height: 42, borderRadius: 21, backgroundColor: "#E5F0FF", alignItems: "center", justifyContent: "center" },
  topAvatarText: { color: "#2878E5", fontWeight: "800", fontSize: 18 },
  content: { padding: 20, paddingBottom: 28, flexGrow: 1 },
  hero: { backgroundColor: "#1F65C5", borderRadius: 22, padding: 22, marginBottom: 24 },
  heroEyebrow: { color: "#CFE2FF", fontSize: 10, fontWeight: "800", letterSpacing: 1.5 },
  heroTitle: { color: "#FFFFFF", fontSize: 27, fontWeight: "800", marginTop: 12 },
  heroCopy: { color: "#E0ECFF", fontSize: 13, marginTop: 8 },
  signedIn: { color: "#FFFFFF", fontSize: 12, marginTop: 18 },
  sectionTitle: { color: "#152B4E", fontSize: 18, fontWeight: "800", marginBottom: 13 },
  quickRow: { flexDirection: "row", gap: 12 },
  quickCard: { flex: 1, backgroundColor: "#FFFFFF", borderRadius: 16, padding: 17, borderWidth: 1, borderColor: "#E8EEF6" },
  quickTitle: { color: "#152B4E", fontSize: 15, fontWeight: "800", marginBottom: 5 },
  muted: { color: "#7B8AA0", fontSize: 12, lineHeight: 18 },
  contactRow: { flexDirection: "row", alignItems: "center", backgroundColor: "#FFFFFF", borderRadius: 15, padding: 12, marginTop: 10, borderWidth: 1, borderColor: "#E9EFF6" },
  avatar: { width: 42, height: 42, borderRadius: 21, backgroundColor: "#E5F0FF", alignItems: "center", justifyContent: "center" },
  avatarText: { color: "#2878E5", fontWeight: "800" },
  contactInfo: { flex: 1, marginLeft: 12 },
  contactName: { color: "#152B4E", fontSize: 14, fontWeight: "700" },
  callMark: { color: "#2878E5", fontSize: 18, paddingHorizontal: 8 },
  emptyCard: { backgroundColor: "#FFFFFF", borderRadius: 18, padding: 22, borderWidth: 1, borderColor: "#E8EEF6" },
  logoutButton: { backgroundColor: "#2878E5", borderRadius: 12, padding: 14, alignItems: "center", marginTop: 22 },
  logoutText: { color: "#FFFFFF", fontWeight: "800" },
  bottomNav: { flexDirection: "row", backgroundColor: "#FFFFFF", borderTopWidth: 1, borderTopColor: "#E7EDF5", paddingVertical: 15 },
  navItem: { flex: 1, alignItems: "center" },
  navLabel: { color: "#91A0B4", fontSize: 12, fontWeight: "700" },
  navActive: { color: "#2878E5", fontWeight: "900" },
});
