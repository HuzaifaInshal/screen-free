import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RuleEvaluationResult } from '../../types/mode';
import { EmergencyOverrideState } from '../../types/analytics';
import { COLORS, RADIUS, SPACING, FONTS, SHADOWS } from '../../constants/theme';
import { formatMinutes } from '../../utils/timeUtils';

interface LiveStatusWidgetProps {
  evaluation: RuleEvaluationResult;
  override: EmergencyOverrideState;
  onOpenOverride: () => void;
  onCancelOverride: () => void;
  currentTime: Date;
}

export const LiveStatusWidget: React.FC<LiveStatusWidgetProps> = ({
  evaluation,
  override,
  onOpenOverride,
  onCancelOverride,
  currentTime,
}) => {
  const isRestricted = evaluation.isRestricted && !override.isActive;

  const getStatusColor = () => {
    if (override.isActive) return COLORS.warning;
    if (isRestricted) return COLORS.danger;
    return COLORS.accent;
  };

  const getStatusTitle = () => {
    if (override.isActive) return 'EMERGENCY PASS ACTIVE';
    if (isRestricted) return 'RESTRICTION ACTIVE';
    return 'SCREEN FREE PASS';
  };

  return (
    <View style={[styles.container, { borderColor: getStatusColor() }]}>
      {/* Outer Glow Ring Header */}
      <View style={styles.headerRow}>
        <View style={[styles.statusDot, { backgroundColor: getStatusColor() }]} />
        <Text style={[styles.statusTitle, { color: getStatusColor() }]}>{getStatusTitle()}</Text>
        <Text style={styles.clockText}>
          {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </Text>
      </View>

      {/* Main Status Callout */}
      <View style={styles.body}>
        <View style={[styles.ringContainer, { borderColor: getStatusColor() }]}>
          <Ionicons
            name={override.isActive ? 'flash' : isRestricted ? 'lock-closed' : 'shield-checkmark'}
            size={36}
            color={getStatusColor()}
          />
        </View>
        <View style={styles.textDetails}>
          <Text style={styles.ruleName}>
            {override.isActive
              ? `Override Pass (${override.durationMinutes}m)`
              : evaluation.activeRuleName || 'All Apps Unlocked'}
          </Text>
          <Text style={styles.ruleReason}>
            {override.isActive
              ? 'Emergency access unlocked temporarily.'
              : evaluation.reason}
          </Text>
          {evaluation.remainingSlotMinutes !== undefined && (
            <View style={styles.quotaBadge}>
              <Text style={styles.quotaText}>
                Remaining Slot Time: {formatMinutes(evaluation.remainingSlotMinutes)}
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Action Footer */}
      <View style={styles.footerRow}>
        {override.isActive ? (
          <TouchableOpacity style={styles.cancelBtn} onPress={onCancelOverride}>
            <Text style={styles.cancelBtnText}>End Emergency Override</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.overrideBtn} onPress={onOpenOverride}>
            <Ionicons name="flash-outline" size={16} color={COLORS.warning} style={{ marginRight: 4 }} />
            <Text style={styles.overrideBtnText}>Quick Emergency Pass</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1.5,
    marginVertical: SPACING.sm,
    ...SHADOWS.glassCard,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusTitle: {
    fontSize: FONTS.size.xs,
    fontWeight: FONTS.weight.bold,
    letterSpacing: 1,
    flex: 1,
  },
  clockText: {
    color: COLORS.textMuted,
    fontSize: FONTS.size.xs,
    fontWeight: FONTS.weight.medium,
  },
  body: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ringContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    marginRight: SPACING.md,
  },
  textDetails: {
    flex: 1,
  },
  ruleName: {
    fontSize: FONTS.size.lg,
    fontWeight: FONTS.weight.bold,
    color: COLORS.textPrimary,
  },
  ruleReason: {
    fontSize: FONTS.size.xs,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  quotaBadge: {
    marginTop: 6,
    backgroundColor: 'rgba(127, 0, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: RADIUS.xs,
    alignSelf: 'flex-start',
  },
  quotaText: {
    color: COLORS.secondary,
    fontSize: 10,
    fontWeight: FONTS.weight.bold,
  },
  footerRow: {
    marginTop: SPACING.md,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderSubtle,
    alignItems: 'flex-end',
  },
  overrideBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 183, 3, 0.1)',
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.warning,
  },
  overrideBtnText: {
    color: COLORS.warning,
    fontSize: FONTS.size.xs,
    fontWeight: FONTS.weight.bold,
  },
  cancelBtn: {
    backgroundColor: 'rgba(255, 0, 85, 0.15)',
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.danger,
  },
  cancelBtnText: {
    color: COLORS.danger,
    fontSize: FONTS.size.xs,
    fontWeight: FONTS.weight.bold,
  },
});
