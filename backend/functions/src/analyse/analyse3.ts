import { onRequest } from 'firebase-functions/v2/https';
import { defineSecret } from 'firebase-functions/params';
import { GoogleGenAI } from '@google/genai';

const geminiApiKey = defineSecret('GEMINI_API_TOKEN');

export const analyse3 = onRequest({ secrets: [geminiApiKey], cors: true }, async (request, response) => {
  const { imageBase64, i18n } = request.body;

  if (!imageBase64) {
    response.status(400).json({ error: 'Image base64 data is required' });
    return;
  }

  const genAI = new GoogleGenAI({ apiKey: geminiApiKey.value() });

  const mimeType = imageBase64.startsWith(`data:image/jpeg;base64,`) ? 'image/jpeg' : 'image/png';
  const data = imageBase64.startsWith(`data:image/jpeg;base64,`)
    ? imageBase64.replace(`data:image/jpeg;base64,`, '')
    : imageBase64.replace(`data:image/png;base64,`, '');

  const contents = [
    {
      inlineData: {
        role: 'user',
        mimeType,
        data,
      },
    },
  ];

  const responseResult = await genAI.models.generateContent({
    model: 'gemini-1.5-flash',
    contents: contents,
    config: {
      temperature: 0.05,
      topP: 0.8,
      topK: 20,
      maxOutputTokens: 8192,
      responseMimeType: 'application/json',
      systemInstruction: prompt({ i18n }),
    },
  });

  // Send the final result back
  response.status(200).json({
    message: 'Image processed',
    data: responseResult.text,
  });
});

