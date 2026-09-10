import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export const BottomNavBar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();

  const tabs = [
    { name: 'home', route: '/', icon: 'home' as const, outline: 'home-outline' as const },
    { name: 'insights', route: '/insights', icon: 'bar-chart' as const, outline: 'bar-chart-outline' as const },
    { name: 'bag', route: '/bag', icon: 'wallet' as const, outline: 'wallet-outline' as const },
    { name: 'settings', route: '/settings', icon: 'settings' as const, outline: 'settings-outline' as const },
  ];

  const isTabActive = (route: string) => {
    if (route === '/' && (pathname === '/' || pathname === '/index')) return true;
    return pathname.startsWith(route) && route !== '/';
  };

  return (
    <View style={styles.container}>
      <View style={styles.barContainer}>
        <View style={styles.bar}>
          {tabs.map((tab) => {
            const active = isTabActive(tab.route);
            return (
              <TouchableOpacity
                key={tab.name}
                activeOpacity={0.8}
                onPress={() => {
                  if (!active) {
                    router.push(tab.route as any);
                  }
                }}
                style={styles.tabButton}
              >
                <View style={[styles.iconWrapper, active && styles.activePill]}>
                  <Ionicons
                    name={active ? tab.icon : tab.outline}
                    size={22}
                    color={active ? '#000000' : '#FFFFFF'}
                  />
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 24,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 1000,
  },
  barContainer: {
    shadowColor: '#000000',
    shadowOffset: { width: 3, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 8,
  },
  bar: {
    flexDirection: 'row',
    backgroundColor: '#000000',
    borderRadius: 24,
    borderWidth: 2.5,
    borderColor: '#000000',
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'space-between',
    width: 260,
  },
  tabButton: {
    paddingHorizontal: 6,
  },
  iconWrapper: {
    width: 44,
    height: 40,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activePill: {
    backgroundColor: '#FFC700',
    borderWidth: 2,
    borderColor: '#000000',
  },
});
