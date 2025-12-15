/**
 * Regional Ticket Provider Configuration
 *
 * Defines ticket provider domains organized by geographic region.
 * Used for prioritizing search results based on user's locale.
 */

export type Region =
  | 'EU' // Europe
  | 'NA' // North America
  | 'LATAM' // Latin America
  | 'APAC_EAST' // Asia Pacific East (Japan, Korea, China)
  | 'APAC_SOUTH' // Asia Pacific South (India, Southeast Asia)
  | 'OCEANIA' // Australia & New Zealand
  | 'MEA' // Middle East & Africa
  | 'GLOBAL'; // Fallback for unknown regions

export interface RegionalProviderConfig {
  primary: string[]; // Prioritized providers for this region
  secondary: string[]; // Also valid but lower priority
}

/**
 * Regional provider configurations
 * Primary providers are prioritized in search results for that region
 * Secondary providers are still shown but ranked lower
 */
export const REGIONAL_PROVIDERS: Record<Region, RegionalProviderConfig> = {
  // Europe
  EU: {
    primary: [
      // Eventim network (major European player)
      'eventim.de',
      'eventim.co.uk',
      'eventim.pl',
      'eventim.com',
      'eventim.es',
      // Ticketmaster European domains
      'ticketmaster.de',
      'ticketmaster.co.uk',
      'ticketmaster.nl',
      'ticketmaster.es',
      'ticketmaster.se',
      'ticketmaster.no',
      'ticketmaster.pl',
      'ticketmaster.ch',
      // Country-specific providers
      'ticketone.it', // Italy
      'fnacspectacles.com', // France
      'ticketcorner.ch', // Switzerland
      'oeticket.com', // Austria
      'seetickets.com', // UK
      'ticketportal.cz', // Czech Republic
      'starticket.ch', // Switzerland
    ],
    secondary: [
      'ticketmaster.com',
      'stubhub.com',
      'viagogo.com',
      'eventbrite.com',
      'songkick.com',
      'bandsintown.com',
      'dice.fm',
      'ra.co',
      'ticketswap.com',
    ],
  },

  // North America (USA & Canada)
  NA: {
    primary: [
      'ticketmaster.com', // Dominant US player (~67% market)
      'ticketmaster.ca', // Canada
      'stubhub.com', // Major secondary market
      'seatgeek.com', // NFL partner, growing
      'axs.com', // AEG venues
      'vividseats.com', // Growing competitor
      'livenation.com',
      'ticketweb.com',
    ],
    secondary: [
      'eventbrite.com',
      'songkick.com',
      'bandsintown.com',
      'dice.fm',
      'viagogo.com',
      'ticketswap.com',
    ],
  },

  // Latin America
  LATAM: {
    primary: [
      'ticketmaster.com.mx', // Mexico
      'ticketmaster.cl', // Chile
      'ticketmaster.com.ar', // Argentina
      'ticketmaster.com.br', // Brazil
      'ticketmaster.pe', // Peru
      'eventim.com.br', // Brazil (Eventim)
      'passline.com', // Multiple LATAM countries
    ],
    secondary: [
      'ticketmaster.com',
      'stubhub.com',
      'eventbrite.com',
      'songkick.com',
      'bandsintown.com',
    ],
  },

  // Asia Pacific East (Japan, Korea, China)
  APAC_EAST: {
    primary: [
      // Korea
      'globalinterpark.com',
      'ticket.interpark.com',
      'ticket.yes24.com',
      'ticket.melon.com',
      // Japan
      'pia.jp',
      'eplus.jp',
      't.pia.jp',
      // China
      'damai.cn',
      'maoyan.com',
    ],
    secondary: [
      'ticketmaster.com',
      'stubhub.com',
      'eventbrite.com',
      'songkick.com',
      'bandsintown.com',
    ],
  },

  // Asia Pacific South (India, Southeast Asia)
  APAC_SOUTH: {
    primary: [
      'bookmyshow.com', // India (dominant)
    ],
    secondary: [
      'ticketmaster.com',
      'stubhub.com',
      'eventbrite.com',
      'songkick.com',
      'bandsintown.com',
    ],
  },

  // Australia & New Zealand
  OCEANIA: {
    primary: [
      'ticketek.com.au', // TEG Group, largest AU
      'ticketmaster.com.au',
      'ticketmaster.co.nz',
      'oztix.com.au', // Independent leader
      'moshtix.com.au', // GA specialist
    ],
    secondary: [
      'ticketmaster.com',
      'stubhub.com',
      'eventbrite.com',
      'songkick.com',
      'bandsintown.com',
    ],
  },

  // Middle East & Africa
  MEA: {
    primary: [
      'ticketmaster.ae', // UAE
      'platinumlist.net', // UAE/Regional
    ],
    secondary: [
      'ticketmaster.com',
      'stubhub.com',
      'viagogo.com',
      'eventbrite.com',
      'songkick.com',
      'bandsintown.com',
    ],
  },

  // Global fallback - includes all major providers
  GLOBAL: {
    primary: [
      // Major global players
      'ticketmaster.com',
      'stubhub.com',
      'eventbrite.com',
      // European majors (for backwards compatibility with existing behavior)
      'eventim.de',
      'eventim.co.uk',
      'eventim.com',
      'ticketmaster.de',
      'ticketmaster.co.uk',
    ],
    secondary: [
      'seatgeek.com',
      'axs.com',
      'vividseats.com',
      'viagogo.com',
      'songkick.com',
      'bandsintown.com',
      'dice.fm',
      'ra.co',
      'ticketswap.com',
      'livenation.com',
      'ticketweb.com',
    ],
  },
};