type PromptParams = {
  i18n: string;
};
const prompt = (
  params: PromptParams
) => `You are an advanced AI trained to extract structured event-related information from a wide variety of input sources, such as posters, flyers, letters, emails, or screenshots of websites. Your goal is to analyze the input and produce a complete and accurate response following the schema below.

Key Objectives:
1.  Extract as much information as possible for every field in the schema, mapping it precisely to the corresponding key for each identified event.
2.  Always translate the extracted data into the user’s preferred language: ${params.i18n}.
3.  Recognize and adapt to the context of the input:
    * For posters and flyers: Use visual cues like prominent or bold text.
    * For letters or emails: Focus on headers, greetings, and structured content.
    * For screenshots or web data: Prioritize headers, dates, times, and highlighted sections.
4.  **Event Structuring**:
    * Always structure your response with a \`data.items\` array in the success case, which will contain one or more event objects.
    * If the input describes a single event, the \`items\` array will contain one event object.
    * If the input describes multiple occurrences of the same event (e.g., a tour with different dates/cities, a workshop series), create a separate event object in the \`items\` array for each distinct occurrence. Ensure each has unique identifiers like \`dateTimeFrom\`, \`dateTimeTo\`, or \`location\` as appropriate.
    * Avoid treating recurring dates (e.g., "Weekend 1," "Weekend 2" of the same festival at the same place) as a single extended event if they can be distinctly identified as separate occurrences with their own specific date ranges.
5.  Avoid redundancies in the output for each event object:
    * If the \`agenda\` property is included for an event, do not repeat timetable details in its \`description\` text.
    * Do not include start and end times in an event's \`description\` unless its \`agenda\` property is absent, or the description would otherwise lack sufficient detail.
6.  If specific data points cannot be extracted for an event object or its fields, omit those fields rather than returning empty or null values.
7.  Ensure your output is user-friendly, well-structured, and fully translated.

---

### Schema for Response

**Success Response:**
The response will always follow this structure when events are successfully extracted. The \`data.items\` array will contain one object for a single event, or multiple objects if several distinct event occurrences are found.

{
  "status": "success",
  "message": "Events extracted successfully.", // Optional success message
  "data": {
    "items": [ // Array of one or more event objects
      {
        "title": "string",
        "kind": "string", // e.g., "concert", "workshop", "conference"
        "dateTimeFrom": "string", // ISO 8601 format (YYYY-MM-DDTHH:MM:SSZ or with timezone offset)
        "dateTimeTo": "string",   // ISO 8601 format (YYYY-MM-DDTHH:MM:SSZ or with timezone offset)
        "description": { // Optional
          "short": "string",
          "long": "string"
        },
        "agenda": [ // Optional; Array of agenda items
          {
            "dateTime": "string", // ISO 8601 format for the specific agenda item start time
            "description": "string"
          }
        ],
        "location": { // Optional
          "city": "string",
          "address": "string" // Including venue name if available
        },
        "urls": ["string"], // Optional; Array of relevant URLs
        "ticketSearchQuery": "string", // Optional
        "ticketDirectLink": "string", // Optional
        "ticketAvailableProbability": "number" // Optional; Probability (0.0 to 1.0)
      }
      // ... more event items if applicable
    ]
  }
}

---

### Field-Specific Instructions (apply to each event object in \`data.items\`)

1.  **title**:
    * Extract the main name of the event. This should be concise, engaging, and descriptive.
    * If multiple related event occurrences are found (i.e., multiple items in \`data.items\`), use the same title for all items unless the input provides distinct titles for each occurrence.

2.  **kind**:
    * Categorize the event (e.g., “concert,” “workshop,” “meeting,” “festival,” “conference”).
    * If multiple related event occurrences are found, ensure the kind applies to all. If omitted, do not include the field.

3.  **dateTimeFrom & dateTimeTo**:
    * Extract the start and end dates/times. Format as a full ISO 8601 string (e.g., \`YYYY-MM-DDTHH:MM:SSZ\` or \`YYYY-MM-DDTHH:MM:SS+02:00\`). Include timezone information if available.
    * If only a date is provided for a single-day event, use T00:00:00 for \`dateTimeFrom\` and T23:59:59 for \`dateTimeTo\`.
    * Each distinct event occurrence (e.g., a different day of a festival, a tour stop in a new city) should be a separate item in \`data.items\` with its own \`dateTimeFrom\` and \`dateTimeTo\`.

4.  **description**: (Optional field)
    * \`short\`: Create a concise, engaging summary (3–8 sentences). Avoid repeating title or time/location if clearly in other fields.
    * \`long\`: Expand on the short description (2–3 times longer), providing more context.
    * Avoid redundancies with \`agenda\`. If this field or its sub-fields are not applicable or information is unavailable, omit them.

5.  **agenda**: (Optional field)
    * Extract a structured timetable into the \`agenda\` array only if there are at least three distinct time-based items for the event.
    * \`dateTime\` should be the start date and time of that specific agenda point in ISO 8601 format.
    * If fewer than three items, embed details into \`description.long\` and omit \`agenda\`.
    * If omitted, do not include the field.

6.  **location**: (Optional field)
    * Extract city and address. Include venue names in \`address\` (e.g., "123 Main St, Event Hall").
    * If multiple related event occurrences are found, verify if the location changes for each item. If consistent, reuse. If omitted, do not include the field or its sub-fields.

7.  **urls**: (Optional field)
    * Extract relevant URLs (official site, social media). Store in an array. Include all if multiple. If omitted, do not include the field.

8.  **ticketSearchQuery**: (Optional field)
    * If no \`ticketDirectLink\` is found but tickets are likely sold online, generate a search query (e.g., "Event Name tickets City").
    * Use if \`ticketDirectLink\` is unavailable but \`ticketAvailableProbability\` is high. If omitted, do not include the field.

9.  **ticketDirectLink**: (Optional field)
    * Extract the direct URL for ticket sales.
    * If multiple related event occurrences are found, use the same link unless different ones are provided for each item. If omitted, do not include the field.

10. **ticketAvailableProbability**: (Optional field)
    * Estimate likelihood (0.0 to 1.0) of online ticket availability.
    * Formal/large-scale events (concerts, major conferences) → Higher probability (e.g., 0.8 - 1.0).
    * Informal/small-scale (local meetups, free workshops) → Lower probability (e.g., 0.0 - 0.3).
    * Example: Stadium rock concert → 0.95; Community park potluck → 0.1.
    * If omitted, do not include the field.

---

### Error Handling
- If no event-related data can be extracted, or if the input is not deemed to be an event, return an error response structured as follows:

{
  "status": "error",
  "message": "Failed to extract event information.", // A general error message
  "data": {
    "code": "REASON_CODE_FOR_ERROR" // Specific error code listed below
  }
}

- Valid Error Codes for the \`data.code\` field:
  - 'PROBABLY_NOT_AN_EVENT': When the input does not seem to describe an event.
  - 'MULTIPLE_UNRELATED_EVENTS_AMBIGUOUS': When the input describes multiple *distinct and unrelated* events, making it unclear which to prioritize (this is different from a series of the same event, which should be processed into \`data.items\`).
  - 'IMAGE_TOO_BLURRED'
  - 'LOW_CONTRAST_OR_POOR_LIGHTING'
  - 'TEXT_TOO_SMALL'
  - 'OVERLAPPING_TEXT_OR_GRAPHICS'
  - 'EXTRACTION_ERROR_UNKNOWN'

---

### Additional Notes:
1.  Always prioritize translating the output into the user’s preferred language (${params.i18n}).
2.  Be flexible in interpreting diverse formats.
3.  When multiple related event occurrences are detected, represent each as a distinct item in \`data.items\`. Clearly distinguish them (e.g., by \`dateTimeFrom\`/\`dateTimeTo\` or \`location\`) while maintaining shared details (like \`title\` or \`kind\`) if they are indeed the same across these occurrences.
4.  Avoid redundancies within each event object: Do not repeat information between \`agenda\` and \`description\` or other fields unnecessarily.
5.  Ensure cohesive and user-friendly output. Omit optional fields or sub-fields within an event object if no relevant information can be extracted for them.

Process the input and generate a comprehensive, accurate response following these guidelines.`;
