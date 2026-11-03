import React, { useState } from "react";
import { SafeAreaView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

type Screen = "welcome" | "signIn" | "signUp";

export default function App() {
  const [screen, setScreen] = useState<Screen>("welcome");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submitNotice = () => {
    // Authentication will be connected to the selected backend in Phase 2.
    setScreen("welcome");
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#101633" />
      <View style={styles.container}>
        <View style={styles.brand}>
          <View style={styles.logo}><Text style={styles.logoText}>V</Text></View>
          <Text style={styles.wordmark}>VCALL</Text>
          <Text style={styles.tagline}>Connect Clearly. Stay Closer.</Text>
        </View>

        {screen === "welcome" ? (
          <View style={styles.panel}>
            <Text style={styles.heading}>Welcome to VCALL</Text>
            <Text style={styles.subheading}>A simpler way to stay close to the people who matter.</Text>
            <TouchableOpacity style={styles.primaryButton} onPress={() => setScreen("signIn")}><Text style={styles.primaryText}>Sign in</Text></TouchableOpacity>
            <TouchableOpacity style={styles.secondaryButton} onPress={() => setScreen("signUp")}><Text style={styles.secondaryText}>Create account</Text></TouchableOpacity>
            <Text style={styles.note}>Secure messaging and calling are being built in stages.</Text>
          </View>
        ) : (
          <View style={styles.panel}>
            <Text style={styles.heading}>{screen === "signIn" ? "Sign in" : "Create account"}</Text>
            <Text style={styles.subheading}>Use your email to continue.</Text>
            <TextInput value={email} onChangeText={setEmail} placeholder="Email address" placeholderTextColor="#8992B2" autoCapitalize="none" keyboardType="email-address" style={styles.input} />
            <TextInput value={password} onChangeText={setPassword} placeholder="Password" placeholderTextColor="#8992B2" secureTextEntry style={styles.input} />
            <TouchableOpacity style={styles.primaryButton} onPress={submitNotice}><Text style={styles.primaryText}>Continue</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => setScreen("welcome")}><Text style={styles.link}>Back</Text></TouchableOpacity>
            <Text style={styles.note}>Account creation is a UI preview; authentication is not connected yet.</Text>
          </View>
        )}
        <Text style={styles.footer}>VCALL • Android</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#101633" },
  container: { flex: 1, paddingHorizontal: 26, justifyContent: "center" },
  brand: { alignItems: "center", marginBottom: 38 },
  logo: { width: 76, height: 76, borderRadius: 24, backgroundColor: "#6D5DFB", alignItems: "center", justifyContent: "center", marginBottom: 14, shadowColor: "#6D5DFB", shadowOpacity: 0.35, shadowRadius: 18, elevation: 8 },
  logoText: { color: "#FFFFFF", fontSize: 42, fontWeight: "900" },
  wordmark: { color: "#FFFFFF", fontSize: 30, fontWeight: "800", letterSpacing: 5 },
  tagline: { color: "#B8C2E8", fontSize: 14, marginTop: 8 },
  panel: { backgroundColor: "#1B2448", borderRadius: 26, padding: 24, borderWidth: 1, borderColor: "#303D70" },
  heading: { color: "#FFFFFF", fontSize: 25, fontWeight: "700", marginBottom: 9 },
  subheading: { color: "#B8C2E8", fontSize: 14, lineHeight: 21, marginBottom: 24 },
  primaryButton: { backgroundColor: "#6D5DFB", borderRadius: 14, paddingVertical: 16, alignItems: "center", marginTop: 8 },
  primaryText: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" },
  secondaryButton: { borderWidth: 1, borderColor: "#7782B5", borderRadius: 14, paddingVertical: 15, alignItems: "center", marginTop: 12 },
  secondaryText: { color: "#FFFFFF", fontSize: 16, fontWeight: "600" },
  input: { backgroundColor: "#111A3A", borderColor: "#394777", borderWidth: 1, borderRadius: 12, color: "#FFFFFF", paddingHorizontal: 15, paddingVertical: 15, marginBottom: 12, fontSize: 15 },
  link: { color: "#B8B0FF", textAlign: "center", marginTop: 18, fontWeight: "600" },
  note: { color: "#8992B2", fontSize: 11, lineHeight: 17, textAlign: "center", marginTop: 22 },
  footer: { color: "#6F789C", fontSize: 11, textAlign: "center", marginTop: 30, letterSpacing: 2 }
});
