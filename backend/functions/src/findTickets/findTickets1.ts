import { onRequest } from 'firebase-functions/v2/https';
import { logger } from 'firebase-functions';
import axios from 'axios';
import { defineSecret } from 'firebase-functions/params';
import { TICKET_PROVIDER_DOMAINS } from './models';
import { GoogleGenAI } from '@google/genai';

const GOOGLE_CUSTOM_SEARCH_API_KEY = defineSecret('GOOGLE_CUSTOM_SEARCH_API_KEY');
const GOOGLE_CUSTOM_SEARCH_CX_ID = defineSecret('GOOGLE_CUSTOM_SEARCH_CX_ID');
const GEMINI_API_KEY = defineSecret('GEMINI_API_TOKEN');

// --- Configuration ---
const RESULTS_PER_PAGE = 10; // Google Custom Search API max
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

export const findTickets1 = onRequest(
  { secrets: [GOOGLE_CUSTOM_SEARCH_API_KEY, GOOGLE_CUSTOM_SEARCH_CX_ID, GEMINI_API_KEY], cors: true },
  async (request, response) => {
    const { query, i18n } = request.body;

    const API_KEY_VALUE = GOOGLE_CUSTOM_SEARCH_API_KEY.value();
    const CX_ID_VALUE = GOOGLE_CUSTOM_SEARCH_CX_ID.value();

    if (!query) {
      response.status(400).json({ error: 'Missing query in request body' });
      return;
    }

    if (!API_KEY_VALUE || !CX_ID_VALUE || !GEMINI_API_KEY) {
      logger.error('API_KEY or CX_ID or GEMINI_API_KEY is not configured.');
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

            console.log('got provider domain');
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

      const unorderedTicketLinks = {
        query,
        ticketLinks,
      };

      console.log('unordered ticket links.', unorderedTicketLinks);

      try {
        // const sortedTicketData = await sortTicketLinksWithGemini(unorderedTicketLinks);
        const sortedTicketData = sortTicketLinksByLikeliness(unorderedTicketLinks);
        // console.log('ordered ticket links.', sortedTicketData);

        response.status(200).json(sortedTicketData);
      } catch (error) {
        console.error('Failed to sort ticket links:', error);
        response.status(500).json({ error: 'Failed to sort ticket links.' });
      }
    } catch (error: any) {
      logger.error('Error in findTickets function:', error.message, error.stack);
      response.status(500).json({ error: 'Failed to process the request.', details: error.message });
    }
  }
);

const prompt = (model: any, i18n: string) => `
order ticketLinks according to likeliness, that they link to the most likely ticket selling page for the specific event. return the corrected json object only, be very strict, not more, not less - Just the corrected json with correctly ordered ticketLinks array according to likeliness of linking to a ticket selling page. always prioritise 'eventim' (.com, .de, ..doesn't matter) ticket links, the should always be first and therefor most likely to be to link to a direct ticket selling page. You can take also the users i18n into consideration: ${i18n}.

${model}
`;

// const prompt = (model: any) => `
// As an automated ticket link re-ordering service, your task is to analyze a provided JSON object containing a concert query and a list of ticket links. Your primary objective is to reorder the \`ticketLinks\` array within the JSON object based on the likelihood that each link points to the most relevant and direct ticket selling page for the specific event mentioned in the \`query\`.
//
// **Prioritization Rules (in order of importance):**
//
// 1.  **Direct Event Match:** Links directly containing the artist name, event name, and venue/city from the query, and are from a primary ticket vendor (e.g., Eventim, Ticketmaster, official venue sites).
// 2.  **Reputable Primary Vendors:** Links from well-known primary ticket vendors that clearly relate to the artist and potentially the event or a similar event.
// 3.  **Event Aggregators/Discovery Platforms:** Links from platforms that aggregate concert information and provide links to ticket sales (e.g., Songkick, Bandsintown), as long as the event details align.
// 4.  **Resale/Secondary Market:** Links from secondary ticket markets (e.g., StubHub, Viagogo) should be de-prioritized as they often involve higher prices and less direct purchase paths.
// 5.  **Irrelevant/Mismatched Links:** Links that do not clearly relate to the queried event should be ranked last.
// 6.  **Promoted Providers:** Always prioritize links that come from eventim. if they are present in the list.
//
// **Input:**
//
// A JSON object with the following structure:
//
// \`\`\`json
// {
//   "query": "STRING_EVENT_QUERY",
//   "ticketLinks": [
//     "URL_LINK_1",
//     "URL_LINK_2",
//     "URL_LINK_N"
//   ]
// }
//
// This is the json to update / sort, return the same json with ticketLinks ordered.
//
// ${model}
// `;

export const sortTicketLinksByLikeliness = (unorderedTicketLinks: FindTicketsResponse): FindTicketsResponse => {
  let eventimItem: string | undefined = undefined;
  unorderedTicketLinks.ticketLinks.forEach((item) => {
    if (item.includes('eventim') && eventimItem === undefined) {
      eventimItem = item;
    }
  });

  if (eventimItem)
    return {
      ticketLinks: [eventimItem],
      query: unorderedTicketLinks.query,
    };

  return unorderedTicketLinks;
};

export const sortTicketLinksWithGemini = async (
  unorderedTicketLinks: FindTicketsResponse,
  i18n: string
): Promise<FindTicketsResponse> => {
  const genAI = new GoogleGenAI({ apiKey: GEMINI_API_KEY.value() });

  try {
    const responseResult = await genAI.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: [{ role: 'user', parts: [{ text: prompt(unorderedTicketLinks, i18n) }] }],
      config: {
        temperature: 0.05,
        topP: 0.8,
        topK: 20,
        maxOutputTokens: 8192,
        responseMimeType: 'application/json', // Ensure the model is instructed to return JSON
      },
    });

    console.log('GOT RESULT', responseResult);
    const responseText = responseResult.text;
    // Parse the JSON response from the model

    const sortedTicketData: FindTicketsResponse = JSON.parse(responseText!);

    console.log();

    return sortedTicketData;
  } catch (error) {
    console.error('Error sorting ticket links:', error);
    // In case of an error, return the original object or an object with an empty array
    // depending on your desired error handling strategy.
    // For this example, we'll return the original object, signifying no sorting occurred.
    return {
      query: unorderedTicketLinks.query,
      ticketLinks: unorderedTicketLinks.ticketLinks,
    };
  }
};
