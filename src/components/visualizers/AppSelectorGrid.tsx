import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRestrictionStore } from '../../hooks/useRestrictionStore';
import { COLORS, RADIUS, SPACING, FONTS } from '../../constants/theme';

interface AppSelectorGridProps {
  selectedAppIds: string[];
  onChange: (appIds: string[]) => void;
}

export const AppSelectorGrid: React.FC<AppSelectorGridProps> = ({
  selectedAppIds,
  onChange,
}) => {
  const { apps, collections } = useRestrictionStore();
  const [activeTab, setActiveTab] = useState<'COLLECTIONS' | 'APPS'>('COLLECTIONS');

  const isAllSelected = selectedAppIds.includes('ALL');

  const toggleAll = () => {
    if (isAllSelected) {
      onChange([apps[0]?.id || 'com.facebook.katana']);
    } else {
      onChange(['ALL']);
    }
  };

  const toggleApp = (id: string) => {
    if (isAllSelected) {
      onChange([id]);
      return;
    }

    if (selectedAppIds.includes(id)) {
      const next = selectedAppIds.filter(a => a !== id);
      onChange(next.length === 0 ? ['ALL'] : next);
    } else {
      onChange([...selectedAppIds, id]);
    }
  };

  const toggleCollection = (colAppIds: string[]) => {
    if (isAllSelected) {
      onChange(colAppIds);
      return;
    }

    const allInColSelected = colAppIds.every(id => selectedAppIds.includes(id));

    if (allInColSelected) {
      // Remove all apps in collection
      const next = selectedAppIds.filter(id => !colAppIds.includes(id));
      onChange(next.length === 0 ? ['ALL'] : next);
    } else {
      // Add all apps in collection
      const merged = Array.from(new Set([...selectedAppIds, ...colAppIds]));
      onChange(merged);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.label}>Target Applications & Groups</Text>
        <TouchableOpacity onPress={toggleAll}>
          <Text style={[styles.allText, isAllSelected && { color: COLORS.accent }]}>
            {isAllSelected ? '✓ All Apps Selected' : 'Select All'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Selector Mode Tabs */}
      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tabChip, activeTab === 'COLLECTIONS' && styles.tabChipActive]}
          onPress={() => setActiveTab('COLLECTIONS')}
        >
          <Ionicons
            name="folder-open-outline"
            size={14}
            color={activeTab === 'COLLECTIONS' ? '#0b0d19' : COLORS.textSecondary}
            style={{ marginRight: 4 }}
          />
          <Text style={[styles.tabText, activeTab === 'COLLECTIONS' && styles.tabTextActive]}>
            App Collections ({collections.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabChip, activeTab === 'APPS' && styles.tabChipActive]}
          onPress={() => setActiveTab('APPS')}
        >
          <Ionicons
            name="apps-outline"
            size={14}
            color={activeTab === 'APPS' ? '#0b0d19' : COLORS.textSecondary}
            style={{ marginRight: 4 }}
          />
          <Text style={[styles.tabText, activeTab === 'APPS' && styles.tabTextActive]}>
            Installed Apps ({apps.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* App Collections View */}
      {activeTab === 'COLLECTIONS' && (
        <View style={styles.collectionsList}>
          {collections.map(col => {
            const isColSelected =
              !isAllSelected && col.appIds.length > 0 && col.appIds.every(id => selectedAppIds.includes(id));
            return (
              <TouchableOpacity
                key={col.id}
                onPress={() => toggleCollection(col.appIds)}
                activeOpacity={0.7}
                style={[
                  styles.collectionCard,
                  isColSelected && { borderColor: col.color, backgroundColor: `${col.color}20` },
                ]}
              >
                <View style={[styles.iconBg, { backgroundColor: col.color }]}>
                  <Ionicons name={col.iconName as any} size={18} color="#ffffff" />
                </View>
                <View style={styles.colInfo}>
                  <Text style={styles.colName}>{col.name}</Text>
                  <Text style={styles.colSub}>Group of {col.appIds.length} apps</Text>
                </View>
                {isColSelected && (
                  <Ionicons name="checkmark-circle" size={20} color={COLORS.primary} />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      {/* Individual Installed Apps View */}
      {activeTab === 'APPS' && (
        <View style={styles.grid}>
          {apps.map(app => {
            const isSelected = isAllSelected || selectedAppIds.includes(app.id);
            return (
              <TouchableOpacity
                key={app.id}
                onPress={() => toggleApp(app.id)}
                activeOpacity={0.7}
                style={[
                  styles.appChip,
                  isSelected && { borderColor: app.iconColor, backgroundColor: `${app.iconColor}20` },
                ]}
              >
                {app.iconUri ? (
                  <Image source={{ uri: app.iconUri }} style={styles.appIconImage} />
                ) : (
                  <View style={[styles.iconBg, { backgroundColor: app.iconColor }]}>
                    <Ionicons name={app.iconName as any} size={18} color="#ffffff" />
                  </View>
                )}
                <Text style={styles.appName} numberOfLines={1}>
                  {app.name}
                </Text>
                {isSelected && (
                  <View style={styles.checkIcon}>
                    <Ionicons name="checkmark-circle" size={16} color={COLORS.primary} />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: SPACING.sm,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  label: {
    color: COLORS.textSecondary,
    fontSize: FONTS.size.sm,
    fontWeight: FONTS.weight.semibold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  allText: {
    color: COLORS.primary,
    fontSize: FONTS.size.xs,
    fontWeight: FONTS.weight.semibold,
  },
  tabRow: {
    flexDirection: 'row',
    marginBottom: SPACING.sm,
  },
  tabChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.sm + 4,
    paddingVertical: 6,
    borderRadius: RADIUS.xs,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginRight: SPACING.xs,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  tabChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  tabText: {
    color: COLORS.textSecondary,
    fontSize: FONTS.size.xs,
    fontWeight: FONTS.weight.semibold,
  },
  tabTextActive: {
    color: '#0b0d19',
    fontWeight: FONTS.weight.bold,
  },
  collectionsList: {
    marginVertical: SPACING.xs,
  },
  collectionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    padding: SPACING.sm + 2,
    marginVertical: 4,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  colInfo: {
    flex: 1,
    marginLeft: SPACING.xs,
  },
  colName: {
    color: COLORS.textPrimary,
    fontSize: FONTS.size.sm,
    fontWeight: FONTS.weight.bold,
  },
  colSub: {
    color: COLORS.textSecondary,
    fontSize: 11,
    marginTop: 1,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  appChip: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    padding: SPACING.xs + 2,
    marginVertical: 4,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  iconBg: {
    width: 28,
    height: 28,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appIconImage: {
    width: 28,
    height: 28,
    borderRadius: 6,
  },
  appName: {
    flex: 1,
    color: COLORS.textPrimary,
    fontSize: FONTS.size.xs,
    fontWeight: FONTS.weight.medium,
    marginLeft: SPACING.xs,
  },
  checkIcon: {
    marginLeft: 2,
  },
});
