import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAppState } from '../context/AppStateContext';
import { NeoCard } from '../components/NeoCard';
import { NeoButton } from '../components/NeoButton';

export default function BudgetGoalScreen() {
  const router = useRouter();
  const { budgetLimit, setBudgetLimit } = useAppState();
  const [currentLimit, setCurrentLimit] = useState(budgetLimit || 25000);

  const handleSliderStep = (step: number) => {
    const val = Math.min(50000, Math.max(10000, currentLimit + step));
    setCurrentLimit(val);
  };

  const handleLockIn = () => {
    setBudgetLimit(currentLimit);
    router.back();
  };

  // Compute percentage for slider positioning
  const sliderPercent = ((currentLimit - 10000) / 40000) * 100;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header Row */}
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.8}>
            <Ionicons name="arrow-back" size={22} color="#000" />
          </TouchableOpacity>
          <Text style={styles.screenTitle}>BUDGET GOAL</Text>
        </View>

        {/* Readout Display */}
        <View style={styles.readoutSection}>
          <Text style={styles.readoutLabel}>MONTHLY BURN LIMIT</Text>
          <Text style={styles.readoutValue}>${currentLimit.toLocaleString()}</Text>
        </View>

        {/* Slider Card */}
        <NeoCard style={styles.sliderCard}>
          <View style={styles.rangeLabelsRow}>
            <Text style={styles.rangeText}>10K</Text>
            <Text style={styles.rangeCenterText}>LIMIT RANGE</Text>
            <Text style={styles.rangeText}>50K</Text>
          </View>

          {/* Interactive Custom Neo Slider */}
          <View style={styles.sliderTrackContainer}>
            <TouchableOpacity style={styles.stepBtn} onPress={() => handleSliderStep(-2500)}>
              <Ionicons name="remove" size={18} color="#000" />
            </TouchableOpacity>

            <View style={styles.sliderTrack}>
              <View style={[styles.sliderFill, { width: `${sliderPercent}%` }]} />
              <View style={[styles.sliderThumb, { left: `${Math.min(92, Math.max(0, sliderPercent - 4))}%` }]}>
                <View style={styles.thumbDot} />
              </View>
            </View>

            <TouchableOpacity style={styles.stepBtn} onPress={() => handleSliderStep(2500)}>
              <Ionicons name="add" size={18} color="#000" />
            </TouchableOpacity>
          </View>

          {/* Alert Callout */}
          <View style={styles.alertBox}>
            <Ionicons name="warning" size={22} color="#000" style={styles.alertIcon} />
            <Text style={styles.alertText}>
              SET IT HIGH FOR BIG VIBES, LOW FOR TRUE SAVINGS. YOUR CHOICE, BALLER.
            </Text>
          </View>
        </NeoCard>

        {/* Action Buttons */}
        <NeoButton
          title="LOCK IT IN"
          backgroundColor="#000000"
          textColor="#FFFFFF"
          onPress={handleLockIn}
          style={styles.lockBtn}
        />

        <TouchableOpacity onPress={() => router.back()} style={styles.maybeBtn}>
          <Text style={styles.maybeText}>MAYBE LATER</Text>
        </TouchableOpacity>
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
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
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
    fontSize: 26,
    fontWeight: '900',
    fontStyle: 'italic',
    color: '#000',
  },
  readoutSection: {
    alignItems: 'center',
    marginBottom: 36,
  },
  readoutLabel: {
    fontSize: 11,
    fontWeight: '900',
    color: '#666',
    letterSpacing: 1,
    marginBottom: 8,
  },
  readoutValue: {
    fontSize: 48,
    fontWeight: '900',
    fontStyle: 'italic',
    color: '#000',
  },
  sliderCard: {
    backgroundColor: '#FFF',
    padding: 20,
    marginBottom: 32,
  },
  rangeLabelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  rangeText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#000',
  },
  rangeCenterText: {
    fontSize: 11,
    fontWeight: '900',
    fontStyle: 'italic',
    color: '#666',
  },
  sliderTrackContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 24,
  },
  stepBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#FAF7E8',
    borderWidth: 2,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sliderTrack: {
    flex: 1,
    height: 14,
    backgroundColor: '#FAF7E8',
    borderWidth: 2.5,
    borderColor: '#000',
    borderRadius: 7,
    position: 'relative',
    justifyContent: 'center',
  },
  sliderFill: {
    height: '100%',
    backgroundColor: '#FFC700',
    borderRadius: 5,
  },
  sliderThumb: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#FFC700',
    borderWidth: 2.5,
    borderColor: '#000',
    top: -8,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  thumbDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#000',
  },
  alertBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF7E8',
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 14,
    padding: 14,
  },
  alertIcon: {
    marginRight: 10,
  },
  alertText: {
    flex: 1,
    fontSize: 11,
    fontWeight: '900',
    color: '#000',
    lineHeight: 15,
  },
  lockBtn: {
    marginBottom: 16,
  },
  maybeBtn: {
    alignSelf: 'center',
    paddingVertical: 8,
  },
  maybeText: {
    fontSize: 13,
    fontWeight: '900',
    fontStyle: 'italic',
    color: '#000',
    textDecorationLine: 'underline',
  },
});
