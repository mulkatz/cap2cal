import { ApiEvent } from '../models/api.types';
import { logger } from './logger';

const CACHE_KEY_PREFIX = 'enrichment_cache_';
const CACHE_VERSION = 'v1';
const MAX_CACHE_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

interface CachedEnrichment {
  version: string;
  timestamp: number;
  data: {
    description: {
      short: string;
      long?: string;
    };
    tags: string[];
    location?: {
      city?: string;
      address?: string;
    };
    ticketAvailableProbability?: number;
    ticketSearchQuery?: string;
  };
}

/**
 * Generate a cache key based on event's core properties
 * This creates a unique identifier for the event that remains stable
 */
const generateCacheKey = (event: Partial<ApiEvent>): string => {
  const keyData = {
    title: event.title?.toLowerCase().trim(),
    date: event.dateTimeFrom?.date,
    time: event.dateTimeFrom?.time,
    location: event.location?.address?.toLowerCase().trim(),
  };

  // Simple hash - in production you might want a proper hash function
  const keyString = JSON.stringify(keyData);
  return `${CACHE_KEY_PREFIX}${CACHE_VERSION}_${btoa(keyString).substring(0, 32)}`;
};

/**
 * Check if enrichment data exists in cache
 * Returns cached data if found and not expired, null otherwise
 */
export const getCachedEnrichment = (event: Partial<ApiEvent>): CachedEnrichment['data'] | null => {
  try {
    const cacheKey = generateCacheKey(event);
    const cached = localStorage.getItem(cacheKey);

    if (!cached) {
      logger.debug('EnrichmentCache', 'Cache miss', { eventTitle: event.title });
      return null;
    }

    const cachedData: CachedEnrichment = JSON.parse(cached);

    // Check version
    if (cachedData.version !== CACHE_VERSION) {
      logger.debug('EnrichmentCache', 'Cache version mismatch, invalidating', {
        cached: cachedData.version,
        current: CACHE_VERSION,
      });
      localStorage.removeItem(cacheKey);
      return null;
    }

    // Check age
    const age = Date.now() - cachedData.timestamp;
    if (age > MAX_CACHE_AGE_MS) {
      logger.debug('EnrichmentCache', 'Cache expired, invalidating', {
        ageMs: age,
        maxAgeMs: MAX_CACHE_AGE_MS,
      });
      localStorage.removeItem(cacheKey);
      return null;
    }

    logger.info('EnrichmentCache', 'Cache hit', {
      eventTitle: event.title,
      ageMs: age,
    });

    return cachedData.data;
  } catch (error) {
    logger.error('EnrichmentCache', 'Failed to get from cache', error instanceof Error ? error : undefined);
    return null;
  }
};

/**
 * Store enrichment data in cache
 */
export const setCachedEnrichment = (
  event: Partial<ApiEvent>,
  enrichedData: CachedEnrichment['data']
): void => {
  try {
    const cacheKey = generateCacheKey(event);
    const cacheData: CachedEnrichment = {
      version: CACHE_VERSION,
      timestamp: Date.now(),
      data: enrichedData,
    };

    localStorage.setItem(cacheKey, JSON.stringify(cacheData));

    logger.debug('EnrichmentCache', 'Cached enrichment data', {
      eventTitle: event.title,
      cacheKey,
    });
  } catch (error) {
    // LocalStorage might be full or disabled
    logger.warn('EnrichmentCache', 'Failed to cache enrichment', error instanceof Error ? error : undefined);
    // Don't throw - caching is optional
  }
};

/**
 * Clear old cache entries to prevent localStorage bloat
 * Call this periodically (e.g., on app startup)
 */
export const cleanupEnrichmentCache = (): void => {
  try {
    let removedCount = 0;
    const keysToRemove: string[] = [];

    // Find all cache keys
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(CACHE_KEY_PREFIX)) {
        try {
          const cached = localStorage.getItem(key);
          if (cached) {
            const cachedData: CachedEnrichment = JSON.parse(cached);

            // Remove if expired or wrong version
            const age = Date.now() - cachedData.timestamp;
            if (age > MAX_CACHE_AGE_MS || cachedData.version !== CACHE_VERSION) {
              keysToRemove.push(key);
            }
          }
        } catch (e) {
          // Invalid cache entry
          keysToRemove.push(key);
        }
      }
    }

    // Remove invalid/expired entries
    keysToRemove.forEach((key) => {
      localStorage.removeItem(key);
      removedCount++;
    });

    if (removedCount > 0) {
      logger.info('EnrichmentCache', `Cleaned up ${removedCount} expired cache entries`);
    }
  } catch (error) {
    logger.error('EnrichmentCache', 'Failed to cleanup cache', error instanceof Error ? error : undefined);
  }
};

/**
 * Clear all enrichment cache entries
 * Useful for debugging or after major app updates
 */
export const clearAllEnrichmentCache = (): void => {
  try {
    const keysToRemove: string[] = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(CACHE_KEY_PREFIX)) {
        keysToRemove.push(key);
      }
    }

    keysToRemove.forEach((key) => localStorage.removeItem(key));

    logger.info('EnrichmentCache', `Cleared ${keysToRemove.length} cache entries`);
  } catch (error) {
    logger.error('EnrichmentCache', 'Failed to clear cache', error instanceof Error ? error : undefined);
  }
};
