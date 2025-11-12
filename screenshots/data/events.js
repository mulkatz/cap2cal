// Sample event data for screenshots in multiple languages

export const events = {
  'en-GB': [
    {
      id: "event-en-001",
      title: "Summer Music Festival 2025",
      kind: "Music Festival",
      tags: ["music", "festival", "outdoor", "summer"],
      description: {
        short: "Three-day outdoor music festival featuring 50+ artists across multiple stages",
        long: "Join us for the biggest summer music festival of the year! Experience incredible live performances from world-renowned artists, discover new talent, and enjoy food trucks, art installations, and more."
      },
      dateTimeFrom: {
        date: "2025-07-18",
        time: "16:00"
      },
      dateTimeTo: {
        date: "2025-07-20",
        time: "23:00"
      },
      location: {
        city: "Los Angeles",
        address: "Griffith Park, 4730 Crystal Springs Dr"
      },
      links: ["https://summermusicfest.example.com"],
      ticketSearchQuery: "Summer Music Festival Los Angeles 2025",
      ticketAvailableProbability: 95,
      timestamp: 1736640000000,
      isFavorite: true
    },
    {
      id: "event-en-002",
      title: "Tech Innovation Conference",
      kind: "Conference",
      tags: ["technology", "business", "networking", "AI"],
      description: {
        short: "Leading tech conference exploring AI, cloud computing, and future innovations",
        long: "Connect with industry leaders, attend workshops, and discover the latest in technology. Topics include artificial intelligence, machine learning, cloud architecture, and cybersecurity."
      },
      dateTimeFrom: {
        date: "2025-09-15",
        time: "09:00"
      },
      dateTimeTo: {
        date: "2025-09-17",
        time: "18:00"
      },
      location: {
        city: "San Francisco",
        address: "Moscone Center, 747 Howard St"
      },
      links: ["https://techinnovationconf.example.com"],
      ticketSearchQuery: "Tech Innovation Conference San Francisco",
      ticketAvailableProbability: 80,
      timestamp: 1736550000000,
      isFavorite: false
    },
    {
      id: "event-en-003",
      title: "Sarah's 30th Birthday Party",
      kind: "Birthday Party",
      tags: ["birthday", "party", "celebration"],
      description: {
        short: "Surprise party for Sarah's 30th birthday! Dress code: Cocktail attire",
        long: "Join us for a special celebration of Sarah's milestone birthday. There will be dinner, drinks, dancing, and lots of surprises. Please arrive by 7 PM. RSVP required."
      },
      dateTimeFrom: {
        date: "2025-06-14",
        time: "19:00"
      },
      dateTimeTo: {
        date: "2025-06-14",
        time: "23:30"
      },
      location: {
        city: "New York",
        address: "The Rooftop Garden, 123 Madison Ave"
      },
      timestamp: 1736460000000,
      isFavorite: true
    },
    {
      id: "event-en-004",
      title: "Yoga & Wellness Retreat",
      kind: "Wellness Retreat",
      tags: ["yoga", "wellness", "meditation", "health"],
      description: {
        short: "Weekend wellness retreat with yoga, meditation, and healthy cuisine"
      },
      dateTimeFrom: {
        date: "2025-08-08",
        time: "15:00"
      },
      dateTimeTo: {
        date: "2025-08-10",
        time: "14:00"
      },
      location: {
        city: "Sedona",
        address: "Mountain View Resort, 456 Red Rock Rd"
      },
      ticketSearchQuery: "Yoga Wellness Retreat Sedona",
      ticketAvailableProbability: 70,
      timestamp: 1736370000000,
      isFavorite: false
    },
    {
      id: "event-en-005",
      title: "Comic Con International",
      kind: "Convention",
      tags: ["comics", "pop culture", "cosplay", "entertainment"],
      description: {
        short: "The ultimate pop culture convention with celebrity guests, panels, and exclusive merch"
      },
      dateTimeFrom: {
        date: "2025-07-24",
        time: "10:00"
      },
      dateTimeTo: {
        date: "2025-07-27",
        time: "19:00"
      },
      location: {
        city: "San Diego",
        address: "Convention Center, 111 W Harbor Dr"
      },
      links: ["https://comic-con.example.com"],
      ticketSearchQuery: "Comic Con San Diego 2025",
      ticketAvailableProbability: 60,
      timestamp: 1736280000000,
      isFavorite: true
    }
  ],
  'de-DE': [
    {
      id: "event-de-001",
      title: "Sommer Musikfestival 2025",
      kind: "Musikfestival",
      tags: ["Musik", "Festival", "Open Air", "Sommer"],
      description: {
        short: "Dreitägiges Open-Air-Musikfestival mit über 50 Künstlern auf mehreren Bühnen",
        long: "Erlebe das größte Sommer-Musikfestival des Jahres! Genieße unglaubliche Live-Auftritte weltbekannter Künstler, entdecke neue Talente und erlebe Foodtrucks, Kunstinstallationen und mehr."
      },
      dateTimeFrom: {
        date: "2025-07-18",
        time: "16:00"
      },
      dateTimeTo: {
        date: "2025-07-20",
        time: "23:00"
      },
      location: {
        city: "Berlin",
        address: "Tempelhofer Feld, Tempelhofer Damm"
      },
      links: ["https://sommermusikfestival.example.de"],
      ticketSearchQuery: "Sommer Musikfestival Berlin 2025",
      ticketAvailableProbability: 95,
      timestamp: 1736640000000,
      isFavorite: true
    },
    {
      id: "event-de-002",
      title: "Tech Innovation Konferenz",
      kind: "Konferenz",
      tags: ["Technologie", "Business", "Networking", "KI"],
      description: {
        short: "Führende Tech-Konferenz zu KI, Cloud Computing und zukunftsweisenden Innovationen",
        long: "Vernetze dich mit Branchenführern, besuche Workshops und entdecke die neuesten Technologien. Themen umfassen künstliche Intelligenz, maschinelles Lernen, Cloud-Architektur und Cybersicherheit."
      },
      dateTimeFrom: {
        date: "2025-09-15",
        time: "09:00"
      },
      dateTimeTo: {
        date: "2025-09-17",
        time: "18:00"
      },
      location: {
        city: "München",
        address: "Messe München, Am Messesee 2"
      },
      links: ["https://techinnovationkonferenz.example.de"],
      ticketSearchQuery: "Tech Innovation Konferenz München",
      ticketAvailableProbability: 80,
      timestamp: 1736550000000,
      isFavorite: false
    },
    {
      id: "event-de-003",
      title: "Sarahs 30. Geburtstag",
      kind: "Geburtstagsfeier",
      tags: ["Geburtstag", "Party", "Feier"],
      description: {
        short: "Überraschungsparty zu Sarahs 30. Geburtstag! Dresscode: Cocktailkleidung",
        long: "Feiere mit uns Sarahs besonderen Meilenstein-Geburtstag. Es gibt Abendessen, Getränke, Tanzen und viele Überraschungen. Bitte bis 19 Uhr eintreffen. Anmeldung erforderlich."
      },
      dateTimeFrom: {
        date: "2025-06-14",
        time: "19:00"
      },
      dateTimeTo: {
        date: "2025-06-14",
        time: "23:30"
      },
      location: {
        city: "Hamburg",
        address: "Dachgarten Restaurant, Jungfernstieg 45"
      },
      timestamp: 1736460000000,
      isFavorite: true
    },
    {
      id: "event-de-004",
      title: "Yoga & Wellness Retreat",
      kind: "Wellness Retreat",
      tags: ["Yoga", "Wellness", "Meditation", "Gesundheit"],
      description: {
        short: "Wochenend-Wellness-Retreat mit Yoga, Meditation und gesunder Küche"
      },
      dateTimeFrom: {
        date: "2025-08-08",
        time: "15:00"
      },
      dateTimeTo: {
        date: "2025-08-10",
        time: "14:00"
      },
      location: {
        city: "Allgäu",
        address: "Bergblick Resort, Panoramaweg 12"
      },
      links: ["https://allgaeuwellness.example.de"],
      ticketSearchQuery: "Yoga Wellness Retreat Allgäu",
      ticketAvailableProbability: 70,
      timestamp: 1736370000000,
      isFavorite: false
    },
    {
      id: "event-de-005",
      title: "Comic Con Deutschland",
      kind: "Convention",
      tags: ["Comics", "Popkultur", "Cosplay", "Entertainment"],
      description: {
        short: "Die ultimative Popkultur-Convention mit Promi-Gästen, Panels und exklusiver Merch"
      },
      dateTimeFrom: {
        date: "2025-07-24",
        time: "10:00"
      },
      dateTimeTo: {
        date: "2025-07-27",
        time: "19:00"
      },
      location: {
        city: "Stuttgart",
        address: "Messe Stuttgart, Messepiazza 1"
      },
      links: ["https://comiccon.example.de"],
      ticketSearchQuery: "Comic Con Stuttgart 2025",
      ticketAvailableProbability: 60,
      timestamp: 1736280000000,
      isFavorite: true
    }
  ]
};
