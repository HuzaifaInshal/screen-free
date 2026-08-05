import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { SimpleScheduleConfig, DayOfWeek, TimeWindow } from '../../types/mode';
import { TimeRangePicker } from '../visualizers/TimeRangePicker';
import { DayOfWeekPicker } from '../visualizers/DayOfWeekPicker';
import { AppSelectorGrid } from '../visualizers/AppSelectorGrid';
import { Button } from '../common/Button';
import { COLORS, RADIUS, SPACING, FONTS } from '../../constants/theme';

interface TimeScheduleFormProps {
  initialName?: string;
  initialAppIds?: string[];
  initialConfig?: SimpleScheduleConfig;
  onSubmit: (data: { name: string; targetAppIds: string[]; config: SimpleScheduleConfig }) => void;
  onCancel: () => void;
}

export const TimeScheduleForm: React.FC<TimeScheduleFormProps> = ({
  initialName = 'Simple Evening Window',
  initialAppIds = ['ALL'],
  initialConfig = {
    windows: [
      { id: 'win-1', startHour: 18, startMinute: 0, endHour: 6, endMinute: 0 }
    ],
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
  },
  onSubmit,
  onCancel,
}) => {
  const [ruleName, setRuleName] = useState(initialName);
  const [selectedApps, setSelectedApps] = useState<string[]>(initialAppIds);

  const initialWindowsList: TimeWindow[] =
    initialConfig?.windows && initialConfig.windows.length > 0
      ? initialConfig.windows
      : [
          {
            id: 'win-1',
            startHour: initialConfig?.startHour ?? 18,
            startMinute: 0,
            endHour: initialConfig?.endHour ?? 6,
            endMinute: 0,
          },
        ];

  const [windows, setWindows] = useState<TimeWindow[]>(initialWindowsList);
  const [daysOfWeek, setDaysOfWeek] = useState<DayOfWeek[]>(initialConfig.daysOfWeek);

  const handleSubmit = () => {
    onSubmit({
      name: ruleName.trim() || 'Simple Time Schedule',
      targetAppIds: selectedApps,
      config: {
        windows,
        startHour: windows[0]?.startHour ?? 18,
        startMinute: 0,
        endHour: windows[0]?.endHour ?? 6,
        endMinute: 0,
        daysOfWeek,
      },
    });
  };

  return (
    <View style={styles.formContainer}>
      <Text style={styles.formTitle}>Rule Name</Text>
      <TextInput
        style={styles.input}
        value={ruleName}
        onChangeText={setRuleName}
        placeholder="Enter rule name"
        placeholderTextColor={COLORS.textMuted}
      />

      <TimeRangePicker
        windows={windows}
        onWindowsChange={setWindows}
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
          title="Save Schedule Rule"
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
  formTitle: {
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
  btnRow: {
    flexDirection: 'row',
    marginTop: SPACING.md,
  },
});
