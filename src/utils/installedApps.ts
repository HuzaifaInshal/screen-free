import { NativeModules, Platform } from 'react-native';
import { MobileApp } from '../types/app';

export async function fetchRealInstalledApps(): Promise<MobileApp[]> {
  if (Platform.OS === 'android') {
    try {
      // Access native Android PackageManager via linked LauncherKit module
      if (NativeModules.LauncherKit || NativeModules.InstalledApps) {
        const LauncherKit = require('react-native-launcher-kit');
        if (LauncherKit && LauncherKit.InstalledApps && typeof LauncherKit.InstalledApps.getSortedApps === 'function') {
          const realApps = await LauncherKit.InstalledApps.getSortedApps();
          if (Array.isArray(realApps) && realApps.length > 0) {
            return realApps.map((item: any, index: number) => {
              const iconUri = item.icon
                ? (item.icon.startsWith('data:') ? item.icon : `data:image/png;base64,${item.icon}`)
                : undefined;
              return {
                id: item.packageName || `app-${index}`,
                name: item.label || item.packageName || `App ${index + 1}`,
                category: categorizeApp(item.label || item.packageName),
                iconName: getCategoryIcon(categorizeApp(item.label || item.packageName)),
                iconColor: getAppBrandColor(item.label || item.packageName),
                iconUri,
                todayUsageMinutes: 0,
                weeklyUsageMinutes: [0, 0, 0, 0, 0, 0, 0],
              };
            });
          }
        }
      }
    } catch (err) {
      console.warn('Native installed apps module not available in Expo Go sandbox', err);
    }
  }

  // NO mock apps fallback: returns empty array if native installed app module is not loaded
  return [];
}

function categorizeApp(name: string = ''): any {
  const lower = name.toLowerCase();
  if (lower.includes('face') || lower.includes('insta') || lower.includes('tweet') || lower.includes('twitter') || lower.includes('reddit') || lower.includes('snap') || lower.includes('linkedin') || lower.includes('pinterest') || lower.includes('threads')) return 'Social Media';
  if (lower.includes('tube') || lower.includes('netfl') || lower.includes('prime') || lower.includes('spotif') || lower.includes('stream') || lower.includes('twitch') || lower.includes('disney') || lower.includes('hulu') || lower.includes('music')) return 'Entertainment';
  if (lower.includes('game') || lower.includes('clash') || lower.includes('pubg') || lower.includes('call') || lower.includes('craft') || lower.includes('subway') || lower.includes('candy') || lower.includes('roblox')) return 'Gaming';
  if (lower.includes('amazon') || lower.includes('ebay') || lower.includes('shop') || lower.includes('walmart') || lower.includes('aliexpress') || lower.includes('target') || lower.includes('shein')) return 'Shopping';
  if (lower.includes('chat') || lower.includes('what') || lower.includes('tele') || lower.includes('signal') || lower.includes('mess') || lower.includes('disc') || lower.includes('slack')) return 'Communication';
  if (lower.includes('mail') || lower.includes('drive') || lower.includes('doc') || lower.includes('sheet') || lower.includes('notion') || lower.includes('zoom') || lower.includes('office') || lower.includes('pdf')) return 'Productivity';
  return 'Utilities';
}

function getCategoryIcon(category: string): string {
  switch (category) {
    case 'Social Media': return 'people-outline';
    case 'Entertainment': return 'film-outline';
    case 'Gaming': return 'game-controller-outline';
    case 'Shopping': return 'cart-outline';
    case 'Communication': return 'chatbubbles-outline';
    case 'Productivity': return 'briefcase-outline';
    default: return 'apps-outline';
  }
}

function getAppBrandColor(name: string = ''): string {
  const lower = name.toLowerCase();
  if (lower.includes('insta')) return '#E4405F';
  if (lower.includes('face')) return '#1877F2';
  if (lower.includes('tube')) return '#FF0000';
  if (lower.includes('what')) return '#25D366';
  if (lower.includes('tweet') || lower.includes('twitter')) return '#1DA1F2';
  if (lower.includes('red')) return '#FF4500';
  if (lower.includes('snap')) return '#FFFC00';
  if (lower.includes('spot')) return '#1DB954';
  if (lower.includes('disc')) return '#5865F2';
  if (lower.includes('slack')) return '#4A154B';
  return '#00f2fe';
}
