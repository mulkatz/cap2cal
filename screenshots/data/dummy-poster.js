// Dummy event poster image (base64 encoded)
// This represents what a user would see through the camera when scanning a poster

export const dummyPoster = {
  'en-GB': `data:image/svg+xml;base64,${Buffer.from(`
    <svg width="800" height="1200" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:#1e3a8a;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#7c3aed;stop-opacity:1" />
        </linearGradient>
      </defs>

      <!-- Background -->
      <rect width="800" height="1200" fill="url(#bg)"/>

      <!-- Decorative stars -->
      <circle cx="100" cy="100" r="3" fill="white" opacity="0.6"/>
      <circle cx="700" cy="150" r="2" fill="white" opacity="0.4"/>
      <circle cx="150" cy="300" r="2" fill="white" opacity="0.5"/>
      <circle cx="650" cy="400" r="3" fill="white" opacity="0.7"/>
      <circle cx="100" cy="900" r="2" fill="white" opacity="0.5"/>
      <circle cx="700" cy="1000" r="3" fill="white" opacity="0.6"/>

      <!-- Title -->
      <text x="400" y="200" font-family="Arial, sans-serif" font-size="72" font-weight="bold"
            fill="white" text-anchor="middle">SUMMER</text>
      <text x="400" y="280" font-family="Arial, sans-serif" font-size="72" font-weight="bold"
            fill="white" text-anchor="middle">MUSIC</text>
      <text x="400" y="360" font-family="Arial, sans-serif" font-size="72" font-weight="bold"
            fill="#fbbf24" text-anchor="middle">FESTIVAL</text>

      <!-- Year -->
      <text x="400" y="420" font-family="Arial, sans-serif" font-size="36"
            fill="white" text-anchor="middle" opacity="0.9">2025</text>

      <!-- Date -->
      <rect x="200" y="500" width="400" height="120" fill="white" opacity="0.1" rx="10"/>
      <text x="400" y="550" font-family="Arial, sans-serif" font-size="48" font-weight="bold"
            fill="white" text-anchor="middle">July 18-20</text>
      <text x="400" y="595" font-family="Arial, sans-serif" font-size="24"
            fill="white" text-anchor="middle" opacity="0.8">Friday - Sunday</text>

      <!-- Location -->
      <text x="400" y="700" font-family="Arial, sans-serif" font-size="32"
            fill="white" text-anchor="middle">📍 Griffith Park</text>
      <text x="400" y="740" font-family="Arial, sans-serif" font-size="28"
            fill="white" text-anchor="middle" opacity="0.8">Los Angeles, CA</text>

      <!-- Artists -->
      <text x="400" y="840" font-family="Arial, sans-serif" font-size="24" font-weight="bold"
            fill="#fbbf24" text-anchor="middle">FEATURING</text>
      <text x="400" y="880" font-family="Arial, sans-serif" font-size="22"
            fill="white" text-anchor="middle">50+ Live Artists</text>
      <text x="400" y="910" font-family="Arial, sans-serif" font-size="22"
            fill="white" text-anchor="middle">Multiple Stages</text>
      <text x="400" y="940" font-family="Arial, sans-serif" font-size="22"
            fill="white" text-anchor="middle">Food Trucks • Art</text>

      <!-- Ticket info -->
      <rect x="150" y="1000" width="500" height="80" fill="white" opacity="0.15" rx="10"/>
      <text x="400" y="1040" font-family="Arial, sans-serif" font-size="28" font-weight="bold"
            fill="#fbbf24" text-anchor="middle">TICKETS AVAILABLE</text>
      <text x="400" y="1070" font-family="Arial, sans-serif" font-size="20"
            fill="white" text-anchor="middle">summermusicfest.com</text>

      <!-- Time -->
      <text x="400" y="1130" font-family="Arial, sans-serif" font-size="20"
            fill="white" text-anchor="middle" opacity="0.7">Gates open 4:00 PM</text>
    </svg>
  `).toString('base64')}`,

  'de-DE': `data:image/svg+xml;base64,${Buffer.from(`
    <svg width="800" height="1200" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:#1e3a8a;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#7c3aed;stop-opacity:1" />
        </linearGradient>
      </defs>

      <!-- Background -->
      <rect width="800" height="1200" fill="url(#bg)"/>

      <!-- Decorative stars -->
      <circle cx="100" cy="100" r="3" fill="white" opacity="0.6"/>
      <circle cx="700" cy="150" r="2" fill="white" opacity="0.4"/>
      <circle cx="150" cy="300" r="2" fill="white" opacity="0.5"/>
      <circle cx="650" cy="400" r="3" fill="white" opacity="0.7"/>
      <circle cx="100" cy="900" r="2" fill="white" opacity="0.5"/>
      <circle cx="700" cy="1000" r="3" fill="white" opacity="0.6"/>

      <!-- Title -->
      <text x="400" y="200" font-family="Arial, sans-serif" font-size="72" font-weight="bold"
            fill="white" text-anchor="middle">SOMMER</text>
      <text x="400" y="280" font-family="Arial, sans-serif" font-size="72" font-weight="bold"
            fill="white" text-anchor="middle">MUSIK</text>
      <text x="400" y="360" font-family="Arial, sans-serif" font-size="72" font-weight="bold"
            fill="#fbbf24" text-anchor="middle">FESTIVAL</text>

      <!-- Year -->
      <text x="400" y="420" font-family="Arial, sans-serif" font-size="36"
            fill="white" text-anchor="middle" opacity="0.9">2025</text>

      <!-- Date -->
      <rect x="200" y="500" width="400" height="120" fill="white" opacity="0.1" rx="10"/>
      <text x="400" y="550" font-family="Arial, sans-serif" font-size="48" font-weight="bold"
            fill="white" text-anchor="middle">18-20 Juli</text>
      <text x="400" y="595" font-family="Arial, sans-serif" font-size="24"
            fill="white" text-anchor="middle" opacity="0.8">Freitag - Sonntag</text>

      <!-- Location -->
      <text x="400" y="700" font-family="Arial, sans-serif" font-size="32"
            fill="white" text-anchor="middle">📍 Tempelhofer Feld</text>
      <text x="400" y="740" font-family="Arial, sans-serif" font-size="28"
            fill="white" text-anchor="middle" opacity="0.8">Berlin, Deutschland</text>

      <!-- Artists -->
      <text x="400" y="840" font-family="Arial, sans-serif" font-size="24" font-weight="bold"
            fill="#fbbf24" text-anchor="middle">MIT DABEI</text>
      <text x="400" y="880" font-family="Arial, sans-serif" font-size="22"
            fill="white" text-anchor="middle">Über 50 Live-Künstler</text>
      <text x="400" y="910" font-family="Arial, sans-serif" font-size="22"
            fill="white" text-anchor="middle">Mehrere Bühnen</text>
      <text x="400" y="940" font-family="Arial, sans-serif" font-size="22"
            fill="white" text-anchor="middle">Food Trucks • Kunst</text>

      <!-- Ticket info -->
      <rect x="150" y="1000" width="500" height="80" fill="white" opacity="0.15" rx="10"/>
      <text x="400" y="1040" font-family="Arial, sans-serif" font-size="28" font-weight="bold"
            fill="#fbbf24" text-anchor="middle">TICKETS ERHÄLTLICH</text>
      <text x="400" y="1070" font-family="Arial, sans-serif" font-size="20"
            fill="white" text-anchor="middle">sommermusikfestival.de</text>

      <!-- Time -->
      <text x="400" y="1130" font-family="Arial, sans-serif" font-size="20"
            fill="white" text-anchor="middle" opacity="0.7">Einlass 16:00 Uhr</text>
    </svg>
  `).toString('base64')}`
};
