import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NeoCard } from "../../components/NeoCard";
import { VibeChart } from "../../components/VibeChart";
import { useAppState } from "../../context/AppStateContext";

export default function InsightsScreen() {
  const router = useRouter();
  const { totalBurned, transactions } = useAppState();

  // Compute category totals
  const cravingsTotal = transactions
    .filter((t) => t.category === "CRAVINGS")
    .reduce((a, b) => a + b.amount, 0);
  const movingTotal = transactions
    .filter((t) => t.category === "MOVING")
    .reduce((a, b) => a + b.amount, 0);
  const funTotal = transactions
    .filter((t) => t.category === "FUN STUFF")
    .reduce((a, b) => a + b.amount, 0);
  const survivalTotal = transactions
    .filter((t) => t.category === "SURVIVAL")
    .reduce((a, b) => a + b.amount, 0);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Header */}
        <View style={styles.headerRow}>
          <Text style={styles.screenTitle}>INSIGHTS</Text>
          <TouchableOpacity style={styles.calBtn} activeOpacity={0.8}>
            <Ionicons name="calendar-outline" size={22} color="#000" />
          </TouchableOpacity>
        </View>

        {/* Total Burned Card */}
        <NeoCard backgroundColor="#FFC700" style={styles.burnedCard}>
          <View style={styles.burnedHeader}>
            <Text style={styles.burnedLabel}>TOTAL BURNED 🛈</Text>
          </View>

          <Text style={styles.burnedAmount}>
            $
            {totalBurned.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </Text>

          <View style={styles.burnedBadgeRow}>
            <View style={styles.topTierPill}>
              <Text style={styles.topTierText}>TOP TIER</Text>
            </View>
            <Text style={styles.monthDiffText}>+12% from last month</Text>
          </View>
        </NeoCard>

        {/* Vibe Check Card */}
        <NeoCard style={styles.vibeCard}>
          <Text style={styles.cardHeaderTitle}>VIBE CHECK</Text>
          <VibeChart />
        </NeoCard>

        {/* Where It Goes Section */}
        <View style={styles.whereSection}>
          <Text style={styles.whereTitle}>WHERE IT GOES</Text>
          <View style={styles.gridContainer}>
            {/* Cravings */}
            <NeoCard backgroundColor="#FFE8D6" style={styles.gridCard}>
              <Ionicons name="pizza-outline" size={26} color="#000" />
              <Text style={styles.gridCategoryTitle}>CRAVINGS</Text>
              <Text style={styles.gridAmount}>
                ${cravingsTotal > 0 ? cravingsTotal.toFixed(0) : "450"}
              </Text>
            </NeoCard>

            {/* Moving */}
            <NeoCard backgroundColor="#D8E9FE" style={styles.gridCard}>
              <Ionicons name="car-outline" size={26} color="#000" />
              <Text style={styles.gridCategoryTitle}>MOVING</Text>
              <Text style={styles.gridAmount}>
                ${movingTotal > 0 ? movingTotal.toFixed(0) : "120"}
              </Text>
            </NeoCard>

            {/* Fun Stuff */}
            <NeoCard backgroundColor="#EBE0FF" style={styles.gridCard}>
              <Ionicons name="game-controller-outline" size={26} color="#000" />
              <Text style={styles.gridCategoryTitle}>FUN STUFF</Text>
              <Text style={styles.gridAmount}>
                ${funTotal > 0 ? funTotal.toFixed(0) : "380"}
              </Text>
            </NeoCard>

            {/* Survival */}
            <NeoCard backgroundColor="#D4FBE5" style={styles.gridCard}>
              <Ionicons name="flash-outline" size={26} color="#000" />
              <Text style={styles.gridCategoryTitle}>SURVIVAL</Text>
              <Text style={styles.gridAmount}>
                ${survivalTotal > 0 ? survivalTotal.toFixed(0) : "290"}
              </Text>
            </NeoCard>
          </View>
        </View>
      </ScrollView>
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
  calBtn: {
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
  burnedCard: {
    marginBottom: 20,
    padding: 18,
  },
  burnedHeader: {
    marginBottom: 4,
  },
  burnedLabel: {
    fontSize: 11,
    fontWeight: "900",
    color: "#000",
    letterSpacing: 0.5,
  },
  burnedAmount: {
    fontSize: 38,
    fontWeight: "900",
    color: "#000",
    marginBottom: 12,
  },
  burnedBadgeRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  topTierPill: {
    backgroundColor: "#FFF",
    borderWidth: 2,
    borderColor: "#000",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 10,
  },
  topTierText: {
    fontSize: 10,
    fontWeight: "900",
    color: "#000",
  },
  monthDiffText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#000",
  },
  vibeCard: {
    marginBottom: 24,
    backgroundColor: "#FFF",
  },
  cardHeaderTitle: {
    fontSize: 18,
    fontWeight: "900",
    fontStyle: "italic",
    color: "#000",
    marginBottom: 10,
  },
  whereSection: {
    marginTop: 4,
  },
  whereTitle: {
    fontSize: 18,
    fontWeight: "900",
    fontStyle: "italic",
    color: "#000",
    marginBottom: 14,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
  gridCard: {
    width: "48%",
    padding: 14,
    justifyContent: "space-between",
    minHeight: 120,
  },
  gridCategoryTitle: {
    fontSize: 12,
    fontWeight: "900",
    color: "#000",
    marginTop: 8,
  },
  gridAmount: {
    fontSize: 22,
    fontWeight: "900",
    color: "#000",
  },
});
