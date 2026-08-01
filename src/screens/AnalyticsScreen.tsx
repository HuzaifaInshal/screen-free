import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Header } from '../components/common/Header';
import { Card } from '../components/common/Card';
import { useRestrictionStore } from '../hooks/useRestrictionStore';
import { COLORS, RADIUS, SPACING, FONTS } from '../constants/theme';
import { formatMinutes } from '../utils/timeUtils';

export const AnalyticsScreen: React.FC = () => {
  const { apps } = useRestrictionStore();

  const totalScreenTime = apps.reduce((sum, app) => sum + app.todayUsageMinutes, 0);
  const timeSavedToday = 145; // simulated minutes saved by restriction rules

  return (
    <View style={styles.container}>
      <Header
        title="Usage Analytics"
        subtitle="Insights & Screen Free impact stats"
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* KPI Stat Cards Row */}
        <View style={styles.kpiRow}>
          <Card variant="glass" style={styles.kpiCard}>
            <Ionicons name="phone-portrait-outline" size={24} color={COLORS.primary} />
            <Text style={styles.kpiValue}>{formatMinutes(totalScreenTime)}</Text>
            <Text style={styles.kpiLabel}>Today's Screen Time</Text>
          </Card>

          <Card variant="glass" style={styles.kpiCard}>
            <Ionicons name="time-outline" size={24} color={COLORS.accent} />
            <Text style={styles.kpiValue}>{formatMinutes(timeSavedToday)}</Text>
            <Text style={styles.kpiLabel}>Time Saved Today</Text>
          </Card>
        </View>

        {/* Per-App Usage Breakdown */}
        <Card variant="glass" style={styles.breakdownCard}>
          <Text style={styles.sectionTitle}>App Usage Breakdown</Text>

          {apps.map(app => {
            const percentage = Math.min(100, Math.round((app.todayUsageMinutes / 180) * 100));
            return (
              <View key={app.id} style={styles.appRow}>
                <View style={[styles.iconBox, { backgroundColor: app.iconColor }]}>
                  <Ionicons name={app.iconName as any} size={18} color="#ffffff" />
                </View>
                <View style={styles.appInfo}>
                  <View style={styles.appTitleRow}>
                    <Text style={styles.appName}>{app.name}</Text>
                    <Text style={styles.appUsage}>{formatMinutes(app.todayUsageMinutes)}</Text>
                  </View>

                  <View style={styles.progressBg}>
                    <View
                      style={[
                        styles.progressFill,
                        { width: `${percentage}%`, backgroundColor: app.iconColor },
                      ]}
                    />
                  </View>
                </View>
              </View>
            );
          })}
        </Card>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgDark,
  },
  scrollContent: {
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.xxl,
  },
  kpiRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: SPACING.xs,
  },
  kpiCard: {
    width: '48%',
    padding: SPACING.md,
    alignItems: 'flex-start',
  },
  kpiValue: {
    fontSize: FONTS.size.xl,
    fontWeight: FONTS.weight.bold,
    color: COLORS.textPrimary,
    marginTop: SPACING.xs,
  },
  kpiLabel: {
    fontSize: FONTS.size.xs,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  breakdownCard: {
    marginVertical: SPACING.sm,
  },
  sectionTitle: {
    color: COLORS.textPrimary,
    fontSize: FONTS.size.md,
    fontWeight: FONTS.weight.bold,
    marginBottom: SPACING.md,
  },
  appRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  iconBox: {
    width: 34,
    height: 34,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm,
  },
  appInfo: {
    flex: 1,
  },
  appTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  appName: {
    color: COLORS.textPrimary,
    fontSize: FONTS.size.sm,
    fontWeight: FONTS.weight.semibold,
  },
  appUsage: {
    color: COLORS.textSecondary,
    fontSize: FONTS.size.xs,
    fontWeight: FONTS.weight.bold,
  },
  progressBg: {
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
});
