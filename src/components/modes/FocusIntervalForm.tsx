import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { FocusIntervalConfig } from '../../types/mode';
import { AppSelectorGrid } from '../visualizers/AppSelectorGrid';
import { Toggle } from '../common/Toggle';
import { Button } from '../common/Button';
import { COLORS, RADIUS, SPACING, FONTS } from '../../constants/theme';

interface FocusIntervalFormProps {
  initialName?: string;
  initialAppIds?: string[];
  initialConfig?: FocusIntervalConfig;
  onSubmit: (data: { name: string; targetAppIds: string[]; config: FocusIntervalConfig }) => void;
  onCancel: () => void;
}

export const FocusIntervalForm: React.FC<FocusIntervalFormProps> = ({
  initialName = 'Deep Focus Pomodoro',
  initialAppIds = ['ALL'],
  initialConfig = {
    sessionLimitMinutes: 25,
    cooldownMinutes: 10,
    enabledBedtime: true,
    bedtimeStartHour: 22,
    bedtimeEndHour: 6,
  },
  onSubmit,
  onCancel,
}) => {
  const [ruleName, setRuleName] = useState(initialName);
  const [selectedApps, setSelectedApps] = useState<string[]>(initialAppIds);
  const [sessionLimitMinutes, setSessionLimitMinutes] = useState(initialConfig.sessionLimitMinutes);
  const [cooldownMinutes, setCooldownMinutes] = useState(initialConfig.cooldownMinutes);
  const [enabledBedtime, setEnabledBedtime] = useState(initialConfig.enabledBedtime);

  const handleSubmit = () => {
    onSubmit({
      name: ruleName.trim() || 'Strict Focus & Cooldown',
      targetAppIds: selectedApps,
      config: {
        sessionLimitMinutes,
        cooldownMinutes,
        enabledBedtime,
        bedtimeStartHour: 22,
        bedtimeEndHour: 6,
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

      <View style={styles.row}>
        <View style={styles.col}>
          <Text style={styles.label}>Max Session Use</Text>
          <View style={styles.stepperBox}>
            <TouchableOpacity
              onPress={() => setSessionLimitMinutes(Math.max(10, sessionLimitMinutes - 5))}
              style={styles.btnSmall}
            >
              <Text style={styles.btnText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.valText}>{sessionLimitMinutes}m</Text>
            <TouchableOpacity
              onPress={() => setSessionLimitMinutes(sessionLimitMinutes + 5)}
              style={styles.btnSmall}
            >
              <Text style={styles.btnText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.col}>
          <Text style={styles.label}>Mandatory Cooldown</Text>
          <View style={styles.stepperBox}>
            <TouchableOpacity
              onPress={() => setCooldownMinutes(Math.max(5, cooldownMinutes - 5))}
              style={styles.btnSmall}
            >
              <Text style={styles.btnText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.valText}>{cooldownMinutes}m</Text>
            <TouchableOpacity
              onPress={() => setCooldownMinutes(cooldownMinutes + 5)}
              style={styles.btnSmall}
            >
              <Text style={styles.btnText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <Toggle
        label="Include Strict Bedtime Lockout"
        sublabel="Automatically enforces 10:00 PM – 6:00 AM hard lock"
        value={enabledBedtime}
        onValueChange={setEnabledBedtime}
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
          title="Save Focus Rule"
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
    marginBottom: SPACING.md,
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
    fontSize: FONTS.size.md,
    fontWeight: FONTS.weight.bold,
  },
  btnRow: {
    flexDirection: 'row',
    marginTop: SPACING.md,
  },
});
