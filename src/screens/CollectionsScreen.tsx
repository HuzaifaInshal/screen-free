import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Header } from '../components/common/Header';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { useRestrictionStore } from '../hooks/useRestrictionStore';
import { COLORS, SPACING, FONTS, RADIUS } from '../constants/theme';
import { AppCollection } from '../types/app';

export const CollectionsScreen: React.FC = () => {
  const { apps, collections, addCollection, updateCollection, deleteCollection } = useRestrictionStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCol, setEditingCol] = useState<AppCollection | null>(null);
  const [colName, setColName] = useState('');
  const [selectedAppIds, setSelectedAppIds] = useState<string[]>([]);
  const [selectedColor, setSelectedColor] = useState('#7f00ff');

  const COLOR_OPTIONS = ['#7f00ff', '#00f2fe', '#ff0055', '#ffb703', '#00f5d4', '#4facfe'];

  const openCreateModal = () => {
    setEditingCol(null);
    setColName('');
    setSelectedAppIds([]);
    setSelectedColor('#7f00ff');
    setIsModalOpen(true);
  };

  const openEditModal = (col: AppCollection) => {
    setEditingCol(col);
    setColName(col.name);
    setSelectedAppIds(col.appIds);
    setSelectedColor(col.color);
    setIsModalOpen(true);
  };

  const handleSaveCollection = async () => {
    if (!colName.trim()) {
      Alert.alert('Error', 'Please enter a group name.');
      return;
    }
    if (selectedAppIds.length === 0) {
      Alert.alert('Error', 'Please select at least one app for this collection.');
      return;
    }

    if (editingCol) {
      const updated: AppCollection = {
        ...editingCol,
        name: colName.trim(),
        color: selectedColor,
        appIds: selectedAppIds,
      };
      await updateCollection(updated);
    } else {
      await addCollection(colName.trim(), selectedAppIds, selectedColor);
    }

    setIsModalOpen(false);
  };

  const toggleAppSelection = (appId: string) => {
    if (selectedAppIds.includes(appId)) {
      setSelectedAppIds(selectedAppIds.filter(id => id !== appId));
    } else {
      setSelectedAppIds([...selectedAppIds, appId]);
    }
  };

  return (
    <View style={styles.container}>
      <Header
        title="App Collections"
        subtitle="Group your apps to easily apply rules across multiple modes"
        rightActionIcon="add-circle-outline"
        onRightAction={openCreateModal}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Button
          title="Create New App Collection Group"
          variant="primary"
          icon="add-circle"
          onPress={openCreateModal}
          style={{ marginBottom: SPACING.md }}
        />

        {collections.length === 0 ? (
          <Card variant="glass" style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>No App Groups Created</Text>
            <Text style={styles.emptySub}>
              Create a group (e.g., "Social Media Pack" or "Gaming Hub") to block the same set of apps in one click.
            </Text>
          </Card>
        ) : (
          collections.map(col => (
            <Card key={col.id} variant="glass" style={[styles.card, { borderColor: `${col.color}40` }]}>
              <View style={styles.cardHeader}>
                <View style={styles.titleRow}>
                  <View style={[styles.colorDot, { backgroundColor: col.color }]} />
                  <Text style={styles.colTitle}>{col.name}</Text>
                </View>

                <View style={styles.actionBtns}>
                  <TouchableOpacity onPress={() => openEditModal(col)} style={styles.actionBtn}>
                    <Ionicons name="pencil" size={16} color={COLORS.primary} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => deleteCollection(col.id)} style={styles.actionBtn}>
                    <Ionicons name="trash-outline" size={16} color={COLORS.danger} />
                  </TouchableOpacity>
                </View>
              </View>

              <Text style={styles.appsCountText}>{col.appIds.length} Apps inside this group</Text>

              <View style={styles.appBadgeGrid}>
                {col.appIds.map(appId => {
                  const targetApp = apps.find(a => a.id === appId);
                  if (!targetApp) return null;
                  return (
                    <View key={appId} style={styles.memberChip}>
                      {targetApp.iconUri ? (
                        <Image source={{ uri: targetApp.iconUri }} style={styles.memberIcon} />
                      ) : (
                        <Ionicons name={targetApp.iconName as any} size={14} color={targetApp.iconColor} />
                      )}
                      <Text style={styles.memberName}>{targetApp.name}</Text>
                    </View>
                  );
                })}
              </View>
            </Card>
          ))
        )}
      </ScrollView>

      {/* Modal for creating / editing App Collection */}
      <Modal
        visible={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCol ? 'Edit App Collection' : 'Create New App Collection'}
      >
        <Text style={styles.label}>Collection / Group Name</Text>
        <TextInput
          style={styles.input}
          value={colName}
          onChangeText={setColName}
          placeholder="e.g. Social Media Heavy"
          placeholderTextColor={COLORS.textMuted}
        />

        <Text style={styles.label}>Group Accent Color</Text>
        <View style={styles.colorPickerRow}>
          {COLOR_OPTIONS.map(c => (
            <TouchableOpacity
              key={c}
              onPress={() => setSelectedColor(c)}
              style={[
                styles.colorOption,
                { backgroundColor: c },
                selectedColor === c && styles.colorOptionSelected,
              ]}
            />
          ))}
        </View>

        <Text style={styles.label}>Select Apps to Include in Group ({selectedAppIds.length})</Text>
        <ScrollView style={styles.appSelectList}>
          {apps.map(app => {
            const isSelected = selectedAppIds.includes(app.id);
            return (
              <TouchableOpacity
                key={app.id}
                onPress={() => toggleAppSelection(app.id)}
                style={[styles.appSelectRow, isSelected && styles.appSelectRowActive]}
              >
                {app.iconUri ? (
                  <Image source={{ uri: app.iconUri }} style={styles.appIconImage} />
                ) : (
                  <Ionicons name={app.iconName as any} size={18} color={app.iconColor} />
                )}
                <Text style={styles.appSelectName}>{app.name}</Text>
                <Ionicons
                  name={isSelected ? 'checkbox' : 'square-outline'}
                  size={20}
                  color={isSelected ? COLORS.primary : COLORS.textMuted}
                />
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <View style={styles.modalBtnRow}>
          <Button
            title="Cancel"
            variant="outline"
            onPress={() => setIsModalOpen(false)}
            style={{ flex: 1, marginRight: SPACING.xs }}
          />
          <Button
            title="Save Group"
            variant="primary"
            icon="checkmark"
            onPress={handleSaveCollection}
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
    borderWidth: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.xs,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: SPACING.xs,
  },
  colTitle: {
    fontSize: FONTS.size.md,
    fontWeight: FONTS.weight.bold,
    color: COLORS.textPrimary,
  },
  actionBtns: {
    flexDirection: 'row',
  },
  actionBtn: {
    padding: 6,
    marginLeft: 4,
  },
  appsCountText: {
    fontSize: FONTS.size.xs,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  appBadgeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  memberChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: SPACING.xs + 2,
    paddingVertical: 4,
    borderRadius: RADIUS.xs,
    marginRight: 6,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  memberIcon: {
    width: 14,
    height: 14,
    borderRadius: 3,
  },
  memberName: {
    color: COLORS.textPrimary,
    fontSize: 11,
    marginLeft: 4,
  },
  emptyCard: {
    padding: SPACING.lg,
    alignItems: 'center',
  },
  emptyTitle: {
    color: COLORS.textPrimary,
    fontSize: FONTS.size.md,
    fontWeight: FONTS.weight.bold,
  },
  emptySub: {
    color: COLORS.textMuted,
    fontSize: FONTS.size.xs,
    textAlign: 'center',
    marginTop: 4,
  },
  label: {
    color: COLORS.textSecondary,
    fontSize: FONTS.size.xs,
    fontWeight: FONTS.weight.bold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
    marginTop: SPACING.xs,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    borderRadius: RADIUS.sm,
    padding: SPACING.sm + 2,
    color: COLORS.textPrimary,
    fontSize: FONTS.size.md,
    marginBottom: SPACING.xs,
  },
  colorPickerRow: {
    flexDirection: 'row',
    marginBottom: SPACING.sm,
  },
  colorOption: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 10,
  },
  colorOptionSelected: {
    borderWidth: 2.5,
    borderColor: '#ffffff',
  },
  appSelectList: {
    maxHeight: 180,
    marginVertical: SPACING.xs,
  },
  appSelectRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: RADIUS.xs,
    marginBottom: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
  },
  appSelectRowActive: {
    backgroundColor: 'rgba(0, 242, 254, 0.1)',
  },
  appIconImage: {
    width: 20,
    height: 20,
    borderRadius: 4,
  },
  appSelectName: {
    flex: 1,
    color: COLORS.textPrimary,
    fontSize: FONTS.size.sm,
    marginLeft: SPACING.xs,
  },
  modalBtnRow: {
    flexDirection: 'row',
    marginTop: SPACING.sm,
  },
});
