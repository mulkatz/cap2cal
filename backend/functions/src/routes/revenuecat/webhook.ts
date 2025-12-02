import { onRequest } from 'firebase-functions/v2/https';
import { logger } from 'firebase-functions/v2';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import * as crypto from 'crypto';

/**
 * RevenueCat Webhook Handler
 *
 * This function receives webhook events from RevenueCat and updates
 * user subscription status in Firestore.
 *
 * Setup Instructions:
 * 1. Deploy this function: `firebase deploy --only functions:revenuecatWebhook`
 * 2. Copy the deployed function URL (e.g., https://us-central1-cap2cal.cloudfunctions.net/revenuecatWebhook)
 * 3. Go to RevenueCat Dashboard → Project Settings → Webhooks
 * 4. Add webhook URL and copy the Authorization Header (shared secret)
 * 5. Add shared secret to Firebase environment config:
 *    `firebase functions:config:set revenuecat.webhook_secret="your_secret_here"`
 *
 * Webhook Events Documentation:
 * https://www.revenuecat.com/docs/integrations/webhooks
 */

/**
 * RevenueCat Event Types
 */
export enum RevenueCatEventType {
  // Purchase Events
  INITIAL_PURCHASE = 'INITIAL_PURCHASE',
  RENEWAL = 'RENEWAL',
  PRODUCT_CHANGE = 'PRODUCT_CHANGE',

  // Cancellation Events
  CANCELLATION = 'CANCELLATION',
  UNCANCELLATION = 'UNCANCELLATION',

  // Expiration Events
  EXPIRATION = 'EXPIRATION',

  // Billing Issues
  BILLING_ISSUE = 'BILLING_ISSUE',

  // Subscriber Attributes
  SUBSCRIBER_ALIAS = 'SUBSCRIBER_ALIAS',

  // Trial Events
  TRIAL_STARTED = 'TRIAL_STARTED',
  TRIAL_CONVERTED = 'TRIAL_CONVERTED',
  TRIAL_CANCELLED = 'TRIAL_CANCELLED',

  // Refund
  REFUND = 'REFUND',

  // Non-subscription events
  NON_RENEWING_PURCHASE = 'NON_RENEWING_PURCHASE',
}

/**
 * Events that should activate Pro status
 */
const PRO_ACTIVATION_EVENTS = [
  RevenueCatEventType.INITIAL_PURCHASE,
  RevenueCatEventType.RENEWAL,
  RevenueCatEventType.UNCANCELLATION,
  RevenueCatEventType.TRIAL_STARTED,
  RevenueCatEventType.TRIAL_CONVERTED,
  RevenueCatEventType.NON_RENEWING_PURCHASE,
];

/**
 * Events that should deactivate Pro status
 */
const PRO_DEACTIVATION_EVENTS = [
  RevenueCatEventType.EXPIRATION,
  RevenueCatEventType.REFUND,
];

/**
 * Events that indicate future cancellation (don't change status immediately)
 */
const PRO_CANCELLATION_SCHEDULED_EVENTS = [
  RevenueCatEventType.CANCELLATION,
];

interface RevenueCatWebhookEvent {
  api_version: string;
  event: {
    aliases: string[];
    app_id: string;
    app_user_id: string;
    commission_percentage: number;
    country_code: string;
    currency: string;
    entitlement_id: string | null;
    entitlement_ids: string[];
    environment: 'PRODUCTION' | 'SANDBOX';
    event_timestamp_ms: number;
    expiration_at_ms: number | null;
    id: string;
    is_family_share: boolean;
    offer_code: string | null;
    original_app_user_id: string;
    original_transaction_id: string;
    period_type: string;
    presented_offering_id: string | null;
    price: number;
    price_in_purchased_currency: number;
    product_id: string;
    purchased_at_ms: number;
    store: 'APP_STORE' | 'PLAY_STORE' | 'STRIPE' | 'PROMOTIONAL';
    subscriber_attributes: Record<string, any>;
    takehome_percentage: number;
    tax_percentage: number;
    transaction_id: string;
    type: RevenueCatEventType;
  };
}

/**
 * Verify webhook signature
 * RevenueCat includes the Authorization header with requests
 */
const verifyWebhookSignature = (
  authHeader: string | undefined,
  expectedSecret: string
): boolean => {
  if (!authHeader || !expectedSecret) {
    logger.warn('[RevenueCat] Missing auth header or secret');
    return false;
  }

  // RevenueCat sends "Bearer <secret>"
  const providedSecret = authHeader.replace('Bearer ', '');

  // Use timing-safe comparison to prevent timing attacks
  try {
    return crypto.timingSafeEqual(
      Buffer.from(providedSecret),
      Buffer.from(expectedSecret)
    );
  } catch (error) {
    logger.error('[RevenueCat] Error comparing secrets', error);
    return false;
  }
};

/**
 * Main webhook handler
 */
