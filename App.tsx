import React, { useMemo, useState } from "react";
import {
  SafeAreaView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity,
  View, ScrollView
} from "react-native";

type Tab = "Home" | "Contacts" | "Calls" | "Profile";
type Screen = "welcome" | "signIn" | "signUp" | "app";

const contacts = [
  { name: "Aarav Sharma", phone: "+91 98765 43210", initials: "AS", status: "Available" },
  { name: "Priya Verma", phone: "+91 98765 12340", initials: "PV", status: "Available" },
  { name: "Rahul Kumar", phone: "+91 91234 56780", initials: "RK", status: "Away" },
  { name: "Neha Singh", phone: "+91 99887 76655", initials: "NS", status: "Available" },
];

export default function App() {
  const [screen, setScreen] = useState<Screen>("welcome");
  const [tab, setTab] = useState<Tab>("Home");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [search, setSearch] = useState("");

  const filteredContacts = useMemo(
    () => contacts.filter((person) =>
      person.name.toLowerCase().includes(search.toLowerCase()) ||
      person.phone.includes(search)
    ), [search]
  );

  const renderContact = (person: typeof contacts[number]) => (
    <View key={person.phone} style={styles.contactRow}>
      <View style={styles.avatar}><Text style={styles.avatarText}>{person.initials}</Text></View>
      <View style={styles.contactInfo}>
        <Text style={styles.contactName}>{person.name}</Text>
        <Text style={styles.muted}>{person.phone} · {person.status}</Text>
      </View>
      <TouchableOpacity style={styles.callIcon} onPress={() => {}}><Text style={styles.callIconText}>☎</Text></TouchableOpacity>
    </View>
  );

  const pageTitle = tab === "Home" ? "Stay connected" : tab;
  const renderTabContent = () => {
    if (tab === "Contacts") return (
      <>
        <Text style={styles.sectionTitle}>Your contacts</Text>
        <TextInput value={search} onChangeText={setSearch} placeholder="Search name or phone" placeholderTextColor="#8793AA" style={styles.search} />
        {filteredContacts.length ? filteredContacts.map(renderContact) : <Text style={styles.muted}>No contacts found.</Text>}
      </>
    );
    if (tab === "Calls") return (
      <>
        <Text style={styles.sectionTitle}>Recent calls</Text>
        <View style={styles.emptyCard}>
          <Text style={styles.emptyIcon}>◷</Text>
          <Text style={styles.cardTitle}>Your call history will appear here</Text>
          <Text style={styles.muted}>Missed, received and outgoing calls will be organized in this space.</Text>
        </View>
      </>
    );
    if (tab === "Profile") return (
      <>
        <View style={styles.profileCard}>
          <View style={styles.profileAvatar}><Text style={styles.profileAvatarText}>V</Text></View>
          <Text style={styles.cardTitle}>Your VCALL profile</Text>
          <Text style={styles.muted}>Sign in to add your name and profile photo.</Text>
        </View>
        {["Privacy & blocked users", "Notifications", "Help & support"].map((item) => (
          <View key={item} style={styles.settingRow}><Text style={styles.contactName}>{item}</Text><Text style={styles.muted}>›</Text></View>
        ))}
        <TouchableOpacity style={styles.outlineButton} onPress={() => setScreen("welcome")}><Text style={styles.outlineText}>Log out</Text></TouchableOpacity>
      </>
    );
    return (
      <>
        <View style={styles.heroCard}>
          <Text style={styles.heroEyebrow}>VCALL · CONNECT CLEARLY</Text>
          <Text style={styles.heroTitle}>Closer, with every call.</Text>
          <Text style={styles.heroCopy}>Simple ways to reach the people who matter.</Text>
          <TouchableOpacity style={styles.heroButton} onPress={() => setTab("Contacts")}><Text style={styles.heroButtonText}>Find a contact</Text></TouchableOpacity>
        </View>
        <Text style={styles.sectionTitle}>Quick access</Text>
        <View style={styles.quickGrid}>
          <TouchableOpacity style={styles.quickCard} onPress={() => setTab("Contacts")}><Text style={styles.quickIcon}>♙</Text><Text style={styles.cardTitle}>Contacts</Text><Text style={styles.muted}>Find people</Text></TouchableOpacity>
          <TouchableOpacity style={styles.quickCard} onPress={() => setTab("Calls")}><Text style={styles.quickIcon}>◷</Text><Text style={styles.cardTitle}>Call history</Text><Text style={styles.muted}>Recent activity</Text></TouchableOpacity>
        </View>
        <Text style={styles.sectionTitle}>Suggested contacts</Text>
        {contacts.slice(0, 2).map(renderContact)}
      </>
    );
  };

  if (screen !== "app") return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#102A56" />
      <View style={styles.authContainer}>
        <View style={styles.brand}>
          <View style={styles.logo}><Text style={styles.logoText}>V</Text></View>
          <Text style={styles.wordmark}>VCALL</Text>
          <Text style={styles.tagline}>Connect Clearly. Stay Closer.</Text>
        </View>
        <View style={styles.authPanel}>
          <Text style={styles.heading}>{screen === "welcome" ? "Welcome to VCALL" : screen === "signIn" ? "Welcome back" : "Create your account"}</Text>
          <Text style={styles.subheading}>{screen === "welcome" ? "A simpler way to stay close to the people who matter." : "Enter your details to continue."}</Text>
          {screen !== "welcome" && <>
            <TextInput value={email} onChangeText={setEmail} placeholder="Email address" placeholderTextColor="#8793AA" autoCapitalize="none" keyboardType="email-address" style={styles.input} />
            <TextInput value={password} onChangeText={setPassword} placeholder="Password" placeholderTextColor="#8793AA" secureTextEntry style={styles.input} />
          </>}
          <TouchableOpacity style={styles.primaryButton} onPress={() => screen === "welcome" ? setScreen("signIn") : setScreen("app")}><Text style={styles.primaryText}>{screen === "welcome" ? "Sign in" : "Continue to VCALL"}</Text></TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton} onPress={() => setScreen(screen === "signUp" ? "signIn" : "signUp")}><Text style={styles.secondaryText}>{screen === "signUp" ? "Already have an account? Sign in" : "Create account"}</Text></TouchableOpacity>
          {screen !== "welcome" && <TouchableOpacity onPress={() => setScreen("welcome")}><Text style={styles.backLink}>Back</Text></TouchableOpacity>}
          <Text style={styles.note}>Preview mode: secure phone OTP sign-in and calling services will be connected in upcoming development phases.</Text>
        </View>
      </View>
    </SafeAreaView>
  );

  return (
    <SafeAreaView style={styles.safeApp}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F8FC" />
      <View style={styles.topBar}>
        <View><Text style={styles.smallBrand}>VCALL</Text><Text style={styles.pageTitle}>{pageTitle}</Text></View>
        <View style={styles.topAvatar}><Text style={styles.topAvatarText}>V</Text></View>
      </View>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {renderTabContent()}
      </ScrollView>
      <View style={styles.bottomNav}>
        {(["Home", "Contacts", "Calls", "Profile"] as Tab[]).map((item) => (
          <TouchableOpacity key={item} style={styles.navItem} onPress={() => { setTab(item); setSearch(""); }}>
            <Text style={[styles.navIcon, tab === item && styles.navActive]}>{item === "Home" ? "⌂" : item === "Contacts" ? "♙" : item === "Calls" ? "◷" : "◎"}</Text>
            <Text style={[styles.navLabel, tab === item && styles.navActive]}>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#102A56" },
  authContainer: { flex: 1, justifyContent: "center", paddingHorizontal: 24 },
  brand: { alignItems: "center", marginBottom: 30 },
  logo: { width: 68, height: 68, borderRadius: 22, backgroundColor: "#2F80ED", alignItems: "center", justifyContent: "center", marginBottom: 12 },
  logoText: { color: "#FFFFFF", fontSize: 40, fontWeight: "900" },
  wordmark: { color: "#FFFFFF", fontSize: 29, fontWeight: "800", letterSpacing: 5 },
  tagline: { color: "#C9D9F3", fontSize: 13, marginTop: 7 },
  authPanel: { backgroundColor: "#FFFFFF", borderRadius: 24, padding: 22 },
  heading: { color: "#152B4E", fontSize: 24, fontWeight: "800", marginBottom: 8 },
  subheading: { color: "#687991", fontSize: 14, lineHeight: 21, marginBottom: 20 },
  input: { backgroundColor: "#F4F7FB", borderColor: "#DFE7F1", borderWidth: 1, borderRadius: 12, color: "#152B4E", paddingHorizontal: 14, paddingVertical: 14, marginBottom: 12 },
  primaryButton: { backgroundColor: "#2878E5", borderRadius: 13, paddingVertical: 15, alignItems: "center", marginTop: 5 },
  primaryText: { color: "#FFFFFF", fontSize: 15, fontWeight: "700" },
  secondaryButton: { borderWidth: 1, borderColor: "#C9D9EE", borderRadius: 13, paddingVertical: 14, alignItems: "center", marginTop: 11 },
  secondaryText: { color: "#2467BC", fontSize: 14, fontWeight: "700" },
  backLink: { color: "#2467BC", textAlign: "center", marginTop: 14 },
  note: { color: "#8290A5", fontSize: 11, lineHeight: 16, textAlign: "center", marginTop: 18 },
  safeApp: { flex: 1, backgroundColor: "#F5F8FC" },
  topBar: { paddingHorizontal: 22, paddingTop: 14, paddingBottom: 16, flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: "#FFFFFF" },
  smallBrand: { color: "#2878E5", fontSize: 12, fontWeight: "900", letterSpacing: 2 },
  pageTitle: { color: "#152B4E", fontSize: 23, fontWeight: "800", marginTop: 3 },
  topAvatar: { width: 42, height: 42, borderRadius: 21, backgroundColor: "#E5F0FF", alignItems: "center", justifyContent: "center" },
  topAvatarText: { color: "#2878E5", fontWeight: "800", fontSize: 18 },
  content: { padding: 20, paddingBottom: 28 },
  heroCard: { backgroundColor: "#1F65C5", borderRadius: 22, padding: 22, marginBottom: 24 },
  heroEyebrow: { color: "#CFE2FF", fontSize: 10, fontWeight: "800", letterSpacing: 1.5 },
  heroTitle: { color: "#FFFFFF", fontSize: 27, fontWeight: "800", marginTop: 12, maxWidth: 240 },
  heroCopy: { color: "#E0ECFF", fontSize: 13, marginTop: 8, lineHeight: 19 },
  heroButton: { backgroundColor: "#FFFFFF", borderRadius: 12, paddingVertical: 12, paddingHorizontal: 16, alignSelf: "flex-start", marginTop: 18 },
  heroButtonText: { color: "#1F65C5", fontWeight: "800" },
  sectionTitle: { color: "#152B4E", fontSize: 17, fontWeight: "800", marginBottom: 13, marginTop: 5 },
  quickGrid: { flexDirection: "row", gap: 12, marginBottom: 24 },
  quickCard: { flex: 1, backgroundColor: "#FFFFFF", borderRadius: 17, padding: 16, borderWidth: 1, borderColor: "#E8EEF6" },
  quickIcon: { color: "#2878E5", fontSize: 26, marginBottom: 10 },
  cardTitle: { color: "#152B4E", fontSize: 14, fontWeight: "800", marginBottom: 5 },
  muted: { color: "#7B8AA0", fontSize: 12, lineHeight: 18 },
  contactRow: { flexDirection: "row", alignItems: "center", backgroundColor: "#FFFFFF", borderRadius: 15, padding: 12, marginBottom: 10, borderWidth: 1, borderColor: "#E9EFF6" },
  avatar: { width: 42, height: 42, borderRadius: 21, backgroundColor: "#E5F0FF", alignItems: "center", justifyContent: "center" },
  avatarText: { color: "#2878E5", fontWeight: "800" },
  contactInfo: { flex: 1, marginLeft: 12 },
  contactName: { color: "#152B4E", fontSize: 14, fontWeight: "700" },
  callIcon: { width: 34, height: 34, borderRadius: 17, backgroundColor: "#EAF3FF", alignItems: "center", justifyContent: "center" },
  callIconText: { color: "#2878E5", fontSize: 17 },
  search: { backgroundColor: "#FFFFFF", borderColor: "#E2EAF4", borderWidth: 1, borderRadius: 13, paddingHorizontal: 14, paddingVertical: 12, color: "#152B4E", marginBottom: 15 },
  emptyCard: { backgroundColor: "#FFFFFF", borderRadius: 18, padding: 24, alignItems: "center", borderWidth: 1, borderColor: "#E8EEF6" },
  emptyIcon: { fontSize: 38, color: "#2878E5", marginBottom: 12 },
  profileCard: { backgroundColor: "#FFFFFF", borderRadius: 18, padding: 24, alignItems: "center", marginBottom: 16 },
  profileAvatar: { width: 72, height: 72, borderRadius: 36, backgroundColor: "#2878E5", alignItems: "center", justifyContent: "center", marginBottom: 14 },
  profileAvatarText: { color: "#FFFFFF", fontSize: 34, fontWeight: "900" },
  settingRow: { backgroundColor: "#FFFFFF", padding: 17, borderRadius: 13, marginBottom: 9, flexDirection: "row", justifyContent: "space-between" },
  outlineButton: { borderWidth: 1, borderColor: "#D7E2F0", borderRadius: 13, padding: 14, alignItems: "center", marginTop: 12 },
  outlineText: { color: "#2467BC", fontWeight: "700" },
  bottomNav: { flexDirection: "row", backgroundColor: "#FFFFFF", borderTopWidth: 1, borderTopColor: "#E7EDF5", paddingTop: 9, paddingBottom: 7 },
  navItem: { flex: 1, alignItems: "center", paddingVertical: 5 },
  navIcon: { color: "#91A0B4", fontSize: 21, marginBottom: 3 },
  navLabel: { color: "#91A0B4", fontSize: 10, fontWeight: "600" },
  navActive: { color: "#2878E5", fontWeight: "900" },
});
