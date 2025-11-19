import { db } from '../models/db';
import { getAuth, deleteUser as firebaseDeleteUser } from 'firebase/auth';
import toast from 'react-hot-toast';
import i18next from 'i18next';

/**
 * Export all user data to a JSON file
 */
export const exportUserData = async (): Promise<void> => {
  try {
    // Get all events from IndexedDB
    const events = await db.eventItems.toArray();

    const auth = getAuth();
    const currentUser = auth.currentUser;

    // Prepare export data (exclude base64 images to keep file size reasonable)
    const exportData = {
      exportDate: new Date().toISOString(),
      userId: currentUser?.uid || 'anonymous',
      appVersion: '1.2.6',
      events: events.map(event => ({
        id: event.id,
        title: event.title,
        kind: event.kind,
        tags: event.tags,
        dateFrom: event.dateTimeFrom.date,
        timeFrom: event.dateTimeFrom.time,
        dateTo: event.dateTimeTo?.date,
        timeTo: event.dateTimeTo?.time,
        location: {
          city: event.location?.city,
          address: event.location?.address,
        },
        description: {
          short: event.description.short,
          long: event.description.long,
        },
        agenda: event.agenda,
        favorite: event.isFavorite,
        ticketLink: event.alreadyFetchedTicketLink || event.ticketDirectLink,
        ticketSearchQuery: event.ticketSearchQuery,
        ticketAvailableProbability: event.ticketAvailableProbability,
        links: event.links,
        timestamp: event.timestamp,
        // Exclude imageData to keep file size reasonable
      })),
      totalEvents: events.length,
    };

    // Create JSON blob
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });

    // Create download link
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cap2cal-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success(i18next.t('toasts.dataManagement.exportSuccess'));
  } catch (error) {
    console.error('Export failed:', error);
    toast.error(i18next.t('toasts.dataManagement.exportError'));
    throw error;
  }
};

/**
 * Delete all user data (local and remote)
 */
export const deleteAllUserData = async (): Promise<void> => {
  try {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    // 1. Delete all local data from IndexedDB
    await db.eventItems.clear();

    // 2. Clear localStorage (except essential app data)
    const keysToKeep = ['i18nextLng']; // Keep language preference
    const allKeys = Object.keys(localStorage);
    allKeys.forEach(key => {
      if (!keysToKeep.includes(key)) {
        localStorage.removeItem(key);
      }
    });

    // 3. Delete user from Firebase Authentication
    if (currentUser) {
      try {
        // Note: This will also trigger the user to be logged out
        await firebaseDeleteUser(currentUser);
      } catch (error: any) {
        // If user needs to re-authenticate, guide them
        if (error.code === 'auth/requires-recent-login') {
          toast.error(i18next.t('toasts.dataManagement.reAuthRequired'));
          throw error;
        }
      }
    }

    toast.success(i18next.t('toasts.dataManagement.deleteSuccess'));
  } catch (error) {
    console.error('Delete failed:', error);
    toast.error(i18next.t('toasts.dataManagement.deleteError'));
    throw error;
  }
};

/**
 * Clear local storage (cache)
 */
export const clearLocalStorage = async (): Promise<void> => {
  try {
    // Clear all events from IndexedDB
    await db.eventItems.clear();

    // Clear capture count
    localStorage.removeItem('captureCount');
    localStorage.removeItem('successfulCaptureCount');

    toast.success(i18next.t('toasts.dataManagement.clearSuccess'));
  } catch (error) {
    console.error('Clear storage failed:', error);
    toast.error(i18next.t('toasts.dataManagement.clearError'));
    throw error;
  }
};
