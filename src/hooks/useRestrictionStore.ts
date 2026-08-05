import { useState, useEffect, useCallback } from 'react';
import { RestrictionRule } from '../types/mode';
import { EmergencyOverrideState } from '../types/analytics';
import { MobileApp, AppCollection, AppCategory } from '../types/app';
import { MOCK_APPS, DEFAULT_COLLECTIONS } from '../constants/mockApps';
import { storage } from '../utils/storage';
import { PRESET_RULES } from '../constants/presetRules';

export function useRestrictionStore() {
  const [rules, setRules] = useState<RestrictionRule[]>([]);
  const [apps, setApps] = useState<MobileApp[]>(MOCK_APPS);
  const [collections, setCollections] = useState<AppCollection[]>(DEFAULT_COLLECTIONS);
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
      const loadedCollections = await storage.getCollections();
      const loadedApps = await storage.getApps();
      setRules(loadedRules);
      setOverride(loadedOverride);
      setCollections(loadedCollections);
      setApps(loadedApps);
      setIsLoading(false);
    }
    loadData();
  }, []);

  // Save rules helper
  const saveRulesState = useCallback(async (newRules: RestrictionRule[]) => {
    setRules(newRules);
    await storage.saveRules(newRules);
  }, []);

  // Save collections helper
  const saveCollectionsState = useCallback(async (newCollections: AppCollection[]) => {
    setCollections(newCollections);
    await storage.saveCollections(newCollections);
  }, []);

  // Save apps helper
  const saveAppsState = useCallback(async (newApps: MobileApp[]) => {
    setApps(newApps);
    await storage.saveApps(newApps);
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

  // App Collection Handlers
  const addCollection = useCallback(async (name: string, appIds: string[], color: string = '#7f00ff') => {
    const newCollection: AppCollection = {
      id: `col-${Date.now()}`,
      name,
      iconName: 'folder-open',
      color,
      appIds,
    };
    const updated = [...collections, newCollection];
    await saveCollectionsState(updated);
    return newCollection;
  }, [collections, saveCollectionsState]);

  const updateCollection = useCallback(async (updatedCollection: AppCollection) => {
    const updated = collections.map(c => c.id === updatedCollection.id ? updatedCollection : c);
    await saveCollectionsState(updated);
  }, [collections, saveCollectionsState]);

  const deleteCollection = useCallback(async (collectionId: string) => {
    const updated = collections.filter(c => c.id !== collectionId);
    await saveCollectionsState(updated);
  }, [collections, saveCollectionsState]);

  // Add Custom App Handler
  const addCustomApp = useCallback(async (appName: string, category: AppCategory = 'Social Media') => {
    const cleanId = `com.custom.${appName.toLowerCase().replace(/[^a-z0-9]/g, '')}`;
    const newApp: MobileApp = {
      id: cleanId,
      name: appName,
      category,
      iconName: 'apps-outline',
      iconColor: '#00f2fe',
      todayUsageMinutes: 30,
      weeklyUsageMinutes: [20, 30, 40, 25, 35, 30, 15],
      isCustom: true,
    };
    const updated = [newApp, ...apps];
    await saveAppsState(updated);
    return newApp;
  }, [apps, saveAppsState]);

  const resetToPresets = useCallback(async () => {
    await saveRulesState(PRESET_RULES);
    await saveCollectionsState(DEFAULT_COLLECTIONS);
  }, [saveRulesState, saveCollectionsState]);

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
    collections,
    override,
    isLoading,
    addRule,
    updateRule,
    deleteRule,
    toggleRule,
    addCollection,
    updateCollection,
    deleteCollection,
    addCustomApp,
    resetToPresets,
    activateEmergencyOverride,
    cancelEmergencyOverride,
  };
}
