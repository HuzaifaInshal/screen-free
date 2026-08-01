export interface HourlyHeatmapSlot {
  hour: number;          // 0 to 23
  isRestricted: boolean;
  activeModeType?: string;
  usageMinutes: number;
  allowedQuotaMinutes: number;
}

export interface DayAnalytics {
  dateString: string;     // YYYY-MM-DD
  totalScreenTimeMinutes: number;
  totalTimeSavedMinutes: number;
  blockCount: number;
  overrideCount: number;
  hourlySlots: HourlyHeatmapSlot[];
}

export interface EmergencyOverrideState {
  isActive: boolean;
  expiresAt: string | null;
  durationMinutes: number;
  reason?: string;
}
