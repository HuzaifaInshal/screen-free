import AsyncStorage from '@react-native-async-storage/async-storage';
import { RestrictionRule } from '../types/mode';
import { EmergencyOverrideState } from '../types/analytics';
import { MobileApp, AppCollection } from '../types/app';

const STORAGE_KEYS = {
  RULES: '@screen_free_rules_v2',
  OVERRIDE: '@screen_free_override_v2',
  COLLECTIONS: '@screen_free_collections_v2',
  CUSTOM_APPS: '@screen_free_custom_apps_v2',
};

export const storage = {
  async getRules(): Promise<RestrictionRule[]> {
    try {
      const json = await AsyncStorage.getItem(STORAGE_KEYS.RULES);
      if (!json) return [];
      return JSON.parse(json);
    } catch (e) {
      return [];
    }
  },

  async saveRules(rules: RestrictionRule[]): Promise<boolean> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.RULES, JSON.stringify(rules));
      return true;
    } catch (e) {
      return false;
    }
  },

  async getCollections(): Promise<AppCollection[]> {
    try {
      const json = await AsyncStorage.getItem(STORAGE_KEYS.COLLECTIONS);
      if (!json) return [];
      return JSON.parse(json);
    } catch (e) {
      return [];
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
      if (!json) return [];
      return JSON.parse(json);
    } catch (e) {
      return [];
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
