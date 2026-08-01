import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MOCK_APPS } from '../../constants/mockApps';
import { COLORS, RADIUS, SPACING, FONTS } from '../../constants/theme';

interface AppSelectorGridProps {
  selectedAppIds: string[];
  onChange: (appIds: string[]) => void;
}

export const AppSelectorGrid: React.FC<AppSelectorGridProps> = ({
  selectedAppIds,
  onChange,
}) => {
  const isAllSelected = selectedAppIds.includes('ALL');

  const toggleAll = () => {
    if (isAllSelected) {
      onChange([MOCK_APPS[0].id]);
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

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.label}>Target Applications</Text>
        <TouchableOpacity onPress={toggleAll}>
          <Text style={[styles.allText, isAllSelected && { color: COLORS.accent }]}>
            {isAllSelected ? '✓ All Apps Selected' : 'Select All'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.grid}>
        {MOCK_APPS.map(app => {
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
              <View style={[styles.iconBg, { backgroundColor: app.iconColor }]}>
                <Ionicons name={app.iconName as any} size={18} color="#ffffff" />
              </View>
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
    marginRight: SPACING.xs,
  },
  appName: {
    flex: 1,
    color: COLORS.textPrimary,
    fontSize: FONTS.size.xs,
    fontWeight: FONTS.weight.medium,
  },
  checkIcon: {
    marginLeft: 2,
  },
});
