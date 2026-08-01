import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { DayOfWeek } from '../../types/mode';
import { DAYS_SHORT } from '../../utils/timeUtils';
import { COLORS, RADIUS, SPACING, FONTS } from '../../constants/theme';

interface DayOfWeekPickerProps {
  selectedDays: DayOfWeek[];
  onChange: (days: DayOfWeek[]) => void;
}

export const DayOfWeekPicker: React.FC<DayOfWeekPickerProps> = ({
  selectedDays,
  onChange,
}) => {
  const toggleDay = (day: DayOfWeek) => {
    if (selectedDays.includes(day)) {
      onChange(selectedDays.filter(d => d !== day));
    } else {
      onChange([...selectedDays, day].sort());
    }
  };

  const setPreset = (preset: 'ALL' | 'WEEKDAYS' | 'WEEKENDS') => {
    if (preset === 'ALL') onChange([0, 1, 2, 3, 4, 5, 6]);
    if (preset === 'WEEKDAYS') onChange([1, 2, 3, 4, 5]);
    if (preset === 'WEEKENDS') onChange([0, 6]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Select Days</Text>
      
      {/* Quick Presets */}
      <View style={styles.presetsRow}>
        <TouchableOpacity style={styles.presetChip} onPress={() => setPreset('ALL')}>
          <Text style={styles.presetText}>Everyday</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.presetChip} onPress={() => setPreset('WEEKDAYS')}>
          <Text style={styles.presetText}>Weekdays</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.presetChip} onPress={() => setPreset('WEEKENDS')}>
          <Text style={styles.presetText}>Weekends</Text>
        </TouchableOpacity>
      </View>

      {/* Day Chips Grid */}
      <View style={styles.daysGrid}>
        {DAYS_SHORT.map((dayName, index) => {
          const isSelected = selectedDays.includes(index as DayOfWeek);
          return (
            <TouchableOpacity
              key={dayName}
              onPress={() => toggleDay(index as DayOfWeek)}
              activeOpacity={0.7}
              style={[
                styles.dayChip,
                isSelected && styles.dayChipSelected,
              ]}
            >
              <Text
                style={[
                  styles.dayText,
                  isSelected && styles.dayTextSelected,
                ]}
              >
                {dayName}
              </Text>
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
  label: {
    color: COLORS.textSecondary,
    fontSize: FONTS.size.sm,
    fontWeight: FONTS.weight.semibold,
    marginBottom: SPACING.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  presetsRow: {
    flexDirection: 'row',
    marginBottom: SPACING.sm,
  },
  presetChip: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: SPACING.sm + 2,
    paddingVertical: 4,
    borderRadius: RADIUS.xs,
    marginRight: SPACING.xs,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  presetText: {
    color: COLORS.textSecondary,
    fontSize: FONTS.size.xs,
    fontWeight: FONTS.weight.medium,
  },
  daysGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayChip: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  dayChipSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  dayText: {
    color: COLORS.textSecondary,
    fontSize: FONTS.size.xs,
    fontWeight: FONTS.weight.bold,
  },
  dayTextSelected: {
    color: '#0b0d19',
  },
});
