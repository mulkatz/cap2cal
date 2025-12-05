import { jsPDF } from 'jspdf';
import { logger } from './logger';

export interface ElementMeasurement {
  x: number; // Position relative to card (pixels)
  y: number;
  width: number;
  height: number;
}

export interface GenerateEventPdfOptions {
  cardScreenshotDataUrl: string; // Event card screenshot with photo already inside (required)
  eventTitle: string;
  locationText?: string; // Optional location text for clickable link
  locationUrl?: string; // Optional maps URL for location
  // Precise measurements of interactive elements (CSS pixels, relative to card)
  locationMeasurement?: ElementMeasurement | null;
  ticketButtonMeasurement?: ElementMeasurement | null;
  footerLinkMeasurement?: ElementMeasurement | null;
  pixelRatio?: number; // Screenshot pixel ratio (default: 2) - measurements need to be scaled by this
}

/**
 * Generates a PDF with tight bounds around the event card screenshot on a dark background
 *
 * @param options - PDF generation options including precise measurements of interactive elements
 * @returns Base64-encoded PDF data (without data URL prefix)
 *
 * Layout:
 * - Very dark blue-gray background (#0D1117)
 * - Event card screenshot (with photo, details, and branding footer already included)
 * - Small padding (5mm) around the card
 * - Accurately positioned clickable links based on element measurements:
 *   - Location (if provided) - links to Google Maps
 *   - Footer link - links to cap2cal.app/invite
 *   - Ticket button (measured for future use)
 */
export const generateEventPdf = async (options: GenerateEventPdfOptions): Promise<string> => {
  const {
    cardScreenshotDataUrl,
    eventTitle,
    locationText,
    locationUrl,
    locationMeasurement,
    ticketButtonMeasurement,
    footerLinkMeasurement,
    pixelRatio = 2,
  } = options;

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

    // --- 3. Add clickable links based on precise measurements ---
    logger.info('pdfGenerator', 'Adding clickable link overlays using measured positions...');

    // Helper to convert element measurement to PDF coordinates
    const addClickableArea = (
      measurement: ElementMeasurement,
      url: string,
      label: string
    ) => {
      // Scale CSS pixel measurements by pixel ratio to match actual image dimensions
      const scaledX = measurement.x * pixelRatio;
      const scaledY = measurement.y * pixelRatio;
      const scaledWidth = measurement.width * pixelRatio;
      const scaledHeight = measurement.height * pixelRatio;

      // Convert scaled pixels to mm (same ratio used for card dimensions)
      const xMm = scaledX * pxToMm;
      const yMm = scaledY * pxToMm;
      const widthMm = scaledWidth * pxToMm;
      const heightMm = scaledHeight * pxToMm;

      // Add PDF padding offset
      const pdfX = paddingMm + xMm;
      const pdfY = paddingMm + yMm; // Use Y as-is (top-down), don't invert

      // Add clickable link
      pdf.link(pdfX, pdfY, widthMm, heightMm, { url });

      logger.info('pdfGenerator', `Added ${label} link at PDF=(${pdfX.toFixed(2)}mm, ${pdfY.toFixed(2)}mm) size=(${widthMm.toFixed(2)}mm x ${heightMm.toFixed(2)}mm)`);
    };

    // Add clickable areas for each measured element
    if (locationMeasurement && locationText && locationUrl) {
      addClickableArea(locationMeasurement, locationUrl, 'location');
    } else if (!locationMeasurement && locationText) {
      logger.warn('pdfGenerator', 'Location text provided but no measurement found');
    }

    if (ticketButtonMeasurement) {
      // For now, ticket button doesn't have a specific URL - could be added later
      logger.info('pdfGenerator', `Ticket button position measured: (${ticketButtonMeasurement.x.toFixed(2)}px, ${ticketButtonMeasurement.y.toFixed(2)}px)`);
    }

    if (footerLinkMeasurement) {
      addClickableArea(footerLinkMeasurement, 'https://cap2cal.app/invite', 'footer');
    } else {
      logger.warn('pdfGenerator', 'Footer link measurement not found');
    }

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
