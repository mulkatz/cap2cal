import { jsPDF } from 'jspdf';
import { logger } from './logger';

export interface GenerateEventPdfOptions {
  cardScreenshotDataUrl: string; // Event card screenshot with photo already inside (required)
  eventTitle: string;
  locationText?: string; // Optional location text for clickable link
  locationUrl?: string; // Optional maps URL for location
}

/**
 * Generates a PDF with tight bounds around the event card screenshot on a dark background
 *
 * @param options - PDF generation options
 * @returns Base64-encoded PDF data (without data URL prefix)
 *
 * Layout:
 * - Dark blue-gray background (#1E2E3F)
 * - Event card screenshot (with photo, details, and branding footer already included)
 * - Small padding around the card
 * - Clickable links: location (if provided) and branding footer
 */
export const generateEventPdf = async (options: GenerateEventPdfOptions): Promise<string> => {
  const { cardScreenshotDataUrl, eventTitle, locationText, locationUrl } = options;

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

    // --- 1. Fill background with very dark blue-gray (#0D1117) ---
    pdf.setFillColor(13, 17, 23); // #0D1117 (GitHub dark theme)
    pdf.rect(0, 0, pdfWidth, pdfHeight, 'F'); // Fill entire page

    // --- 2. Add Event Card Screenshot (centered with padding) ---
    logger.info('pdfGenerator', 'Adding event card screenshot...');

    pdf.addImage(cardScreenshotDataUrl, 'PNG', paddingMm, paddingMm, cardWidthMm, cardHeightMm);

    // --- 3. Add clickable links ---
    logger.info('pdfGenerator', 'Adding clickable link overlays...');

    // 3a. Location link (if provided)
    if (locationText && locationUrl) {
      // Location layout (from card top):
      // - Padding top: 20px (5.3mm)
      // - Date badge + title + kind: ~90px (24mm)
      // - Time row: ~30px (8mm)
      // - Location row: ~30px (8mm) ← TARGET
      // Total from card top: ~140px (37mm)
      // But photo adds variable height above, so calculate from a percentage

      // Use 45% from top as starting point (works for various photo heights)
      const locationYOffset = cardHeightMm * 0.45;
      const locationHeightMm = 12; // Tall clickable area (45px) for better coverage
      const locationY = paddingMm + locationYOffset;
      const locationX = paddingMm; // Full left edge
      const locationWidthMm = cardWidthMm; // Full width

      pdf.link(locationX, locationY, locationWidthMm, locationHeightMm, { url: locationUrl });
      logger.info('pdfGenerator', `Added location link at Y=${locationY.toFixed(2)}mm: ${locationUrl}`);
    }

    // 3b. Branding footer link - positioned at BOTTOM of card
    // Footer is the last element, calculate from bottom UP
    // Footer structure:
    // - Border-top + padding-top: 16px (4mm)
    // - Text line: 32px (8.5mm)
    // - Padding-bottom: 20px (5.3mm)
    // Total: ~68px (18mm)

    const footerHeightMm = 18; // Full footer height
    const footerY = paddingMm + cardHeightMm - footerHeightMm; // Start from bottom
    const footerX = paddingMm; // Full width, centered by content
    const footerWidthMm = cardWidthMm; // Full width

    // Add invisible clickable rectangle over entire footer area
    pdf.link(footerX, footerY, footerWidthMm, footerHeightMm, { url: 'https://cap2cal.app/invite' });
    logger.info('pdfGenerator', `Added branding footer link at Y=${footerY.toFixed(2)}mm`);

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
  const baseUrl = 'https://cap2cal.app/invite';
  return `${baseUrl}/${eventId}`;
};
