import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LimitingModeType } from '../../types/mode';
import { COLORS, RADIUS, SPACING, FONTS } from '../../constants/theme';

interface ModeOption {
  type: LimitingModeType;
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  badge: string;
}

const MODES: ModeOption[] = [
  {
    type: 'SIMPLE_SCHEDULE',
    title: 'Simple Time Window',
    subtitle: 'Restrict access during fixed time windows (e.g. 6 PM – 6 AM on weekdays or all days)',
    icon: 'time-outline',
    color: COLORS.secondary,
    badge: 'Window Lock',
  },
  {
    type: 'PER_TIMEFRAME_QUOTA',
    title: 'Timeframe Session Limit',
    subtitle: 'Restrict app usage e.g. 2 hrs/day OR 15 minutes each hour during active slots (1-3 & 5-9 PM)',
    icon: 'hourglass-outline',
    color: COLORS.primary,
    badge: 'Session Quota',
  },
  {
    type: 'FOCUS_INTERVAL',
    title: 'Strict Focus & Cooldown',
    subtitle: 'Enforce continuous session locks (25m focus / 10m break) & hard bedtime restrictions',
    icon: 'flame-outline',
    color: COLORS.danger,
    badge: 'Interval Lock',
  },
];

interface ModeSelectorCardProps {
  selectedMode: LimitingModeType;
  onSelectMode: (mode: LimitingModeType) => void;
}

export const ModeSelectorCard: React.FC<ModeSelectorCardProps> = ({
  selectedMode,
  onSelectMode,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Choose Restriction Mode</Text>
      {MODES.map(mode => {
        const isSelected = selectedMode === mode.type;
        return (
          <TouchableOpacity
            key={mode.type}
            onPress={() => onSelectMode(mode.type)}
            activeOpacity={0.8}
            style={[
              styles.card,
              isSelected && { borderColor: mode.color, backgroundColor: 'rgba(20, 24, 45, 0.95)' },
            ]}
          >
            <View style={[styles.iconBox, { backgroundColor: `${mode.color}20` }]}>
              <Ionicons name={mode.icon} size={24} color={mode.color} />
            </View>
            <View style={styles.textContainer}>
              <View style={styles.headerRow}>
                <Text style={styles.title}>{mode.title}</Text>
                <View style={[styles.badge, { backgroundColor: mode.color }]}>
                  <Text style={styles.badgeText}>{mode.badge}</Text>
                </View>
              </View>
              <Text style={styles.subtitle}>{mode.subtitle}</Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: SPACING.xs,
  },
  sectionTitle: {
    color: COLORS.textSecondary,
    fontSize: FONTS.size.sm,
    fontWeight: FONTS.weight.semibold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: SPACING.xs,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginVertical: SPACING.xs,
    borderWidth: 1.5,
    borderColor: COLORS.borderSubtle,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  textContainer: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: FONTS.size.md,
    fontWeight: FONTS.weight.bold,
    color: COLORS.textPrimary,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
  },
  badgeText: {
    color: '#0b0d19',
    fontSize: 10,
    fontWeight: FONTS.weight.bold,
  },
  subtitle: {
    fontSize: FONTS.size.xs,
    color: COLORS.textSecondary,
    marginTop: 4,
    lineHeight: 16,
  },
});
