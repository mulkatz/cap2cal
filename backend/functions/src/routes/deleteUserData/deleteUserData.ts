import { onCall, HttpsError } from 'firebase-functions/v2/https';
import * as admin from 'firebase-admin';
import { logger } from 'firebase-functions';

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

/**
 * Delete User Data Cloud Function
 *
 * Deletes all user data from Firestore including:
 * - User document from 'users' collection
 * - User subscription data from 'subscriptions' collection
 * - Any other user-related data
 *
 * This function requires authentication and can only delete the
 * authenticated user's own data (GDPR compliance).
 *
 * Call this function from the client with:
 * const deleteUserData = httpsCallable(functions, 'deleteUserData');
 * await deleteUserData();
 */
export const deleteUserData = onCall(
  {
    enforceAppCheck: true, // Require App Check to prevent abuse
    memory: '256MiB',
    timeoutSeconds: 30,
  },
  async (request) => {
    // Verify user is authenticated
    if (!request.auth) {
      logger.warn('[Delete User Data] Unauthenticated request blocked');
      throw new HttpsError('unauthenticated', 'User must be authenticated to delete data');
    }

    const userId = request.auth.uid;
    logger.info(`[Delete User Data] Deleting data for user: ${userId}`);

    try {
      // Start a batch delete operation
      const batch = db.batch();

      // 1. Delete user document from 'users' collection (if it exists)
      const userDocRef = db.collection('users').doc(userId);
      const userDoc = await userDocRef.get();
      if (userDoc.exists) {
        batch.delete(userDocRef);
        logger.info(`[Delete User Data] Queued deletion of user document: ${userId}`);
      }

      // 2. Delete subscription data from 'subscriptions' collection (if it exists)
      const subscriptionDocRef = db.collection('subscriptions').doc(userId);
      const subscriptionDoc = await subscriptionDocRef.get();
      if (subscriptionDoc.exists) {
        batch.delete(subscriptionDocRef);
        logger.info(`[Delete User Data] Queued deletion of subscription document: ${userId}`);
      }

      // 3. Delete any feedback submitted by the user
      const feedbackSnapshot = await db.collection('feedback').where('userId', '==', userId).get();
      feedbackSnapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });
      if (!feedbackSnapshot.empty) {
        logger.info(`[Delete User Data] Queued deletion of ${feedbackSnapshot.size} feedback documents`);
      }

      // 4. Delete any other user-related collections here
      // (Add more as your app grows)

      // Commit the batch delete
      await batch.commit();

      logger.info(`[Delete User Data] Successfully deleted all data for user: ${userId}`);

      return {
        success: true,
        message: 'All user data has been deleted successfully',
        deletedAt: new Date().toISOString(),
      };
    } catch (error: any) {
      logger.error('[Delete User Data] Error deleting user data', {
        userId,
        error: error.message,
        stack: error.stack,
      });

      throw new HttpsError('internal', 'Failed to delete user data. Please try again later.');
    }
  }
);
