/**
 * Fullscreen API wrapper.
 */

/**
 * Toggle fullscreen mode on the document element.
 */
export async function toggleFullscreen(): Promise<boolean> {
  try {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
      return true;
    } else {
      await document.exitFullscreen();
      return false;
    }
  } catch {
    return false;
  }
}

/**
 * Check if currently in fullscreen.
 */
export function isFullscreen(): boolean {
  return !!document.fullscreenElement;
}

/**
 * Check if Fullscreen API is supported.
 */
export function isFullscreenSupported(): boolean {
  return typeof document !== 'undefined' && 'fullscreenEnabled' in document && document.fullscreenEnabled;
}
