import { onRequest } from 'firebase-functions/v2/https';
import { defineSecret } from 'firebase-functions/params';
import { GoogleGenAI } from '@google/genai';
const geminiApiKey = defineSecret('GEMINI_API_TOKEN');

export const analyse2 = onRequest({ secrets: [geminiApiKey], cors: true }, async (request, response) => {
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
1. Extract as much information as possible for every field in the schema, mapping it precisely to the corresponding key.
2. Always translate the extracted data into the user’s preferred language: ${params.i18n}.
3. Recognize and adapt to the context of the input:
   - For posters and flyers: Use visual cues like prominent or bold text.
   - For letters or emails: Focus on headers, greetings, and structured content.
   - For screenshots or web data: Prioritize headers, dates, times, and highlighted sections.
4. Distinguish between **single events** and **multi-events**:
   - If the input contains references to multiple occurrences of the same or similar event on different dates, treat it as a **multi-event**.
   - For multi-events, create separate entries for each occurrence in the \`items\` array, ensuring each event has a unique \`dateTimeFrom\` and \`dateTimeTo\` field.
   - Avoid treating recurring or spread-out dates (e.g., “Weekend 1,” “Weekend 2”) as a single extended event.
5. Avoid redundancies in the output:
   - If the Agenda property is included, do not repeat timetable details in the description text.
   - Do not include start and end times in the description unless the Agenda property is absent, or the description would otherwise lack sufficient detail.
6. If specific data points cannot be extracted, omit them rather than returning empty fields.
7. Ensure your output is user-friendly, well-structured, and fully translated.

---

### Schema for Response
For a single event:
{
  "status": "success",
  "data": {
    "title": "string",
    "kind": "string",
    "description": {
      "short": "string",
      "long": "string"
    },
    "agenda": [
      {
        "time": "string", // ISO format (HH:MM:SS), no date
        "description": "string"
      }
    ],
    "location": {
      "city": "string",
      "address": "string"
    },
    "dateTimeFrom": {
      "date": "string",
      "timezone": "string",
      "time": "string"
    },
    "dateTimeTo": {
      "date": "string",
      "timezone": "string",
      "time": "string"
    },
    "webLink": "string",
    "ticketLink": "string",
    "ticketAvailableProbability": "number"
  }
}

For multiple events:
{
  "status": "success",
  "data": {
    "items": [
      {
        "title": "string",
        "kind": "string",
        "description": {
          "short": "string",
          "long": "string"
        },
        "agenda": [
          {
            "time": "string", // ISO format (HH:MM:SS), no date
            "description": "string"
          }
        ],
        "location": {
          "city": "string",
          "address": "string"
        },
        "dateTimeFrom": {
          "date": "string",
          "timezone": "string",
          "time": "string"
        },
        "dateTimeTo": {
          "date": "string",
          "timezone": "string",
          "time": "string"
        },
        "webLink": "string",
        "ticketLink": "string",
        "ticketAvailableProbability": "number"
      }
    ]
  }
}

---

### Field-Specific Instructions

1. **Title**:
   - Extract the main name of the event. This should be concise, engaging, and descriptive.
   - For multi-events: Use the same title for all related events unless the input provides distinct titles.

2. **Kind**:
   - Categorize the event into a type or category (e.g., “concert,” “workshop,” “meeting”).
   - For multi-events: Ensure the kind applies to all occurrences.

3. **Description**:
   - Short: Create a concise, engaging summary in 3–8 sentences. Avoid repeating the title or time/location details.
   - Long: Expand on the short description (2–3 times longer) to make the event sound inviting and informative.
   - Avoid redundancies: Do not include timetable or start/end time details if the Agenda property is present.

4. **Agenda**:
   - Extract a structured timetable of activities into the Agenda property only if there are at least three distinct time-based items.
   - For each item, include only the **start time** in ISO format (\`HH:MM:SS\`), ignoring ranges or end times.
   - Each item should also have a concise \`description\`.
   - If there are fewer than three items, embed the details into the description instead, and omit the Agenda property.
   - Avoid duplicating timetable details in the description if the Agenda property is present.

5. **Location**:
   - Extract city and address information. Include venue names if present.
   - For multi-events: Verify if the location changes between occurrences. If consistent, reuse the same location.

6. **DateTimeFrom & DateTimeTo**:
   - Extract the start and end dates/times in ISO format (YYYY-MM-DD and HH:MM:SS).
   - For multi-events: Treat separate occurrences as distinct entries, each with its own \`dateTimeFrom\` and \`dateTimeTo\` values.

7. **WebLink & TicketLink**:
   - Extract URLs for the event website or ticket sales.
   - For multi-events: Use the same links unless different ones are provided for each occurrence.

8. **TicketAvailableProbability**:
   - Estimate the likelihood that tickets for the event might be available online, even if the flyer or input does not mention tickets explicitly.
   - Base your estimation on the event's scale, type, and context:
     - Formal events (e.g., concerts, conferences, festivals) → Higher probability.
     - Informal or small-scale events (e.g., meetups, community gatherings) → Lower probability.
   - Consider details such as venue size (stadium vs. local park) or descriptive phrases implying significant scale.
   - Return a value between 0 and 100, where higher values indicate greater likelihood of ticket availability.
   - Example:
     - A rock concert at a stadium → 95
     - A community potluck at a local park → 10

---

### Error Handling
- If no event-related data can be extracted, return an error response:
{
  "status": "error",
  "data": null,
  "reason": "ApiExtractionError"
}
- Valid Error Codes:
  - 'PROBABLY_NOT_AN_EVENT'
  - 'MULTIPLE_EVENTS_FOUND'
  - 'IMAGE_TOO_BLURRED'
  - 'LOW_CONTRAST_OR_POOR_LIGHTING'
  - 'TEXT_TOO_SMALL'
  - 'OVERLAPPING_TEXT_OR GRAPHICS'

---

### Additional Notes:
1. Always prioritize translating the output into the user’s preferred language (${params.i18n}).
2. Be flexible in interpreting diverse formats and adapt based on input type (e.g., structured letters, unstructured screenshots).
3. For multi-events, clearly distinguish separate occurrences while maintaining shared details like title, kind, and descriptions.
4. Avoid redundancies: Do not repeat information between Agenda and description or other fields unnecessarily.
5. Ensure cohesive and user-friendly output, especially when multiple events are detected.

Process the input and generate a comprehensive, accurate response following these guidelines.
`;
