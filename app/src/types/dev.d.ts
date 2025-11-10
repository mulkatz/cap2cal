import { ExtractionError } from '../api/model';

declare global {
  interface Window {
    /**
     * Dev function to trigger the paywall sheet for testing
     * Only available in development mode
     *
     * @example
     * ```js
     * window.__triggerPaywall()
     * ```
     */
    __triggerPaywall?: () => void;

    /**
     * Dev function to trigger any extraction error for testing
     * Only available in development mode
     *
     * @example
     * ```js
     * window.__triggerError('LIMIT_REACHED')
     * window.__triggerError('PROBABLY_NOT_AN_EVENT')
     * ```
     */
    __triggerError?: (errorType: ExtractionError) => void;
  }
}

export {};
