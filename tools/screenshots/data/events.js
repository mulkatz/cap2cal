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
  ],
  'es-ES': [
    {
      id: "event-es-001",
      title: "Festival de Verano 2025",
      kind: "Festival de Música",
      tags: ["música", "festival", "aire libre", "verano"],
      description: {
        short: "Festival al aire libre de tres días con más de 50 artistas en múltiples escenarios",
        long: "Únete al festival de música más grande del verano. Disfruta de increíbles actuaciones en vivo de artistas de renombre mundial, descubre nuevos talentos y disfruta de food trucks, instalaciones artísticas y más."
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
        city: "Barcelona",
        address: "Parc del Fòrum, Rambla de Prim"
      },
      links: ["https://festivaldeverano.example.es"],
      ticketSearchQuery: "Festival de Verano Barcelona 2025",
      ticketAvailableProbability: 95,
      timestamp: 1736640000000,
      isFavorite: true
    },
    {
      id: "event-es-002",
      title: "Conferencia Tech Innovation",
      kind: "Conferencia",
      tags: ["tecnología", "negocios", "networking", "IA"],
      description: {
        short: "Conferencia tecnológica líder sobre IA, computación en la nube e innovaciones futuras",
        long: "Conéctate con líderes de la industria, asiste a talleres y descubre lo último en tecnología. Los temas incluyen inteligencia artificial, aprendizaje automático, arquitectura cloud y ciberseguridad."
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
        city: "Madrid",
        address: "IFEMA, Av. Partenón 5"
      },
      links: ["https://techinnovation.example.es"],
      ticketSearchQuery: "Tech Innovation Madrid",
      ticketAvailableProbability: 80,
      timestamp: 1736550000000,
      isFavorite: false
    },
    {
      id: "event-es-003",
      title: "30 Cumpleaños de Sara",
      kind: "Fiesta de Cumpleaños",
      tags: ["cumpleaños", "fiesta", "celebración"],
      description: {
        short: "¡Fiesta sorpresa para el 30 cumpleaños de Sara! Código de vestimenta: Cóctel",
        long: "Únete a nosotros para celebrar el cumpleaños especial de Sara. Habrá cena, bebidas, baile y muchas sorpresas. Por favor, llega a las 19:00. Confirmación requerida."
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
        city: "Valencia",
        address: "Terraza del Mar, Paseo Neptuno 42"
      },
      timestamp: 1736460000000,
      isFavorite: true
    },
    {
      id: "event-es-004",
      title: "Retiro de Yoga y Bienestar",
      kind: "Retiro de Bienestar",
      tags: ["yoga", "bienestar", "meditación", "salud"],
      description: {
        short: "Retiro de fin de semana con yoga, meditación y cocina saludable"
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
        city: "Mallorca",
        address: "Resort Son Vida, Carrer de la Bonanova"
      },
      ticketSearchQuery: "Retiro Yoga Mallorca",
      ticketAvailableProbability: 70,
      timestamp: 1736370000000,
      isFavorite: false
    },
    {
      id: "event-es-005",
      title: "Comic Con España",
      kind: "Convención",
      tags: ["cómics", "cultura pop", "cosplay", "entretenimiento"],
      description: {
        short: "La convención de cultura pop definitiva con invitados famosos, paneles y productos exclusivos"
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
        city: "Sevilla",
        address: "FIBES, Av. Alcalde Luis Uruñuela"
      },
      links: ["https://comiccon.example.es"],
      ticketSearchQuery: "Comic Con Sevilla 2025",
      ticketAvailableProbability: 60,
      timestamp: 1736280000000,
      isFavorite: true
    }
  ],
  'fr-FR': [
    {
      id: "event-fr-001",
      title: "Festival d'Été 2025",
      kind: "Festival de Musique",
      tags: ["musique", "festival", "plein air", "été"],
      description: {
        short: "Festival en plein air de trois jours avec plus de 50 artistes sur plusieurs scènes",
        long: "Rejoignez-nous pour le plus grand festival de musique de l'été ! Vivez des performances live incroyables d'artistes de renommée mondiale, découvrez de nouveaux talents et profitez des food trucks, installations artistiques et plus encore."
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
        city: "Paris",
        address: "Parc de la Villette, 211 Avenue Jean Jaurès"
      },
      links: ["https://festivaldete.example.fr"],
      ticketSearchQuery: "Festival d'Été Paris 2025",
      ticketAvailableProbability: 95,
      timestamp: 1736640000000,
      isFavorite: true
    },
    {
      id: "event-fr-002",
      title: "Conférence Tech Innovation",
      kind: "Conférence",
      tags: ["technologie", "business", "networking", "IA"],
      description: {
        short: "Conférence tech de référence sur l'IA, le cloud computing et les innovations futures",
        long: "Connectez-vous avec les leaders de l'industrie, participez à des ateliers et découvrez les dernières technologies. Les sujets incluent l'intelligence artificielle, le machine learning, l'architecture cloud et la cybersécurité."
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
        city: "Lyon",
        address: "Centre de Congrès, 50 Quai Charles de Gaulle"
      },
      links: ["https://techinnovation.example.fr"],
      ticketSearchQuery: "Tech Innovation Lyon",
      ticketAvailableProbability: 80,
      timestamp: 1736550000000,
      isFavorite: false
    },
    {
      id: "event-fr-003",
      title: "30 ans de Sarah",
      kind: "Fête d'anniversaire",
      tags: ["anniversaire", "fête", "célébration"],
      description: {
        short: "Fête surprise pour les 30 ans de Sarah ! Code vestimentaire : Tenue cocktail",
        long: "Rejoignez-nous pour célébrer l'anniversaire spécial de Sarah. Il y aura dîner, boissons, danse et plein de surprises. Veuillez arriver à 19h. RSVP obligatoire."
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
        city: "Nice",
        address: "Le Rooftop, 15 Promenade des Anglais"
      },
      timestamp: 1736460000000,
      isFavorite: true
    },
    {
      id: "event-fr-004",
      title: "Retraite Yoga & Bien-être",
      kind: "Retraite Bien-être",
      tags: ["yoga", "bien-être", "méditation", "santé"],
      description: {
        short: "Retraite weekend avec yoga, méditation et cuisine saine"
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
        city: "Provence",
        address: "Domaine de la Paix, Route de Gordes"
      },
      ticketSearchQuery: "Retraite Yoga Provence",
      ticketAvailableProbability: 70,
      timestamp: 1736370000000,
      isFavorite: false
    },
    {
      id: "event-fr-005",
      title: "Comic Con France",
      kind: "Convention",
      tags: ["comics", "culture pop", "cosplay", "divertissement"],
      description: {
        short: "La convention ultime de culture pop avec des invités célèbres, des panels et des produits exclusifs"
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
        city: "Paris",
        address: "Paris Expo, Porte de Versailles"
      },
      links: ["https://comiccon.example.fr"],
      ticketSearchQuery: "Comic Con Paris 2025",
      ticketAvailableProbability: 60,
      timestamp: 1736280000000,
      isFavorite: true
    }
  ],
  'pt-BR': [
    {
      id: "event-pt-001",
      title: "Festival de Verão 2025",
      kind: "Festival de Música",
      tags: ["música", "festival", "ao ar livre", "verão"],
      description: {
        short: "Festival ao ar livre de três dias com mais de 50 artistas em múltiplos palcos",
        long: "Venha para o maior festival de música do verão! Viva apresentações incríveis de artistas mundialmente famosos, descubra novos talentos e aproveite food trucks, instalações artísticas e muito mais."
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
        city: "São Paulo",
        address: "Parque Ibirapuera, Av. Pedro Álvares Cabral"
      },
      links: ["https://festivaldeverao.example.br"],
      ticketSearchQuery: "Festival de Verão São Paulo 2025",
      ticketAvailableProbability: 95,
      timestamp: 1736640000000,
      isFavorite: true
    },
    {
      id: "event-pt-002",
      title: "Conferência Tech Innovation",
      kind: "Conferência",
      tags: ["tecnologia", "negócios", "networking", "IA"],
      description: {
        short: "Conferência tech líder sobre IA, computação em nuvem e inovações futuras",
        long: "Conecte-se com líderes da indústria, participe de workshops e descubra as últimas tecnologias. Os temas incluem inteligência artificial, machine learning, arquitetura cloud e cibersegurança."
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
        city: "Rio de Janeiro",
        address: "Centro de Convenções SulAmérica, Av. Paulo de Frontin"
      },
      links: ["https://techinnovation.example.br"],
      ticketSearchQuery: "Tech Innovation Rio de Janeiro",
      ticketAvailableProbability: 80,
      timestamp: 1736550000000,
      isFavorite: false
    },
    {
      id: "event-pt-003",
      title: "30 Anos da Sara",
      kind: "Festa de Aniversário",
      tags: ["aniversário", "festa", "celebração"],
      description: {
        short: "Festa surpresa para os 30 anos da Sara! Dress code: Traje social",
        long: "Junte-se a nós para celebrar o aniversário especial da Sara. Teremos jantar, drinks, dança e muitas surpresas. Por favor, chegue às 19h. Confirmação necessária."
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
        city: "Belo Horizonte",
        address: "Rooftop Jardins, Av. Afonso Pena 1500"
      },
      timestamp: 1736460000000,
      isFavorite: true
    },
    {
      id: "event-pt-004",
      title: "Retiro de Yoga e Bem-estar",
      kind: "Retiro de Bem-estar",
      tags: ["yoga", "bem-estar", "meditação", "saúde"],
      description: {
        short: "Retiro de fim de semana com yoga, meditação e culinária saudável"
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
        city: "Búzios",
        address: "Spa Resort Búzios, Rua das Pedras"
      },
      ticketSearchQuery: "Retiro Yoga Búzios",
      ticketAvailableProbability: 70,
      timestamp: 1736370000000,
      isFavorite: false
    },
    {
      id: "event-pt-005",
      title: "Comic Con Brasil",
      kind: "Convenção",
      tags: ["quadrinhos", "cultura pop", "cosplay", "entretenimento"],
      description: {
        short: "A convenção definitiva de cultura pop com convidados famosos, painéis e produtos exclusivos"
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
        city: "São Paulo",
        address: "São Paulo Expo, Rodovia dos Imigrantes"
      },
      links: ["https://comiccon.example.br"],
      ticketSearchQuery: "Comic Con São Paulo 2025",
      ticketAvailableProbability: 60,
      timestamp: 1736280000000,
      isFavorite: true
    }
  ]
};
