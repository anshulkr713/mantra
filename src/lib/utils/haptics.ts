/**
 * Trigger haptic feedback via Vibration API (Android only).
 * Gracefully degrades on iOS/desktop.
 */
export function vibrate(pattern: number | number[] = 15): void {
  try {
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  } catch {
    // Silently fail — vibration not available
  }
}

/**
 * Short tap vibration
 */
export function tapVibrate(): void {
  vibrate(10);
}

/**
 * Completion vibration pattern (mala round complete)
 */
export function completionVibrate(): void {
  vibrate([50, 100, 50, 100, 200]);
}

/**
 * Check if vibration is supported
 */
export function isVibrationSupported(): boolean {
  return typeof navigator !== 'undefined' && 'vibrate' in navigator;
}
