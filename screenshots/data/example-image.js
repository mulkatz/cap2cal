// Real event poster images for screenshots
// These are the actual images that will be used for testing the image processing flow

import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Helper function to read and convert image to base64
const readImageAsBase64 = (filename) => {
  const imagePath = join(__dirname, filename);
  const imageBuffer = readFileSync(imagePath);
  return `data:image/png;base64,${imageBuffer.toString("base64")}`;
};

// Read all 3 example images
const base64Image1 = readImageAsBase64("event-capture-example-1.jpg");
const base64Image2 = readImageAsBase64("event-capture-example-2.jpg");
const base64Image3 = readImageAsBase64("event-capture-example-3.jpg");

// Export all example images
export const exampleImage1 = {
  id: "example-001",
  dataUrl: base64Image1,
  capturedAt: Date.now(),
};

export const exampleImage2 = {
  id: "example-002",
  dataUrl: base64Image2,
  capturedAt: Date.now(),
};

export const exampleImage3 = {
  id: "example-003",
  dataUrl: base64Image3,
  capturedAt: Date.now(),
};

// For backwards compatibility, export the first image as default
export const exampleImage = exampleImage1;
