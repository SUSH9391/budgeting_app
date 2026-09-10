import React from 'react';
import { StyleSheet, Text, TouchableOpacity, ViewStyle, TextStyle, StyleProp, View } from 'react-native';

interface NeoButtonProps {
  title: string;
  onPress: () => void;
  backgroundColor?: string;
  textColor?: string;
  icon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export const NeoButton: React.FC<NeoButtonProps> = ({
  title,
  onPress,
  backgroundColor = '#FFC700',
  textColor = '#000000',
  icon,
  style,
  textStyle,
}) => {
  return (
    <TouchableOpacity activeOpacity={0.85} onPress={onPress} style={[styles.buttonWrapper, style]}>
      <View style={[styles.button, { backgroundColor }]}>
        {icon && <View style={styles.iconContainer}>{icon}</View>}
        <Text style={[styles.text, { color: textColor }, textStyle]}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonWrapper: {
    shadowColor: '#000000',
    shadowOffset: { width: 3, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 5,
  },
  button: {
    borderWidth: 2.5,
    borderColor: '#000000',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginRight: 8,
  },
  text: {
    fontWeight: '900',
    fontSize: 16,
    letterSpacing: 0.5,
    fontStyle: 'italic',
    textTransform: 'uppercase',
  },
});
