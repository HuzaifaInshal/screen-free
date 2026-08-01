import { DayOfWeek } from '../types/mode';

export const DAYS_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
export const DAYS_FULL = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/**
 * Format an hour number (0-23) into 12-hour format string (e.g., "6 PM", "12 AM")
 */
export function formatHourLabel(hour: number): string {
  const h = hour % 24;
  if (h === 0) return '12 AM';
  if (h === 12) return '12 PM';
  if (h < 12) return `${h} AM`;
  return `${h - 12} PM`;
}

/**
 * Format minutes into human-readable duration (e.g., 135 -> "2h 15m")
 */
export function formatMinutes(minutes: number): string {
  if (minutes < 0) minutes = 0;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
}

/**
 * Format start and end hours into a clean string (e.g., "6:00 PM – 6:00 AM")
 */
export function formatTimeWindow(startHour: number, endHour: number): string {
  return `${formatHourLabel(startHour)} – ${formatHourLabel(endHour)}`;
}

/**
 * Check if a given hour falls inside a range [startHour, endHour).
 * Handles overnight ranges (e.g., 18:00 to 06:00).
 */
export function isHourInRange(hour: number, startHour: number, endHour: number): boolean {
  if (startHour === endHour) return false;
  
  if (startHour < endHour) {
    // Standard daytime range (e.g., 9 AM to 5 PM)
    return hour >= startHour && hour < endHour;
  } else {
    // Overnight range (e.g., 6 PM to 6 AM)
    return hour >= startHour || hour < endHour;
  }
}

/**
 * Calculate total hours restricted in a start/end window
 */
export function calculateWindowDuration(startHour: number, endHour: number): number {
  if (startHour === endHour) return 0;
  if (startHour < endHour) {
    return endHour - startHour;
  } else {
    return (24 - startHour) + endHour;
  }
}

/**
 * Get current day index (0 = Sunday, 1 = Monday ... 6 = Saturday)
 */
export function getCurrentDayOfWeek(): DayOfWeek {
  return new Date().getDay() as DayOfWeek;
}

/**
 * Get current hour of day (0-23)
 */
export function getCurrentHour(): number {
  return new Date().getHours();
}
