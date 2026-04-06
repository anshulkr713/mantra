import { createPersistentState } from './persistence.svelte';
import type { AppSettings } from '../types';

const DEFAULT_SETTINGS: AppSettings = {
  darkMode: 'dark',
  hapticEnabled: true,
  audioEnabled: false,
  audioType: 'bell',
  wakeLockEnabled: true,
  showMalaBeads: true
};

const settingsState = createPersistentState<AppSettings>('mantra-settings', DEFAULT_SETTINGS);

export function getSettings() {
  return settingsState;
}

export function updateSetting<K extends keyof AppSettings>(key: K, value: AppSettings[K]) {
  settingsState.value = { ...settingsState.value, [key]: value };
}

export function applyTheme(mode: AppSettings['darkMode']) {
  if (typeof document === 'undefined') return;

  if (mode === 'system') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
  } else {
    document.documentElement.setAttribute('data-theme', mode);
  }
}
