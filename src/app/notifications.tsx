import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAppState } from '../context/AppStateContext';
import { NeoCard } from '../components/NeoCard';
import { BottomNavBar } from '../components/BottomNavBar';

export default function NotificationsScreen() {
  const router = useRouter();
  const { notifications, clearNotifications } = useAppState();

  const todayNoise = notifications.filter((n) => n.isToday);
  const yesterdayNoise = notifications.filter((n) => !n.isToday);

  const getIconForType = (type: string) => {
    switch (type) {
      case 'alert':
        return <Ionicons name="flame-outline" size={22} color="#000" />;
      case 'tool':
        return <Ionicons name="hardware-chip-outline" size={22} color="#000" />;
      case 'achievement':
        return <Ionicons name="trophy-outline" size={22} color="#000" />;
      case 'recap':
        return <Ionicons name="stats-chart-outline" size={22} color="#000" />;
      default:
        return <Ionicons name="notifications-outline" size={22} color="#000" />;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          {/* Header Row */}
          <View style={styles.headerRow}>
            <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.8}>
              <Ionicons name="arrow-back" size={22} color="#000" />
            </TouchableOpacity>
            <Text style={styles.screenTitle}>WHAT'S UP?</Text>
          </View>

          {/* Today's Noise Section */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>TODAY'S NOISE</Text>
            <TouchableOpacity onPress={clearNotifications}>
              <Text style={styles.clearAllText}>CLEAR ALL</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.cardsList}>
            {todayNoise.length > 0 ? (
              todayNoise.map((item) => (
                <NeoCard key={item.id} style={styles.notifCard}>
                  <View style={styles.notifHeader}>
                    <View style={styles.iconCircle}>{getIconForType(item.type)}</View>

                    <View style={styles.titleCol}>
                      <View style={styles.titleRow}>
                        <Text style={styles.notifTitle}>{item.title}</Text>
                        <View style={styles.timeRow}>
                          <Text style={styles.timeText}>{item.time}</Text>
                          {item.unread && <View style={styles.unreadRedDot} />}
                        </View>
                      </View>
                      <Text style={styles.notifBody}>{item.body}</Text>

                      {item.tags && item.tags.length > 0 && (
                        <View style={styles.tagsRow}>
                          {item.tags.map((tag, idx) => (
                            <View
                              key={idx}
                              style={[
                                styles.tagPill,
                                tag === 'BUDGET'
                                  ? styles.tagYellow
                                  : tag === 'HIGH SPEND'
                                  ? styles.tagGray
                                  : styles.tagBlue,
                              ]}
                            >
                              <Text style={styles.tagText}>{tag}</Text>
                            </View>
                          ))}
                        </View>
                      )}
                    </View>
                  </View>
                </NeoCard>
              ))
            ) : (
              <NeoCard style={styles.emptyCard}>
                <Text style={styles.emptyText}>No active noise right now!</Text>
              </NeoCard>
            )}
          </View>

          {/* Yesterday Section */}
          {yesterdayNoise.length > 0 && (
            <View style={styles.yesterdaySection}>
              <Text style={styles.sectionTitle}>YESTERDAY</Text>
              <View style={styles.cardsList}>
                {yesterdayNoise.map((item) => (
                  <NeoCard key={item.id} style={styles.notifCard}>
                    <View style={styles.notifHeader}>
                      <View style={styles.iconCircle}>{getIconForType(item.type)}</View>

                      <View style={styles.titleCol}>
                        <View style={styles.titleRow}>
                          <Text style={styles.notifTitle}>{item.title}</Text>
                          <Text style={styles.timeText}>{item.time}</Text>
                        </View>
                        <Text style={styles.notifBody}>{item.body}</Text>

                        {item.tags && item.tags.length > 0 && (
                          <View style={styles.tagsRow}>
                            {item.tags.map((tag, idx) => (
                              <View key={idx} style={[styles.tagPill, styles.tagBlue]}>
                                <Text style={styles.tagText}>{tag}</Text>
                              </View>
                            ))}
                          </View>
                        )}
                      </View>
                    </View>
                  </NeoCard>
                ))}
              </View>
            </View>
          )}
        </ScrollView>

        <BottomNavBar />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAF7E8',
  },
  container: {
    flex: 1,
    position: 'relative',
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 110,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: '#FFF',
    borderWidth: 2.5,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: '900',
    fontStyle: 'italic',
    color: '#000',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: '#666',
    letterSpacing: 0.5,
  },
  clearAllText: {
    fontSize: 12,
    fontWeight: '900',
    textDecorationLine: 'underline',
    color: '#000',
  },
  cardsList: {
    gap: 14,
  },
  notifCard: {
    backgroundColor: '#FFF',
    padding: 16,
  },
  emptyCard: {
    backgroundColor: '#FFF',
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#777',
  },
  notifHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FAF7E8',
    borderWidth: 2,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  titleCol: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  notifTitle: {
    fontSize: 15,
    fontWeight: '900',
    fontStyle: 'italic',
    color: '#000',
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#888',
    marginRight: 6,
  },
  unreadRedDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF4D4D',
  },
  notifBody: {
    fontSize: 13,
    fontWeight: '600',
    color: '#444',
    lineHeight: 18,
    marginBottom: 8,
  },
  tagsRow: {
    flexDirection: 'row',
    gap: 6,
  },
  tagPill: {
    borderWidth: 1.5,
    borderColor: '#000',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  tagYellow: {
    backgroundColor: '#FFC700',
  },
  tagGray: {
    backgroundColor: '#E5E5E5',
  },
  tagBlue: {
    backgroundColor: '#D8E9FE',
  },
  tagText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#000',
  },
  yesterdaySection: {
    marginTop: 24,
  },
});
