export type LimitingModeType = 
  | 'SIMPLE_SCHEDULE'
  | 'PER_TIMEFRAME_QUOTA'
  | 'FOCUS_INTERVAL';

export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0=Sunday, 1=Monday ... 6=Saturday

export interface TimeWindow {
  id: string;
  startHour: number;   // 0-23 (e.g. 18 for 6 PM)
  startMinute: number; // 0-59
  endHour: number;     // 0-23 (e.g. 6 for 6 AM)
  endMinute: number;   // 0-59
}

export interface SimpleScheduleConfig {
  windows?: TimeWindow[]; // Multiple time windows support (e.g. [{9AM-12PM}, {6PM-6AM}])
  startHour?: number;    // Backward compatibility
  startMinute?: number;  // Backward compatibility
  endHour?: number;      // Backward compatibility
  endMinute?: number;    // Backward compatibility
  daysOfWeek: DayOfWeek[];
}

export interface QuotaTimeframeConfig {
  dailyLimitMinutes: number;   // e.g. 120 (2 hrs)
  slotLimitMinutes?: number;   // e.g. 15 mins allowed inside selected hourly slots
  activeSlotHours: number[];   // e.g. [13, 14, 17, 18, 19, 20] (1-3 PM and 5-9 PM)
  daysOfWeek: DayOfWeek[];
}

export interface FocusIntervalConfig {
  sessionLimitMinutes: number; // e.g. 25 minutes continuous usage
  cooldownMinutes: number;     // e.g. 10 minutes required break
  bedtimeStartHour?: number;   // e.g. 22 (10 PM)
  bedtimeEndHour?: number;     // e.g. 6 (6 AM)
  enabledBedtime: boolean;
}

export interface RestrictionRule {
  id: string;
  name: string;
  modeType: LimitingModeType;
  enabled: boolean;
  targetAppIds: string[];      // Array of app package names or 'ALL'
  targetCategory?: string;
  scheduleConfig?: SimpleScheduleConfig;
  quotaConfig?: QuotaTimeframeConfig;
  focusConfig?: FocusIntervalConfig;
  createdAt: string;
  updatedAt: string;
}

export interface RuleEvaluationResult {
  isRestricted: boolean;
  activeRuleName?: string;
  activeRuleId?: string;
  modeType?: LimitingModeType;
  reason?: string;
  remainingMinutesToday?: number;
  remainingSlotMinutes?: number;
  nextAllowedTime?: string;
}
