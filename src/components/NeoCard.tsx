import React from 'react';
import { StyleSheet, View, ViewStyle, StyleProp } from 'react-native';

interface NeoCardProps {
  children: React.ReactNode;
  backgroundColor?: string;
  borderColor?: string;
  style?: StyleProp<ViewStyle>;
  noShadow?: boolean;
}

export const NeoCard: React.FC<NeoCardProps> = ({
  children,
  backgroundColor = '#FFFFFF',
  borderColor = '#000000',
  style,
  noShadow = false,
}) => {
  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor,
          borderColor,
        },
        !noShadow && styles.shadow,
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderWidth: 2.5,
    borderRadius: 20,
    padding: 16,
  },
  shadow: {
    shadowColor: '#000000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 6,
  },
});
