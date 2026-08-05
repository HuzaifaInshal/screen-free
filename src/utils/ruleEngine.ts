import { RestrictionRule, RuleEvaluationResult, DayOfWeek } from '../types/mode';
import { HourlyHeatmapSlot } from '../types/analytics';
import { isHourInRange, getCurrentDayOfWeek, getCurrentHour } from './timeUtils';

/**
 * Evaluate if a target app or general phone screen is currently restricted
 * based on all enabled restriction rules and current emergency override status.
 */
export function evaluateActiveRules(
  rules: RestrictionRule[],
  appId: string | 'ALL',
  appTodayUsageMinutes: number = 0,
  isOverrideActive: boolean = false,
  targetDate: Date = new Date()
): RuleEvaluationResult {
  if (isOverrideActive) {
    return {
      isRestricted: false,
      reason: 'Emergency Override Active',
    };
  }

  const currentDay = targetDate.getDay() as DayOfWeek;
  const currentHour = targetDate.getHours();
  const activeRules = rules.filter(r => r.enabled);

  for (const rule of activeRules) {
    // Check if app matches target (or rule targets ALL)
    const matchesApp = rule.targetAppIds.includes('ALL') || rule.targetAppIds.includes(appId);
    if (!matchesApp && appId !== 'ALL') continue;

    // 1. SIMPLE_SCHEDULE MODE EVALUATION (Supports multiple time windows)
    if (rule.modeType === 'SIMPLE_SCHEDULE' && rule.scheduleConfig) {
      const { windows, startHour, endHour, daysOfWeek } = rule.scheduleConfig;
      if (daysOfWeek.includes(currentDay)) {
        const windowList = (windows && windows.length > 0)
          ? windows
          : [{ id: '1', startHour: startHour ?? 0, startMinute: 0, endHour: endHour ?? 0, endMinute: 0 }];

        for (const win of windowList) {
          if (isHourInRange(currentHour, win.startHour, win.endHour)) {
            return {
              isRestricted: true,
              activeRuleName: rule.name,
              activeRuleId: rule.id,
              modeType: 'SIMPLE_SCHEDULE',
              reason: `Restricted during ${rule.name} schedule (${win.startHour}:00 - ${win.endHour}:00)`,
            };
          }
        }
      }
    }

    // 2. PER_TIMEFRAME_QUOTA MODE EVALUATION
    if (rule.modeType === 'PER_TIMEFRAME_QUOTA' && rule.quotaConfig) {
      const { dailyLimitMinutes, slotLimitMinutes, activeSlotHours, daysOfWeek } = rule.quotaConfig;
      if (daysOfWeek.includes(currentDay)) {
        // Daily total limit check
        if (appTodayUsageMinutes >= dailyLimitMinutes) {
          return {
            isRestricted: true,
            activeRuleName: rule.name,
            activeRuleId: rule.id,
            modeType: 'PER_TIMEFRAME_QUOTA',
            reason: `Exceeded daily quota limit (${dailyLimitMinutes} mins)`,
            remainingMinutesToday: 0,
          };
        }

        // Active slot limit check
        if (activeSlotHours.includes(currentHour)) {
          if (slotLimitMinutes && slotLimitMinutes > 0) {
            return {
              isRestricted: false,
              activeRuleName: rule.name,
              activeRuleId: rule.id,
              modeType: 'PER_TIMEFRAME_QUOTA',
              remainingSlotMinutes: Math.max(0, slotLimitMinutes),
              remainingMinutesToday: Math.max(0, dailyLimitMinutes - appTodayUsageMinutes),
            };
          }
        }
      }
    }

    // 3. FOCUS_INTERVAL MODE EVALUATION
    if (rule.modeType === 'FOCUS_INTERVAL' && rule.focusConfig) {
      const { enabledBedtime, bedtimeStartHour, bedtimeEndHour } = rule.focusConfig;
      if (enabledBedtime && bedtimeStartHour !== undefined && bedtimeEndHour !== undefined) {
        if (isHourInRange(currentHour, bedtimeStartHour, bedtimeEndHour)) {
          return {
            isRestricted: true,
            activeRuleName: rule.name,
            activeRuleId: rule.id,
            modeType: 'FOCUS_INTERVAL',
            reason: `Focus Bedtime lock in effect (${bedtimeStartHour}:00 - ${bedtimeEndHour}:00)`,
          };
        }
      }
    }
  }

  return {
    isRestricted: false,
    reason: 'App usage allowed',
  };
}

/**
 * Generate a 24-hour status timeline combining all enabled restriction rules
 * into an hourly array for visualization.
 */
export function generateCombined24HourMatrix(
  rules: RestrictionRule[],
  dayOfWeek: DayOfWeek = getCurrentDayOfWeek()
): HourlyHeatmapSlot[] {
  const activeRules = rules.filter(r => r.enabled);
  const matrix: HourlyHeatmapSlot[] = [];

  for (let hour = 0; hour < 24; hour++) {
    let isRestricted = false;
    let modeType: string | undefined = undefined;
    let allowedQuotaMinutes = 60;

    for (const rule of activeRules) {
      // Simple schedule check
      if (rule.modeType === 'SIMPLE_SCHEDULE' && rule.scheduleConfig) {
        if (rule.scheduleConfig.daysOfWeek.includes(dayOfWeek)) {
          const windowList = (rule.scheduleConfig.windows && rule.scheduleConfig.windows.length > 0)
            ? rule.scheduleConfig.windows
            : [{ id: '1', startHour: rule.scheduleConfig.startHour ?? 0, startMinute: 0, endHour: rule.scheduleConfig.endHour ?? 0, endMinute: 0 }];

          for (const win of windowList) {
            if (isHourInRange(hour, win.startHour, win.endHour)) {
              isRestricted = true;
              modeType = 'SIMPLE_SCHEDULE';
              allowedQuotaMinutes = 0;
              break;
            }
          }
          if (isRestricted) break;
        }
      }

      // Quota slot check
      if (rule.modeType === 'PER_TIMEFRAME_QUOTA' && rule.quotaConfig) {
        if (rule.quotaConfig.daysOfWeek.includes(dayOfWeek)) {
          if (rule.quotaConfig.activeSlotHours.includes(hour)) {
            if (!isRestricted) {
              modeType = 'PER_TIMEFRAME_QUOTA';
              allowedQuotaMinutes = rule.quotaConfig.slotLimitMinutes || 15;
            }
          }
        }
      }

      // Focus bedtime check
      if (rule.modeType === 'FOCUS_INTERVAL' && rule.focusConfig) {
        if (rule.focusConfig.enabledBedtime && rule.focusConfig.bedtimeStartHour !== undefined && rule.focusConfig.bedtimeEndHour !== undefined) {
          if (isHourInRange(hour, rule.focusConfig.bedtimeStartHour, rule.focusConfig.bedtimeEndHour)) {
            isRestricted = true;
            modeType = 'FOCUS_INTERVAL';
            allowedQuotaMinutes = 0;
            break;
          }
        }
      }
    }

    matrix.push({
      hour,
      isRestricted,
      activeModeType: modeType,
      usageMinutes: isRestricted ? 0 : Math.min(allowedQuotaMinutes, Math.floor(Math.random() * 25) + 5),
      allowedQuotaMinutes,
    });
  }

  return matrix;
}
