import { RestrictionRule } from '../types/mode';

export const PRESET_RULES: RestrictionRule[] = [
  {
    id: 'preset-night-schedule',
    name: 'Night Sleep Window',
    modeType: 'SIMPLE_SCHEDULE',
    enabled: true,
    targetAppIds: ['com.facebook.katana', 'com.instagram.android', 'com.zhiliaoapp.musically', 'com.google.android.youtube'],
    scheduleConfig: {
      startHour: 18, // 6:00 PM
      startMinute: 0,
      endHour: 6,   // 6:00 AM
      endMinute: 0,
      daysOfWeek: [0, 1, 2, 3, 4, 5, 6], // Every day
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'preset-social-quota',
    name: 'Peak Hours Social Limit',
    modeType: 'PER_TIMEFRAME_QUOTA',
    enabled: true,
    targetAppIds: ['com.facebook.katana', 'com.instagram.android'],
    quotaConfig: {
      dailyLimitMinutes: 120, // 2 hours max / day
      slotLimitMinutes: 15,  // max 15 mins per hour slot
      activeSlotHours: [13, 14, 15, 17, 18, 19, 20, 21], // 1-3 PM & 5-9 PM
      daysOfWeek: [1, 2, 3, 4, 5], // Mon-Fri
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'preset-work-focus',
    name: 'Deep Focus & Cooldown',
    modeType: 'FOCUS_INTERVAL',
    enabled: false,
    targetAppIds: ['com.facebook.katana', 'com.instagram.android', 'com.supercell.clashofclans'],
    focusConfig: {
      sessionLimitMinutes: 25,
      cooldownMinutes: 10,
      enabledBedtime: true,
      bedtimeStartHour: 22,
      bedtimeEndHour: 6,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];
