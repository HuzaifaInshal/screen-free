import AsyncStorage from '@react-native-async-storage/async-storage';
import { RestrictionRule } from '../types/mode';
import { PRESET_RULES } from '../constants/presetRules';
import { EmergencyOverrideState } from '../types/analytics';

const STORAGE_KEYS = {
  RULES: '@screen_free_rules_v1',
  OVERRIDE: '@screen_free_override_v1',
  DAILY_STATS: '@screen_free_stats_v1',
};

export const storage = {
  async getRules(): Promise<RestrictionRule[]> {
    try {
      const json = await AsyncStorage.getItem(STORAGE_KEYS.RULES);
      if (!json) {
        // Save initial presets if first load
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
