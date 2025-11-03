import { onRequest } from 'firebase-functions/v2/https';
import { logger } from 'firebase-functions';
import axios from 'axios';
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
  GenerationConfig,
  SafetySetting,
} from '@google/generative-ai';
import { defineSecret } from 'firebase-functions/params';

// --- Secret Definitions ---
const GEMINI_API_KEY = defineSecret('GEMINI_API_TOKEN'); // Your Gemini API Key Secret
const CUSTOM_SEARCH_API_KEY = '***REMOVED***'; // Your Google Custom Search API Key Secret
const CUSTOM_SEARCH_CX_ID = '***REMOVED***'; // Your Google Custom Search CX ID Secret

// --- Configuration ---
const MAX_CONTENT_LENGTH_FOR_GEMINI = 180000; // Characters, adjust based on model and typical page sizes (Gemini 1.5 Flash can handle more)
const GEMINI_MODEL_NAME = 'gemini-1.5-flash-latest';
const RESULTS_PER_PAGE = 10;
const PAGES_TO_FETCH = 1; // Fetch 1 page (10 results) to limit search API cost initially. Increase if needed.
const MAX_LINKS_TO_ANALYZE_WITH_GEMINI = 3; // Max number of links to pass to Gemini to control cost/time

const TICKET_PROVIDER_DOMAINS: string[] = [
  'ticketmaster.com',
  'livenation.com',
  'eventim.de',
  'stubhub.com',
  'seatgeek.com',
  'axs.com',
  'ticketweb.com',
  'eventbrite.com',
  'seetickets.com',
  'songkick.com',
  'bandsintown.com',
  'viagogo.com',
  'ticketcorner.ch',
  'oeticket.com',
  'ticketone.it',
  'fnacspectacles.com',
  'ticketportal.cz',
  'ticketswap.com',
  'ra.co',
  'dice.fm',
  // Add country-specific versions like:
  'ticketmaster.co.uk',
  'ticketmaster.ca',
  'ticketmaster.de',
  'eventim.co.uk',
  'eventim.pl',
  // Consider local/regional providers
];

interface SearchItem {
  link: string;
  title?: string;
  snippet?: string;
  displayLink?: string;
  [key: string]: any;
}

interface AnalyzedTicketLink {
  url: string;
  source: 'custom_search' | 'direct_url'; // If you later allow direct URL input
  cheapestPriceInfo?: {
    price?: string; // e.g., "€25.50", "$50 - $75"
    currency?: string;
    category?: string; // e.g., "Standard", "Balcony Row A"
    restrictions?: string; // e.g., "Restricted View", "Resale"
    availability?: string; // e.g., "Available", "Low Stock"
  };
  otherPrices?: string[];
  error?: string; // If analysis failed for this link
  fullAnalysis?: string; // The raw text from Gemini
}

