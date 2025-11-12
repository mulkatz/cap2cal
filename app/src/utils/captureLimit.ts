/**
 * Utility functions for tracking capture count on frontend
 */

const CAPTURE_COUNT_KEY = 'captureCount';

/**
 * Get the current capture count from localStorage
 */
export const getCaptureCount = (): number => {
  const count = localStorage.getItem(CAPTURE_COUNT_KEY);
  return count ? parseInt(count, 10) : 0;
};

/**
 * Increment the capture count in localStorage
 */
export const incrementCaptureCount = (): number => {
  const currentCount = getCaptureCount();
  const newCount = currentCount + 1;
  localStorage.setItem(CAPTURE_COUNT_KEY, newCount.toString());
  console.log(`[Capture Limit] Incremented count to ${newCount}`);
  return newCount;
};

/**
 * Reset the capture count (useful for testing or when user upgrades to pro)
 */
export const resetCaptureCount = (): void => {
  localStorage.setItem(CAPTURE_COUNT_KEY, '0');
  console.log('[Capture Limit] Reset count to 0');
};

/**
 * Check if user has reached the capture limit
 * @param limit The maximum number of free captures allowed
 * @returns true if limit is reached, false otherwise
 */
export const hasReachedLimit = (limit: number): boolean => {
  const count = getCaptureCount();
  return count >= limit;
};
