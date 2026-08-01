import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { QuotaTimeframeConfig, DayOfWeek } from '../../types/mode';
import { HourSlotGridPicker } from '../visualizers/HourSlotGridPicker';
import { DayOfWeekPicker } from '../visualizers/DayOfWeekPicker';
import { AppSelectorGrid } from '../visualizers/AppSelectorGrid';
import { Button } from '../common/Button';
import { COLORS, RADIUS, SPACING, FONTS } from '../../constants/theme';

interface QuotaSessionFormProps {
  initialName?: string;
  initialAppIds?: string[];
  initialConfig?: QuotaTimeframeConfig;
  onSubmit: (data: { name: string; targetAppIds: string[]; config: QuotaTimeframeConfig }) => void;
  onCancel: () => void;
}

export const QuotaSessionForm: React.FC<QuotaSessionFormProps> = ({
  initialName = 'Social Session Quota',
  initialAppIds = ['com.facebook.katana', 'com.instagram.android'],
  initialConfig = {
    dailyLimitMinutes: 120, // 2 hrs / day
    slotLimitMinutes: 15,  // 15 mins each selected hour
    activeSlotHours: [13, 14, 15, 17, 18, 19, 20, 21], // 1-3 & 5-9 PM
    daysOfWeek: [1, 2, 3, 4, 5],
  },
  onSubmit,
  onCancel,
}) => {
  const [ruleName, setRuleName] = useState(initialName);
  const [selectedApps, setSelectedApps] = useState<string[]>(initialAppIds);
  const [dailyLimitMinutes, setDailyLimitMinutes] = useState(initialConfig.dailyLimitMinutes);
  const [slotLimitMinutes, setSlotLimitMinutes] = useState(initialConfig.slotLimitMinutes || 15);
  const [activeSlotHours, setActiveSlotHours] = useState<number[]>(initialConfig.activeSlotHours);
  const [daysOfWeek, setDaysOfWeek] = useState<DayOfWeek[]>(initialConfig.daysOfWeek);

  const handleSubmit = () => {
    onSubmit({
      name: ruleName.trim() || 'Timeframe Session Limit',
      targetAppIds: selectedApps,
      config: {
        dailyLimitMinutes,
        slotLimitMinutes,
        activeSlotHours,
        daysOfWeek,
      },
    });
  };

  return (
    <View style={styles.formContainer}>
      <Text style={styles.label}>Rule Name</Text>
      <TextInput
        style={styles.input}
        value={ruleName}
        onChangeText={setRuleName}
        placeholder="Enter rule name"
        placeholderTextColor={COLORS.textMuted}
      />

      {/* Quota Limit Selection Cards */}
      <View style={styles.row}>
        <View style={styles.col}>
          <Text style={styles.label}>Daily Total Limit</Text>
          <View style={styles.stepperBox}>
            <TouchableOpacity
              onPress={() => setDailyLimitMinutes(Math.max(15, dailyLimitMinutes - 15))}
              style={styles.btnSmall}
            >
              <Text style={styles.btnText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.valText}>{Math.floor(dailyLimitMinutes / 60)}h {dailyLimitMinutes % 60}m</Text>
            <TouchableOpacity
              onPress={() => setDailyLimitMinutes(dailyLimitMinutes + 15)}
              style={styles.btnSmall}
            >
              <Text style={styles.btnText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.col}>
          <Text style={styles.label}>Limit Per Slot</Text>
          <View style={styles.stepperBox}>
            <TouchableOpacity
              onPress={() => setSlotLimitMinutes(Math.max(5, slotLimitMinutes - 5))}
              style={styles.btnSmall}
            >
              <Text style={styles.btnText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.valText}>{slotLimitMinutes}m / hr</Text>
            <TouchableOpacity
              onPress={() => setSlotLimitMinutes(slotLimitMinutes + 5)}
              style={styles.btnSmall}
            >
              <Text style={styles.btnText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <HourSlotGridPicker
        selectedHours={activeSlotHours}
        onChange={setActiveSlotHours}
        maxQuotaMinutes={slotLimitMinutes}
      />

      <DayOfWeekPicker
        selectedDays={daysOfWeek}
        onChange={setDaysOfWeek}
      />

      <AppSelectorGrid
        selectedAppIds={selectedApps}
        onChange={setSelectedApps}
      />

      <View style={styles.btnRow}>
        <Button
          title="Cancel"
          variant="outline"
          onPress={onCancel}
          style={{ flex: 1, marginRight: SPACING.xs }}
        />
        <Button
          title="Save Quota Rule"
          variant="primary"
          icon="checkmark-circle"
          onPress={handleSubmit}
          style={{ flex: 2, marginLeft: SPACING.xs }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    paddingVertical: SPACING.xs,
  },
  label: {
    color: COLORS.textSecondary,
    fontSize: FONTS.size.sm,
    fontWeight: FONTS.weight.semibold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    borderRadius: RADIUS.sm,
    padding: SPACING.sm + 2,
    color: COLORS.textPrimary,
    fontSize: FONTS.size.md,
    marginBottom: SPACING.md,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  col: {
    width: '48%',
  },
  stepperBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    borderRadius: RADIUS.sm,
    padding: SPACING.xs,
  },
  btnSmall: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 242, 254, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    color: COLORS.primary,
    fontSize: 18,
    fontWeight: 'bold',
  },
  valText: {
    color: COLORS.textPrimary,
    fontSize: FONTS.size.sm,
    fontWeight: FONTS.weight.bold,
  },
  btnRow: {
    flexDirection: 'row',
    marginTop: SPACING.md,
  },
});
