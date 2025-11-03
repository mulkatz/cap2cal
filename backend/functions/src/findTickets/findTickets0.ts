import { onRequest } from 'firebase-functions/v2/https';
import { logger } from 'firebase-functions';
import axios from 'axios';
import { defineSecret } from 'firebase-functions/params';
import { TICKET_PROVIDER_DOMAINS } from './models';

const GOOGLE_CUSTOM_SEARCH_API_KEY = defineSecret('GOOGLE_CUSTOM_SEARCH_API_KEY');
const GOOGLE_CUSTOM_SEARCH_CX_ID = defineSecret('GOOGLE_CUSTOM_SEARCH_CX_ID');

// --- Configuration ---
const RESULTS_PER_PAGE = 10; // Google Custom Search API max
const PAGES_TO_FETCH = 1;

interface SearchItem {
  link: string;
  displayLink: string;
  [key: string]: any;
}

export const findTickets0 = onRequest(
  { secrets: [GOOGLE_CUSTOM_SEARCH_API_KEY, GOOGLE_CUSTOM_SEARCH_CX_ID], cors: true },
  async (request, response) => {
    const { query } = request.body;

    const API_KEY_VALUE = GOOGLE_CUSTOM_SEARCH_API_KEY.value();
    const CX_ID_VALUE = GOOGLE_CUSTOM_SEARCH_CX_ID.value();

    if (!query) {
      response.status(400).json({ error: 'Missing query in request body' });
      return;
    }

    if (!API_KEY_VALUE || !CX_ID_VALUE) {
      logger.error('API_KEY or CX_ID is not configured.');
      response.status(500).json({ error: 'Server configuration error.' });
      return;
    }

    try {
      logger.info(`Received query: ${query}`);
      let allItems: SearchItem[] = [];

      // Fetch results from multiple pages
      logger.info(`start fetching ${PAGES_TO_FETCH * RESULTS_PER_PAGE} search results.`);
      for (let i = 0; i < PAGES_TO_FETCH; i++) {
        const startIndex = i * RESULTS_PER_PAGE + 1;
        const searchUrl = `https://www.googleapis.com/customsearch/v1?key=${API_KEY_VALUE}&cx=${CX_ID_VALUE}&q=${encodeURIComponent(query)}&start=${startIndex}`;

        try {
          const searchResponse = await axios.get(searchUrl);
          if (searchResponse.data.items && searchResponse.data.items.length > 0) {
            allItems = allItems.concat(searchResponse.data.items);
          } else {
            // No more results, break early
            break;
          }
        } catch (searchError: any) {
          logger.error(`Error fetching page ${i + 1}:`, searchError.response?.data || searchError.message);
          // Decide if you want to continue if one page fails, or stop.
          // For now, we'll log and continue, it might fetch less than 3 pages.
        }
      }

      // Filter for ticket provider domains
      const ticketLinks: string[] = [];
      const uniqueTicketLinks = new Set<string>(); // To avoid duplicate links

      for (const item of allItems) {
        if (item.link) {
          try {
            const url = new URL(item.link);
            const domain = url.hostname.replace(/^www\./, ''); // Remove 'www.' for easier matching

            if (TICKET_PROVIDER_DOMAINS.some((providerDomain) => domain.includes(providerDomain))) {
              uniqueTicketLinks.add(item.link);
            }
          } catch (urlError) {
            logger.warn(`Invalid URL found: ${item.link}`, urlError);
          }
        }
      }
      ticketLinks.push(...Array.from(uniqueTicketLinks));
      logger.info(`Found ${ticketLinks.length} potential ticket links.`);

      response.status(200).json({
        query,
        ticketLinks,
      });
    } catch (error: any) {
      logger.error('Error in findTickets function:', error.message, error.stack);
      response.status(500).json({ error: 'Failed to process the request.', details: error.message });
    }
  }
);
