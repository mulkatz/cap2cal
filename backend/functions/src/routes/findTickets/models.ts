interface GoogleApiItemPagemapMusicEvent {
  endDate?: string;
  eventStatus?: string;
  name?: string;
  startDate?: string;
  description?: string;
  eventAttendanceMode?: string;
  url?: string;
  image?: string;
  location?: {
    name?: string;
    address?: {
      addressLocality?: string;
      addressRegion?: string;
    };
  };
}

interface GoogleApiItemPagemap {
  cse_thumbnail?: Array<{ src: string; width: string; height: string }>;
  MusicEvent?: GoogleApiItemPagemapMusicEvent[];
  metatags?: Array<Record<string, string>>;
}

interface GoogleApiItem {
  kind?: string;
  title?: string;
  link?: string;
  displayLink?: string;
  snippet?: string;
  htmlTitle?: string;
  htmlSnippet?: string;
  formattedUrl?: string;
  htmlFormattedUrl?: string;
  pagemap?: GoogleApiItemPagemap;
}

interface GoogleApiResponse {
  kind?: string;
  items?: GoogleApiItem[];
  queries?: any;
  context?: any;
  searchInformation?: any;
}

interface QueryDetails {
  original_query: string;
  artist: string | null;
  location: string | null;
  year: number | null;
  month: number | null; // 1-12
  month_name: string | null;
}

interface TicketLink {
  url: string | null;
  title: string | null;
  snippet: string | null;
  source_domain: string | null;
  category: string;
  relevance_score: number;
  event_date_found: string | null; // YYYY-MM-DD
  matched_criteria: string[];
}

interface ApiOutput {
  query_details: QueryDetails;
  ticket_links: TicketLink[];
  error?: string;
}

export type SellerOffer = {
  seller: string | 'eventim' | 'ticket_master';
  offerUrl: string;
};

export type SellerOfferResult = {
  items: SellerOffer[];
};

export type ErrorResult = {
  code: number;
};

export const findSeller = (query: string): SellerOfferResult | ErrorResult => {
  return {
    code: 500,
  };
};

export interface SearchResultItem {
  kind: string;
  title: string;
  htmlTitle: string;
  link: string;
  displayLink: string;
  snippet: string;
  htmlSnippet: string;
  formattedUrl: string;
  htmlFormattedUrl: string;
  pagemap?: Record<string, any>;
}

export interface CustomSearchResponse {
  kind: string;
  url: {
    type: string;
    template: string;
  };
  queries: Record<string, any>;
  context?: Record<string, any>;
  searchInformation?: Record<string, any>;
  items?: SearchResultItem[];
}

// Import comprehensive provider list from providers.ts
// This export is kept for backwards compatibility
export { ALL_PROVIDER_DOMAINS as TICKET_PROVIDER_DOMAINS } from './providers';
