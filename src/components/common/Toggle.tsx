import React from 'react';
import { Switch, View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS, SPACING } from '../../constants/theme';

interface ToggleProps {
  value: boolean;
  onValueChange: (val: boolean) => void;
  label?: string;
  sublabel?: string;
}

export const Toggle: React.FC<ToggleProps> = ({
  value,
  onValueChange,
  label,
  sublabel,
}) => {
  return (
    <View style={styles.container}>
      {label && (
        <View style={styles.textContainer}>
          <Text style={styles.label}>{label}</Text>
          {sublabel && <Text style={styles.sublabel}>{sublabel}</Text>}
        </View>
      )}
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: '#2d3748', true: COLORS.primary }}
        thumbColor={value ? '#ffffff' : '#a0aec0'}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.xs,
  },
  textContainer: {
    flex: 1,
    paddingRight: SPACING.md,
  },
  label: {
    color: COLORS.textPrimary,
    fontSize: FONTS.size.md,
    fontWeight: FONTS.weight.medium,
  },
  sublabel: {
    color: COLORS.textSecondary,
    fontSize: FONTS.size.xs,
    marginTop: 2,
  },
});
