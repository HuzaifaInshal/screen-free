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
  editingRule?: RestrictionRule | null;
}

export const RulesManagerScreen: React.FC<RulesManagerScreenProps> = ({
  onRuleSaved,
  editingRule,
}) => {
  const { addRule, updateRule } = useRestrictionStore();
  const [selectedMode, setSelectedMode] = useState<LimitingModeType>(
    editingRule ? editingRule.modeType : 'SIMPLE_SCHEDULE'
  );

  const isEditing = !!editingRule;

  const handleSaveScheduleRule = async (data: any) => {
    if (editingRule) {
      const updatedRule: RestrictionRule = {
        ...editingRule,
        name: data.name,
        modeType: 'SIMPLE_SCHEDULE',
        targetAppIds: data.targetAppIds,
        scheduleConfig: data.config,
        updatedAt: new Date().toISOString(),
      };
      await updateRule(updatedRule);
    } else {
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
    }
    onRuleSaved();
  };

  const handleSaveQuotaRule = async (data: any) => {
    if (editingRule) {
      const updatedRule: RestrictionRule = {
        ...editingRule,
        name: data.name,
        modeType: 'PER_TIMEFRAME_QUOTA',
        targetAppIds: data.targetAppIds,
        quotaConfig: data.config,
        updatedAt: new Date().toISOString(),
      };
      await updateRule(updatedRule);
    } else {
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
    }
    onRuleSaved();
  };

  const handleSaveFocusRule = async (data: any) => {
    if (editingRule) {
      const updatedRule: RestrictionRule = {
        ...editingRule,
        name: data.name,
        modeType: 'FOCUS_INTERVAL',
        targetAppIds: data.targetAppIds,
        focusConfig: data.config,
        updatedAt: new Date().toISOString(),
      };
      await updateRule(updatedRule);
    } else {
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
    }
    onRuleSaved();
  };

  return (
    <View style={styles.container}>
      <Header
        title={isEditing ? 'Edit Restriction Mode' : 'Add Restriction Mode'}
        subtitle={
          isEditing
            ? 'Modify schedule windows, session quotas or focus locks'
            : 'Create schedule windows, session quotas or focus locks'
        }
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ModeSelectorCard
          selectedMode={selectedMode}
          onSelectMode={setSelectedMode}
        />

        {selectedMode === 'SIMPLE_SCHEDULE' && (
          <TimeScheduleForm
            initialName={editingRule?.modeType === 'SIMPLE_SCHEDULE' ? editingRule.name : undefined}
            initialAppIds={editingRule?.modeType === 'SIMPLE_SCHEDULE' ? editingRule.targetAppIds : undefined}
            initialConfig={editingRule?.modeType === 'SIMPLE_SCHEDULE' ? editingRule.scheduleConfig : undefined}
            onSubmit={handleSaveScheduleRule}
            onCancel={onRuleSaved}
          />
        )}

        {selectedMode === 'PER_TIMEFRAME_QUOTA' && (
          <QuotaSessionForm
            initialName={editingRule?.modeType === 'PER_TIMEFRAME_QUOTA' ? editingRule.name : undefined}
            initialAppIds={editingRule?.modeType === 'PER_TIMEFRAME_QUOTA' ? editingRule.targetAppIds : undefined}
            initialConfig={editingRule?.modeType === 'PER_TIMEFRAME_QUOTA' ? editingRule.quotaConfig : undefined}
            onSubmit={handleSaveQuotaRule}
            onCancel={onRuleSaved}
          />
        )}

        {selectedMode === 'FOCUS_INTERVAL' && (
          <FocusIntervalForm
            initialName={editingRule?.modeType === 'FOCUS_INTERVAL' ? editingRule.name : undefined}
            initialAppIds={editingRule?.modeType === 'FOCUS_INTERVAL' ? editingRule.targetAppIds : undefined}
            initialConfig={editingRule?.modeType === 'FOCUS_INTERVAL' ? editingRule.focusConfig : undefined}
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
