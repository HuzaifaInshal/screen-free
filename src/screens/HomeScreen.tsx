import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Header } from '../components/common/Header';
import { LiveStatusWidget } from '../components/dashboard/LiveStatusWidget';
import { ActiveRulesList } from '../components/dashboard/ActiveRulesList';
import { QuickOverrideModal } from '../components/dashboard/QuickOverrideModal';
import { useRestrictionStore } from '../hooks/useRestrictionStore';
import { useLiveClock } from '../hooks/useLiveClock';
import { RestrictionRule } from '../types/mode';
import { evaluateActiveRules } from '../utils/ruleEngine';
import { COLORS, SPACING } from '../constants/theme';

interface HomeScreenProps {
  onNavigateToRules: () => void;
  onNavigateToTimeline: () => void;
  onEditRule?: (rule: RestrictionRule) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onNavigateToRules,
  onNavigateToTimeline,
  onEditRule,
}) => {
  const {
    rules,
    override,
    toggleRule,
    deleteRule,
    activateEmergencyOverride,
    cancelEmergencyOverride,
  } = useRestrictionStore();

  const currentTime = useLiveClock();
  const [isOverrideModalOpen, setIsOverrideModalOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const evaluation = evaluateActiveRules(
    rules,
    'ALL',
    95, // simulated app today usage minutes
    override.isActive,
    currentTime
  );

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 500);
  };

  return (
    <View style={styles.container}>
      <Header
        title="Screen Free"
        subtitle="Smart App Usage & Mindful Focus"
        rightActionIcon="analytics-outline"
        onRightAction={onNavigateToTimeline}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />
        }
      >
        <LiveStatusWidget
          evaluation={evaluation}
          override={override}
          onOpenOverride={() => setIsOverrideModalOpen(true)}
          onCancelOverride={cancelEmergencyOverride}
          currentTime={currentTime}
        />

        <ActiveRulesList
          rules={rules}
          onToggleRule={toggleRule}
          onDeleteRule={deleteRule}
          onAddRulePress={onNavigateToRules}
          onEditRule={onEditRule}
        />
      </ScrollView>

      <QuickOverrideModal
        visible={isOverrideModalOpen}
        onClose={() => setIsOverrideModalOpen(false)}
        onActivate={(mins, reason) => activateEmergencyOverride(mins, reason)}
      />
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
