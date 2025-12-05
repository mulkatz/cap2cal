import { jsPDF } from 'jspdf';
import { logger } from './logger';

export interface GenerateEventPdfOptions {
  eventPhotoDataUrl?: string; // Original event photo (optional)
  cardScreenshotDataUrl: string; // Event card screenshot (required)
  eventTitle: string;
  inviteUrl: string; // URL to the web invite page
}

/**
 * Generates a PDF containing the event photo and card screenshot with an interactive link
 *
 * @param options - PDF generation options
 * @returns Base64-encoded PDF data (without data URL prefix)
 *
 * Layout:
 * - Event photo at the top (if provided)
 * - Event card screenshot below the photo
 * - Interactive link at the bottom: "View full event details: [URL]"
 */
export const generateEventPdf = async (options: GenerateEventPdfOptions): Promise<string> => {
  const { eventPhotoDataUrl, cardScreenshotDataUrl, eventTitle, inviteUrl } = options;

  try {
    logger.info('pdfGenerator', 'Starting PDF generation...');

    // Create PDF in portrait mode, A4 size
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 10; // 10mm margin
    const contentWidth = pageWidth - 2 * margin;

    let currentY = margin;

    // --- 1. Add Event Photo (if provided) ---
    if (eventPhotoDataUrl) {
      logger.info('pdfGenerator', 'Adding event photo...');

      // Get image dimensions to calculate aspect ratio
      const imgProps = pdf.getImageProperties(eventPhotoDataUrl);
      const imgAspectRatio = imgProps.width / imgProps.height;

      // Calculate image dimensions (max width: contentWidth, maintain aspect ratio)
      let imgWidth = contentWidth;
      let imgHeight = imgWidth / imgAspectRatio;

      // If image is too tall, scale down to fit
      const maxPhotoHeight = pageHeight * 0.4; // Max 40% of page height
      if (imgHeight > maxPhotoHeight) {
        imgHeight = maxPhotoHeight;
        imgWidth = imgHeight * imgAspectRatio;
      }

      // Center the image horizontally
      const imgX = (pageWidth - imgWidth) / 2;

      pdf.addImage(eventPhotoDataUrl, 'PNG', imgX, currentY, imgWidth, imgHeight);
      currentY += imgHeight + 10; // Add 10mm spacing
    }

    // --- 2. Add Event Card Screenshot ---
    logger.info('pdfGenerator', 'Adding event card screenshot...');

    const cardProps = pdf.getImageProperties(cardScreenshotDataUrl);
    const cardAspectRatio = cardProps.width / cardProps.height;

    // Calculate card dimensions
    let cardWidth = contentWidth;
    let cardHeight = cardWidth / cardAspectRatio;

    // Check if card fits on remaining space, otherwise scale down
    const remainingHeight = pageHeight - currentY - margin - 20; // Reserve 20mm for link at bottom
    if (cardHeight > remainingHeight) {
      cardHeight = remainingHeight;
      cardWidth = cardHeight * cardAspectRatio;
    }

    // Center the card horizontally
    const cardX = (pageWidth - cardWidth) / 2;

    pdf.addImage(cardScreenshotDataUrl, 'PNG', cardX, currentY, cardWidth, cardHeight);
    currentY += cardHeight + 10; // Add 10mm spacing

    // --- 3. Add Interactive Link ---
    logger.info('pdfGenerator', 'Adding interactive link...');

    // Set font for link text
    pdf.setFontSize(10);
    pdf.setTextColor(0, 102, 204); // Blue color for link

    const linkText = 'View full event details';
    const linkTextWidth = pdf.getTextWidth(linkText);
    const linkX = (pageWidth - linkTextWidth) / 2;

    // Add clickable link
    pdf.textWithLink(linkText, linkX, currentY, { url: inviteUrl });

    // Add underline to make it look like a link
    pdf.setDrawColor(0, 102, 204);
    pdf.line(linkX, currentY + 0.5, linkX + linkTextWidth, currentY + 0.5);

    // --- 4. Add metadata ---
    pdf.setProperties({
      title: eventTitle,
      subject: `Event: ${eventTitle}`,
      author: 'Capture2Calendar',
      keywords: 'event, calendar, capture2calendar',
      creator: 'Capture2Calendar App',
    });

    // --- 5. Generate base64 output ---
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
