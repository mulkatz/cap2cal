export type ApiResponse<T> = {
  status: 'success' | 'error';
  message?: string;
  data?: T;
};

export type ApiSuccess<T> = ApiResponse<T> & {
  status: 'success';
  message?: string;
  data: T;
};

export type ApiError = ApiResponse<{
  reason: string;
}> & {
  status: 'error';
  message?: string;
  data?: {
    reason?: string;
  };
};

export type ApiRequest = {
  i18n: string;
  image: string;
};

export type ApiEvent = {
  id: string;
  title: string;
  kind?: string;
  tags: string[];
  description: {
    short: string;
    long?: string;
  };
  dateTimeFrom: {
    date?: string;
    // timezone?: string;
    time?: string;
  };
  dateTimeTo?: {
    date?: string;
    // timezone?: string;
    time?: string;
  };
  agenda?: {
    date: string;
    time: string;
    description: string;
  }[];
  location?: {
    city?: string;
    address?: string;
  };
  links?: string[];
  ticketDirectLink?: string;
  ticketAvailableProbability?: number;
  ticketSearchQuery?: string;
};

export type ExtractionError =
  | 'PROBABLY_NOT_AN_EVENT'
  | 'IMAGE_TOO_BLURRED'
  | 'LOW_CONTRAST_OR_POOR_LIGHTING'
  | 'TEXT_TOO_SMALL'
  | 'OVERLAPPING_TEXT_OR_GRAPHICS'
  | 'UNKNOWN';

export type ApiFindResult = {
  query: string;
  ticketLinks: string[];
};
