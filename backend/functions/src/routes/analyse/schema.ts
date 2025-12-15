import { z } from 'zod';

// DateTime schema for dateTimeFrom (date required for frontend validation)
const DateTimeFromSchema = z.object({
  date: z.string(), // Required - YYYY-MM-DD format
  time: z.string().optional(), // Optional - HH:MM:SS format
});

// DateTime schema for dateTimeTo (all optional)
const DateTimeToSchema = z.object({
  date: z.string().optional(),
  time: z.string().optional(),
});

// Agenda item schema
const AgendaItemSchema = z.object({
  date: z.string(),
  time: z.string(),
  description: z.string(),
});

// Location schema
const LocationSchema = z.object({
  city: z.string().optional(),
  address: z.string().optional(),
});

// Description schema (short required, long optional)
const DescriptionSchema = z.object({
  short: z.string(),
  long: z.string().optional(),
});

// Main ApiEvent schema (without id - AI doesn't provide it, backend adds it)
const ApiEventFromAISchema = z.object({
  title: z.string(),
  kind: z.string().optional(),
  tags: z.array(z.string()),
  description: DescriptionSchema,
  dateTimeFrom: DateTimeFromSchema,
  dateTimeTo: DateTimeToSchema.optional(),
  agenda: z.array(AgendaItemSchema).optional(),
  location: LocationSchema.optional(),
  links: z.array(z.string()).optional(),
  ticketDirectLink: z.string().optional(),
  ticketAvailableProbability: z.number().optional(),
  ticketSearchQuery: z.string().optional(),
});

// Success response schema
const SuccessResponseSchema = z.object({
  status: z.literal('success'),
  message: z.string().optional(),
  data: z.object({
    items: z.array(ApiEventFromAISchema),
  }),
});

// Error response schema (valid response for non-event images)
const ErrorResponseSchema = z.object({
  status: z.literal('error'),
  message: z.string().optional(),
  data: z
    .object({
      reason: z.enum([
        'PROBABLY_NOT_AN_EVENT',
        'IMAGE_TOO_BLURRED',
        'LOW_CONTRAST_OR_POOR_LIGHTING',
        'TEXT_TOO_SMALL',
        'OVERLAPPING_TEXT_OR_GRAPHICS',
      ]),
    })
    .optional(),
});

// Combined schema: either success or error response
export const AIResponseSchema = z.union([SuccessResponseSchema, ErrorResponseSchema]);

// Type exports
export type AIResponse = z.infer<typeof AIResponseSchema>;
export type SuccessResponse = z.infer<typeof SuccessResponseSchema>;
export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;
export type ApiEventFromAI = z.infer<typeof ApiEventFromAISchema>;
