import { onRequest } from 'firebase-functions/v2/https';
import { logger } from 'firebase-functions';
import axios from 'axios';
import { defineSecret } from 'firebase-functions/params';
import { TICKET_PROVIDER_DOMAINS } from './models';

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
    const { query, i18n } = request.body;

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

            if (TICKET_PROVIDER_DOMAINS.some((providerDomain) => domain.includes(providerDomain))) {
              uniqueTicketLinks.add(item.link);
            }
          } catch (urlError) {
            logger.warn(`Invalid URL found: ${item.link}`, urlError);
          }
        }
      }
      ticketLinks.push(...Array.from(uniqueTicketLinks));
      logger.info(`Found ${ticketLinks.length} potential ticket links`);

      const unorderedTicketLinks = {
        query,
        ticketLinks,
      };

      try {
        const sortedTicketData = sortTicketLinksByLikeliness(unorderedTicketLinks);
        response.status(200).json(sortedTicketData);
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

