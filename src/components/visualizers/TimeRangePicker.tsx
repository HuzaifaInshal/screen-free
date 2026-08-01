import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { formatHourLabel, formatTimeWindow, calculateWindowDuration } from '../../utils/timeUtils';
import { COLORS, RADIUS, SPACING, FONTS } from '../../constants/theme';

interface TimeRangePickerProps {
  startHour: number;
  endHour: number;
  onRangeChange: (start: number, end: number) => void;
}

export const TimeRangePicker: React.FC<TimeRangePickerProps> = ({
  startHour,
  endHour,
  onRangeChange,
}) => {
  const duration = calculateWindowDuration(startHour, endHour);

  const incrementStart = (delta: number) => {
    let next = (startHour + delta) % 24;
    if (next < 0) next += 24;
    onRangeChange(next, endHour);
  };

  const incrementEnd = (delta: number) => {
    let next = (endHour + delta) % 24;
    if (next < 0) next += 24;
    onRangeChange(startHour, next);
  };

  const applyPreset = (start: number, end: number) => {
    onRangeChange(start, end);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Restriction Time Window</Text>
      
      {/* Visual Window Header */}
      <View style={styles.windowCard}>
        <Text style={styles.rangeTitle}>{formatTimeWindow(startHour, endHour)}</Text>
        <View style={styles.durationBadge}>
          <Text style={styles.durationText}>{duration} hours locked</Text>
        </View>
      </View>

      {/* Quick Presets */}
      <View style={styles.presetRow}>
        <TouchableOpacity
          style={styles.presetPill}
          onPress={() => applyPreset(18, 6)}
        >
          <Text style={styles.presetText}>6 PM – 6 AM</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.presetPill}
          onPress={() => applyPreset(22, 6)}
        >
          <Text style={styles.presetText}>10 PM – 6 AM</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.presetPill}
          onPress={() => applyPreset(9, 17)}
        >
          <Text style={styles.presetText}>9 AM – 5 PM</Text>
        </TouchableOpacity>
      </View>

      {/* Interactive Picker Steppers */}
      <View style={styles.stepperContainer}>
        {/* Start Hour */}
        <View style={styles.stepperBox}>
          <Text style={styles.stepperLabel}>Start Lock</Text>
          <View style={styles.stepperRow}>
            <TouchableOpacity
              onPress={() => incrementStart(-1)}
              style={styles.stepperBtn}
            >
              <Ionicons name="remove" size={20} color={COLORS.primary} />
            </TouchableOpacity>
            <Text style={styles.hourValue}>{formatHourLabel(startHour)}</Text>
            <TouchableOpacity
              onPress={() => incrementStart(1)}
              style={styles.stepperBtn}
            >
              <Ionicons name="add" size={20} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Separator icon */}
        <Ionicons name="arrow-forward" size={20} color={COLORS.textMuted} style={styles.arrow} />

        {/* End Hour */}
        <View style={styles.stepperBox}>
          <Text style={styles.stepperLabel}>End Lock</Text>
          <View style={styles.stepperRow}>
            <TouchableOpacity
              onPress={() => incrementEnd(-1)}
              style={styles.stepperBtn}
            >
              <Ionicons name="remove" size={20} color={COLORS.primary} />
            </TouchableOpacity>
            <Text style={styles.hourValue}>{formatHourLabel(endHour)}</Text>
            <TouchableOpacity
              onPress={() => incrementEnd(1)}
              style={styles.stepperBtn}
            >
              <Ionicons name="add" size={20} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: SPACING.sm,
  },
  label: {
    color: COLORS.textSecondary,
    fontSize: FONTS.size.sm,
    fontWeight: FONTS.weight.semibold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: SPACING.xs,
  },
  windowCard: {
    backgroundColor: 'rgba(127, 0, 255, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(127, 0, 255, 0.4)',
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  rangeTitle: {
    fontSize: FONTS.size.xl,
    fontWeight: FONTS.weight.bold,
    color: COLORS.textPrimary,
  },
  durationBadge: {
    marginTop: 4,
    backgroundColor: COLORS.secondary,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
  },
  durationText: {
    color: '#ffffff',
    fontSize: FONTS.size.xs,
    fontWeight: FONTS.weight.bold,
  },
  presetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  presetPill: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.xs,
    alignItems: 'center',
    marginHorizontal: 3,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  presetText: {
    color: COLORS.textSecondary,
    fontSize: FONTS.size.xs,
    fontWeight: FONTS.weight.medium,
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stepperBox: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: RADIUS.sm,
    padding: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    alignItems: 'center',
  },
  stepperLabel: {
    color: COLORS.textMuted,
    fontSize: FONTS.size.xs,
    marginBottom: SPACING.xs,
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 242, 254, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hourValue: {
    color: COLORS.textPrimary,
    fontSize: FONTS.size.md,
    fontWeight: FONTS.weight.bold,
    marginHorizontal: SPACING.sm,
  },
  arrow: {
    marginHorizontal: SPACING.xs,
  },
});
