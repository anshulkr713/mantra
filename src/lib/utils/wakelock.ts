/**
 * Screen Wake Lock API wrapper.
 * Keeps screen on during japa meditation.
 */

let wakeLockSentinel: WakeLockSentinel | null = null;

/**
 * Request a screen wake lock to prevent the device from sleeping.
 */
export async function requestWakeLock(): Promise<boolean> {
  try {
    if (!('wakeLock' in navigator)) return false;

    wakeLockSentinel = await navigator.wakeLock.request('screen');

    // Re-acquire on visibility change (browser releases lock when tab hidden)
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return true;
  } catch (err) {
    console.warn('Wake Lock request failed:', err);
    return false;
  }
}

/**
 * Release the screen wake lock.
 */
export async function releaseWakeLock(): Promise<void> {
  try {
    document.removeEventListener('visibilitychange', handleVisibilityChange);
    if (wakeLockSentinel) {
      await wakeLockSentinel.release();
      wakeLockSentinel = null;
    }
  } catch {
    // Already released
  }
}

/**
 * Check if wake lock is currently active.
 */
export function isWakeLockActive(): boolean {
  return wakeLockSentinel !== null && !wakeLockSentinel.released;
}

/**
 * Check if Wake Lock API is supported.
 */
export function isWakeLockSupported(): boolean {
  return typeof navigator !== 'undefined' && 'wakeLock' in navigator;
}

async function handleVisibilityChange(): Promise<void> {
  if (document.visibilityState === 'visible' && wakeLockSentinel !== null) {
    try {
      wakeLockSentinel = await navigator.wakeLock.request('screen');
    } catch {
      // Failed to re-acquire
    }
  }
}
