import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Header } from '../components/common/Header';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { useRestrictionStore } from '../hooks/useRestrictionStore';
import { COLORS, SPACING, FONTS, RADIUS } from '../constants/theme';
import { storage } from '../utils/storage';

export const SettingsScreen: React.FC = () => {
  const { collections, addCollection, deleteCollection, resetToPresets } = useRestrictionStore();
  const [isColModalOpen, setIsColModalOpen] = useState(false);
  const [newColName, setNewColName] = useState('');

  const handleCreateCollection = async () => {
    if (!newColName.trim()) return;
    await addCollection(newColName.trim(), ['com.facebook.katana', 'com.instagram.android'], '#7f00ff');
    setNewColName('');
    setIsColModalOpen(false);
    Alert.alert('Collection Created', `App group "${newColName}" created successfully!`);
  };

  const handleResetPresets = async () => {
    await resetToPresets();
    Alert.alert('Presets Restored', 'Rules and App Collections reset to default templates.');
  };

  const handleClearAll = async () => {
    await storage.clearAllData();
    await resetToPresets();
    Alert.alert('Data Cleared', 'All custom rules and overrides reset.');
  };

  return (
    <View style={styles.container}>
      <Header
        title="Settings & Collections"
        subtitle="App groups, configuration & preset templates"
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* App Collections Card */}
        <Card variant="glass" style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.sectionTitle}>App Collections / Groups</Text>
            <TouchableOpacity onPress={() => setIsColModalOpen(true)}>
              <Text style={styles.addLink}>+ New Group</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.desc}>
            Group your favorite apps into reusable collections so you can easily restrict the same set of apps across multiple modes.
          </Text>

          {collections.map(col => (
            <View key={col.id} style={styles.colRow}>
              <View style={[styles.colDot, { backgroundColor: col.color }]} />
              <View style={styles.colDetails}>
                <Text style={styles.colName}>{col.name}</Text>
                <Text style={styles.colAppsCount}>{col.appIds.length} apps inside group</Text>
              </View>
              <TouchableOpacity onPress={() => deleteCollection(col.id)} style={styles.delBtn}>
                <Ionicons name="trash-outline" size={16} color={COLORS.textMuted} />
              </TouchableOpacity>
            </View>
          ))}
        </Card>

        {/* Preset Templates */}
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

        {/* Storage Reset */}
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

      {/* Modal for creating a new collection */}
      <Modal
        visible={isColModalOpen}
        onClose={() => setIsColModalOpen(false)}
        title="Create App Group / Collection"
      >
        <Text style={styles.desc}>
          Give your group a name (e.g., "Work Distractions", "Shopping Apps", "Gaming Hub").
        </Text>
        <TextInput
          style={styles.input}
          value={newColName}
          onChangeText={setNewColName}
          placeholder="e.g. Social Doomscroll Pack"
          placeholderTextColor={COLORS.textMuted}
        />
        <View style={styles.btnRow}>
          <Button
            title="Cancel"
            variant="outline"
            onPress={() => setIsColModalOpen(false)}
            style={{ flex: 1, marginRight: SPACING.xs }}
          />
          <Button
            title="Create Group"
            variant="primary"
            icon="checkmark"
            onPress={handleCreateCollection}
            style={{ flex: 1.5, marginLeft: SPACING.xs }}
          />
        </View>
      </Modal>
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
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontSize: FONTS.size.md,
    fontWeight: FONTS.weight.bold,
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  addLink: {
    color: COLORS.primary,
    fontSize: FONTS.size.xs,
    fontWeight: FONTS.weight.bold,
  },
  desc: {
    fontSize: FONTS.size.xs,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
    lineHeight: 18,
  },
  colRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    padding: SPACING.sm,
    borderRadius: RADIUS.xs,
    marginVertical: 3,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  colDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: SPACING.sm,
  },
  colDetails: {
    flex: 1,
  },
  colName: {
    color: COLORS.textPrimary,
    fontSize: FONTS.size.sm,
    fontWeight: FONTS.weight.semibold,
  },
  colAppsCount: {
    color: COLORS.textMuted,
    fontSize: 10,
  },
  delBtn: {
    padding: 4,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    borderRadius: RADIUS.sm,
    padding: SPACING.sm + 2,
    color: COLORS.textPrimary,
    fontSize: FONTS.size.md,
    marginBottom: SPACING.md,
  },
  btnRow: {
    flexDirection: 'row',
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
