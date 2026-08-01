import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { COLORS, RADIUS, SPACING, SHADOWS } from '../../constants/theme';

interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  glowColor?: string;
  variant?: 'glass' | 'solid' | 'bordered';
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  glowColor,
  variant = 'glass',
}) => {
  const getVariantStyle = () => {
    switch (variant) {
      case 'solid':
        return styles.solidCard;
      case 'bordered':
        return styles.borderedCard;
      default:
        return styles.glassCard;
    }
  };

  return (
    <View
      style={[
        styles.card,
        getVariantStyle(),
        glowColor ? { borderColor: glowColor, borderRightWidth: 3 } : null,
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginVertical: SPACING.xs,
    overflow: 'hidden',
  },
  glassCard: {
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    ...SHADOWS.glassCard,
  },
  solidCard: {
    backgroundColor: COLORS.bgModal,
  },
  borderedCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: COLORS.borderGlow,
  },
});