// Helper function to analyze a single URL with Gemini
async function getPriceFromUrlWithGemini(
  eventQuery: string,
  ticketUrl: string,
  apiKey: string
): Promise<AnalyzedTicketLink> {
  let pageContent = '';
  const result: AnalyzedTicketLink = { url: ticketUrl, source: 'custom_search' };

  try {
    logger.info(`[Gemini Analysis] Fetching content from URL: ${ticketUrl} for event: ${eventQuery}`);
    const axiosResponse = await axios.get(ticketUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36', // More current UA
        Accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
        'Accept-Language': 'en-US,en;q=0.9',
        'Upgrade-Insecure-Requests': '1',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'cross-site', // Often 'cross-site' or 'none'
        // 'Referer': 'https://www.google.com/' // General referer
      },
      timeout: 20000, // Increased timeout
    });
    pageContent = axiosResponse.data;

    if (typeof pageContent !== 'string') {
      pageContent = JSON.stringify(pageContent);
    }

    // Basic stripping of script, style, and nav/footer to reduce noise and token count.
    // This is very naive; a proper HTML parser (like Cheerio on server-side) would be better.
    pageContent = pageContent.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    pageContent = pageContent.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');
    // pageContent = pageContent.replace(/<nav\b[^<]*(?:(?!<\/nav>)<[^<]*)*<\/nav>/gi, '');
    // pageContent = pageContent.replace(/<footer\b[^<]*(?:(?!<\/footer>)<[^<]*)*<\/footer>/gi, '');
    // pageContent = pageContent.replace(/<header\b[^<]*(?:(?!<\/header>)<[^<]*)*<\/header>/gi, '');

    if (pageContent.length > MAX_CONTENT_LENGTH_FOR_GEMINI) {
      logger.warn(`[Gemini Analysis] Content from ${ticketUrl} is too long (${pageContent.length} chars), truncating.`);
      pageContent = pageContent.substring(0, MAX_CONTENT_LENGTH_FOR_GEMINI);
    }
    logger.info(`[Gemini Analysis] Successfully fetched content from ${ticketUrl}. Length: ${pageContent.length}`);
  } catch (fetchError: any) {
    logger.error(`[Gemini Analysis] Failed to fetch content from ${ticketUrl}:`, fetchError.message);
    result.error = `Failed to fetch URL content: ${fetchError.message}`;
    if (axios.isAxiosError(fetchError) && fetchError.response?.status === 403) {
      result.error = `Failed to fetch URL content: 403 Forbidden. The site likely blocked automated access. URL: ${ticketUrl}`;
    }
    return result; // Return early if fetching failed
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: GEMINI_MODEL_NAME });

    const generationConfig: GenerationConfig = { temperature: 0.2 }; // Lower temperature for more factual extraction
    const safetySettings: SafetySetting[] = [
      { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
      { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
      { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
      { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    ];

    const prompt = `
      You are an expert ticket price extractor for the event "${eventQuery}".
      Analyze the following text content, retrieved from the URL ${ticketUrl}.
      Your task is to find the CHEAPEST available ticket price.

      Based ONLY on the provided text content below, extract:
      1.  Cheapest Price: Identify the *absolute cheapest single adult ticket price* currently available. State the price and currency (e.g., "€25.50", "$49.99"). If a price range is given for the cheapest category, state the lowest end of that range.
      2.  Category/Section for Cheapest Price: Specify the ticket category, section, or type associated with this cheapest price (e.g., "General Admission", "Balcony - Row Z", "Standard Standing").
      3.  Restrictions for Cheapest Price: Note any explicit restrictions mentioned for this cheapest ticket (e.g., "Restricted View", "No Minors", "Resale Ticket", "Limited Time Offer").
      4.  Availability of Cheapest Price: Is there any information about its availability (e.g., "Available", "Low Stock", "Sold Out for this type")?

      If you cannot find a specific ticket price for the event "${eventQuery}" on this page, or if the page seems to be a general search or informational page without direct pricing for this specific event, clearly state that.
      Do not infer information or browse the internet. Base your analysis SOLELY on the text provided.
      If the page is a list of different events, focus only on "${eventQuery}".
      If no price is found, state "No specific price found for this event on the page."

      Event: "${eventQuery}"
      Source URL: ${ticketUrl}

      Provided Text Content:
      ---
      ${pageContent}
      ---

      Structure your response clearly. For the cheapest price, try to parse it into distinct fields if possible, like:
      Cheapest Price: [Amount and Currency]
      Category: [Category/Section]
      Restrictions: [Restrictions]
      Availability: [Availability]
    `;

    const geminiResult = await model.generateContent(prompt);
    const response = geminiResult.response;

    if (!response || !response.candidates || response.candidates.length === 0 || !response.text()) {
      logger.error('[Gemini Analysis] No valid response/candidates from Gemini.', response?.promptFeedback);
      result.error = 'No valid response from Gemini analysis.';
      if (response?.promptFeedback?.blockReason) {
        result.error += ` Block Reason: ${response.promptFeedback.blockReason}.`;
      }
      return result;
    }

    const analysisText = response.text();
    result.fullAnalysis = analysisText;
    logger.info(`[Gemini Analysis] Gemini analysis for ${ticketUrl}: ${analysisText.substring(0, 200)}...`);

    // Attempt to parse structured info from analysisText (this is basic, can be improved)
    const priceMatch = analysisText.match(/Cheapest Price:\s*([€$£]?\s*\d+[\.,]?\d*\s*[A-Za-z]*)/i);
    const categoryMatch = analysisText.match(/Category:\s*(.+)/i);
    const restrictionsMatch = analysisText.match(/Restrictions:\s*(.+)/i);
    const availabilityMatch = analysisText.match(/Availability:\s*(.+)/i);

    if (priceMatch && priceMatch[1] && !analysisText.toLowerCase().includes('no specific price found')) {
      result.cheapestPriceInfo = {
        price: priceMatch[1].trim(),
        category: categoryMatch ? categoryMatch[1].trim() : 'Not specified',
        restrictions: restrictionsMatch ? restrictionsMatch[1].trim() : 'Not specified',
        availability: availabilityMatch ? availabilityMatch[1].trim() : 'Not specified',
      };
      // Try to extract currency if not in price string
      if (result.cheapestPriceInfo.price) {
        const currencySymbol = result.cheapestPriceInfo.price.match(/[€$£]/);
        if (currencySymbol) result.cheapestPriceInfo.currency = currencySymbol[0];
        else if (result.cheapestPriceInfo.price.toLowerCase().includes('eur'))
          result.cheapestPriceInfo.currency = 'EUR';
        else if (
          result.cheapestPriceInfo.price.toLowerCase().includes('usd') ||
          result.cheapestPriceInfo.price.includes('$')
        )
          result.cheapestPriceInfo.currency = 'USD';
        else if (
          result.cheapestPriceInfo.price.toLowerCase().includes('gbp') ||
          result.cheapestPriceInfo.price.includes('£')
        )
          result.cheapestPriceInfo.currency = 'GBP';
      }
    } else if (analysisText.toLowerCase().includes('no specific price found')) {
      result.cheapestPriceInfo = { price: 'No specific price found on page' };
    }
  } catch (geminiError: any) {
    logger.error(`[Gemini Analysis] Error during Gemini API call for ${ticketUrl}:`, geminiError.message);
    result.error = `Gemini API call failed: ${geminiError.message}`;
  }
  return result;
}

export const findTicketPrice1 = onRequest(
  {
    secrets: [GEMINI_API_KEY, CUSTOM_SEARCH_API_KEY, CUSTOM_SEARCH_CX_ID],
    memory: '1GiB', // Increased memory for potentially multiple page fetches & analyses
    timeoutSeconds: 300, // Increased timeout
    cors: true,
  },
  async (request, response) => {
    const { eventQuery } = request.body;

    if (!eventQuery) {
      response.status(400).json({ error: 'Missing eventQuery in request body' });
      return;
    }

    if (!CUSTOM_SEARCH_API_KEY || !CUSTOM_SEARCH_CX_ID || !GEMINI_API_KEY) {
      logger.error('One or more API keys/IDs are not configured in secrets.');
      response.status(500).json({ error: 'Server configuration error: API Key(s) missing.' });
      return;
    }

    try {
      logger.info(`[Main Flow] Received event query: ${eventQuery}`);
      let allSearchItems: SearchItem[] = [];

      // Step 1: Google Custom Search to find potential links
      for (let i = 0; i < PAGES_TO_FETCH; i++) {
        const startIndex = i * RESULTS_PER_PAGE + 1;
        const searchUrl = `https://www.googleapis.com/customsearch/v1?key=${CUSTOM_SEARCH_API_KEY}&cx=${CUSTOM_SEARCH_CX_ID}&q=${encodeURIComponent(eventQuery)}&start=${startIndex}`;
        try {
          logger.info(`[Main Flow] Fetching search results page ${i + 1}`);
          const searchResponse = await axios.get(searchUrl);
          if (searchResponse.data.items && searchResponse.data.items.length > 0) {
            allSearchItems = allSearchItems.concat(searchResponse.data.items);
          } else {
            break;
          }
        } catch (searchError: any) {
          logger.error(
            `[Main Flow] Error fetching search page ${i + 1}:`,
            searchError.response?.data || searchError.message
          );
          // Continue if one page fails
        }
      }
      logger.info(`[Main Flow] Fetched ${allSearchItems.length} items from Google Search.`);

      const potentialTicketLinks = new Set<string>();
      for (const item of allSearchItems) {
        if (item.link) {
          try {
            const url = new URL(item.link);
            const domain = url.hostname.replace(/^www\./, '');
            if (TICKET_PROVIDER_DOMAINS.some((providerDomain) => domain.includes(providerDomain))) {
              potentialTicketLinks.add(item.link);
            }
          } catch (urlError) {
            /* Ignore invalid URLs */
          }
        }
      }
      const linksToAnalyze = Array.from(potentialTicketLinks).slice(0, MAX_LINKS_TO_ANALYZE_WITH_GEMINI);
      logger.info(
        `[Main Flow] Found ${linksToAnalyze.length} unique links from known providers to analyze (max ${MAX_LINKS_TO_ANALYZE_WITH_GEMINI}). Links: ${linksToAnalyze.join(', ')}`
      );

      if (linksToAnalyze.length === 0) {
        response.status(200).json({
          eventQuery,
          message: 'No relevant ticket provider links found from Google Custom Search.',
          analyzedLinks: [],
        });
        return;
      }

      // Step 2: Analyze selected links with Gemini
      const analysisPromises = linksToAnalyze.map((link) =>
        getPriceFromUrlWithGemini(eventQuery, link, GEMINI_API_KEY.value())
      );
      const analyzedLinksResults = await Promise.all(analysisPromises);

      // Step 3: Consolidate and return results
      // You could add logic here to find the overall cheapest price from analyzedLinksResults

      response.status(200).json({
        eventQuery,
        searchTotalItems: allSearchItems.length,
        searchLinksFromProviders: Array.from(potentialTicketLinks).length,
        linksAttemptedAnalysis: linksToAnalyze.length,
        analyzedLinks: analyzedLinksResults,
      });
    } catch (error: any) {
      logger.error('[Main Flow] Critical error in findTicketPrice1:', error.message, error.stack);
      response.status(500).json({ error: 'Failed to process the request.', details: error.message });
    }
  }
);
