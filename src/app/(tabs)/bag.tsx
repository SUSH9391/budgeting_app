import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAppState } from '../../context/AppStateContext';
import { NeoCard } from '../../components/NeoCard';
import { NeoButton } from '../../components/NeoButton';

export default function BagScreen() {
  const router = useRouter();
  const { subscriptions, leftToSpend, budgetLimit, toggleSubscription, addSubscription } = useAppState();

  const [modalVisible, setModalVisible] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newDays, setNewDays] = useState('');

  const activeCount = subscriptions.filter((s) => s.active).length;
  const progressPercent = Math.min(100, Math.max(0, (leftToSpend / (budgetLimit || 2500)) * 100));

  const handleAddSub = () => {
    if (!newTitle || !newAmount) return;
    const amt = parseFloat(newAmount) || 14.99;
    const days = parseInt(newDays) || 7;

    const colors = ['#FF4D4D', '#2ECC71', '#A55EA5', '#3498DB', '#F1C40F'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    addSubscription({
      title: newTitle.toUpperCase(),
      amount: amt,
      dueText: `Due in ${days} days`,
      dueDays: days,
      active: true,
      color: randomColor,
      icon: 'card-outline',
    });

    setNewTitle('');
    setNewAmount('');
    setNewDays('');
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Top Header */}
        <View style={styles.headerRow}>
          <Text style={styles.screenTitle}>MY BAG</Text>
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => setModalVisible(true)}
            activeOpacity={0.8}
          >
            <Ionicons name="add" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        {/* Left To Spend Mint Card */}
        <NeoCard backgroundColor="#7DF4B2" style={styles.spendCard}>
          <View style={styles.spendHeader}>
            <View>
              <Text style={styles.spendLabel}>LEFT TO SPEND</Text>
              <Text style={styles.spendAmount}>
                ${leftToSpend.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </Text>
            </View>
            <View style={styles.smileyBadge}>
              <Text style={styles.smileyText}>😊</Text>
            </View>
          </View>

          {/* Progress Bar Container */}
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
          </View>

          <View style={styles.spendFooter}>
            <Text style={styles.safeZoneText}>SAFE ZONE</Text>
            <TouchableOpacity onPress={() => router.push('/budget-goal' as any)}>
              <Text style={styles.totalLimitText}>${(budgetLimit / 1000).toFixed(1)}K TOTAL</Text>
            </TouchableOpacity>
          </View>
        </NeoCard>

        {/* Auto-Burn Section */}
        <View style={styles.autoBurnSection}>
          <View style={styles.autoBurnHeader}>
            <Text style={styles.autoBurnTitle}>AUTO-BURN 🛈</Text>
            <View style={styles.activePill}>
              <Text style={styles.activePillText}>{activeCount} ACTIVE</Text>
            </View>
          </View>

          <View style={styles.subList}>
            {subscriptions.map((sub) => (
              <TouchableOpacity
                key={sub.id}
                activeOpacity={0.9}
                onPress={() => toggleSubscription(sub.id)}
              >
                <NeoCard
                  style={[
                    styles.subCard,
                    { borderLeftWidth: 8, borderLeftColor: sub.color },
                    !sub.active && styles.subInactive,
                  ]}
                >
                  <View style={styles.subRow}>
                    <View style={styles.subIconCircle}>
                      <Ionicons name={sub.icon as any || 'card-outline'} size={20} color="#FFF" />
                    </View>

                    <View style={styles.subMainInfo}>
                      <Text style={styles.subTitle}>{sub.title}</Text>
                      <Text style={styles.subDue}>{sub.dueText}</Text>
                    </View>

                    <Text style={styles.subPrice}>${sub.amount.toFixed(2)}</Text>
                  </View>
                </NeoCard>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Add Subscription Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>ADD AUTO-BURN SUB</Text>

            <TextInput
              style={styles.modalInput}
              placeholder="Subscription Name (e.g. HBO Max)"
              placeholderTextColor="#777"
              value={newTitle}
              onChangeText={setNewTitle}
            />

            <TextInput
              style={styles.modalInput}
              placeholder="Monthly Price (e.g. 14.99)"
              placeholderTextColor="#777"
              keyboardType="decimal-pad"
              value={newAmount}
              onChangeText={setNewAmount}
            />

            <TextInput
              style={styles.modalInput}
              placeholder="Days until due (e.g. 5)"
              placeholderTextColor="#777"
              keyboardType="number-pad"
              value={newDays}
              onChangeText={setNewDays}
            />

            <View style={styles.modalBtnRow}>
              <NeoButton
                title="CANCEL"
                backgroundColor="#FFF"
                onPress={() => setModalVisible(false)}
                style={{ flex: 1, marginRight: 8 }}
              />
              <NeoButton
                title="ADD SUB"
                backgroundColor="#FFC700"
                onPress={handleAddSub}
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
    backgroundColor: '#FAF7E8',
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 110,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: '900',
    fontStyle: 'italic',
    color: '#000',
  },
  addBtn: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: '#FFF',
    borderWidth: 2.5,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  spendCard: {
    marginBottom: 28,
    padding: 20,
  },
  spendHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  spendLabel: {
    fontSize: 11,
    fontWeight: '900',
    color: '#000',
    letterSpacing: 0.5,
  },
  spendAmount: {
    fontSize: 38,
    fontWeight: '900',
    color: '#000',
  },
  smileyBadge: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFF',
    borderWidth: 2,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  smileyText: {
    fontSize: 22,
  },
  progressTrack: {
    height: 12,
    backgroundColor: '#FFF',
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#000',
  },
  spendFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  safeZoneText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#000',
  },
  totalLimitText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#000',
    textDecorationLine: 'underline',
  },
  autoBurnSection: {},
  autoBurnHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  autoBurnTitle: {
    fontSize: 18,
    fontWeight: '900',
    fontStyle: 'italic',
    color: '#000',
  },
  activePill: {
    backgroundColor: '#FFC700',
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  activePillText: {
    fontSize: 11,
    fontWeight: '900',
    fontStyle: 'italic',
    color: '#000',
  },
  subList: {
    gap: 14,
  },
  subCard: {
    backgroundColor: '#FFF',
    padding: 16,
  },
  subInactive: {
    opacity: 0.5,
  },
  subRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  subIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  subMainInfo: {
    flex: 1,
  },
  subTitle: {
    fontSize: 16,
    fontWeight: '900',
    fontStyle: 'italic',
    color: '#000',
  },
  subDue: {
    fontSize: 12,
    fontWeight: '600',
    fontStyle: 'italic',
    color: '#666',
  },
  subPrice: {
    fontSize: 18,
    fontWeight: '900',
    color: '#000',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    backgroundColor: '#FAF7E8',
    borderRadius: 24,
    borderWidth: 3,
    borderColor: '#000',
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '900',
    fontStyle: 'italic',
    color: '#000',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalInput: {
    backgroundColor: '#FFF',
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 12,
  },
  modalBtnRow: {
    flexDirection: 'row',
    marginTop: 8,
  },
});
