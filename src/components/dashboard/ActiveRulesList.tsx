import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RestrictionRule } from '../../types/mode';
import { COLORS, RADIUS, SPACING, FONTS } from '../../constants/theme';
import { Badge } from '../common/Badge';
import { Toggle } from '../common/Toggle';
import { formatTimeWindow } from '../../utils/timeUtils';

interface ActiveRulesListProps {
  rules: RestrictionRule[];
  onToggleRule: (ruleId: string) => void;
  onDeleteRule: (ruleId: string) => void;
  onAddRulePress: () => void;
  onEditRule?: (rule: RestrictionRule) => void;
}

export const ActiveRulesList: React.FC<ActiveRulesListProps> = ({
  rules,
  onToggleRule,
  onDeleteRule,
  onAddRulePress,
  onEditRule,
}) => {
  const getModeIcon = (modeType: string) => {
    switch (modeType) {
      case 'SIMPLE_SCHEDULE': return 'time-outline';
      case 'PER_TIMEFRAME_QUOTA': return 'hourglass-outline';
      case 'FOCUS_INTERVAL': return 'flame-outline';
      default: return 'shield-outline';
    }
  };

  const getModeColor = (modeType: string) => {
    switch (modeType) {
      case 'SIMPLE_SCHEDULE': return COLORS.secondary;
      case 'PER_TIMEFRAME_QUOTA': return COLORS.primary;
      case 'FOCUS_INTERVAL': return COLORS.danger;
      default: return COLORS.accent;
    }
  };

  const getRuleSummaryText = (rule: RestrictionRule) => {
    if (rule.modeType === 'SIMPLE_SCHEDULE' && rule.scheduleConfig) {
      return `Window: ${formatTimeWindow(rule.scheduleConfig.startHour, rule.scheduleConfig.endHour)}`;
    }
    if (rule.modeType === 'PER_TIMEFRAME_QUOTA' && rule.quotaConfig) {
      return `Quota: ${Math.floor(rule.quotaConfig.dailyLimitMinutes / 60)}h daily (${rule.quotaConfig.activeSlotHours.length} slots active)`;
    }
    if (rule.modeType === 'FOCUS_INTERVAL' && rule.focusConfig) {
      return `Focus: ${rule.focusConfig.sessionLimitMinutes}m use / ${rule.focusConfig.cooldownMinutes}m break`;
    }
    return 'Active Mode Rule';
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>Active Restriction Rules</Text>
        <TouchableOpacity style={styles.addBtn} onPress={onAddRulePress}>
          <Ionicons name="add-circle" size={20} color={COLORS.primary} style={{ marginRight: 4 }} />
          <Text style={styles.addBtnText}>Add Mode</Text>
        </TouchableOpacity>
      </View>

      {rules.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyText}>No rules created yet.</Text>
          <Text style={styles.emptySub}>Tap 'Add Mode' above to restrict app usage.</Text>
        </View>
      ) : (
        rules.map(rule => {
          const color = getModeColor(rule.modeType);
          return (
            <TouchableOpacity
              key={rule.id}
              activeOpacity={0.85}
              onPress={() => onEditRule?.(rule)}
              style={[
                styles.ruleCard,
                !rule.enabled && styles.disabledCard,
              ]}
            >
              <View style={[styles.iconBox, { backgroundColor: `${color}20` }]}>
                <Ionicons name={getModeIcon(rule.modeType) as any} size={22} color={color} />
              </View>

              <View style={styles.infoBox}>
                <Text style={styles.ruleName}>
                  {rule.name}
                </Text>
                <View style={styles.badgeRow}>
                  <Badge label={rule.modeType.replace(/_/g, ' ')} color={color} />
                </View>
                <Text style={styles.ruleSub}>{getRuleSummaryText(rule)}</Text>
              </View>

              <View style={styles.actionCol}>
                <Toggle
                  value={rule.enabled}
                  onValueChange={() => onToggleRule(rule.id)}
                />
                <TouchableOpacity
                  onPress={() => onDeleteRule(rule.id)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  style={styles.deleteBtn}
                >
                  <Ionicons name="trash-outline" size={16} color={COLORS.textMuted} />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          );
        })
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: SPACING.xs,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.xs,
  },
  sectionTitle: {
    color: COLORS.textSecondary,
    fontSize: FONTS.size.sm,
    fontWeight: FONTS.weight.semibold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addBtnText: {
    color: COLORS.primary,
    fontSize: FONTS.size.xs,
    fontWeight: FONTS.weight.bold,
  },
  emptyBox: {
    backgroundColor: COLORS.bgCard,
    padding: SPACING.lg,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  emptyText: {
    color: COLORS.textPrimary,
    fontSize: FONTS.size.md,
    fontWeight: FONTS.weight.semibold,
  },
  emptySub: {
    color: COLORS.textMuted,
    fontSize: FONTS.size.xs,
    marginTop: 4,
  },
  ruleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.md,
    padding: SPACING.sm + 4,
    marginVertical: SPACING.xs,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  disabledCard: {
    opacity: 0.5,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm,
  },
  infoBox: {
    flex: 1,
  },
  badgeRow: {
    marginVertical: 4,
  },
  ruleName: {
    color: COLORS.textPrimary,
    fontSize: FONTS.size.md,
    fontWeight: FONTS.weight.bold,
  },
  ruleSub: {
    color: COLORS.textSecondary,
    fontSize: FONTS.size.xs,
  },
  actionCol: {
    alignItems: 'flex-end',
    marginLeft: SPACING.xs,
  },
  deleteBtn: {
    marginTop: 2,
  },
});
