import { Ionicons } from "@expo/vector-icons";

import {
  AudioModule,
  RecordingPresets,
  setAudioModeAsync,
  useAudioRecorder,
} from "expo-audio";
import { GlassView } from "expo-glass-effect";
import { Animated, Easing } from "react-native";
import { useRouter } from "expo-router";
import { useState, useRef } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NeoCard } from "../../components/NeoCard";
import { useAppState } from "../../context/AppStateContext";

export default function HomeScreen() {
  const router = useRouter();
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const { transactions, profile, notifications, deleteTransaction } =
    useAppState();

  const unreadCount = notifications.filter((n) => n.unread).length;

  // Animation value for pulse scale (drives the circular pulse)
  const pulseAnim = useRef(new Animated.Value(1)).current; // starts at scale 1

  const startRecording = async () => {
    try {
      // 1. Ask for microphone permission
      const permission =
        await AudioModule.requestRecordingPermissionsAsync();

      if (!permission.granted) {
        console.log("Microphone permission denied");
        return;
      }

      // 2. Configure audio
      await setAudioModeAsync({
        allowsRecording: true,
        playsInSilentMode: true,
      });

      // 3. Start pulse animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 800,
            useNativeDriver: false,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1.0,
            duration: 800,
            useNativeDriver: false,
          }),
        ])
      ).start();

      // 4. Start recording
      recorder.record();

      setIsRecording(true);
      setTranscript("Listening..."); // Update transcript to show listening state

      console.log("Recording started");
    } catch (error) {
      console.error("Failed to start recording:", error);
    }
  };

  const stopRecording = async () => {
    try {
      // 1. Stop pulse animation
      pulseAnim.stopAnimation();
      pulseAnim.setValue(1); // reset to initial scale

      // 2. Stop recording
      await recorder.stop();

      setIsRecording(false);

      console.log("Recording stopped");
      console.log("Audio URI:", recorder.uri);

      // 3. Send recorder.uri to your transcription service
      // For mock transcription, we'll use a fixed example
      // In a real app, you would send the audio file to a speech-to-text service
      // const text = await transcribeAudio(recorder.uri);
      // setTranscript(text);

      // Mock transcription for demonstration
      setTranscript("I just spent $25 on pizza 🍕");
    } catch (error) {
      console.error("Failed to stop recording:", error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Header */}
        <View style={styles.topHeader}>
          <TouchableOpacity
            style={styles.userInfo}
            onPress={() => router.push("/settings" as any)}
            activeOpacity={0.8}
          >
            <Image
              source={{
                uri: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
              }}
              style={styles.avatar}
            />
            <View style={styles.userTextCol}>
              <Text style={styles.userName}>
                Yo, {profile.name.split(" ")[0]}!
              </Text>
              <Text style={styles.userTagline}>{profile.tagline}</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.bellBtn}
            onPress={() => router.push("/notifications" as any)}
            activeOpacity={0.8}
          >
            <Ionicons name="notifications-outline" size={22} color="#000" />
            {unreadCount > 0 && <View style={styles.unreadDot} />}
          </TouchableOpacity>
        </View>

        {/* Hero Speak To Spark Area */}
        <View style={styles.heroSection}>
          <Text style={styles.heroTitle}>SPEAK TO SPARK</Text>
          <Text style={styles.heroSubtitle}>
            {transcript || "Tap the microphone and speak"}
          </Text>

          <TouchableOpacity
            style={styles.micButton}
            onPress={isRecording ? stopRecording : startRecording}
            activeOpacity={0.6}
          >
            <Ionicons
              name={isRecording ? "stop" : "mic"}
              size={30}
              color="#fff"
            />
          </TouchableOpacity>
        </View>

        {/* Recent Hits Section */}
        <View style={styles.recentSection}>
          <View style={styles.recentHeader}>
            <Text style={styles.recentTitle}>RECENT HITS</Text>
            <Text style={styles.subSubtitle}>Last 24 hours</Text>
            <TouchableOpacity
              onPress={() => router.push("/insights" as any)}
              style={styles.seeAllBtn}
            >
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.hitsList}>
            {transactions.slice(0, 4).map((tx) => (
              <NeoCard key={tx.id} style={styles.hitCard}>
                <View style={styles.hitRow}>
                  <View style={styles.hitIconBox}>
                    <Ionicons
                      name={(tx.icon as any) || "cash-outline"}
                      size={24}
                      color="#000"
                    />
                  </View>

                  <View style={styles.hitMainInfo}>
                    <Text style={styles.hitTitle}>{tx.title}</Text>
                    <Text style={styles.hitCategory}>{tx.categoryLabel}</Text>
                  </View>

                  <View style={styles.hitRightInfo}>
                    <Text style={styles.hitAmount}>
                      -${tx.amount.toFixed(2)}
                    </Text>
                    {tx.badge ? (
                      <View
                        style={[
                          styles.badgePill,
                          tx.badgeType === "saved"
                            ? styles.badgeSaved
                            : tx.badgeType === "high"
                              ? styles.badgeHigh
                              : styles.badgeLegit,
                        ]}
                      >
                        <Text style={styles.badgePillText}>{tx.badge}</Text>
                      </View>
                    ) : null}
                  </View>

                  <TouchableOpacity
                    onPress={() => deleteTransaction(tx.id)}
                    style={styles.deleteBtn}
                  >
                    <Ionicons name="trash-outline" size={16} color="#888" />
                  </TouchableOpacity>
                </View>
              </NeoCard>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* GlassView overlay for recording state */}
      {isRecording && (
        <GlassView
          style={[StyleSheet.absoluteFillObject, { backgroundColor: "rgba(0,0,0,0.3)" }]}
          blurStyle="light"
        >
          <View style={styles.overlayContent}>
            {/* Circular Pulse Animation */}
            <Animated.View
              style={[
                styles.pulseCircle,
                { transform: [{ scale: pulseAnim }] },
              ]}
            />
            {/* Stop Button */}
            <TouchableOpacity
              style={styles.stopButton}
              onPress={stopRecording}
              activeOpacity={0.6}
            >
              <Ionicons name="stop" size={30} color="#fff" />
            </TouchableOpacity>
            {/* Transcript (shows "Listening..." during recording, mock transcript after stopping) */}
            <Text style={styles.transcriptPlaceholder}>
              {transcript}
            </Text>
          </View>
        </GlassView>
      )}
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
  topHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 28,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: "#000",
    marginRight: 10,
  },
  userTextCol: {
    justifyContent: "center",
  },
  userName: {
    fontSize: 15,
    fontWeight: "900",
    color: "#000",
  },
  userTagline: {
    fontSize: 12,
    fontWeight: "600",
    color: "#666",
  },
  bellBtn: {
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
  unreadDot: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#FF4D4D",
    borderWidth: 1.5,
    borderColor: "#000",
  },
  heroSection: {
    alignItems: "center",
    marginBottom: 32,
  },
  aiTag: {
    backgroundColor: "#FFC700",
    borderWidth: 2,
    borderColor: "#000",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 5,
    transform: [{ rotate: "-2deg" }],
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  aiTagText: {
    fontSize: 11,
    fontWeight: "900",
    fontStyle: "italic",
    color: "#000",
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: "900",
    fontStyle: "italic",
    letterSpacing: 0.5,
    color: "#000",
    marginBottom: 6,
  },
  heroSubtitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#555",
    marginBottom: 24,
  },
  micButton: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "#000",
    borderWidth: 3,
    borderColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 4, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 8,
  },
  recentSection: {
    marginTop: 8,
  },
  recentHeader: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 14,
  },
  recentTitle: {
    fontSize: 20,
    fontWeight: "900",
    fontStyle: "italic",
    color: "#000",
    marginRight: 8,
  },
  subSubtitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#666",
    flex: 1,
  },
  seeAllBtn: {
    paddingHorizontal: 4,
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: "800",
    textDecorationLine: "underline",
    color: "#000",
  },
  hitsList: {
    gap: 12,
  },
  hitCard: {
    backgroundColor: "#FFFFFF",
    padding: 14,
  },
  hitRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  hitIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#FAF7E8",
    borderWidth: 2,
    borderColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  hitMainInfo: {
    flex: 1,
  },
  hitTitle: {
    fontSize: 16,
    fontWeight: "900",
    fontStyle: "italic",
    color: "#000",
  },
  hitCategory: {
    fontSize: 12,
    fontWeight: "600",
    color: "#666",
  },
  hitRightInfo: {
    alignItems: "flex-end",
    marginRight: 8,
  },
  hitAmount: {
    fontSize: 16,
    fontWeight: "900",
    color: "#000",
    marginBottom: 2,
  },
  badgePill: {
    borderWidth: 1.5,
    borderColor: "#000",
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  badgeLegit: {
    backgroundColor: "#7DF4B2",
  },
  badgeSaved: {
    backgroundColor: "#FFC700",
  },
  badgeHigh: {
    backgroundColor: "#FF7B7B",
  },
  badgePillText: {
    fontSize: 9,
    fontWeight: "900",
    color: "#000",
  },
  deleteBtn: {
    padding: 4,
  },
  /* New styles for recording overlay */
  overlayContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  pulseCircle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderWidth: 2,
    borderColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  stopButton: {
    position: "absolute",
    bottom: 100,
  },
  transcriptPlaceholder: {
    position: "absolute",
    bottom: 60,
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    width: "80%",
    maxWidth: 300,
  },
});