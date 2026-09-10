import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { NeoCard } from '../components/NeoCard';
import { NeoButton } from '../components/NeoButton';

export default function AuthScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('alex@vibe.com');
  const [password, setPassword] = useState('••••••••');

  const handleLogin = () => {
    router.replace('/' as any);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        {/* Floating Spark Accent Icons */}
        <View style={[styles.sparkIcon, { top: 40, left: 30 }]}>
          <Ionicons name="flash" size={28} color="#FFC700" />
        </View>
        <View style={[styles.sparkIcon, { bottom: 40, right: 30 }]}>
          <Ionicons name="star" size={24} color="#FF8A8A" />
        </View>

        <NeoCard style={styles.authCard}>
          <Text style={styles.title}>SPARK</Text>
          <Text style={styles.subtitle}>WELCOME BACK, BALLER 🛈</Text>

          {/* Email Field */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>THE DIGITAL TAG (EMAIL)</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Password Field */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>THE SECRET CODE (PASSWORD)</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            <TouchableOpacity style={styles.forgotBtn}>
              <Text style={styles.forgotText}>FORGOT IT?</Text>
            </TouchableOpacity>
          </View>

          {/* Primary Submit Button */}
          <NeoButton
            title="LET'S BOUNCE!"
            backgroundColor="#FFC700"
            onPress={handleLogin}
            style={styles.submitBtn}
          />

          {/* Divider */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR VIBE WITH</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Social Icons */}
          <View style={styles.socialRow}>
            <TouchableOpacity style={styles.socialBtn} onPress={handleLogin}>
              <Text style={styles.socialIconText}>G</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialBtn} onPress={handleLogin}>
              <Ionicons name="logo-apple" size={22} color="#000" />
            </TouchableOpacity>
          </View>

          {/* Footer signup */}
          <View style={styles.footerRow}>
            <Text style={styles.footerText}>NEW TO THE CREW? </Text>
            <TouchableOpacity onPress={handleLogin}>
              <Text style={styles.joinText}>Join Spark</Text>
            </TouchableOpacity>
          </View>
        </NeoCard>
      </KeyboardAvoidingView>
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
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    position: 'relative',
  },
  sparkIcon: {
    position: 'absolute',
  },
  authCard: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#FFF',
    padding: 24,
  },
  title: {
    fontSize: 38,
    fontWeight: '900',
    fontStyle: 'italic',
    textAlign: 'center',
    color: '#000',
    letterSpacing: 1,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '900',
    fontStyle: 'italic',
    textAlign: 'center',
    color: '#666',
    marginBottom: 24,
  },
  fieldContainer: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '900',
    color: '#000',
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: '#FFF',
    borderWidth: 2.5,
    borderColor: '#000',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    fontWeight: '700',
    color: '#000',
  },
  forgotBtn: {
    alignSelf: 'flex-end',
    marginTop: 6,
  },
  forgotText: {
    fontSize: 11,
    fontWeight: '900',
    textDecorationLine: 'underline',
    color: '#000',
  },
  submitBtn: {
    marginTop: 10,
    marginBottom: 20,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  dividerLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#000',
  },
  dividerText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#000',
    paddingHorizontal: 10,
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 20,
  },
  socialBtn: {
    flex: 1,
    height: 48,
    backgroundColor: '#FFF',
    borderWidth: 2.5,
    borderColor: '#000',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  socialIconText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#000',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    fontWeight: '800',
    fontStyle: 'italic',
    color: '#666',
  },
  joinText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#000',
    textDecorationLine: 'underline',
  },
});
