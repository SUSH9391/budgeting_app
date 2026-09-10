import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppState } from '../context/AppStateContext';

interface VoiceInputModalProps {
  visible: boolean;
  onClose: () => void;
}

export const VoiceInputModal: React.FC<VoiceInputModalProps> = ({ visible, onClose }) => {
  const { addTransaction } = useAppState();
  const [promptText, setPromptText] = useState('');
  const [isListening, setIsListening] = useState(false);

  const presets = [
    { title: 'PIZZA HUT', amount: 25.0, cat: 'CRAVINGS' as const, label: 'Food & Dranks', icon: 'pizza-outline' },
    { title: 'UBER RIDE', amount: 12.5, cat: 'MOVING' as const, label: "Vibin' & Movin'", icon: 'car-outline' },
    { title: 'THRIFT SHOP', amount: 45.0, cat: 'FUN STUFF' as const, label: 'Drip Check', icon: 'shirt-outline' },
    { title: 'WHOLE FOODS', amount: 65.0, cat: 'SURVIVAL' as const, label: 'Groceries', icon: 'cart-outline' },
  ];

  const handlePresetSelect = (preset: typeof presets[0]) => {
    addTransaction({
      title: preset.title,
      category: preset.cat,
      categoryLabel: preset.label,
      amount: preset.amount,
      date: 'Just now',
      badge: 'LEGIT',
      badgeType: 'legit',
      icon: preset.icon,
    });
    setPromptText('');
    onClose();
  };

  const handleSimulateVoice = () => {
    setIsListening(true);
    setPromptText('Listening...');
    setTimeout(() => {
      setPromptText('Spent $25 on pizza at Pizza Hut');
      setIsListening(false);
    }, 1500);
  };

  const handleSubmitText = () => {
    if (!promptText.trim()) return;

    // Parse amount from prompt or default to 20
    const match = promptText.match(/\$?(\d+(?:\.\d{1,2})?)/);
    const parsedAmount = match ? parseFloat(match[1]) : 20.0;

    let title = promptText.replace(/\$?(\d+(?:\.\d{1,2})?)/, '').replace(/spent|on|at|for/gi, '').trim().toUpperCase() || 'SPARK HIT';
    if (title.length > 18) title = title.substring(0, 18);

    let cat: 'CRAVINGS' | 'MOVING' | 'FUN STUFF' | 'SURVIVAL' = 'CRAVINGS';
    let label = 'Food & Dranks';
    let icon = 'pizza-outline';

    const lower = promptText.toLowerCase();
    if (lower.includes('uber') || lower.includes('car') || lower.includes('gas') || lower.includes('bus')) {
      cat = 'MOVING';
      label = "Vibin' & Movin'";
      icon = 'car-outline';
    } else if (lower.includes('thrift') || lower.includes('game') || lower.includes('fun') || lower.includes('movie')) {
      cat = 'FUN STUFF';
      label = 'Drip Check';
      icon = 'shirt-outline';
    } else if (lower.includes('grocery') || lower.includes('market') || lower.includes('pharmacy') || lower.includes('food')) {
      cat = 'SURVIVAL';
      label = 'Groceries';
      icon = 'cart-outline';
    }

    addTransaction({
      title,
      category: cat,
      categoryLabel: label,
      amount: parsedAmount,
      date: 'Just now',
      badge: 'LEGIT',
      badgeType: 'legit',
      icon,
    });

    setPromptText('');
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.modalContent}>
              <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
                <Ionicons name="close" size={24} color="#000" />
              </TouchableOpacity>

              <View style={styles.badgeTag}>
                <Text style={styles.badgeText}>{isListening ? 'AI LISTENING...' : 'AI READY'}</Text>
              </View>

              <Text style={styles.title}>SPEAK TO SPARK</Text>
              <Text style={styles.subtitle}>Say or type what you spent today</Text>

              <TouchableOpacity
                style={[styles.micCircle, isListening && styles.micListening]}
                onPress={handleSimulateVoice}
                activeOpacity={0.8}
              >
                <Ionicons name="mic" size={44} color="#FFFFFF" />
              </TouchableOpacity>

              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder='e.g. "I spent $25 on pizza"'
                  placeholderTextColor="#777"
                  value={promptText}
                  onChangeText={setPromptText}
                  onSubmitEditing={handleSubmitText}
                />
                <TouchableOpacity style={styles.sendBtn} onPress={handleSubmitText}>
                  <Ionicons name="arrow-up" size={20} color="#000" />
                </TouchableOpacity>
              </View>

              <Text style={styles.quickTitle}>QUICK VIBE LOGS:</Text>
              <View style={styles.presetRow}>
                {presets.map((p, idx) => (
                  <TouchableOpacity
                    key={idx}
                    style={styles.presetChip}
                    onPress={() => handlePresetSelect(p)}
                  >
                    <Text style={styles.presetText}>+ ${p.amount} {p.title}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FAF7E8',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    borderWidth: 3,
    borderColor: '#000',
    padding: 24,
    alignItems: 'center',
  },
  closeBtn: {
    position: 'absolute',
    top: 16,
    right: 20,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFF',
    borderWidth: 2,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeTag: {
    backgroundColor: '#FFC700',
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginBottom: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '900',
    fontStyle: 'italic',
  },
  title: {
    fontSize: 26,
    fontWeight: '900',
    fontStyle: 'italic',
    color: '#000',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
    marginBottom: 20,
  },
  micCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#000',
    borderWidth: 3,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 3, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 6,
  },
  micListening: {
    backgroundColor: '#FF4D4D',
    transform: [{ scale: 1.08 }],
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    backgroundColor: '#FFF',
    borderWidth: 2.5,
    borderColor: '#000',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    fontWeight: '700',
    color: '#000',
    marginRight: 8,
  },
  sendBtn: {
    backgroundColor: '#FFC700',
    borderWidth: 2.5,
    borderColor: '#000',
    borderRadius: 16,
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickTitle: {
    fontSize: 12,
    fontWeight: '900',
    fontStyle: 'italic',
    color: '#333',
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  presetRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    width: '100%',
  },
  presetChip: {
    backgroundColor: '#FFF',
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  presetText: {
    fontSize: 13,
    fontWeight: '800',
    fontStyle: 'italic',
    color: '#000',
  },
});
