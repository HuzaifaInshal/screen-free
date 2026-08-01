import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { COLORS, RADIUS, SPACING, FONTS } from '../../constants/theme';

interface QuickOverrideModalProps {
  visible: boolean;
  onClose: () => void;
  onActivate: (durationMinutes: number, reason: string) => void;
}

export const QuickOverrideModal: React.FC<QuickOverrideModalProps> = ({
  visible,
  onClose,
  onActivate,
}) => {
  const [duration, setDuration] = useState<number>(15);
  const [reason, setReason] = useState<string>('Work Emergency Call');

  const handleActivate = () => {
    onActivate(duration, reason);
    onClose();
  };

  return (
    <Modal visible={visible} onClose={onClose} title="Emergency Pass Unlock">
      <View style={styles.container}>
        <Text style={styles.desc}>
          Temporarily bypass all active restrictions for urgent phone use.
        </Text>

        <Text style={styles.label}>Select Pass Duration</Text>
        <View style={styles.durationRow}>
          {[5, 15, 30, 60].map(mins => (
            <TouchableOpacity
              key={mins}
              onPress={() => setDuration(mins)}
              style={[
                styles.durChip,
                duration === mins && styles.durChipActive,
              ]}
            >
              <Text style={[styles.durText, duration === mins && styles.durTextActive]}>
                {mins} Mins
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Unlock Reason</Text>
        <TextInput
          style={styles.input}
          value={reason}
          onChangeText={setReason}
          placeholder="State reason for emergency unlock"
          placeholderTextColor={COLORS.textMuted}
        />

        <View style={styles.btnRow}>
          <Button
            title="Cancel"
            variant="outline"
            onPress={onClose}
            style={{ flex: 1, marginRight: SPACING.xs }}
          />
          <Button
            title={`Unlock (${duration}m)`}
            variant="danger"
            icon="flash"
            onPress={handleActivate}
            style={{ flex: 1.5, marginLeft: SPACING.xs }}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: SPACING.xs,
  },
  desc: {
    color: COLORS.textSecondary,
    fontSize: FONTS.size.xs,
    marginBottom: SPACING.md,
  },
  label: {
    color: COLORS.textSecondary,
    fontSize: FONTS.size.xs,
    fontWeight: FONTS.weight.bold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: SPACING.xs,
  },
  durationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  durChip: {
    flex: 1,
    paddingVertical: SPACING.xs + 2,
    borderRadius: RADIUS.xs,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
    marginHorizontal: 3,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  durChipActive: {
    backgroundColor: COLORS.warning,
    borderColor: COLORS.warning,
  },
  durText: {
    color: COLORS.textSecondary,
    fontSize: FONTS.size.xs,
    fontWeight: FONTS.weight.bold,
  },
  durTextActive: {
    color: '#0b0d19',
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    borderRadius: RADIUS.sm,
    padding: SPACING.sm + 2,
    color: COLORS.textPrimary,
    fontSize: FONTS.size.sm,
    marginBottom: SPACING.md,
  },
  btnRow: {
    flexDirection: 'row',
    marginTop: SPACING.xs,
  },
});
