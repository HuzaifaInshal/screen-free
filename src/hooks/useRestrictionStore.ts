import { useState, useEffect, useCallback } from 'react';
import { RestrictionRule } from '../types/mode';
import { EmergencyOverrideState } from '../types/analytics';
import { MobileApp } from '../types/app';
import { MOCK_APPS } from '../constants/mockApps';
import { storage } from '../utils/storage';
import { PRESET_RULES } from '../constants/presetRules';

export function useRestrictionStore() {
  const [rules, setRules] = useState<RestrictionRule[]>([]);
  const [apps, setApps] = useState<MobileApp[]>(MOCK_APPS);
  const [override, setOverride] = useState<EmergencyOverrideState>({
    isActive: false,
    expiresAt: null,
    durationMinutes: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Initial Data Load
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      const loadedRules = await storage.getRules();
      const loadedOverride = await storage.getOverrideState();
      setRules(loadedRules);
      setOverride(loadedOverride);
      setIsLoading(false);
    }
    loadData();
  }, []);

  // Save rules helper
  const saveRulesState = useCallback(async (newRules: RestrictionRule[]) => {
    setRules(newRules);
    await storage.saveRules(newRules);
  }, []);

  // Rule Handlers
  const addRule = useCallback(async (rule: RestrictionRule) => {
    const updated = [rule, ...rules];
    await saveRulesState(updated);
  }, [rules, saveRulesState]);

  const updateRule = useCallback(async (updatedRule: RestrictionRule) => {
    const updated = rules.map(r => r.id === updatedRule.id ? updatedRule : r);
    await saveRulesState(updated);
  }, [rules, saveRulesState]);

  const deleteRule = useCallback(async (ruleId: string) => {
    const updated = rules.filter(r => r.id !== ruleId);
    await saveRulesState(updated);
  }, [rules, saveRulesState]);

  const toggleRule = useCallback(async (ruleId: string) => {
    const updated = rules.map(r => 
      r.id === ruleId ? { ...r, enabled: !r.enabled, updatedAt: new Date().toISOString() } : r
    );
    await saveRulesState(updated);
  }, [rules, saveRulesState]);

  const resetToPresets = useCallback(async () => {
    await saveRulesState(PRESET_RULES);
  }, [saveRulesState]);

  // Override Handlers
  const activateEmergencyOverride = useCallback(async (durationMinutes: number, reason?: string) => {
    const expiresAt = new Date(Date.now() + durationMinutes * 60 * 1000).toISOString();
    const newState: EmergencyOverrideState = {
      isActive: true,
      expiresAt,
      durationMinutes,
      reason,
    };
    setOverride(newState);
    await storage.saveOverrideState(newState);
  }, []);

  const cancelEmergencyOverride = useCallback(async () => {
    const newState: EmergencyOverrideState = {
      isActive: false,
      expiresAt: null,
      durationMinutes: 0,
    };
    setOverride(newState);
    await storage.saveOverrideState(newState);
  }, []);

  return {
    rules,
    apps,
    override,
    isLoading,
    addRule,
    updateRule,
    deleteRule,
    toggleRule,
    resetToPresets,
    activateEmergencyOverride,
    cancelEmergencyOverride,
  };
}
