import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Header } from '../components/common/Header';
import { ModeSelectorCard } from '../components/modes/ModeSelectorCard';
import { TimeScheduleForm } from '../components/modes/TimeScheduleForm';
import { QuotaSessionForm } from '../components/modes/QuotaSessionForm';
import { FocusIntervalForm } from '../components/modes/FocusIntervalForm';
import { LimitingModeType, RestrictionRule } from '../types/mode';
import { useRestrictionStore } from '../hooks/useRestrictionStore';
import { COLORS, SPACING } from '../constants/theme';

interface RulesManagerScreenProps {
  onRuleSaved: () => void;
}

export const RulesManagerScreen: React.FC<RulesManagerScreenProps> = ({ onRuleSaved }) => {
  const { addRule } = useRestrictionStore();
  const [selectedMode, setSelectedMode] = useState<LimitingModeType>('SIMPLE_SCHEDULE');

  const handleSaveScheduleRule = async (data: any) => {
    const newRule: RestrictionRule = {
      id: `rule-${Date.now()}`,
      name: data.name,
      modeType: 'SIMPLE_SCHEDULE',
      enabled: true,
      targetAppIds: data.targetAppIds,
      scheduleConfig: data.config,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await addRule(newRule);
    onRuleSaved();
  };

  const handleSaveQuotaRule = async (data: any) => {
    const newRule: RestrictionRule = {
      id: `rule-${Date.now()}`,
      name: data.name,
      modeType: 'PER_TIMEFRAME_QUOTA',
      enabled: true,
      targetAppIds: data.targetAppIds,
      quotaConfig: data.config,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await addRule(newRule);
    onRuleSaved();
  };

  const handleSaveFocusRule = async (data: any) => {
    const newRule: RestrictionRule = {
      id: `rule-${Date.now()}`,
      name: data.name,
      modeType: 'FOCUS_INTERVAL',
      enabled: true,
      targetAppIds: data.targetAppIds,
      focusConfig: data.config,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await addRule(newRule);
    onRuleSaved();
  };

  return (
    <View style={styles.container}>
      <Header
        title="Add Restriction Mode"
        subtitle="Create schedule windows, session quotas or focus locks"
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ModeSelectorCard
          selectedMode={selectedMode}
          onSelectMode={setSelectedMode}
        />

        {selectedMode === 'SIMPLE_SCHEDULE' && (
          <TimeScheduleForm
            onSubmit={handleSaveScheduleRule}
            onCancel={onRuleSaved}
          />
        )}

        {selectedMode === 'PER_TIMEFRAME_QUOTA' && (
          <QuotaSessionForm
            onSubmit={handleSaveQuotaRule}
            onCancel={onRuleSaved}
          />
        )}

        {selectedMode === 'FOCUS_INTERVAL' && (
          <FocusIntervalForm
            onSubmit={handleSaveFocusRule}
            onCancel={onRuleSaved}
          />
        )}
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
});
