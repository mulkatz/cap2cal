import { onRequest } from 'firebase-functions/v2/https';
import { GenerateContentRequest, GenerativeModel, VertexAI } from '@google-cloud/vertexai';
import { v4 as uuid } from 'uuid';
import { z } from 'zod';

import { GCLOUD_PROJECT, GEMINI_MODEL_ID, VERTEX_AI_LOCATION } from '../../config';
import { validateCaptureRequest, incrementUserCaptureCount } from '../../auth';
import { logger } from 'firebase-functions';
import { v0 } from '../../prompts/v0';
import { AIResponseSchema, AIResponse } from './schema';

// Temperature variations for parallel calls - slight differences to hedge against malformed JSON
const TEMPERATURES = [0.05, 0.1, 0.15] as const;

// Reuse VertexAI client across requests (connection pooling, faster warm starts)
const vertexAI = new VertexAI({
  project: GCLOUD_PROJECT,
  location: VERTEX_AI_LOCATION,
});

// Types for tracking AI call results
interface AICallResult {
  index: number;
  temperature: number;
  success: boolean;
  durationMs: number;
  response?: AIResponse;
  rawJson?: string;
  error?: string;
  validationErrors?: z.ZodError;
}

interface LogContext {
  requestId: string;
  userId?: string;
  startTime: number;
}

/**
 * Makes a single AI call with the specified temperature, validates the response with Zod.
 * Returns a result object indicating success/failure with detailed information for logging.
 */
async function makeAICall(
  generativeModel: GenerativeModel,
  request: GenerateContentRequest,
  temperature: number,
  index: number,
  logContext: LogContext
): Promise<AICallResult> {
  const callStartTime = Date.now();

  logger.info(`[${logContext.requestId}] AI call ${index + 1} starting`, {
    temperature,
    callIndex: index,
  });

  try {
    // Clone request and set temperature
    const requestWithTemp = {
      ...request,
      generationConfig: {
        ...request.generationConfig,
        temperature,
      },
    };

    const result = await generativeModel.generateContent(requestWithTemp);
    const durationMs = Date.now() - callStartTime;

    const candidates = result.response?.candidates;
    if (!candidates || candidates.length === 0 || !candidates[0].content?.parts[0]?.text) {
      logger.warn(`[${logContext.requestId}] AI call ${index + 1} returned invalid structure`, {
        temperature,
        durationMs,
        hasResponse: !!result.response,
        candidateCount: candidates?.length || 0,
      });

      return {
        index,
        temperature,
        success: false,
        durationMs,
        error: 'Invalid response structure from Vertex AI',
      };
    }

    const jsonText = candidates[0].content.parts[0].text;

    logger.info(`[${logContext.requestId}] AI call ${index + 1} received response`, {
      temperature,
      durationMs,
      responseLength: jsonText.length,
    });

    // Try to parse JSON
    let parsedData: unknown;
    try {
      parsedData = JSON.parse(jsonText);
    } catch (parseError) {
      logger.warn(`[${logContext.requestId}] AI call ${index + 1} JSON parse failed`, {
        temperature,
        durationMs,
        parseError: parseError instanceof Error ? parseError.message : 'Unknown',
        rawJsonSnippet: jsonText.substring(0, 200),
      });

      return {
        index,
        temperature,
        success: false,
        durationMs,
        rawJson: jsonText,
        error: 'JSON parse failed',
      };
    }

    // Validate with Zod
    const validationResult = AIResponseSchema.safeParse(parsedData);

    if (!validationResult.success) {
      logger.warn(`[${logContext.requestId}] AI call ${index + 1} Zod validation failed`, {
        temperature,
        durationMs,
        validationErrors: validationResult.error.errors,
        rawJsonSnippet: jsonText.substring(0, 500),
      });

      return {
        index,
        temperature,
        success: false,
        durationMs,
        rawJson: jsonText,
        validationErrors: validationResult.error,
        error: 'Zod validation failed',
      };
    }

    logger.info(`[${logContext.requestId}] AI call ${index + 1} validation PASSED`, {
      temperature,
      durationMs,
      status: validationResult.data.status,
      itemCount: validationResult.data.status === 'success' ? validationResult.data.data?.items?.length : 0,
    });

    return {
      index,
      temperature,
      success: true,
      durationMs,
      response: validationResult.data,
      rawJson: jsonText,
    };
  } catch (error) {
    const durationMs = Date.now() - callStartTime;

    logger.error(`[${logContext.requestId}] AI call ${index + 1} threw exception`, {
      temperature,
      durationMs,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    });

    return {
      index,
      temperature,
      success: false,
      durationMs,
      error: error instanceof Error ? error.message : 'Unknown exception',
    };
  }
}

/**
 * Executes multiple AI calls in parallel and returns as soon as the first valid result arrives.
 * Uses a "race to first valid" pattern - doesn't wait for slower calls once we have a winner.
 * Returns null if all calls fail validation.
 */
