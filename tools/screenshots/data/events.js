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
  ],
  'it-IT': [
    {
      id: "event-it-001",
      title: "Festival Musicale Estate 2025",
      kind: "Festival Musicale",
      tags: ["musica", "festival", "all'aperto", "estate"],
      description: {
        short: "Festival all'aperto di tre giorni con oltre 50 artisti su più palchi",
        long: "Unisciti a noi per il più grande festival musicale estivo dell'anno! Vivi incredibili performance dal vivo di artisti di fama mondiale, scopri nuovi talenti e goditi food truck, installazioni artistiche e molto altro."
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
        city: "Milano",
        address: "Parco Sempione, Piazza Sempione"
      },
      links: ["https://festivalmusicale.example.it"],
      ticketSearchQuery: "Festival Musicale Estate Milano 2025",
      ticketAvailableProbability: 95,
      timestamp: 1736640000000,
      isFavorite: true
    },
    {
      id: "event-it-002",
      title: "Conferenza Tech Innovation",
      kind: "Conferenza",
      tags: ["tecnologia", "business", "networking", "IA"],
      description: {
        short: "Conferenza tech leader su IA, cloud computing e innovazioni future",
        long: "Connettiti con i leader del settore, partecipa a workshop e scopri le ultime tecnologie. I temi includono intelligenza artificiale, machine learning, architettura cloud e cybersecurity."
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
        city: "Roma",
        address: "Fiera Roma, Via Portuense 1645"
      },
      links: ["https://techinnovation.example.it"],
      ticketSearchQuery: "Tech Innovation Roma",
      ticketAvailableProbability: 80,
      timestamp: 1736550000000,
      isFavorite: false
    },
    {
      id: "event-it-003",
      title: "30° Compleanno di Sara",
      kind: "Festa di Compleanno",
      tags: ["compleanno", "festa", "celebrazione"],
      description: {
        short: "Festa a sorpresa per il 30° compleanno di Sara! Dress code: Abbigliamento elegante",
        long: "Unisciti a noi per celebrare il compleanno speciale di Sara. Ci sarà cena, drink, balli e tante sorprese. Per favore arriva alle 19:00. Conferma richiesta."
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
        city: "Firenze",
        address: "Terrazza Panoramica, Piazzale Michelangelo"
      },
      timestamp: 1736460000000,
      isFavorite: true
    },
    {
      id: "event-it-004",
      title: "Ritiro Yoga e Benessere",
      kind: "Ritiro Benessere",
      tags: ["yoga", "benessere", "meditazione", "salute"],
      description: {
        short: "Ritiro weekend con yoga, meditazione e cucina sana"
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
        city: "Toscana",
        address: "Agriturismo La Pace, Via delle Colline"
      },
      ticketSearchQuery: "Ritiro Yoga Toscana",
      ticketAvailableProbability: 70,
      timestamp: 1736370000000,
      isFavorite: false
    },
    {
      id: "event-it-005",
      title: "Comic Con Italia",
      kind: "Convention",
      tags: ["fumetti", "cultura pop", "cosplay", "intrattenimento"],
      description: {
        short: "La convention definitiva di cultura pop con ospiti famosi, panel e merchandise esclusivo"
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
        city: "Bologna",
        address: "BolognaFiere, Viale della Fiera"
      },
      links: ["https://comiccon.example.it"],
      ticketSearchQuery: "Comic Con Bologna 2025",
      ticketAvailableProbability: 60,
      timestamp: 1736280000000,
      isFavorite: true
    }
  ],
  'nl-NL': [
    {
      id: "event-nl-001",
      title: "Zomer Muziekfestival 2025",
      kind: "Muziekfestival",
      tags: ["muziek", "festival", "openlucht", "zomer"],
      description: {
        short: "Driedaags openluchtfestival met meer dan 50 artiesten op meerdere podia",
        long: "Kom naar het grootste zomermuziekfestival van het jaar! Beleef ongelooflijke live optredens van wereldberoemde artiesten, ontdek nieuw talent en geniet van foodtrucks, kunstinstallaties en meer."
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
        city: "Amsterdam",
        address: "Vondelpark, Vondelpark 3"
      },
      links: ["https://zomerfestival.example.nl"],
      ticketSearchQuery: "Zomer Muziekfestival Amsterdam 2025",
      ticketAvailableProbability: 95,
      timestamp: 1736640000000,
      isFavorite: true
    },
    {
      id: "event-nl-002",
      title: "Tech Innovation Conferentie",
      kind: "Conferentie",
      tags: ["technologie", "business", "netwerken", "AI"],
      description: {
        short: "Toonaangevende techconferentie over AI, cloud computing en toekomstige innovaties",
        long: "Maak contact met brancheleiders, neem deel aan workshops en ontdek de nieuwste technologieën. Onderwerpen zijn onder meer kunstmatige intelligentie, machine learning, cloud-architectuur en cybersecurity."
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
        city: "Rotterdam",
        address: "Ahoy Rotterdam, Ahoyweg 10"
      },
      links: ["https://techinnovation.example.nl"],
      ticketSearchQuery: "Tech Innovation Rotterdam",
      ticketAvailableProbability: 80,
      timestamp: 1736550000000,
      isFavorite: false
    },
    {
      id: "event-nl-003",
      title: "Sara's 30e Verjaardag",
      kind: "Verjaardagsfeest",
      tags: ["verjaardag", "feest", "viering"],
      description: {
        short: "Verrassingsfeest voor Sara's 30e verjaardag! Dresscode: Cocktailkleding",
        long: "Kom vieren met ons Sara's speciale mijlpaalverjaardag. Er is diner, drankjes, dansen en veel verrassingen. Graag om 19:00 aanwezig zijn. RSVP verplicht."
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
        city: "Utrecht",
        address: "Het Dakterras, Mariaplaats 25"
      },
      timestamp: 1736460000000,
      isFavorite: true
    },
    {
      id: "event-nl-004",
      title: "Yoga & Wellness Retraite",
      kind: "Wellness Retraite",
      tags: ["yoga", "wellness", "meditatie", "gezondheid"],
      description: {
        short: "Weekendretraite met yoga, meditatie en gezonde keuken"
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
        city: "Veluwe",
        address: "Landgoed De Rust, Bosweg 12"
      },
      ticketSearchQuery: "Yoga Wellness Retraite Veluwe",
      ticketAvailableProbability: 70,
      timestamp: 1736370000000,
      isFavorite: false
    },
    {
      id: "event-nl-005",
      title: "Comic Con Nederland",
      kind: "Conventie",
      tags: ["strips", "popcultuur", "cosplay", "entertainment"],
      description: {
        short: "De ultieme popcultuurconventie met beroemde gasten, panels en exclusieve merchandise"
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
        city: "Utrecht",
        address: "Jaarbeurs, Jaarbeursplein"
      },
      links: ["https://comiccon.example.nl"],
      ticketSearchQuery: "Comic Con Utrecht 2025",
      ticketAvailableProbability: 60,
      timestamp: 1736280000000,
      isFavorite: true
    }
  ],
  'ja-JP': [
    {
      id: "event-ja-001",
      title: "サマーミュージックフェスティバル 2025",
      kind: "音楽フェスティバル",
      tags: ["音楽", "フェス", "野外", "夏"],
      description: {
        short: "50組以上のアーティストが出演する3日間の野外音楽フェスティバル",
        long: "今年最大のサマーミュージックフェスに参加しよう！世界的に有名なアーティストの素晴らしいライブパフォーマンス、新しい才能の発見、フードトラック、アートインスタレーションなどを楽しめます。"
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
        city: "東京",
        address: "代々木公園、渋谷区代々木神園町"
      },
      links: ["https://summerfes.example.jp"],
      ticketSearchQuery: "サマーミュージックフェスティバル 東京 2025",
      ticketAvailableProbability: 95,
      timestamp: 1736640000000,
      isFavorite: true
    },
    {
      id: "event-ja-002",
      title: "テックイノベーションカンファレンス",
      kind: "カンファレンス",
      tags: ["テクノロジー", "ビジネス", "ネットワーキング", "AI"],
      description: {
        short: "AI、クラウドコンピューティング、未来のイノベーションを探る最先端テックカンファレンス",
        long: "業界リーダーとつながり、ワークショップに参加し、最新テクノロジーを発見しましょう。トピックには人工知能、機械学習、クラウドアーキテクチャ、サイバーセキュリティが含まれます。"
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
        city: "東京",
        address: "東京ビッグサイト、江東区有明"
      },
      links: ["https://techinnovation.example.jp"],
      ticketSearchQuery: "テックイノベーションカンファレンス 東京",
      ticketAvailableProbability: 80,
      timestamp: 1736550000000,
      isFavorite: false
    },
    {
      id: "event-ja-003",
      title: "さらの30歳誕生日パーティー",
      kind: "誕生日パーティー",
      tags: ["誕生日", "パーティー", "お祝い"],
      description: {
        short: "さらの30歳サプライズパーティー！ドレスコード：カクテルドレス",
        long: "さらの特別なマイルストーンバースデーをお祝いしましょう。ディナー、ドリンク、ダンス、そしてたくさんのサプライズがあります。19時までにお越しください。出欠確認必須。"
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
        city: "大阪",
        address: "スカイラウンジ、中央区難波"
      },
      timestamp: 1736460000000,
      isFavorite: true
    },
    {
      id: "event-ja-004",
      title: "ヨガ＆ウェルネスリトリート",
      kind: "ウェルネスリトリート",
      tags: ["ヨガ", "ウェルネス", "瞑想", "健康"],
      description: {
        short: "ヨガ、瞑想、ヘルシー料理を楽しむ週末リトリート"
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
        city: "京都",
        address: "禅リゾート、嵐山"
      },
      ticketSearchQuery: "ヨガリトリート 京都",
      ticketAvailableProbability: 70,
      timestamp: 1736370000000,
      isFavorite: false
    },
    {
      id: "event-ja-005",
      title: "コミコン ジャパン",
      kind: "コンベンション",
      tags: ["漫画", "ポップカルチャー", "コスプレ", "エンタメ"],
      description: {
        short: "有名ゲスト、パネル、限定グッズが集まる究極のポップカルチャーイベント"
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
        city: "千葉",
        address: "幕張メッセ、美浜区中瀬"
      },
      links: ["https://comiccon.example.jp"],
      ticketSearchQuery: "コミコン 幕張 2025",
      ticketAvailableProbability: 60,
      timestamp: 1736280000000,
      isFavorite: true
    }
  ],
  'ko-KR': [
    {
      id: "event-ko-001",
      title: "여름 뮤직 페스티벌 2025",
      kind: "음악 페스티벌",
      tags: ["음악", "페스티벌", "야외", "여름"],
      description: {
        short: "50팀 이상의 아티스트가 출연하는 3일간의 야외 음악 페스티벌",
        long: "올해 최대의 여름 음악 페스티벌에 참여하세요! 세계적으로 유명한 아티스트의 놀라운 라이브 공연을 경험하고, 새로운 재능을 발견하며, 푸드트럭, 아트 설치물 등을 즐기세요."
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
        city: "서울",
        address: "올림픽공원, 송파구 올림픽로"
      },
      links: ["https://summerfest.example.kr"],
      ticketSearchQuery: "여름 뮤직 페스티벌 서울 2025",
      ticketAvailableProbability: 95,
      timestamp: 1736640000000,
      isFavorite: true
    },
    {
      id: "event-ko-002",
      title: "테크 이노베이션 컨퍼런스",
      kind: "컨퍼런스",
      tags: ["기술", "비즈니스", "네트워킹", "AI"],
      description: {
        short: "AI, 클라우드 컴퓨팅, 미래 혁신을 다루는 선도적인 테크 컨퍼런스",
        long: "업계 리더들과 연결하고, 워크샵에 참여하며, 최신 기술을 발견하세요. 주제에는 인공지능, 머신러닝, 클라우드 아키텍처, 사이버보안이 포함됩니다."
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
        city: "서울",
        address: "코엑스, 강남구 영동대로"
      },
      links: ["https://techinnovation.example.kr"],
      ticketSearchQuery: "테크 이노베이션 컨퍼런스 서울",
      ticketAvailableProbability: 80,
      timestamp: 1736550000000,
      isFavorite: false
    },
    {
      id: "event-ko-003",
      title: "사라의 30번째 생일 파티",
      kind: "생일 파티",
      tags: ["생일", "파티", "축하"],
      description: {
        short: "사라의 30번째 생일 서프라이즈 파티! 드레스코드: 칵테일 복장",
        long: "사라의 특별한 마일스톤 생일을 함께 축하해요. 저녁 식사, 음료, 댄스, 그리고 많은 서프라이즈가 준비되어 있습니다. 오후 7시까지 도착해 주세요. 참석 여부 회신 필수."
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
        city: "부산",
        address: "루프탑 가든, 해운대구 해운대해변로"
      },
      timestamp: 1736460000000,
      isFavorite: true
    },
    {
      id: "event-ko-004",
      title: "요가 & 웰니스 리트릿",
      kind: "웰니스 리트릿",
      tags: ["요가", "웰니스", "명상", "건강"],
      description: {
        short: "요가, 명상, 건강 요리를 즐기는 주말 리트릿"
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
        city: "제주",
        address: "힐링 리조트, 서귀포시 중문로"
      },
      ticketSearchQuery: "요가 웰니스 리트릿 제주",
      ticketAvailableProbability: 70,
      timestamp: 1736370000000,
      isFavorite: false
    },
    {
      id: "event-ko-005",
      title: "코믹콘 코리아",
      kind: "컨벤션",
      tags: ["만화", "팝컬처", "코스프레", "엔터테인먼트"],
      description: {
        short: "유명 게스트, 패널, 한정판 굿즈가 가득한 궁극의 팝컬처 이벤트"
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
        city: "서울",
        address: "킨텍스, 고양시 대화동"
      },
      links: ["https://comiccon.example.kr"],
      ticketSearchQuery: "코믹콘 서울 2025",
      ticketAvailableProbability: 60,
      timestamp: 1736280000000,
      isFavorite: true
    }
  ],
  'pl-PL': [
    {
      id: "event-pl-001",
      title: "Letni Festiwal Muzyczny 2025",
      kind: "Festiwal Muzyczny",
      tags: ["muzyka", "festiwal", "plener", "lato"],
      description: {
        short: "Trzydniowy festiwal na świeżym powietrzu z ponad 50 artystami na wielu scenach",
        long: "Dołącz do największego letniego festiwalu muzycznego roku! Przeżyj niesamowite występy na żywo światowej sławy artystów, odkryj nowe talenty i ciesz się food truckami, instalacjami artystycznymi i wieloma innymi atrakcjami."
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
        city: "Warszawa",
        address: "Park Skaryszewski, ul. Waszyngtona"
      },
      links: ["https://letnifestiwal.example.pl"],
      ticketSearchQuery: "Letni Festiwal Muzyczny Warszawa 2025",
      ticketAvailableProbability: 95,
      timestamp: 1736640000000,
      isFavorite: true
    },
    {
      id: "event-pl-002",
      title: "Konferencja Tech Innovation",
      kind: "Konferencja",
      tags: ["technologia", "biznes", "networking", "AI"],
      description: {
        short: "Wiodąca konferencja technologiczna o AI, chmurze obliczeniowej i przyszłych innowacjach",
        long: "Nawiąż kontakty z liderami branży, weź udział w warsztatach i odkryj najnowsze technologie. Tematy obejmują sztuczną inteligencję, uczenie maszynowe, architekturę chmury i cyberbezpieczeństwo."
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
        city: "Kraków",
        address: "ICE Kraków, ul. Marii Konopnickiej 17"
      },
      links: ["https://techinnovation.example.pl"],
      ticketSearchQuery: "Tech Innovation Kraków",
      ticketAvailableProbability: 80,
      timestamp: 1736550000000,
      isFavorite: false
    },
    {
      id: "event-pl-003",
      title: "30. Urodziny Sary",
      kind: "Przyjęcie Urodzinowe",
      tags: ["urodziny", "impreza", "świętowanie"],
      description: {
        short: "Niespodzianka na 30. urodziny Sary! Dress code: Strój koktajlowy",
        long: "Dołącz do nas na wyjątkowe świętowanie urodzin Sary. Będzie kolacja, drinki, taniec i wiele niespodzianek. Prosimy o przybycie do 19:00. Wymagane potwierdzenie."
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
        city: "Wrocław",
        address: "Taras Widokowy, Rynek Główny 15"
      },
      timestamp: 1736460000000,
      isFavorite: true
    },
    {
      id: "event-pl-004",
      title: "Joga i Wellness Retreat",
      kind: "Retreat Wellness",
      tags: ["joga", "wellness", "medytacja", "zdrowie"],
      description: {
        short: "Weekendowy retreat z jogą, medytacją i zdrową kuchnią"
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
        city: "Zakopane",
        address: "Górski Resort, ul. Krupówki"
      },
      ticketSearchQuery: "Joga Wellness Retreat Zakopane",
      ticketAvailableProbability: 70,
      timestamp: 1736370000000,
      isFavorite: false
    },
    {
      id: "event-pl-005",
      title: "Comic Con Polska",
      kind: "Konwent",
      tags: ["komiksy", "popkultura", "cosplay", "rozrywka"],
      description: {
        short: "Najważniejszy konwent popkultury ze sławnymi gośćmi, panelami i ekskluzywnym merchandise"
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
        city: "Poznań",
        address: "MTP, ul. Głogowska 14"
      },
      links: ["https://comiccon.example.pl"],
      ticketSearchQuery: "Comic Con Poznań 2025",
      ticketAvailableProbability: 60,
      timestamp: 1736280000000,
      isFavorite: true
    }
  ]
};
