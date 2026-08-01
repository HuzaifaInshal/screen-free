export type AppCategory = 
  | 'Social Media'
  | 'Entertainment'
  | 'Gaming'
  | 'Productivity'
  | 'Shopping'
  | 'All Apps';

export interface MobileApp {
  id: string;             // unique app bundle identifier
  name: string;           // e.g. "Facebook", "Instagram", "YouTube"
  category: AppCategory;  // e.g. "Social Media"
  iconName: string;       // Vector icon name
  iconColor: string;      // Accent color
  todayUsageMinutes: number; // Current day accumulated usage
  weeklyUsageMinutes: number[]; // Last 7 days usage array
}
