import { onRequest } from 'firebase-functions/v2/https';
import { GenerateContentRequest, VertexAI } from '@google-cloud/vertexai';
import { GCLOUD_PROJECT, VERTEX_AI_LOCATION } from '../../config';
import { validateCaptureRequest } from '../../auth';
import { logger } from 'firebase-functions';
import { v2_enricher } from '../../prompts/v2_enricher';

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

      const enrichedData = JSON.parse(candidates[0].content.parts[0].text);

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
