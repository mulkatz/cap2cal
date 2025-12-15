import { onRequest } from 'firebase-functions/v2/https';
import { logger } from 'firebase-functions';
import axios from 'axios';
import { defineSecret } from 'firebase-functions/params';
import { TICKET_PROVIDER_DOMAINS } from './models';
import { ALL_PROVIDER_DOMAINS, REGIONAL_PROVIDERS, Region } from './providers';
import { detectRegion } from './regionDetection';

const GOOGLE_CUSTOM_SEARCH_API_KEY = defineSecret('GOOGLE_CUSTOM_SEARCH_API_KEY');
const GOOGLE_CUSTOM_SEARCH_CX_ID = defineSecret('GOOGLE_CUSTOM_SEARCH_CX_ID');

const RESULTS_PER_PAGE = 10;
const PAGES_TO_FETCH = 2;

interface SearchItem {
  link: string;
  displayLink: string;
  [key: string]: any;
}

type FindTicketsResponse = {
  query: string;
  ticketLinks: string[];
};

export const findTickets = onRequest(
  { secrets: [GOOGLE_CUSTOM_SEARCH_API_KEY, GOOGLE_CUSTOM_SEARCH_CX_ID], cors: true },
  async (request, response) => {
    const { query, i18n, region: explicitRegion } = request.body;

    const API_KEY_VALUE = GOOGLE_CUSTOM_SEARCH_API_KEY.value();
    const CX_ID_VALUE = GOOGLE_CUSTOM_SEARCH_CX_ID.value();

    if (!query) {
      response.status(400).json({ error: 'Missing query in request body' });
      return;
    }

    if (!API_KEY_VALUE || !CX_ID_VALUE) {
      logger.error('API_KEY or CX_ID is not configured');
      response.status(500).json({ error: 'Server configuration error' });
      return;
    }

    // Detect user's region from language/locale
    const detectedRegion = detectRegion(i18n, explicitRegion);
    logger.info(`Region detection: i18n=${i18n}, explicit=${explicitRegion}, detected=${detectedRegion}`);

    try {
      logger.info(`Received query: ${query}`);
      let allItems: SearchItem[] = [];

      logger.info(`Start fetching ${PAGES_TO_FETCH * RESULTS_PER_PAGE} search results`);
      for (let i = 0; i < PAGES_TO_FETCH; i++) {
        const startIndex = i * RESULTS_PER_PAGE + 1;
        const searchUrl = `https://www.googleapis.com/customsearch/v1?key=${API_KEY_VALUE}&cx=${CX_ID_VALUE}&q=${encodeURIComponent(query)}&start=${startIndex}`;

        try {
          const searchResponse = await axios.get(searchUrl);
          if (searchResponse.data.items && searchResponse.data.items.length > 0) {
            allItems = allItems.concat(searchResponse.data.items);
          } else {
            break;
          }
        } catch (searchError: any) {
          logger.error(`Error fetching page ${i + 1}:`, searchError.response?.data || searchError.message);
        }
      }

      const ticketLinks: string[] = [];
      const uniqueTicketLinks = new Set<string>();

      for (const item of allItems) {
        if (item.link) {
          try {
            const url = new URL(item.link);
            const domain = url.hostname.replace(/^www\./, '');

            // Use the expanded ALL_PROVIDER_DOMAINS list for filtering
            if (ALL_PROVIDER_DOMAINS.some((providerDomain) => domain.includes(providerDomain))) {
              uniqueTicketLinks.add(item.link);
            }
          } catch (urlError) {
            logger.warn(`Invalid URL found: ${item.link}`, urlError);
          }
        }
      }
      ticketLinks.push(...Array.from(uniqueTicketLinks));
      logger.info(`Found ${ticketLinks.length} potential ticket links for region ${detectedRegion}`);

      try {
        // Sort by regional priority instead of hardcoded Eventim-first
        const sortedLinks = sortTicketLinksByRegion(ticketLinks, detectedRegion);
        response.status(200).json({
          query,
          ticketLinks: sortedLinks,
        });
      } catch (error) {
        logger.error('Failed to sort ticket links', error);
        response.status(500).json({ error: 'Failed to sort ticket links.' });
      }
    } catch (error: any) {
      logger.error('Error in findTickets function:', error.message, error.stack);
      response.status(500).json({ error: 'Failed to process the request.', details: error.message });
    }
  }
);

/**
 * Extract domain from URL for matching against provider list
 */
const extractDomain = (url: string): string => {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.replace(/^www\./, '').toLowerCase();
  } catch {
    return url.toLowerCase();
  }
};

/**
 * Sort ticket links by regional priority
 *
 * Links from primary providers for the detected region appear first,
 * followed by secondary providers, then other providers.
 *
 * @param ticketLinks - Array of ticket URLs
 * @param region - Detected user region
 * @returns Sorted array of ticket URLs
 */
const sortTicketLinksByRegion = (ticketLinks: string[], region: Region): string[] => {
  const config = REGIONAL_PROVIDERS[region] || REGIONAL_PROVIDERS.GLOBAL;

  const primary: string[] = [];
  const secondary: string[] = [];
  const other: string[] = [];

  for (const link of ticketLinks) {
    const domain = extractDomain(link);

    if (config.primary.some((p) => domain.includes(p))) {
      primary.push(link);
    } else if (config.secondary.some((s) => domain.includes(s))) {
      secondary.push(link);
    } else {
      other.push(link);
    }
  }

  return [...primary, ...secondary, ...other];
};

// Keep legacy function for backwards compatibility (not used but preserved)
const sortTicketLinksByLikeliness = (unorderedTicketLinks: FindTicketsResponse): FindTicketsResponse => {
  const eventimItem = unorderedTicketLinks.ticketLinks.find((item) => item.includes('eventim'));

  if (eventimItem) {
    return {
      ticketLinks: [eventimItem],
      query: unorderedTicketLinks.query,
    };
  }

  return unorderedTicketLinks;
};

