import { onRequest } from 'firebase-functions/v2/https';
import { GenerateContentRequest, VertexAI } from '@google-cloud/vertexai';
import { v4 as uuid } from 'uuid';
import { GCLOUD_PROJECT, VERTEX_AI_LOCATION } from '../../config';
import { validateCaptureRequest, incrementUserCaptureCount } from '../../auth';
import { logger } from 'firebase-functions';
import { v1_scanner } from '../../prompts/v1_scanner';
import { jsonrepair } from 'jsonrepair';

export const scan = onRequest(
  {
    region: VERTEX_AI_LOCATION,
    memory: '4GiB',
    timeoutSeconds: 120,
    cors: true,
    // @ts-ignore
    enforceAppCheck: true,
  },
  async (request, response) => {
    // Validate capture request (check auth and limits)
    const validation = await validateCaptureRequest(request);

    if (!validation.allowed) {
      response.status(validation.status || 403).json({
        error: validation.error || 'Capture not allowed',
      });
      return;
    }

    const { image, i18n } = request.body;

    if (!image) {
      response.status(400).json({ error: 'Image base64 data is required' });
      return;
    }

    // Initialize Vertex AI
    const vertexAI = new VertexAI({
      project: GCLOUD_PROJECT,
      location: VERTEX_AI_LOCATION,
    });

    // Use gemini-2.5-flash for fast extraction
    const generativeModel = vertexAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      systemInstruction: { role: 'model', parts: [{ text: v1_scanner({ i18n }) }] },
    });

    const mimeType = image.startsWith('data:image/jpeg;base64,') ? 'image/jpeg' : 'image/png';
    const data = image.replace(/^data:image\/(jpeg|png);base64,/, '');

    const req = {
      contents: [
        {
          role: 'user',
          parts: [{ inlineData: { mimeType, data } }],
        },
      ],
      generationConfig: {
        temperature: 0.1,
        topP: 0.95,
        maxOutputTokens: 8192,
        responseMimeType: 'application/json',
      },
    } satisfies GenerateContentRequest;

    try {
      const result = await generativeModel.generateContent(req);

      const candidates = result.response?.candidates;
      if (!candidates || candidates.length === 0 || !candidates[0].content?.parts[0]?.text) {
        logger.error('Invalid response structure from Vertex AI', { result: JSON.stringify(result) });
        response.status(500).json({ message: 'Failed to get a valid response from the AI model.' });
        return;
      }

      let textResponse = candidates[0].content.parts[0].text;

      // SANITIZATION LAYER
      // 1. Remove Markdown code blocks if they slip through (defensive coding)
      textResponse = textResponse.replace(/^```json/gm, '').replace(/^```/gm, '').trim();

      let rawJson;
      try {
        // 2. Try native parse first (fastest)
        rawJson = JSON.parse(textResponse);
      } catch (parseError: any) {
        logger.warn('Native JSON parse failed, attempting repair...', {
          error: parseError.message,
          textLength: textResponse.length,
        });

        try {
          // 3. Attempt to repair truncated/malformed JSON
          const repaired = jsonrepair(textResponse);
          rawJson = JSON.parse(repaired);
          logger.info('JSON repaired successfully');
        } catch (repairError: any) {
          // 4. If repair fails, log the RAW text for debugging
          logger.error('JSON Repair failed. Raw output:', {
            rawText: textResponse.substring(0, 1000), // Log first 1000 chars
            error: repairError.message,
          });
          response.status(500).json({ message: 'Failed to parse event data from AI response.' });
          return;
        }
      }

      // Check if it's an error response
      if (rawJson.status === 'error') {
        logger.warn('Scanner returned error', { reason: rawJson.data?.reason });
        response.status(200).json(rawJson);
        return;
      }

      // Transform scanner output to match frontend ApiEvent format (skeleton version)
      const processedItems = rawJson.data.items.map((item: any) => ({
        id: uuid(),
        title: item.title,
        kind: item.kind,
        tags: [], // Will be enriched later
        dateTimeFrom: {
          date: item.date_iso,
          time: item.time_iso || undefined,
        },
        dateTimeTo:
          item.end_date_iso || item.end_time_iso
            ? {
                date: item.end_date_iso || item.date_iso,
                time: item.end_time_iso || undefined,
              }
            : undefined,
        description: {
          short: '', // Leave empty - will be enriched
          long: '',
        },
        // Store raw context for enrichment, but don't show to user
        _rawContext: item.raw_text_context || '',
        location: {
          city: '',
          address: item.location_raw || '',
        },
        links: item.links || [],
        ticketDirectLink: item.ticket_direct_link || undefined,
        ticketAvailableProbability: 0.5, // Default, will be enriched
        ticketSearchQuery: '', // Will be enriched
        confidence: item.confidence,
        // Flag to indicate this needs enrichment
        isEnriched: false,
      }));

      // Increment capture count on successful processing
      if (validation.userId) {
        await incrementUserCaptureCount(validation.userId);
      }

      logger.info('Successfully scanned image', {
        userId: validation.userId,
        eventCount: processedItems.length,
        overallConfidence: rawJson.data.meta.overall_confidence,
      });

      response.status(200).json({
        status: 'success',
        message: 'Scanned successfully',
        data: {
          meta: rawJson.data.meta,
          items: processedItems,
        },
      });
    } catch (e: any) {
      logger.error('Error processing scan request', e);
      response.status(500).json({
        message: 'An error occurred during scanning.',
        error: e.message,
      });
    }
  }
);
