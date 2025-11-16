/**
 * Utility functions for tracking in-app review prompt state
 */

const REVIEW_PROMPT_SHOWN_KEY = 'reviewPromptShown';
const REVIEW_PROMPT_LAST_DATE_KEY = 'reviewPromptLastDate';
const REVIEW_PROMPT_ATTEMPT_COUNT_KEY = 'reviewPromptAttemptCount';

const MIN_CAPTURES_FOR_REVIEW = 3;
const COOLDOWN_DAYS = 30;
const MAX_PROMPT_ATTEMPTS = 3;

/**
 * Check if we've already shown the review prompt
 */
export const hasShownReviewPrompt = (): boolean => {
  const shown = localStorage.getItem(REVIEW_PROMPT_SHOWN_KEY);
  return shown === 'true';
};

/**
 * Get the last date when review prompt was shown
 */
export const getLastReviewPromptDate = (): Date | null => {
  const dateStr = localStorage.getItem(REVIEW_PROMPT_LAST_DATE_KEY);
  return dateStr ? new Date(dateStr) : null;
};

/**
 * Get the number of times we've attempted to show the review prompt
 */
export const getReviewPromptAttemptCount = (): number => {
  const count = localStorage.getItem(REVIEW_PROMPT_ATTEMPT_COUNT_KEY);
  return count ? parseInt(count, 10) : 0;
};

/**
 * Check if enough time has passed since last prompt (30-day cooldown)
 */
export const canShowReviewPromptByCooldown = (): boolean => {
  const lastDate = getLastReviewPromptDate();
  if (!lastDate) {
    return true; // Never shown before
  }

  const now = new Date();
  const daysSinceLastPrompt = Math.floor(
    (now.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  return daysSinceLastPrompt >= COOLDOWN_DAYS;
};

/**
 * Check if we should show the review prompt based on all conditions
 * @param captureCount Current number of successful captures
 * @returns true if all conditions are met to show the prompt
 */
export const shouldShowReviewPrompt = (captureCount: number): boolean => {
  // Must have at least MIN_CAPTURES_FOR_REVIEW successful captures
  if (captureCount < MIN_CAPTURES_FOR_REVIEW) {
    return false;
  }

  // Check if we've exceeded max attempts
  const attemptCount = getReviewPromptAttemptCount();
  if (attemptCount >= MAX_PROMPT_ATTEMPTS) {
    console.log('[Review Prompt] Max attempts reached');
    return false;
  }

  // Check cooldown period
  if (!canShowReviewPromptByCooldown()) {
    console.log('[Review Prompt] Still in cooldown period');
    return false;
  }

  return true;
};

/**
 * Mark that the review prompt has been shown
 */
export const markReviewPromptShown = (): void => {
  const now = new Date();
  const currentAttempts = getReviewPromptAttemptCount();

  localStorage.setItem(REVIEW_PROMPT_SHOWN_KEY, 'true');
  localStorage.setItem(REVIEW_PROMPT_LAST_DATE_KEY, now.toISOString());
  localStorage.setItem(
    REVIEW_PROMPT_ATTEMPT_COUNT_KEY,
    (currentAttempts + 1).toString()
  );

  console.log(
    `[Review Prompt] Marked as shown. Attempt ${currentAttempts + 1}/${MAX_PROMPT_ATTEMPTS}`
  );
};

/**
 * Reset review prompt tracking (useful for testing)
 */
export const resetReviewPromptTracking = (): void => {
  localStorage.removeItem(REVIEW_PROMPT_SHOWN_KEY);
  localStorage.removeItem(REVIEW_PROMPT_LAST_DATE_KEY);
  localStorage.removeItem(REVIEW_PROMPT_ATTEMPT_COUNT_KEY);
  console.log('[Review Prompt] Reset tracking');
};

/**
 * Get debug info about review prompt state
 */
export const getReviewPromptDebugInfo = () => {
  return {
    hasShown: hasShownReviewPrompt(),
    lastDate: getLastReviewPromptDate(),
    attemptCount: getReviewPromptAttemptCount(),
    canShowByCooldown: canShowReviewPromptByCooldown(),
  };
};
