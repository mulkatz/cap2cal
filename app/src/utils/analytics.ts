/**
 * Analytics Events and Constants
 *
 * This file contains all analytics event names, parameters, and user properties
 * used throughout the application for consistent tracking and insights.
 */

// ============================================================================
// EVENT NAMES
// ============================================================================

export const AnalyticsEvent = {
  // User Journey & Screens
  SCREEN_VIEW: 'screen_view',
  APP_OPENED: 'app_opened',
  SESSION_START: 'session_start',

  // Onboarding
  ONBOARDING_STARTED: 'onboarding_started',
  ONBOARDING_SCREEN_VIEWED: 'onboarding_screen_viewed',
  ONBOARDING_COMPLETED: 'onboarding_completed',
  ONBOARDING_SKIPPED: 'onboarding_skipped',

  // Entry Points
  ENTRY_SHARE_INTENT: 'entry_share_intent',
  ENTRY_DIRECT: 'entry_direct',

  // Camera & Capture
  CAMERA_OPENED: 'camera_opened',
  IMAGE_CAPTURED: 'image_captured',
  IMAGE_SELECTED_FROM_GALLERY: 'image_selected_from_gallery',
  CAPTURE_CANCELLED: 'capture_cancelled',

  // Image Processing
  IMAGE_UPLOAD_STARTED: 'image_upload_started',
  IMAGE_UPLOAD_COMPLETED: 'image_upload_completed',
  EXTRACTION_STARTED: 'extraction_started',
  EXTRACTION_SUCCESS: 'extraction_success',
  EXTRACTION_ERROR: 'extraction_error',

  // Event Editing
  EVENT_PREVIEW_VIEWED: 'event_preview_viewed',
  EVENT_FIELD_EDITED: 'event_field_edited',
  EVENT_RETAKE_INITIATED: 'event_retake_initiated',

  // Calendar Integration
  CALENDAR_SAVE_INITIATED: 'calendar_save_initiated',
  CALENDAR_SAVE_SUCCESS: 'calendar_save_success',
  CALENDAR_SAVE_ERROR: 'calendar_save_error',

  // Sharing
  EVENT_SHARED: 'event_shared',
  SHARE_METHOD_SELECTED: 'share_method_selected',

  // Error Recovery
  ERROR_RETRY_ATTEMPTED: 'error_retry_attempted',
  ERROR_DISMISSED: 'error_dismissed',

  // User Engagement
  FEEDBACK_OPENED: 'feedback_opened',
  FEEDBACK_SUBMITTED: 'feedback_submitted',
  HELP_VIEWED: 'help_viewed',

  // Settings & History
  SETTINGS_OPENED: 'settings_opened',
  SETTINGS_CHANGED: 'settings_changed',
  HISTORY_OPENED: 'history_opened',
  DATA_EXPORTED: 'data_exported',
  STORAGE_CLEARED: 'storage_cleared',
  ACCOUNT_DELETED: 'account_deleted',

  // In-App Review
  REVIEW_PROMPT_SHOWN: 'review_prompt_shown',
  REVIEW_PROMPT_LIKED: 'review_prompt_liked',
  REVIEW_PROMPT_DISLIKED: 'review_prompt_disliked',
  REVIEW_PROMPT_DISMISSED: 'review_prompt_dismissed',
  NATIVE_REVIEW_TRIGGERED: 'native_review_triggered',
  NATIVE_REVIEW_SUCCESS: 'native_review_success',
  NATIVE_REVIEW_ERROR: 'native_review_error',

  // Subscription & Monetization
  PAYWALL_VIEWED: 'paywall_viewed',
  SUBSCRIPTION_PURCHASE_INITIATED: 'subscription_purchase_initiated',
  SUBSCRIPTION_PURCHASE_SUCCESS: 'subscription_purchase_success',
  SUBSCRIPTION_PURCHASE_FAILED: 'subscription_purchase_failed',
  SUBSCRIPTION_PURCHASE_CANCELLED: 'subscription_purchase_cancelled',
  SUBSCRIPTION_ACTIVATED: 'subscription_activated',
  SUBSCRIPTION_CANCELLED: 'subscription_cancelled',
  SUBSCRIPTION_RESTORED: 'subscription_restored',
  UPGRADE_BUTTON_CLICKED: 'upgrade_button_clicked',

  // Performance
  PERFORMANCE_TIMING: 'performance_timing',
} as const;

// ============================================================================
// EVENT PARAMETERS
// ============================================================================

