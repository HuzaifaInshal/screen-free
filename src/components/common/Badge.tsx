import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, RADIUS, SPACING, FONTS } from '../../constants/theme';

interface BadgeProps {
  label: string;
  color?: string;
  variant?: 'solid' | 'outline';
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  color = COLORS.primary,
  variant = 'solid',
}) => {
  return (
    <View
      style={[
        styles.badge,
        variant === 'solid'
          ? { backgroundColor: `${color}25`, borderColor: `${color}50` }
          : { backgroundColor: 'transparent', borderColor: color },
      ]}
    >
      <Text style={[styles.text, { color }]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: SPACING.sm + 2,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    alignSelf: 'flex-start',
    marginRight: SPACING.xs,
  },
  text: {
    fontSize: FONTS.size.xs,
    fontWeight: FONTS.weight.semibold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
