import { onRequest } from 'firebase-functions/v2/https';
import { GenerateContentRequest, VertexAI } from '@google-cloud/vertexai';
import { GCLOUD_PROJECT, VERTEX_AI_LOCATION } from '../../config';
import { validateCaptureRequest } from '../../auth';
import { logger } from 'firebase-functions';
import { v2_enricher } from '../../prompts/v2_enricher';
import { jsonrepair } from 'jsonrepair';

export const enrich = onRequest(
  {
    region: VERTEX_AI_LOCATION,
    memory: '2GiB',
    timeoutSeconds: 120,
    cors: true,
    // @ts-ignore
    enforceAppCheck: true,
  },
  async (request, response) => {
    // Validate auth
    const validation = await validateCaptureRequest(request);

    if (!validation.allowed) {
      response.status(validation.status || 403).json({
        error: validation.error || 'Request not allowed',
      });
      return;
    }

    const { event, i18n } = request.body;

    if (!event || !event.title) {
      response.status(400).json({ error: 'Valid event object with title is required' });
      return;
    }

    const vertexAI = new VertexAI({
      project: GCLOUD_PROJECT,
      location: VERTEX_AI_LOCATION,
    });

    // Use gemini-2.5-flash for enrichment (can upgrade to pro for better quality)
    const generativeModel = vertexAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      systemInstruction: { role: 'model', parts: [{ text: v2_enricher({ i18n }) }] },
    });

    // Construct the prompt payload with the skeleton event data
    const promptContext = JSON.stringify({
      title: event.title,
      kind: event.kind,
      dateTimeFrom: event.dateTimeFrom,
      dateTimeTo: event.dateTimeTo,
      location_raw: event.location?.address || '',
      raw_text_context: (event as any)._rawContext || '',
      links: event.links || [],
    });

    const req = {
      contents: [
        {
          role: 'user',
          parts: [{ text: `Enrich this event data:\n\n${promptContext}` }],
        },
      ],
      generationConfig: {
        temperature: 0.7,
        topP: 0.9,
        maxOutputTokens: 2048,
        responseMimeType: 'application/json',
      },
    } satisfies GenerateContentRequest;

    try {
      const result = await generativeModel.generateContent(req);

      const candidates = result.response?.candidates;
      if (!candidates || candidates.length === 0 || !candidates[0].content?.parts[0]?.text) {
        logger.error('Invalid response structure from Vertex AI during enrichment', {
          result: JSON.stringify(result),
        });
        response.status(500).json({ message: 'Failed to get a valid response from the AI model.' });
        return;
      }

      let textResponse = candidates[0].content.parts[0].text;

      // SANITIZATION LAYER
      // 1. Remove Markdown code blocks if they slip through (defensive coding)
      textResponse = textResponse.replace(/^```json/gm, '').replace(/^```/gm, '').trim();

      let enrichedData;
      try {
        // 2. Try native parse first (fastest)
        enrichedData = JSON.parse(textResponse);
      } catch (parseError: any) {
        logger.warn('Native JSON parse failed during enrichment, attempting repair...', {
          error: parseError.message,
          textLength: textResponse.length,
          eventId: event.id,
        });

        try {
          // 3. Attempt to repair truncated/malformed JSON
          const repaired = jsonrepair(textResponse);
          enrichedData = JSON.parse(repaired);
          logger.info('Enrichment JSON repaired successfully', { eventId: event.id });
        } catch (repairError: any) {
          // 4. If repair fails, log the RAW text for debugging
          logger.error('Enrichment JSON Repair failed. Raw output:', {
            rawText: textResponse.substring(0, 1000), // Log first 1000 chars
            error: repairError.message,
            eventId: event.id,
          });
          response.status(500).json({ message: 'Failed to parse enrichment data from AI response.' });
          return;
        }
      }

      logger.info('Successfully enriched event', {
        eventId: event.id,
        userId: validation.userId,
      });

      response.status(200).json({
        status: 'success',
        message: 'Enriched successfully',
        data: {
          ...enrichedData,
          isEnriched: true,
        },
      });
    } catch (e: any) {
      logger.error('Error during enrichment', {
        error: e.message,
        eventId: event.id,
        userId: validation.userId,
      });

      // Return partial success - frontend can still use the skeleton data
      response.status(500).json({
        status: 'error',
        message: 'Enrichment failed',
        error: e.message,
        data: {
          // Return empty enrichment so frontend can handle gracefully
          description: {
            short: event.description?.short || '',
            long: '',
          },
          tags: [],
          location: event.location || { city: '', address: '' },
          ticketAvailableProbability: 0.5,
          ticketSearchQuery: '',
          isEnriched: false,
        },
      });
    }
  }
);