async function findFirstValidResult(
  generativeModel: GenerativeModel,
  request: GenerateContentRequest,
  logContext: LogContext
): Promise<{ winner: AICallResult | null; completedResults: AICallResult[] }> {
  logger.info(`[${logContext.requestId}] Starting ${TEMPERATURES.length} parallel AI calls (race mode)`, {
    temperatures: TEMPERATURES,
  });

  const completedResults: AICallResult[] = [];
  let winner: AICallResult | null = null;

  // Create all promises
  const promises = TEMPERATURES.map((temp, index) =>
    makeAICall(generativeModel, request, temp, index, logContext)
  );

  // Race to first valid result
  return new Promise((resolve) => {
    let pendingCount = promises.length;

    promises.forEach((promise, index) => {
      promise.then((result) => {
        completedResults.push(result);
        pendingCount--;

        // If we already have a winner, just log this result
        if (winner) {
          logger.info(`[${logContext.requestId}] AI call ${result.index + 1} completed (after winner)`, {
            temperature: result.temperature,
            durationMs: result.durationMs,
            success: result.success,
          });
          return;
        }

        // Check if this is a valid result
        if (result.success) {
          winner = result;
          logger.info(`[${logContext.requestId}] WINNER: AI call ${result.index + 1} (first valid)`, {
            temperature: result.temperature,
            durationMs: result.durationMs,
            status: result.response?.status,
          });
          // Return immediately with the winner
          resolve({ winner, completedResults });
          return;
        }

        // If all calls have completed and none succeeded, resolve with null
        if (pendingCount === 0 && !winner) {
          logger.error(`[${logContext.requestId}] ALL ${promises.length} AI CALLS FAILED`, {
            failures: completedResults.map((r) => ({
              index: r.index,
              temperature: r.temperature,
              error: r.error,
              validationErrorCount: r.validationErrors?.errors?.length,
            })),
          });
          resolve({ winner: null, completedResults });
        }
      });
    });
  });
}

export const analyse = onRequest(
  {
    region: VERTEX_AI_LOCATION,
    memory: '2GiB',
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

    // Initialize logging context
    const logContext: LogContext = {
      requestId: uuid(),
      userId: validation.userId,
      startTime: Date.now(),
    };

    logger.info(`[${logContext.requestId}] Request received`, {
      userId: validation.userId,
      i18n,
      imageSize: image.length,
    });

    // Get model with language-specific system instruction (vertexAI client is reused at module level)
    const generativeModel = vertexAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      systemInstruction: { role: 'model', parts: [{ text: v0({ i18n }) }] },
    });

    const mimeType = image.startsWith('data:image/jpeg;base64,') ? 'image/jpeg' : 'image/png';
    const imageData = image.replace(/^data:image\/(jpeg|png);base64,/, '');

    const req = {
      contents: [
        {
          role: 'user',
          parts: [{ text: 'analyse' }, { inlineData: { mimeType, data: imageData } }],
        },
      ],
      generationConfig: {
        temperature: 0.05, // Will be overridden per call
        topP: 0.8,
        topK: 20,
        maxOutputTokens: 8192,
        responseMimeType: 'application/json',
      },
    } satisfies GenerateContentRequest;

    try {
      const { winner, completedResults } = await findFirstValidResult(generativeModel, req, logContext);

      const totalDuration = Date.now() - logContext.startTime;

      // Log summary (note: completedResults may not include all calls if we returned early)
      logger.info(`[${logContext.requestId}] Request completed`, {
        totalDurationMs: totalDuration,
        completedCount: completedResults.length,
        successCount: completedResults.filter((r) => r.success).length,
        failureCount: completedResults.filter((r) => !r.success).length,
        winnerIndex: winner?.index,
        winnerTemperature: winner?.temperature,
        returnedEarly: winner !== null && completedResults.length < TEMPERATURES.length,
      });

      if (!winner) {
        // All calls failed - return 500 with detailed information
        logger.error(`[${logContext.requestId}] All AI calls failed validation`, {
          completedResults: completedResults.map((r) => ({
            index: r.index,
            temperature: r.temperature,
            durationMs: r.durationMs,
            error: r.error,
            validationErrors: r.validationErrors?.errors,
          })),
        });

        response.status(500).json({
          message: 'All AI responses failed validation',
          requestId: logContext.requestId,
        });
        return;
      }

      // Process the winning response
      const data = winner.response!;

      // Add UUIDs to items if success response
      if (data.status === 'success' && data.data?.items) {
        data.data.items = data.data.items.map((item) => ({
          ...item,
          id: uuid(),
        }));
      }

      // Increment capture count on successful processing
      if (validation.userId) {
        await incrementUserCaptureCount(validation.userId);
      }

      logger.info(`[${logContext.requestId}] Successfully processed image`, {
        userId: validation.userId,
        status: data.status,
        eventCount: data.status === 'success' ? data.data?.items?.length : 0,
        winnerIndex: winner.index,
        totalDurationMs: totalDuration,
      });

      response.status(200).json({
        message: 'processed',
        data: JSON.stringify(data),
      });
    } catch (e: any) {
      const totalDuration = Date.now() - logContext.startTime;

      logger.error(`[${logContext.requestId}] Unexpected error in analyse handler`, {
        error: e.message,
        stack: e.stack,
        totalDurationMs: totalDuration,
      });

      response.status(500).json({
        message: 'An unexpected error occurred during processing.',
        error: e.message,
        requestId: logContext.requestId,
      });
    }
  }
);
