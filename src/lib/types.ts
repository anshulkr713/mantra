export interface MantraProfile {
  id: string;
  name: string;
  sanskritName?: string;
  target: number;
  totalCount: number;
  totalRounds: number;
  createdAt: number;
  color?: string;
}

export interface DailyRecord {
  date: string; // YYYY-MM-DD
  mantraId: string;
  count: number;
  rounds: number;
}

export interface AppSettings {
  darkMode: 'system' | 'dark' | 'light';
  hapticEnabled: boolean;
  audioEnabled: boolean;
  audioType: 'bell' | 'click';
  wakeLockEnabled: boolean;
  showMalaBeads: boolean;
}

export type ViewTab = 'counter' | 'history' | 'mantras';
