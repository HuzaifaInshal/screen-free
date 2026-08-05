import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { HomeScreen } from '../screens/HomeScreen';
import { RulesManagerScreen } from '../screens/RulesManagerScreen';
import { CombinedTimelineScreen } from '../screens/CombinedTimelineScreen';
import { AnalyticsScreen } from '../screens/AnalyticsScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { COLORS, RADIUS, SPACING, FONTS } from '../constants/theme';

export type TabName = 'Home' | 'AddRule' | 'Timeline' | 'Analytics' | 'Settings';

interface TabItem {
  name: TabName;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  activeIcon: keyof typeof Ionicons.glyphMap;
}

const TABS: TabItem[] = [
  { name: 'Home', label: 'Home', icon: 'home-outline', activeIcon: 'home' },
  { name: 'Timeline', label: 'Timeline', icon: 'calendar-outline', activeIcon: 'calendar' },
  { name: 'AddRule', label: 'Add Mode', icon: 'add-circle-outline', activeIcon: 'add-circle' },
  { name: 'Analytics', label: 'Analytics', icon: 'bar-chart-outline', activeIcon: 'bar-chart' },
  { name: 'Settings', label: 'Settings', icon: 'settings-outline', activeIcon: 'settings' },
];

export const BottomTabNavigator: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<TabName>('Home');
  const [editingRule, setEditingRule] = useState<any>(null);
  const insets = useSafeAreaInsets();

  const handleEditRule = (rule: any) => {
    setEditingRule(rule);
    setCurrentTab('AddRule');
  };

  const handleAddRuleClick = () => {
    setEditingRule(null);
    setCurrentTab('AddRule');
  };

  const handleRuleSaved = () => {
    setEditingRule(null);
    setCurrentTab('Home');
  };

  const renderScreen = () => {
    switch (currentTab) {
      case 'Home':
        return (
          <HomeScreen
            onNavigateToRules={handleAddRuleClick}
            onNavigateToTimeline={() => setCurrentTab('Timeline')}
            onEditRule={handleEditRule}
          />
        );
      case 'Timeline':
        return <CombinedTimelineScreen />;
      case 'AddRule':
        return (
          <RulesManagerScreen
            editingRule={editingRule}
            onRuleSaved={handleRuleSaved}
          />
        );
      case 'Analytics':
        return <AnalyticsScreen />;
      case 'Settings':
        return <SettingsScreen />;
    }
  };

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, 16) }]}>
      <View style={styles.screenContainer}>{renderScreen()}</View>

      {/* Custom Glass Bottom Tab Bar */}
      <View style={[styles.tabBar, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        {TABS.map(tab => {
          const isActive = currentTab === tab.name;
          const labelText = tab.name === 'AddRule' && editingRule ? 'Edit Mode' : tab.label;
          return (
            <TouchableOpacity
              key={tab.name}
              onPress={() => {
                if (tab.name === 'AddRule') handleAddRuleClick();
                else setCurrentTab(tab.name);
              }}
              activeOpacity={0.7}
              style={styles.tabBtn}
            >
              <View
                style={[
                  styles.iconWrapper,
                  isActive && styles.activeIconWrapper,
                ]}
              >
                <Ionicons
                  name={isActive ? tab.activeIcon : tab.icon}
                  size={22}
                  color={isActive ? COLORS.primary : COLORS.textMuted}
                />
              </View>
              <Text
                style={[
                  styles.tabLabel,
                  isActive && styles.activeTabLabel,
                ]}
              >
                {labelText}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgDark,
  },
  screenContainer: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(20, 24, 45, 0.95)',
    borderTopWidth: 1,
    borderTopColor: COLORS.borderSubtle,
    paddingTop: SPACING.xs + 2,
    paddingHorizontal: SPACING.xs,
  },
  tabBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  iconWrapper: {
    padding: 4,
    borderRadius: RADIUS.xs,
  },
  activeIconWrapper: {
    backgroundColor: 'rgba(0, 242, 254, 0.1)',
  },
  tabLabel: {
    fontSize: 10,
    color: COLORS.textMuted,
    marginTop: 2,
    fontWeight: FONTS.weight.medium,
  },
  activeTabLabel: {
    color: COLORS.primary,
    fontWeight: FONTS.weight.bold,
  },
});
