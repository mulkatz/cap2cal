import { ApiEvent } from '../api/model.ts';

export type CaptureEvent = ApiEvent & {
  timestamp: number;
  img?: Img;
  alreadyFetchedTicketLink?: string | null;
  // captureAtLocation?: string;
  isFavorite?: boolean;
  // dateTimeFromUTC: string;
  // dateTimeToUTC?: string;
  // isSingleEvent?: boolean;
};
export type Img = {
  id: string;
  dataUrl: string;
  capturedAt: number; // timestamp in milliseconds
};
