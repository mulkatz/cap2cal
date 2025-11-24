// Real event poster image for screenshots
// This is the actual image that will be used for testing the image processing flow

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read the image and convert to base64 (using example-1)
const imagePath = join(__dirname, 'event-capture-example-1.png');
const imageBuffer = readFileSync(imagePath);
const base64Image = `data:image/png;base64,${imageBuffer.toString('base64')}`;

export const exampleImage = {
  id: 'example-001',
  dataUrl: base64Image,
  capturedAt: Date.now()
};
