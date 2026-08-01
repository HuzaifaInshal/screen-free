import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { formatHourLabel } from '../../utils/timeUtils';
import { COLORS, RADIUS, SPACING, FONTS } from '../../constants/theme';

interface HourSlotGridPickerProps {
  selectedHours: number[]; // Array of selected hours (0-23)
  onChange: (hours: number[]) => void;
  maxQuotaMinutes?: number;
}

export const HourSlotGridPicker: React.FC<HourSlotGridPickerProps> = ({
  selectedHours,
  onChange,
  maxQuotaMinutes = 15,
}) => {
  const toggleHour = (hour: number) => {
    if (selectedHours.includes(hour)) {
      onChange(selectedHours.filter(h => h !== hour).sort((a, b) => a - b));
    } else {
      onChange([...selectedHours, hour].sort((a, b) => a - b));
    }
  };

  const selectPresetRange = (start: number, end: number) => {
    const range: number[] = [];
    for (let h = start; h <= end; h++) {
      range.push(h);
    }
    const merged = Array.from(new Set([...selectedHours, ...range])).sort((a, b) => a - b);
    onChange(merged);
  };

  const clearSelection = () => onChange([]);

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.label}>Select Active Timeframe Slots</Text>
        <TouchableOpacity onPress={clearSelection}>
          <Text style={styles.clearText}>Clear All</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.subtext}>
        Selected hours will enforce a limit of {maxQuotaMinutes} mins per hour slot.
      </Text>

      {/* Quick Slot Presets */}
      <View style={styles.presetRow}>
        <TouchableOpacity
          style={styles.presetChip}
          onPress={() => selectPresetRange(13, 15)}
        >
          <Text style={styles.presetText}>+ 1 PM – 3 PM</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.presetChip}
          onPress={() => selectPresetRange(17, 21)}
        >
          <Text style={styles.presetText}>+ 5 PM – 9 PM</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.presetChip}
          onPress={() => selectPresetRange(9, 17)}
        >
          <Text style={styles.presetText}>+ Work Hours (9-5)</Text>
        </TouchableOpacity>
      </View>

      {/* 24 Hour Slots Visual Grid */}
      <View style={styles.grid}>
        {Array.from({ length: 24 }).map((_, hour) => {
          const isSelected = selectedHours.includes(hour);
          return (
            <TouchableOpacity
              key={hour}
              onPress={() => toggleHour(hour)}
              activeOpacity={0.7}
              style={[
                styles.slotChip,
                isSelected && styles.slotChipSelected,
              ]}
            >
              <Text
                style={[
                  styles.slotText,
                  isSelected && styles.slotTextSelected,
                ]}
              >
                {formatHourLabel(hour)}
              </Text>
              {isSelected && (
                <View style={styles.indicatorBadge}>
                  <Text style={styles.indicatorText}>{maxQuotaMinutes}m</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: SPACING.sm,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    color: COLORS.textSecondary,
    fontSize: FONTS.size.sm,
    fontWeight: FONTS.weight.semibold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  subtext: {
    color: COLORS.textMuted,
    fontSize: FONTS.size.xs,
    marginVertical: 4,
  },
  clearText: {
    color: COLORS.primary,
    fontSize: FONTS.size.xs,
    fontWeight: FONTS.weight.semibold,
  },
  presetRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: SPACING.xs,
  },
  presetChip: {
    backgroundColor: 'rgba(0, 242, 254, 0.1)',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: RADIUS.xs,
    marginRight: SPACING.xs,
    marginBottom: SPACING.xs,
    borderWidth: 1,
    borderColor: COLORS.borderGlow,
  },
  presetText: {
    color: COLORS.primary,
    fontSize: FONTS.size.xs,
    fontWeight: FONTS.weight.medium,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: SPACING.xs,
  },
  slotChip: {
    width: '23%',
    paddingVertical: SPACING.xs + 2,
    marginVertical: 4,
    borderRadius: RADIUS.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  slotChipSelected: {
    backgroundColor: COLORS.secondary,
    borderColor: '#e100ff',
  },
  slotText: {
    color: COLORS.textSecondary,
    fontSize: FONTS.size.xs,
    fontWeight: FONTS.weight.medium,
  },
  slotTextSelected: {
    color: '#ffffff',
    fontWeight: FONTS.weight.bold,
  },
  indicatorBadge: {
    marginTop: 2,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    paddingHorizontal: 4,
    borderRadius: 4,
  },
  indicatorText: {
    color: COLORS.accent,
    fontSize: 9,
    fontWeight: FONTS.weight.bold,
  },
});
