import React, { useEffect } from 'react';
import { StyleSheet, View, Text, SafeAreaView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { NeoCard } from '../components/NeoCard';

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/' as any);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <TouchableOpacity
        style={styles.container}
        activeOpacity={1}
        onPress={() => router.replace('/' as any)}
      >
        {/* Floating Accents */}
        <View style={[styles.accent, { top: 60, left: 30 }]}>
          <Ionicons name="flash" size={32} color="#FFC700" />
        </View>

        <View style={[styles.accent, { top: 180, right: 40 }]}>
          <Ionicons name="cloud-outline" size={48} color="#C4E0E5" />
        </View>

        <View style={[styles.accent, { bottom: 80, right: 30 }]}>
          <View style={styles.dottedCircle}>
            <Text style={styles.dottedText}>!</Text>
          </View>
        </View>

        {/* Center Card */}
        <NeoCard style={styles.splashCard}>
          <View style={styles.micBadge}>
            <Ionicons name="mic" size={28} color="#000" />
          </View>

          <Text style={styles.title}>SPARK</Text>
          <Text style={styles.subtitle}>VIBE-CHECK YOUR SPEND</Text>

          {/* Loading Track */}
          <View style={styles.loadingTrack}>
            <View style={styles.loadingFill} />
          </View>

          <Text style={styles.loadingText}>LOADING ALPHA 2.0...</Text>
        </NeoCard>
      </TouchableOpacity>
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
    paddingHorizontal: 24,
    position: 'relative',
  },
  accent: {
    position: 'absolute',
  },
  dottedCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#FFC700',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dottedText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFC700',
  },
  splashCard: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: '#FFF',
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 24,
  },
  micBadge: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: '#FFC700',
    borderWidth: 3,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    fontStyle: 'italic',
    color: '#000',
    letterSpacing: 1,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 11,
    fontWeight: '900',
    fontStyle: 'italic',
    color: '#666',
    letterSpacing: 0.5,
    marginBottom: 28,
  },
  loadingTrack: {
    width: '100%',
    height: 10,
    backgroundColor: '#FAF7E8',
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 12,
  },
  loadingFill: {
    width: '65%',
    height: '100%',
    backgroundColor: '#000',
  },
  loadingText: {
    fontSize: 10,
    fontWeight: '900',
    fontStyle: 'italic',
    color: '#000',
    letterSpacing: 0.5,
  },
});
