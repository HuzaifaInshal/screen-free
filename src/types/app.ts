export type AppCategory = 
  | 'Social Media'
  | 'Entertainment'
  | 'Gaming'
  | 'Productivity'
  | 'Shopping'
  | 'Utilities'
  | 'Communication'
  | 'All Apps';

export interface MobileApp {
  id: string;             // unique app bundle identifier
  name: string;           // e.g. "Facebook", "Instagram", "YouTube"
  category: AppCategory;  // e.g. "Social Media"
  iconName: string;       // Vector icon name
  iconColor: string;      // Accent color
  todayUsageMinutes: number; // Current day accumulated usage
  weeklyUsageMinutes: number[]; // Last 7 days usage array
  isCustom?: boolean;     // Added by user
}

export interface AppCollection {
  id: string;             // e.g. "col-1"
  name: string;           // e.g. "Social & Doomscroll"
  iconName: string;       // e.g. "grid-outline" or "albums"
  color: string;          // e.g. "#7f00ff"
  appIds: string[];       // array of app IDs in this collection
}