export const revenuecatWebhook = onRequest(
  {
    region: 'us-central1',
    maxInstances: 10,
  },
  async (req, res) => {
    // Only accept POST requests
    if (req.method !== 'POST') {
      logger.warn('[RevenueCat] Invalid method', { method: req.method });
      res.status(405).send('Method Not Allowed');
      return;
    }

    try {
      // Verify webhook signature
      const webhookSecret = process.env.REVENUECAT_WEBHOOK_SECRET;

      if (webhookSecret) {
        const authHeader = req.headers.authorization;
        const isValid = verifyWebhookSignature(authHeader, webhookSecret);

        if (!isValid) {
          logger.warn('[RevenueCat] Invalid webhook signature');
          res.status(401).send('Unauthorized');
          return;
        }

        logger.info('[RevenueCat] Webhook signature verified');
      } else {
        logger.warn('[RevenueCat] No webhook secret configured - skipping signature verification');
      }

      // Parse webhook payload
      const webhookData = req.body as RevenueCatWebhookEvent;
      const { event } = webhookData;

      logger.info('[RevenueCat] Received webhook event', {
        type: event.type,
        userId: event.app_user_id,
        environment: event.environment,
        productId: event.product_id,
        transactionId: event.transaction_id,
      });

      // Get user ID (this should match the Firebase UID we passed to RevenueCat)
      const userId = event.app_user_id;

      if (!userId) {
        logger.error('[RevenueCat] No app_user_id in webhook event');
        res.status(400).send('Bad Request: Missing app_user_id');
        return;
      }

      // Get Firestore reference
      const firestore = getFirestore();
      const userRef = firestore.collection('users').doc(userId);

      // Determine what action to take based on event type
      const eventType = event.type;

      if (PRO_ACTIVATION_EVENTS.includes(eventType)) {
        // Activate Pro status
        await userRef.set(
          {
            isPro: true,
            subscriptionStatus: 'active',
            subscriptionProductId: event.product_id,
            subscriptionStore: event.store,
            subscriptionEnvironment: event.environment,
            lastSubscriptionEvent: eventType,
            lastSubscriptionEventAt: FieldValue.serverTimestamp(),
            subscriptionExpiresAt: event.expiration_at_ms
              ? new Date(event.expiration_at_ms)
              : null,
            subscriptionStartedAt: event.purchased_at_ms
              ? new Date(event.purchased_at_ms)
              : FieldValue.serverTimestamp(),
          },
          { merge: true }
        );

        logger.info('[RevenueCat] ✅ Pro status ACTIVATED', {
          userId,
          eventType,
          productId: event.product_id,
        });
      } else if (PRO_DEACTIVATION_EVENTS.includes(eventType)) {
        // Deactivate Pro status
        await userRef.set(
          {
            isPro: false,
            subscriptionStatus: 'expired',
            lastSubscriptionEvent: eventType,
            lastSubscriptionEventAt: FieldValue.serverTimestamp(),
            subscriptionExpiredAt: FieldValue.serverTimestamp(),
          },
          { merge: true }
        );

        logger.info('[RevenueCat] ❌ Pro status DEACTIVATED', {
          userId,
          eventType,
          productId: event.product_id,
        });
      } else if (PRO_CANCELLATION_SCHEDULED_EVENTS.includes(eventType)) {
        // User cancelled but subscription is still active until expiration
        await userRef.set(
          {
            isPro: true, // Keep Pro status until expiration
            subscriptionStatus: 'cancelled',
            subscriptionWillExpireAt: event.expiration_at_ms
              ? new Date(event.expiration_at_ms)
              : null,
            lastSubscriptionEvent: eventType,
            lastSubscriptionEventAt: FieldValue.serverTimestamp(),
          },
          { merge: true }
        );

        logger.info('[RevenueCat] 📅 Cancellation scheduled (Pro still active)', {
          userId,
          eventType,
          expiresAt: event.expiration_at_ms,
        });
      } else if (eventType === RevenueCatEventType.BILLING_ISSUE) {
        // Billing issue - keep Pro status but flag for attention
        await userRef.set(
          {
            subscriptionStatus: 'billing_issue',
            lastSubscriptionEvent: eventType,
            lastSubscriptionEventAt: FieldValue.serverTimestamp(),
          },
          { merge: true }
        );

        logger.warn('[RevenueCat] ⚠️ Billing issue detected', {
          userId,
          eventType,
        });
      } else {
        // Other events - just log them
        await userRef.set(
          {
            lastSubscriptionEvent: eventType,
            lastSubscriptionEventAt: FieldValue.serverTimestamp(),
          },
          { merge: true }
        );

        logger.info('[RevenueCat] Event logged (no status change)', {
          userId,
          eventType,
        });
      }

      // Log event to subcollection for audit trail
      await userRef.collection('subscriptionEvents').add({
        eventType,
        eventData: event,
        receivedAt: FieldValue.serverTimestamp(),
      });

      // Return 200 to acknowledge receipt
      res.status(200).send('OK');
    } catch (error) {
      logger.error('[RevenueCat] Webhook processing error', error);
      res.status(500).send('Internal Server Error');
    }
  }
);
