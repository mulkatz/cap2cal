import { jsPDF } from 'jspdf';
import { logger } from './logger';

export interface GenerateEventPdfOptions {
  cardScreenshotDataUrl: string; // Event card screenshot with photo already inside (required)
  eventTitle: string;
}

/**
 * Generates a PDF with tight bounds around the event card screenshot on a black background
 *
 * @param options - PDF generation options
 * @returns Base64-encoded PDF data (without data URL prefix)
 *
 * Layout:
 * - Black background
 * - Event card screenshot (with photo, details, and branding footer already included)
 * - Small padding around the card
 */
export const generateEventPdf = async (options: GenerateEventPdfOptions): Promise<string> => {
  const { cardScreenshotDataUrl, eventTitle } = options;

  try {
    logger.info('pdfGenerator', 'Starting PDF generation...');

    // Get card image dimensions
    const img = new Image();
    img.src = cardScreenshotDataUrl;
    await new Promise((resolve) => {
      img.onload = resolve;
    });

    const cardWidthPx = img.width;
    const cardHeightPx = img.height;

    // Convert pixels to mm (assuming 96 DPI)
    const pxToMm = 0.264583;
    const paddingMm = 5; // 5mm padding around the card

    const cardWidthMm = cardWidthPx * pxToMm;
    const cardHeightMm = cardHeightPx * pxToMm;
    const pdfWidth = cardWidthMm + 2 * paddingMm;
    const pdfHeight = cardHeightMm + 2 * paddingMm;

    logger.info('pdfGenerator', `PDF dimensions: ${pdfWidth.toFixed(2)}mm x ${pdfHeight.toFixed(2)}mm`);

    // Create PDF with custom size (tight bounds)
    const pdf = new jsPDF({
      orientation: pdfWidth > pdfHeight ? 'landscape' : 'portrait',
      unit: 'mm',
      format: [pdfWidth, pdfHeight],
    });

    // --- 1. Fill background with black ---
    pdf.setFillColor(0, 0, 0); // Black
    pdf.rect(0, 0, pdfWidth, pdfHeight, 'F'); // Fill entire page

    // --- 2. Add Event Card Screenshot (centered with padding) ---
    logger.info('pdfGenerator', 'Adding event card screenshot...');

    pdf.addImage(cardScreenshotDataUrl, 'PNG', paddingMm, paddingMm, cardWidthMm, cardHeightMm);

    // --- 3. Add invisible clickable link over branding footer ---
    logger.info('pdfGenerator', 'Adding clickable link overlay...');

    // Branding footer is at the bottom of the card (approximately last 60px / 16mm)
    // We'll create a clickable rectangle over the footer area
    const footerHeightMm = 16; // Height of the branding footer area
    const footerY = paddingMm + cardHeightMm - footerHeightMm; // Y position of footer
    const footerX = paddingMm; // X position (start of card)
    const footerWidthMm = cardWidthMm; // Full width of card

    // Add invisible clickable rectangle
    pdf.link(footerX, footerY, footerWidthMm, footerHeightMm, { url: 'https://cap2cal.app/invite' });

    // --- 4. Add metadata ---
    pdf.setProperties({
      title: eventTitle,
      subject: `Event: ${eventTitle}`,
      author: 'Capture2Calendar',
      keywords: 'event, calendar, capture2calendar',
      creator: 'Capture2Calendar App',
    });

    // --- 4. Generate base64 output ---
    logger.info('pdfGenerator', 'PDF generation complete');

    // Get base64 string (without data URL prefix)
    const pdfBase64 = pdf.output('datauristring').split(',')[1];

    return pdfBase64;
  } catch (error) {
    logger.error('pdfGenerator', 'Failed to generate PDF', error as Error);
    throw new Error('Failed to generate PDF');
  }
};

/**
 * Helper to get the invite URL for an event
 * @param eventId - The event ID
 * @returns The full invite URL
 */
export const getEventInviteUrl = (eventId: string): string => {
  // TODO: Replace with your actual invite page URL
  const baseUrl = 'https://capture2calendar.app/invite';
  return `${baseUrl}/${eventId}`;
};
