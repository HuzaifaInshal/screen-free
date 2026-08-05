import AsyncStorage from '@react-native-async-storage/async-storage';
import { RestrictionRule } from '../types/mode';
import { PRESET_RULES } from '../constants/presetRules';
import { EmergencyOverrideState } from '../types/analytics';
import { MobileApp, AppCollection } from '../types/app';
import { MOCK_APPS, DEFAULT_COLLECTIONS } from '../constants/mockApps';

const STORAGE_KEYS = {
  RULES: '@screen_free_rules_v1',
  OVERRIDE: '@screen_free_override_v1',
  COLLECTIONS: '@screen_free_collections_v1',
  CUSTOM_APPS: '@screen_free_custom_apps_v1',
};

export const storage = {
  async getRules(): Promise<RestrictionRule[]> {
    try {
      const json = await AsyncStorage.getItem(STORAGE_KEYS.RULES);
      if (!json) {
        await AsyncStorage.setItem(STORAGE_KEYS.RULES, JSON.stringify(PRESET_RULES));
        return PRESET_RULES;
      }
      return JSON.parse(json);
    } catch (e) {
      console.error('Failed to load rules from storage', e);
      return PRESET_RULES;
    }
  },

  async saveRules(rules: RestrictionRule[]): Promise<boolean> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.RULES, JSON.stringify(rules));
      return true;
    } catch (e) {
      console.error('Failed to save rules to storage', e);
      return false;
    }
  },

  async getCollections(): Promise<AppCollection[]> {
    try {
      const json = await AsyncStorage.getItem(STORAGE_KEYS.COLLECTIONS);
      if (!json) {
        await AsyncStorage.setItem(STORAGE_KEYS.COLLECTIONS, JSON.stringify(DEFAULT_COLLECTIONS));
        return DEFAULT_COLLECTIONS;
      }
      return JSON.parse(json);
    } catch (e) {
      return DEFAULT_COLLECTIONS;
    }
  },

  async saveCollections(collections: AppCollection[]): Promise<boolean> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.COLLECTIONS, JSON.stringify(collections));
      return true;
    } catch (e) {
      return false;
    }
  },

  async getApps(): Promise<MobileApp[]> {
    try {
      const json = await AsyncStorage.getItem(STORAGE_KEYS.CUSTOM_APPS);
      if (!json) {
        return MOCK_APPS;
      }
      const customApps: MobileApp[] = JSON.parse(json);
      // Merge with MOCK_APPS
      const existingIds = new Set(MOCK_APPS.map(a => a.id));
      const filteredCustom = customApps.filter(a => !existingIds.has(a.id));
      return [...MOCK_APPS, ...filteredCustom];
    } catch (e) {
      return MOCK_APPS;
    }
  },

  async saveApps(apps: MobileApp[]): Promise<boolean> {
    try {
      const customApps = apps.filter(a => a.isCustom);
      await AsyncStorage.setItem(STORAGE_KEYS.CUSTOM_APPS, JSON.stringify(customApps));
      return true;
    } catch (e) {
      return false;
    }
  },

  async getOverrideState(): Promise<EmergencyOverrideState> {
    try {
      const json = await AsyncStorage.getItem(STORAGE_KEYS.OVERRIDE);
      if (!json) return { isActive: false, expiresAt: null, durationMinutes: 0 };
      const state: EmergencyOverrideState = JSON.parse(json);
      if (state.isActive && state.expiresAt) {
        if (new Date(state.expiresAt).getTime() < Date.now()) {
          return { isActive: false, expiresAt: null, durationMinutes: 0 };
        }
      }
      return state;
    } catch (e) {
      return { isActive: false, expiresAt: null, durationMinutes: 0 };
    }
  },

  async saveOverrideState(state: EmergencyOverrideState): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.OVERRIDE, JSON.stringify(state));
    } catch (e) {
      console.error('Failed to save override state', e);
    }
  },

  async clearAllData(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (e) {
      console.error('Failed to clear data', e);
    }
  }
};
