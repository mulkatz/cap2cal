/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { onRequest } from 'firebase-functions/v2/https';
import * as logger from 'firebase-functions/logger';
import { findTickets0 } from './findTickets/findTickets0';

import { defineSecret } from 'firebase-functions/params';
import { analyse2 } from './analyse/analyse2';
import { findTicketPrice1 } from './findTicketPrice/findTicketPrice1';
import { analyse3 } from './analyse/analyse3';
import { analyse4 } from './analyse/analyse4';
import { findTickets1 } from './findTickets/findTickets1';

const API_KEY = defineSecret('GOOGLE_CUSTOM_SEARCH_API_KEY');
const CX_ID = defineSecret('GOOGLE_CUSTOM_SEARCH_CX_ID');
const GEMINI_API_KEY = defineSecret('GEMINI_API_TOKEN');

// choose a function variationz
// const analyseFunction = analyse4;
const findTicketsFunction = findTickets1;
const findTicketPriceFunction = findTicketPrice1;

// export const analyse = onRequest({ secrets: [GEMINI_API_KEY], cors: true }, async (request, response) => {
//   logger.log('call analyse function');
//   analyseFunction(request, response);
// });

export const findTickets = onRequest(
  { secrets: [API_KEY, CX_ID, GEMINI_API_KEY], cors: true },
  async (request, response) => {
    logger.log('call find_tickets function');
    findTicketsFunction(request, response);
  }
);

export const findTicketPrice = onRequest({ secrets: [GEMINI_API_KEY], cors: true }, async (request, response) => {
  logger.log('call find_ticket_price function');
  findTicketPriceFunction(request, response);
});

export * from './analyse/analyse4';
