/**
 * Date utility helpers for streak tracking and calendar heatmap.
 */

/**
 * Get today's date as YYYY-MM-DD string in local timezone.
 */
export function getToday(): string {
  return new Date().toISOString().split('T')[0];
}

/**
 * Get date string for N days ago.
 */
export function getDaysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().split('T')[0];
}

/**
 * Format a date string for display.
 */
export function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });
}

/**
 * Get day of week (0=Sun, 6=Sat) for a date string.
 */
export function getDayOfWeek(dateStr: string): number {
  return new Date(dateStr + 'T00:00:00').getDay();
}

/**
 * Generate an array of date strings for the last N days.
 */
export function getDateRange(days: number): string[] {
  const dates: string[] = [];
  for (let i = days - 1; i >= 0; i--) {
    dates.push(getDaysAgo(i));
  }
  return dates;
}

/**
 * Generate a unique ID.
 */
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

/**
 * Format a large number with commas.
 */
export function formatNumber(n: number): string {
  return n.toLocaleString();
}
