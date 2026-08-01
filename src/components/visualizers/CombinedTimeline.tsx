import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RestrictionRule, DayOfWeek } from '../../types/mode';
import { generateCombined24HourMatrix } from '../../utils/ruleEngine';
import { formatHourLabel, DAYS_SHORT, getCurrentDayOfWeek } from '../../utils/timeUtils';
import { COLORS, RADIUS, SPACING, FONTS } from '../../constants/theme';
import { Card } from '../common/Card';

interface CombinedTimelineProps {
  rules: RestrictionRule[];
}

export const CombinedTimeline: React.FC<CombinedTimelineProps> = ({ rules }) => {
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>(getCurrentDayOfWeek());
  const [inspectHour, setInspectHour] = useState<number>(new Date().getHours());

  const matrix = generateCombined24HourMatrix(rules, selectedDay);
  const selectedSlot = matrix.find(m => m.hour === inspectHour) || matrix[0];

  // Stats calculation
  const restrictedHoursCount = matrix.filter(m => m.isRestricted).length;
  const quotaHoursCount = matrix.filter(m => !m.isRestricted && m.activeModeType === 'PER_TIMEFRAME_QUOTA').length;
  const openHoursCount = 24 - restrictedHoursCount - quotaHoursCount;

  return (
    <View style={styles.container}>
      {/* Day Selector Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dayTabsScroll}>
        {DAYS_SHORT.map((dayName, idx) => {
          const isSelected = selectedDay === idx;
          return (
            <TouchableOpacity
              key={dayName}
              onPress={() => setSelectedDay(idx as DayOfWeek)}
              activeOpacity={0.8}
              style={[
                styles.dayTab,
                isSelected && styles.dayTabActive,
              ]}
            >
              <Text style={[styles.dayTabText, isSelected && styles.dayTabTextActive]}>
                {dayName}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Summary KPI Pills */}
      <View style={styles.kpiRow}>
        <View style={[styles.kpiChip, { borderColor: COLORS.danger, backgroundColor: 'rgba(255, 0, 85, 0.1)' }]}>
          <View style={[styles.dot, { backgroundColor: COLORS.danger }]} />
          <Text style={styles.kpiText}>{restrictedHoursCount}h Locked</Text>
        </View>
        <View style={[styles.kpiChip, { borderColor: COLORS.secondary, backgroundColor: 'rgba(127, 0, 255, 0.1)' }]}>
          <View style={[styles.dot, { backgroundColor: COLORS.secondary }]} />
          <Text style={styles.kpiText}>{quotaHoursCount}h Session Quota</Text>
        </View>
        <View style={[styles.kpiChip, { borderColor: COLORS.accent, backgroundColor: 'rgba(0, 245, 212, 0.1)' }]}>
          <View style={[styles.dot, { backgroundColor: COLORS.accent }]} />
          <Text style={styles.kpiText}>{openHoursCount}h Free</Text>
        </View>
      </View>

      {/* 24-Hour Interactive Visual Heatmap Chart */}
      <Card variant="glass" style={styles.chartCard}>
        <Text style={styles.chartTitle}>Combined 24-Hour Restriction Heatmap</Text>
        <Text style={styles.chartSub}>Tap any hour block to inspect mode breakdown</Text>

        <View style={styles.heatmapGrid}>
          {matrix.map((slot) => {
            const isInspected = inspectHour === slot.hour;
            let barColor = COLORS.accent;
            if (slot.isRestricted) barColor = COLORS.danger;
            else if (slot.activeModeType === 'PER_TIMEFRAME_QUOTA') barColor = COLORS.secondary;

            return (
              <TouchableOpacity
                key={slot.hour}
                onPress={() => setInspectHour(slot.hour)}
                activeOpacity={0.7}
                style={styles.slotCol}
              >
                <View
                  style={[
                    styles.heatBar,
                    { backgroundColor: barColor },
                    isInspected && styles.heatBarInspected,
                  ]}
                />
                <Text style={[styles.hourLabel, isInspected && styles.hourLabelInspected]}>
                  {slot.hour % 6 === 0 ? formatHourLabel(slot.hour) : '•'}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </Card>

      {/* Hour Inspector Detail Card */}
      <Card variant="bordered" style={styles.inspectorCard}>
        <View style={styles.inspectorHeader}>
          <View style={styles.inspectorTimeBox}>
            <Ionicons name="time" size={18} color={COLORS.primary} />
            <Text style={styles.inspectorTimeText}>{formatHourLabel(selectedSlot.hour)} Slot</Text>
          </View>
          <View
            style={[
              styles.statusTag,
              {
                backgroundColor: selectedSlot.isRestricted
                  ? 'rgba(255, 0, 85, 0.2)'
                  : selectedSlot.activeModeType === 'PER_TIMEFRAME_QUOTA'
                  ? 'rgba(127, 0, 255, 0.2)'
                  : 'rgba(0, 245, 212, 0.2)',
              },
            ]}
          >
            <Text
              style={[
                styles.statusTagText,
                {
                  color: selectedSlot.isRestricted
                    ? COLORS.danger
                    : selectedSlot.activeModeType === 'PER_TIMEFRAME_QUOTA'
                    ? COLORS.secondary
                    : COLORS.accent,
                },
              ]}
            >
              {selectedSlot.isRestricted
                ? 'RESTRICTED'
                : selectedSlot.activeModeType === 'PER_TIMEFRAME_QUOTA'
                ? 'QUOTA ACTIVE'
                : 'FREE ACCESS'}
            </Text>
          </View>
        </View>

        <Text style={styles.inspectorDesc}>
          {selectedSlot.isRestricted
            ? `Apps locked by ${selectedSlot.activeModeType || 'Schedule'} Mode rule.`
            : selectedSlot.activeModeType === 'PER_TIMEFRAME_QUOTA'
            ? `Allowance limit: Max ${selectedSlot.allowedQuotaMinutes} minutes allowed inside this hour.`
            : 'Unrestricted usage time window.'}
        </Text>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: SPACING.xs,
  },
  dayTabsScroll: {
    marginBottom: SPACING.sm,
  },
  dayTab: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginRight: SPACING.xs,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  dayTabActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  dayTabText: {
    color: COLORS.textSecondary,
    fontSize: FONTS.size.xs,
    fontWeight: FONTS.weight.bold,
  },
  dayTabTextActive: {
    color: '#0b0d19',
  },
  kpiRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  kpiChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.xs + 4,
    paddingVertical: 4,
    borderRadius: RADIUS.xs,
    borderWidth: 1,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  kpiText: {
    color: COLORS.textPrimary,
    fontSize: 10,
    fontWeight: FONTS.weight.bold,
  },
  chartCard: {
    marginVertical: SPACING.xs,
  },
  chartTitle: {
    fontSize: FONTS.size.md,
    fontWeight: FONTS.weight.bold,
    color: COLORS.textPrimary,
  },
  chartSub: {
    fontSize: FONTS.size.xs,
    color: COLORS.textMuted,
    marginBottom: SPACING.md,
  },
  heatmapGrid: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 100,
    paddingTop: SPACING.xs,
  },
  slotCol: {
    flex: 1,
    alignItems: 'center',
    height: '100%',
    justifyContent: 'flex-end',
  },
  heatBar: {
    width: 8,
    height: '70%',
    borderRadius: 4,
    opacity: 0.8,
  },
  heatBarInspected: {
    width: 12,
    height: '95%',
    opacity: 1,
    borderWidth: 1,
    borderColor: '#ffffff',
  },
  hourLabel: {
    color: COLORS.textMuted,
    fontSize: 8,
    marginTop: 4,
  },
  hourLabelInspected: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  inspectorCard: {
    marginTop: SPACING.xs,
  },
  inspectorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inspectorTimeBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inspectorTimeText: {
    fontSize: FONTS.size.md,
    fontWeight: FONTS.weight.bold,
    color: COLORS.textPrimary,
    marginLeft: SPACING.xs,
  },
  statusTag: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: RADIUS.xs,
  },
  statusTagText: {
    fontSize: 10,
    fontWeight: FONTS.weight.bold,
  },
  inspectorDesc: {
    fontSize: FONTS.size.xs,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
});
