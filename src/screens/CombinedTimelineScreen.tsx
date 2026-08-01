import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Header } from '../components/common/Header';
import { CombinedTimeline } from '../components/visualizers/CombinedTimeline';
import { useRestrictionStore } from '../hooks/useRestrictionStore';
import { COLORS, SPACING } from '../constants/theme';

export const CombinedTimelineScreen: React.FC = () => {
  const { rules } = useRestrictionStore();

  return (
    <View style={styles.container}>
      <Header
        title="Unified Timeline Matrix"
        subtitle="Visualizing combined rules, windows & quotas"
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <CombinedTimeline rules={rules} />
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
