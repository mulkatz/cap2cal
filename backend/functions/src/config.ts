import { HarmBlockThreshold, HarmCategory } from '@google-cloud/vertexai';

// cloud and model configs
export const GCLOUD_PROJECT = 'cap2cal';
export const VERTEX_AI_LOCATION = 'us-central1';
export const GEMINI_MODEL_ID = 'gemini-2.0-flash-lite';
// export const IMAGEN_MODEL_ID = 'imagegeneration@006';

// Recommended for user generated content
export const SAFETY_SETTINGS = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
  },
];