export const AnalyticsParam = {
  // Screen & Navigation
  SCREEN_NAME: 'screen_name',
  PREVIOUS_SCREEN: 'previous_screen',

  // Onboarding
  ONBOARDING_STEP: 'step',
  ONBOARDING_DURATION_SEC: 'duration_sec',

  // Entry & Source
  ENTRY_POINT: 'entry_point',
  SOURCE: 'source',
  SHARE_INTENT_TYPE: 'share_intent_type',

  // Image & Capture
  IMAGE_SOURCE: 'image_source', // 'camera' | 'gallery' | 'share'
  IMAGE_SIZE_KB: 'image_size_kb',
  HAS_MULTIPLE_IMAGES: 'has_multiple_images',

  // Extraction
  EXTRACTION_REASON: 'reason', // Error reason
  RETRY_ATTEMPT: 'retry_attempt',

  // Event Data
  HAS_TITLE: 'has_title',
  HAS_DATE: 'has_date',
  HAS_TIME: 'has_time',
  HAS_LOCATION: 'has_location',
  HAS_DESCRIPTION: 'has_description',
  FIELD_EDITED: 'field_edited',
  EDIT_COUNT: 'edit_count',

  // Calendar
  CALENDAR_TYPE: 'calendar_type',
  CALENDAR_NAME: 'calendar_name',

  // Share
  SHARE_METHOD: 'share_method',

  // Performance
  DURATION_MS: 'duration_ms',
  TIMING_TYPE: 'timing_type', // 'upload' | 'extraction' | 'total'

  // Feedback
  FEEDBACK_TYPE: 'feedback_type', // 'idea' | 'bug' | 'default'

  // Session
  SESSION_DURATION_SEC: 'session_duration_sec',
  CAPTURES_IN_SESSION: 'captures_in_session',

  // Subscription
  SUBSCRIPTION_PLAN: 'subscription_plan', // 'monthly' | 'yearly'
  SUBSCRIPTION_PRICE: 'subscription_price',
  ERROR_CODE: 'error_code',
  ERROR_MESSAGE: 'error_message',
} as const;

// ============================================================================
// USER PROPERTIES
// ============================================================================

export const AnalyticsUserProperty = {
  PLATFORM: 'platform',
  BROWSER: 'browser',
  LANGUAGE: 'language',
  IS_SHARE_INTENT_USER: 'is_share_intent_user',
  TOTAL_CAPTURES: 'total_captures',
  TOTAL_SUCCESSES: 'total_successes',
  FIRST_CAPTURE_DATE: 'first_capture_date',
  LAST_CAPTURE_DATE: 'last_capture_date',
  IS_PRO: 'is_pro',
  SUBSCRIPTION_TYPE: 'subscription_type', // 'monthly' | 'yearly'
} as const;

// ============================================================================
// SCREEN NAMES
// ============================================================================

export const ScreenName = {
  ONBOARDING_VALUE_PROP: 'onboarding_value_prop',
  ONBOARDING_HOW_IT_WORKS: 'onboarding_how_it_works',
  ONBOARDING_TICKETS: 'onboarding_tickets',
  ONBOARDING_FREE_TRIAL: 'onboarding_free_trial',
  HOME: 'home',
  CAMERA: 'camera',
  PROCESSING: 'processing',
  EVENT_PREVIEW: 'event_preview',
  EVENT_EDIT: 'event_edit',
  ERROR: 'error',
  SUCCESS: 'success',
  FEEDBACK: 'feedback',
} as const;

// ============================================================================
// EXTRACTION ERROR REASONS (for consistency)
// ============================================================================

export const ExtractionErrorReason = {
  PROBABLY_NOT_AN_EVENT: 'PROBABLY_NOT_AN_EVENT',
  IMAGE_TOO_BLURRED: 'IMAGE_TOO_BLURRED',
  LOW_CONTRAST_OR_POOR_LIGHTING: 'LOW_CONTRAST_OR_POOR_LIGHTING',
  TEXT_TOO_SMALL: 'TEXT_TOO_SMALL',
  OVERLAPPING_TEXT_OR_GRAPHICS: 'OVERLAPPING_TEXT_OR_GRAPHICS',
  LIMIT_REACHED: 'LIMIT_REACHED',
  UNKNOWN: 'UNKNOWN',
} as const;

// ============================================================================
// HELPER TYPES
// ============================================================================

export type AnalyticsEventName = typeof AnalyticsEvent[keyof typeof AnalyticsEvent];
export type AnalyticsParamName = typeof AnalyticsParam[keyof typeof AnalyticsParam];
export type AnalyticsUserPropertyName = typeof AnalyticsUserProperty[keyof typeof AnalyticsUserProperty];
export type ScreenNameType = typeof ScreenName[keyof typeof ScreenName];
export type ExtractionErrorReasonType = typeof ExtractionErrorReason[keyof typeof ExtractionErrorReason];

// ============================================================================
// ANALYTICS UTILITIES
// ============================================================================

/**
 * Calculate which event fields are present in extracted data
 */
export function getEventFieldsPresence(eventData: any) {
  return {
    [AnalyticsParam.HAS_TITLE]: !!eventData?.title,
    [AnalyticsParam.HAS_DATE]: !!eventData?.date,
    [AnalyticsParam.HAS_TIME]: !!eventData?.time,
    [AnalyticsParam.HAS_LOCATION]: !!eventData?.location,
    [AnalyticsParam.HAS_DESCRIPTION]: !!eventData?.description,
  };
}

/**
 * Format timing data for performance events
 */
export function formatTimingEvent(timingType: string, durationMs: number) {
  return {
    [AnalyticsParam.TIMING_TYPE]: timingType,
    [AnalyticsParam.DURATION_MS]: Math.round(durationMs),
  };
}

/**
 * Format session data
 */
export function formatSessionData(capturesCount: number, durationSec: number) {
  return {
    [AnalyticsParam.CAPTURES_IN_SESSION]: capturesCount,
    [AnalyticsParam.SESSION_DURATION_SEC]: Math.round(durationSec),
  };
}
