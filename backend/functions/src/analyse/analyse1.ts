import { onRequest } from 'firebase-functions/v2/https';
import { defineSecret } from 'firebase-functions/params';
import { GoogleGenerativeAI } from '@google/generative-ai';

const geminiApiKey = defineSecret('GEMINI_API_TOKEN');

export const analyse1 = onRequest({ secrets: [geminiApiKey], cors: true }, async (request, response) => {
  const { imageBase64, languageAndRegionCode: i18n } = request.body;

  if (!imageBase64) {
    response.status(400).json({ error: 'Image base64 data is required' });
    return;
  }

  // Step 1: Initialize Google Generative AI to process the image and extract data
  const genAI = new GoogleGenerativeAI(geminiApiKey.value());

  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    systemInstruction: prompt({ i18n }),
  });

  // First, extract basic information from the image
  const session = model.startChat({
    generationConfig: {
      temperature: 0.05,
      topP: 0.8,
      topK: 20,
      maxOutputTokens: 8192,
      responseMimeType: 'application/json',
    },
    history: [
      {
        role: 'user',
        parts: [{ inlineData: { mimeType: 'image/jpeg', data: imageBase64 } }],
      },
    ],
  });

  // Wait for the first task (extracting data from the image)
  const result = await session.sendMessage(
    'Process the input and generate a comprehensive, accurate response following these guidelines.'
  );
  const data = result.response.text(); // Assuming the response contains JSON with the extracted data

  // Send the final result back
  response.status(200).json({
    message: 'Image processed',
    data,
  });
});

type PromptParams = {
  i18n: string;
};
const prompt = (params: PromptParams) => `
Please extract the event details from the image and return them in the following schema. Ensure the date and time are well-formatted in UTC (ISO 8601 format), considering the provided user's location and time for context. If necessary, convert the event times from the user's timezone to UTC.

For event start and end times, use the format \`YYYY-MM-DDTHH:MM:SSZ\`. If the time is not provided, return only the date in \`YYYY-MM-DD\` format.

### User Information (for context):
- **User Location**: ${params.i18n} (This is the location of the user viewing the event, which may be relevant for interpreting the event location.)
- **User Time**: ${params.i18n} (This is the user's current time in UTC, formatted as \`YYYY-MM-DDTHH:MM:SSZ\`. Use this as a reference for converting any event times to UTC.)

Here is the schema to follow:

interface Response {
  status?: "error" | "success",
  data?: {
    title: string,             // The title of the event
    description: string,       // A description of the event
    begin: {                   // Start of the event
      date: string,            // The start date of the event in UTC (required, format: YYYY-MM-DD)
      time?: string            // The start time in UTC (optional, format: HH:MM:SSZ)
    },
    end?: {                    // End of the event (optional)
      date: string,            // The end date of the event in UTC (format: YYYY-MM-DD)
      time?: string            // The end time in UTC (optional, format: HH:MM:SSZ)
    },
    location: string | null    // The location should be a full address or a specific place name that can be found via Google Maps. Include as much detail as possible to ensure accurate geolocation.
  }
}

### Guidelines:
- **eventTitle**: The event title should be concise but descriptive.
- **description**: Provide the full description of the event, including any relevant details.
- **begin.date**: This must be formatted as \`YYYY-MM-DD\` in UTC (required).
- **begin.time**: If the event has a specific start time, include it as \`HH:MM:SSZ\` in UTC (optional).
- **end.date**: If the event has an end date, format it as \`YYYY-MM-DD\` in UTC (optional).
- **end.time**: If the event has an end time, format it as \`HH:MM:SSZ\` in UTC (optional).
- **location**: The location should be a precise address or venue that can be found in Google Maps (e.g., "123 Main St, Springfield, IL 62704, USA" or "Eiffel Tower, Paris, France"). The more specific, the better.

### Example Response:
{
  "error": "success",
  "data": {
    "eventTitle": "Team Meeting",
    "description": "Discussing project milestones.",
    "begin": {
      "date": "2024-10-07",
      "time": "10:00:00Z"
    },
    "end": {
      "date": "2024-10-07",
      "time": "11:00:00Z"
    },
    "location": "123 Main St, Springfield, IL 62704, USA"
  }
}
`;

