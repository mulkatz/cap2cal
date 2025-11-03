import { onRequest } from 'firebase-functions/v2/https';
import { logger } from 'firebase-functions';
import axios from 'axios';
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
  GenerationConfig, // Added for explicit configuration
  SafetySetting, // Added for explicit configuration
} from '@google/generative-ai';
import { defineSecret } from 'firebase-functions/params';

const MAX_CONTENT_LENGTH_FOR_GEMINI = 150000; // Characters, adjust based on model and typical page sizes
const MODEL_NAME = 'gemini-1.5-flash-latest'; // Or "gemini-pro" or other compatible models

const geminiApiKey = defineSecret('GEMINI_API_TOKEN');

export const findTicketPrice0 = onRequest(
  {
    secrets: [geminiApiKey], // Your Gemini API Key from Firebase secrets
    memory: '512MiB',
    timeoutSeconds: 120,
    cors: true,
  },
  async (request, response) => {
    const { eventQuery, ticketUrl } = request.body;

    const GEMINI_API_KEY = geminiApiKey;

    if (!eventQuery || !ticketUrl) {
      response.status(400).json({ error: 'Missing eventQuery or ticketUrl in request body' });
      return;
    }

    if (!GEMINI_API_KEY) {
      logger.error('Gemini API Key is not configured in secrets.');
      response.status(500).json({ error: 'Server configuration error: Gemini API Key missing.' });
      return;
    }

    let pageContent = '';
    try {
      logger.info(`Workspaceing content from URL: ${ticketUrl}`);
      const axiosResponse = await axios.get(ticketUrl, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
        },
        timeout: 15000,
      });
      pageContent = axiosResponse.data;

      if (typeof pageContent !== 'string') {
        pageContent = JSON.stringify(pageContent);
      }

      pageContent = pageContent.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
      pageContent = pageContent.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');
      // Consider a more robust HTML-to-text conversion for production
      // pageContent = pageContent.replace(/<[^>]+>/g, ' ').replace(/\s\s+/g, ' ').trim();

      if (pageContent.length > MAX_CONTENT_LENGTH_FOR_GEMINI) {
        logger.warn(
          `Content from ${ticketUrl} is too long (${pageContent.length} chars), truncating to ${MAX_CONTENT_LENGTH_FOR_GEMINI} chars.`
        );
        pageContent = pageContent.substring(0, MAX_CONTENT_LENGTH_FOR_GEMINI);
      }
      logger.info(
        `Successfully fetched and processed content from ${ticketUrl}. Length: ${pageContent.length} characters.`
      );
    } catch (fetchError: any) {
      logger.error(`Failed to fetch content from ${ticketUrl}:`, fetchError.message);
      if (axios.isAxiosError(fetchError) && fetchError.response) {
        logger.error('Axios error details:', { status: fetchError.response.status, data: fetchError.response.data });
        response.status(500).json({
          error: `Failed to fetch content from ticket URL. Status: ${fetchError.response.status}`,
          details: fetchError.message,
        });
      } else {
        response.status(500).json({
          error: 'Failed to fetch content from ticket URL.',
          details: fetchError.message,
        });
      }
      return;
    }

    try {
      logger.info(`Initializing GoogleGenerativeAI with API key.`);
      const genAI = new GoogleGenerativeAI(geminiApiKey.value());

      const generationConfig: GenerationConfig = {
        // temperature: 0.3, // Example: Adjust for creativity vs. factuality
        // maxOutputTokens: 2048, // Example: Adjust as needed
        // topK: ...,
        // topP: ...,
      };

      const safetySettings: SafetySetting[] = [
        { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
        { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
        {
          category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
      ];

      const model = genAI.getGenerativeModel({
        model: MODEL_NAME,
        generationConfig,
        safetySettings,
      });

      const prompt = `
        You are an expert ticket information extractor.
        Analyze the following text content, which was retrieved from the URL ${ticketUrl}, for the event "${eventQuery}".

        Based ONLY on the provided text content below, please extract the following information if available:
        1. Ticket Prices: List any specific ticket prices or price ranges you can find.
        2. Ticket Availability: Is there any information about ticket availability (e.g., "on sale", "sold out", "low availability", specific dates/times)?
        3. Seating Sections/Types: Are different seating sections or ticket types mentioned with their prices?
        4. Direct Purchase Link (if discernible within the content and related to the event): If there's a clear link or button text suggesting a direct purchase path for this event on the page.
        5. Any important notes or conditions related to ticket purchase (e.g., "resale tickets", "limited view").

        If information for any of these points is not found in the provided text, explicitly state "Not found in the provided content."
        Do not infer information or browse the internet. Your analysis must be based SOLELY on the text provided.

        Event: "${eventQuery}"
        Source URL: ${ticketUrl}

        Provided Text Content:
        ---
        ${pageContent}
        ---

        Please structure your response clearly.
      `;

      logger.info(`Sending request to Gemini model ${MODEL_NAME} for event "${eventQuery}" and URL ${ticketUrl}`);

      const result = await model.generateContent(prompt);
      const geminiResponse = result.response;

      if (!geminiResponse || !geminiResponse.candidates || geminiResponse.candidates.length === 0) {
        const blockReason = geminiResponse?.promptFeedback?.blockReason;
        const safetyRatings = geminiResponse?.promptFeedback?.safetyRatings;
        logger.error('No content candidates found in Gemini response.', {
          blockReason,
          safetyRatings,
          response: geminiResponse,
        });
        let errorMessage = 'No content candidates found in Gemini response.';
        if (blockReason) {
          errorMessage += ` Block Reason: ${blockReason}.`;
        }
        if (safetyRatings && safetyRatings.length > 0) {
          errorMessage += ` Safety Ratings: ${JSON.stringify(safetyRatings)}.`;
        }
        throw new Error(errorMessage);
      }

      // The .text() method directly gives the aggregated text from all parts.
      const analysisText = geminiResponse.text();
      logger.info('Successfully received analysis from Gemini.');

      response.status(200).json({
        eventQuery,
        ticketUrl,
        analysis: analysisText,
      });
    } catch (geminiError: any) {
      logger.error('Error during Gemini API call or processing:', geminiError.message, geminiError.stack);
      response.status(500).json({
        error: 'Failed to get ticket analysis from Gemini.',
        details: geminiError.message,
      });
    }
  }
);
