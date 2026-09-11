import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NeoButton } from "../../components/NeoButton";
import { NeoCard } from "../../components/NeoCard";
import { useAppState } from "../../context/AppStateContext";

export default function SettingsScreen() {
  const router = useRouter();
  const { profile, updateProfile, resetAllData } = useAppState();

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editName, setEditName] = useState(profile.name);
  const [editTagline, setEditTagline] = useState(profile.tagline);

  const handleSaveProfile = () => {
    updateProfile({ name: editName, tagline: editTagline });
    setEditModalVisible(false);
  };

  const handleLogout = () => {
    Alert.alert(
      "SELF DESTRUCT (LOGOUT)",
      "Are you sure you want to log out and clear active session?",
      [
        { text: "CANCEL", style: "cancel" },
        {
          text: "LOG OUT",
          style: "destructive",
          onPress: () => {
            router.replace("/auth" as any);
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Header */}
        <View style={styles.headerRow}>
          <Text style={styles.screenTitle}>GEAR UP</Text>
          <TouchableOpacity
            style={styles.boltBtn}
            onPress={() => router.push("/splash" as any)}
            activeOpacity={0.8}
          >
            <Ionicons name="flash" size={22} color="#000" />
          </TouchableOpacity>
        </View>

        {/* Profile Card */}
        <NeoCard style={styles.profileCard}>
          <View style={styles.profileRow}>
            <Image
              source={{
                uri: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
              }}
              style={styles.avatarLarge}
            />
            <View style={styles.profileMain}>
              <Text style={styles.profileName}>{profile.name}</Text>
              <Text style={styles.profileTagline}>{profile.tagline}</Text>
              <TouchableOpacity
                onPress={() => setEditModalVisible(true)}
                style={styles.editBtn}
              >
                <Text style={styles.editBtnText}>EDIT PROFILE</Text>
              </TouchableOpacity>
            </View>
          </View>
        </NeoCard>

        {/* Settings List Container */}
        <NeoCard style={styles.settingsGroupCard}>
          {/* AI Voice Training */}
          <TouchableOpacity
            style={styles.settingItem}
            activeOpacity={0.7}
            onPress={() =>
              Alert.alert(
                "AI Voice Training",
                "Voice recognition mode is calibrated and active.",
              )
            }
          >
            <View style={styles.itemLeft}>
              <Ionicons
                name="mic-outline"
                size={20}
                color="#000"
                style={styles.itemIcon}
              />
              <Text style={styles.itemTitle}>AI VOICE TRAINING</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#000" />
          </TouchableOpacity>

          <View style={styles.divider} />

          {/* Privacy Guard */}
          <View style={styles.settingItem}>
            <View style={styles.itemLeft}>
              <Ionicons
                name="shield-checkmark-outline"
                size={20}
                color="#000"
                style={styles.itemIcon}
              />
              <Text style={styles.itemTitle}>PRIVACY GUARD</Text>
            </View>
            <Switch
              value={profile.privacyGuard}
              onValueChange={(val) => updateProfile({ privacyGuard: val })}
              trackColor={{ false: "#DDD", true: "#7DF4B2" }}
              thumbColor="#FFF"
            />
          </View>

          <View style={styles.divider} />

          {/* Vibe Alerts */}
          <View style={styles.settingItem}>
            <View style={styles.itemLeft}>
              <Ionicons
                name="notifications-outline"
                size={20}
                color="#000"
                style={styles.itemIcon}
              />
              <Text style={styles.itemTitle}>VIBE ALERTS</Text>
            </View>
            <Switch
              value={profile.vibeAlerts}
              onValueChange={(val) => updateProfile({ vibeAlerts: val })}
              trackColor={{ false: "#DDD", true: "#FFC700" }}
              thumbColor="#FFF"
            />
          </View>

          <View style={styles.divider} />

          {/* Linked Banks */}
          <TouchableOpacity
            style={styles.settingItem}
            activeOpacity={0.7}
            onPress={() =>
              Alert.alert("Linked Banks", "2 Banks connected: Chase & Amex.")
            }
          >
            <View style={styles.itemLeft}>
              <Ionicons
                name="card-outline"
                size={20}
                color="#000"
                style={styles.itemIcon}
              />
              <Text style={styles.itemTitle}>LINKED BANKS</Text>
            </View>
            <View style={styles.connectedBadge}>
              <Text style={styles.connectedBadgeText}>
                {profile.linkedBanksCount} CONNECTED
              </Text>
            </View>
          </TouchableOpacity>
        </NeoCard>

        {/* Self Destruct / Logout Button */}
        <NeoButton
          title="SELF DESTRUCT (LOGOUT)"
          backgroundColor="#FF7B7B"
          onPress={handleLogout}
          icon={<Ionicons name="exit-outline" size={20} color="#000" />}
          style={styles.logoutBtn}
        />

        <Text style={styles.versionText}>VERSION 2.0.420-ALPHA</Text>
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal
        visible={editModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>EDIT PROFILE</Text>

            <Text style={styles.inputLabel}>FULL NAME</Text>
            <TextInput
              style={styles.modalInput}
              value={editName}
              onChangeText={setEditName}
            />

            <Text style={styles.inputLabel}>RANK / TAGLINE</Text>
            <TextInput
              style={styles.modalInput}
              value={editTagline}
              onChangeText={setEditTagline}
            />

            <View style={styles.modalBtnRow}>
              <NeoButton
                title="CANCEL"
                backgroundColor="#FFF"
                onPress={() => setEditModalVisible(false)}
                style={{ flex: 1, marginRight: 8 }}
              />
              <NeoButton
                title="SAVE"
                backgroundColor="#FFC700"
                onPress={handleSaveProfile}
                style={{ flex: 1 }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FAF7E8",
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 110,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: "900",
    fontStyle: "italic",
    color: "#000",
  },
  boltBtn: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: "#FFF",
    borderWidth: 2.5,
    borderColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  profileCard: {
    backgroundColor: "#FFF",
    marginBottom: 20,
    padding: 16,
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarLarge: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 2.5,
    borderColor: "#000",
    marginRight: 16,
  },
  profileMain: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: "900",
    fontStyle: "italic",
    color: "#000",
  },
  profileTagline: {
    fontSize: 13,
    fontWeight: "600",
    color: "#666",
    marginBottom: 6,
  },
  editBtn: {},
  editBtnText: {
    fontSize: 12,
    fontWeight: "900",
    textDecorationLine: "underline",
    color: "#000",
  },
  settingsGroupCard: {
    backgroundColor: "#FFF",
    padding: 0,
    marginBottom: 24,
    overflow: "hidden",
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 18,
  },
  itemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  itemIcon: {
    marginRight: 12,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: "900",
    fontStyle: "italic",
    color: "#000",
  },
  divider: {
    height: 2,
    backgroundColor: "#000",
  },
  connectedBadge: {
    backgroundColor: "#000",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  connectedBadgeText: {
    fontSize: 10,
    fontWeight: "900",
    color: "#FFF",
  },
  logoutBtn: {
    marginBottom: 20,
  },
  versionText: {
    textAlign: "center",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1,
    color: "#A0A0A0",
    marginBottom: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    width: "100%",
    backgroundColor: "#FAF7E8",
    borderRadius: 24,
    borderWidth: 3,
    borderColor: "#000",
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "900",
    fontStyle: "italic",
    color: "#000",
    marginBottom: 16,
    textAlign: "center",
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: "900",
    color: "#000",
    marginBottom: 4,
  },
  modalInput: {
    backgroundColor: "#FFF",
    borderWidth: 2,
    borderColor: "#000",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 14,
  },
  modalBtnRow: {
    flexDirection: "row",
    marginTop: 8,
  },
});