export const calendarObject2 = (params: { userLocation: string; userTime: string }) => `
Please extract the event details from the image and return them in the following schema. Ensure the date and time are well-formatted in UTC (ISO 8601 format), considering the provided user’s location and time for context. If necessary, convert the event times from the user’s timezone to UTC.

For event start and end times, use the format YYYY-MM-DDTHH:MM:SSZ. If the time is not provided, return only the date in YYYY-MM-DD format.

User Information (for context):

\t•\tUser Location: ${params.userLocation} (This is the location of the user viewing the event, which may be relevant for interpreting the event location.)
\t•\tUser Time: ${params.userTime} (This is the user’s current time in UTC, formatted as YYYY-MM-DDTHH:MM:SSZ. Use this as a reference for converting any event times to UTC.)

Here is the schema to follow:

interface SuccessResponse {
  status: "success"; // always "success"
  data: {
    title: string;                    // The title of the event
    kind: string;                     // The kind or category of the event
    location: {
      city: string;                   // The city where the event will take place
      address: string;                // The specific address of the event location
    };
    dateTimeFrom: {
      date: string;                   // The start date of the event (format: YYYY-MM-DD)
      timezone: string;               // The timezone of the event start time
      time: string;                   // The start time of the event (format: HH:MM:SSZ)
    };
    dateTimeTo: {
      date: string;                   // The end date of the event (format: YYYY-MM-DD)
      timezone: string;               // The timezone of the event end time
      time: string;                   // The end time of the event (format: HH:MM:SSZ)
    };
    description: {
      short: string;                  // A short description of the event
      long: string;                   // A detailed description of the event
    };
    webLink: string;                  // A link to the event webpage or additional information
    ticketLink: string;               // A link to purchase tickets for the event (if applicable)
  }
};

interface ErrorResponse {
  status: "error"; // always "error"
  reason: "no_event_data_found" | "probably_not_an_event" | "definitely_not_an_event" | "other_reason"
  data: null; // always null
};

Guidelines:

\t•\ttitle: The event title should be concise but descriptive.
\t•\tkind: Indicate the type of event (e.g., “Concert,” “Workshop”).
\t•\tlocation.city: Provide the city where the event is held.
\t•\tlocation.address: Include the full address for precise geolocation (e.g., “123 Main St, Springfield, IL 62704, USA”).
\t•\tdateTimeFrom.date: The start date of the event in YYYY-MM-DD format (required).
\t•\tdateTimeFrom.time: The start time in HH:MM:SSZ format in UTC (required).
\t•\tdateTimeTo.date: The end date of the event in YYYY-MM-DD format (required).
\t•\tdateTimeTo.time: The end time in HH:MM:SSZ format in UTC (required).
\t•\tdescription.short: A short, concise summary of the event.
\t•\tdescription.long: A more detailed description, including any key information.
\t•\twebLink: A URL pointing to the official event page.
\t•\tticketLink: A URL where tickets can be purchased.


### Example Response (Success):
{
  "error": "success",
  "data": {
    "title": "Live Concert: The Electric Sound",
    "kind": "Concert",
    "location": {
      "city": "Berlin",
      "address": "Mercedes-Benz Arena, Mercedes-Platz 1, 10243 Berlin, Germany"
    },
    "dateTimeFrom": {
      "date": "2024-11-15",
      "timezone": "UTC+1",
      "time": "19:00:00Z"
    },
    "dateTimeTo": {
      "date": "2024-11-15",
      "timezone": "UTC+1",
      "time": "22:00:00Z"
    },
    "description": {
      "short": "A night of electric beats and live music.",
      "long": "Join us for a spectacular evening of live performances featuring The Electric Sound, showcasing their latest album with mesmerizing light displays and powerful beats. An unforgettable night for music lovers!"
    },
    "webLink": "https://example.com/concert",
    "ticketLink": "https://example.com/concert-tickets"
  }
}

### Example Response (Error):
{
  "error": "error",
  "reason": "no_event_data_found"
  "data": null,
}

Always return all data in user language!!

`;
