import { onRequest } from 'firebase-functions/v2/https';

import { GenerateContentRequest, VertexAI } from '@google-cloud/vertexai';

import { v4 as uuid } from 'uuid';
import { GCLOUD_PROJECT, GEMINI_MODEL_ID, VERTEX_AI_LOCATION } from '../../config';
import { validateCaptureRequest, incrementUserCaptureCount } from '../../auth';
import { logger } from 'firebase-functions';
import { v0 } from '../../prompts/v0';

export const analyse = onRequest(
  {
    region: VERTEX_AI_LOCATION,
    memory: '1GiB',
    timeoutSeconds: 180,
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

    const vertexAI = new VertexAI({
      project: GCLOUD_PROJECT,
      location: VERTEX_AI_LOCATION,
    });

    const generativeModel = vertexAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      systemInstruction: { role: 'model', parts: [{ text: v0({ i18n }) }] },
    });

    const mimeType = image.startsWith('data:image/jpeg;base64,') ? 'image/jpeg' : 'image/png';
    const data = image.replace(/^data:image\/(jpeg|png);base64,/, '');

    const req = {
      contents: [
        {
          role: 'user',
          parts: [{ text: 'analyse' }, { inlineData: { mimeType, data } }],
        },
      ],
      generationConfig: {
        temperature: 0.05,
        topP: 0.8,
        topK: 20,
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

      const jsonText = candidates[0].content.parts[0].text;
      const data = JSON.parse(jsonText);

      if (data?.data?.items) {
        data.data.items = data.data.items.map((item: any) => ({
          ...item,
          id: uuid(),
        }));
      }

      // Increment capture count on successful processing
      if (validation.userId) {
        await incrementUserCaptureCount(validation.userId);
      }

      logger.info('Successfully processed image and extracted event data', {
        userId: validation.userId,
        eventCount: data?.data?.items?.length || 0,
      });

      response.status(200).json({
        message: 'processed',
        data: JSON.stringify(data),
      });
    } catch (e: any) {
      logger.error('Error processing request', e);
      response.status(500).json({
        message: 'An error occurred during processing.',
        error: e.message,
      });
    }
  }
);