/**
 * Master list of all ticket provider domains
 * Used for filtering search results - a result must match one of these domains
 */
export const ALL_PROVIDER_DOMAINS: string[] = [
  // Global/Multi-Region
  'ticketmaster.com',
  'stubhub.com',
  'viagogo.com',
  'eventbrite.com',
  'songkick.com',
  'bandsintown.com',
  'dice.fm',
  'ra.co',
  'ticketswap.com',

  // North America
  'seatgeek.com',
  'axs.com',
  'vividseats.com',
  'ticketmaster.ca',
  'livenation.com',
  'ticketweb.com',

  // Europe - Eventim network
  'eventim.de',
  'eventim.co.uk',
  'eventim.pl',
  'eventim.com',
  'eventim.es',

  // Europe - Ticketmaster regional
  'ticketmaster.de',
  'ticketmaster.co.uk',
  'ticketmaster.nl',
  'ticketmaster.es',
  'ticketmaster.se',
  'ticketmaster.no',
  'ticketmaster.pl',
  'ticketmaster.ch',

  // Europe - Country-specific
  'ticketone.it',
  'fnacspectacles.com',
  'ticketcorner.ch',
  'oeticket.com',
  'seetickets.com',
  'ticketportal.cz',
  'starticket.ch',

  // Latin America
  'ticketmaster.com.mx',
  'ticketmaster.cl',
  'ticketmaster.com.ar',
  'ticketmaster.com.br',
  'ticketmaster.pe',
  'eventim.com.br',
  'passline.com',

  // Asia Pacific - Korea
  'globalinterpark.com',
  'ticket.interpark.com',
  'ticket.yes24.com',
  'ticket.melon.com',

  // Asia Pacific - Japan
  'pia.jp',
  'eplus.jp',
  't.pia.jp',

  // Asia Pacific - China
  'damai.cn',
  'maoyan.com',

  // Asia Pacific - India
  'bookmyshow.com',

  // Australia/New Zealand
  'ticketmaster.com.au',
  'ticketmaster.co.nz',
  'ticketek.com.au',
  'oztix.com.au',
  'moshtix.com.au',

  // Middle East
  'ticketmaster.ae',
  'platinumlist.net',
];
