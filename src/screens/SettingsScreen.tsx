import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { Header } from '../components/common/Header';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { useRestrictionStore } from '../hooks/useRestrictionStore';
import { COLORS, SPACING, FONTS } from '../constants/theme';
import { storage } from '../utils/storage';

export const SettingsScreen: React.FC = () => {
  const { resetToPresets } = useRestrictionStore();

  const handleResetPresets = async () => {
    await resetToPresets();
    Alert.alert('Presets Restored', 'Rules reset to default preset templates.');
  };

  const handleClearAll = async () => {
    await storage.clearAllData();
    await resetToPresets();
    Alert.alert('Data Cleared', 'All custom rules and overrides reset.');
  };

  return (
    <View style={styles.container}>
      <Header
        title="Settings & Presets"
        subtitle="Configuration & default templates"
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card variant="glass" style={styles.card}>
          <Text style={styles.sectionTitle}>Preset Templates</Text>
          <Text style={styles.desc}>
            Quickly restore default restriction modes (Night Sleep 6PM-6AM, Peak Hours Quota 15m/hr, Work Focus 25/10).
          </Text>
          <Button
            title="Restore Preset Templates"
            variant="secondary"
            icon="refresh-outline"
            onPress={handleResetPresets}
          />
        </Card>

        <Card variant="glass" style={styles.card}>
          <Text style={styles.sectionTitle}>Storage & Reset</Text>
          <Text style={styles.desc}>
            Clear local AsyncStorage rules cache and reset Screen Free application state.
          </Text>
          <Button
            title="Clear Application Data"
            variant="danger"
            icon="trash-bin-outline"
            onPress={handleClearAll}
          />
        </Card>

        <View style={styles.appInfo}>
          <Text style={styles.appName}>Screen Free v1.0.0</Text>
          <Text style={styles.appSub}>Mindful Digital Wellbeing & Multi-Mode App Limiter</Text>
        </View>
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
  card: {
    marginVertical: SPACING.xs,
  },
  sectionTitle: {
    fontSize: FONTS.size.md,
    fontWeight: FONTS.weight.bold,
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  desc: {
    fontSize: FONTS.size.xs,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
    lineHeight: 18,
  },
  appInfo: {
    alignItems: 'center',
    marginTop: SPACING.xl,
  },
  appName: {
    color: COLORS.textMuted,
    fontSize: FONTS.size.sm,
    fontWeight: FONTS.weight.bold,
  },
  appSub: {
    color: COLORS.textMuted,
    fontSize: FONTS.size.xs,
    marginTop: 2,
  },
});
