<div align="center">
  <img src="app/src/assets/images/icon.png" width="100" alt="Cap2Cal Icon" />
  <h1>Cap2Cal</h1>
  <p>Turn any event poster into a calendar entry with AI.<br/>Never type event details manually again.</p>
  <br/>
  <a href="https://apps.apple.com/app/capture2calendar/id6754225481">
    <img src="web/src/assets/icons/Download_on_the_App_Store_RGB_blk.svg" height="40" alt="Download on the App Store" />
  </a>
  &nbsp;&nbsp;
  <a href="https://play.google.com/store/apps/details?id=cx.franz.cap2cal">
    <img src="web/src/assets/icons/Google_Play_Store_badge_EN.svg" height="40" alt="Get it on Google Play" />
  </a>
  <br/><br/>
</div>

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Platform - iOS](https://img.shields.io/badge/Platform-iOS-000000?logo=apple)](https://apps.apple.com/app/capture2calendar/id6754225481)
[![Platform - Android](https://img.shields.io/badge/Platform-Android-3DDC84?logo=android&logoColor=white)](https://play.google.com/store/apps/details?id=cx.franz.cap2cal)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Firebase](https://img.shields.io/badge/Firebase-Cloud_Functions-FFCA28?logo=firebase&logoColor=black)](https://firebase.google.com)
[![Gemini](https://img.shields.io/badge/Google-Gemini_AI-4285F4?logo=google&logoColor=white)](https://deepmind.google/technologies/gemini/)

> Snap a photo of any event poster, flyer, or ticket — Cap2Cal extracts the event details using AI and adds them to your calendar. Available on [iOS](https://apps.apple.com/app/capture2calendar/id6754225481) and [Android](https://play.google.com/store/apps/details?id=cx.franz.cap2cal). See the [landing page](https://cap2cal.franz.cx/).

<div align="center">
  <img src="tools/screenshots/output/en-GB/03_camera_view_1.png" width="180" alt="Camera View" />
  <img src="tools/screenshots/output/en-GB/04a_capture_result_1.png" width="180" alt="Event Result" />
  <img src="tools/screenshots/output/en-GB/07_event_history_final.png" width="180" alt="Event History" />
  <img src="tools/screenshots/output/en-GB/08_settings.png" width="180" alt="Settings" />
</div>

## How it works

1. Point your camera at an event poster (or import a photo)
2. AI extracts title, date, time, location and description
3. Export to Google Calendar, Apple Calendar or Outlook with one tap

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **App** | React 18, TypeScript, Vite, TailwindCSS |
| **Native** | Capacitor 7 (iOS + Android) |
| **Backend** | Firebase Cloud Functions, TypeScript |
| **AI** | Google Gemini / Vertex AI |
| **Storage** | Dexie (IndexedDB, local-first) |
| **Analytics** | Firebase Analytics, Crashlytics |
| **Payments** | RevenueCat |
| **Landing Page** | React, Framer Motion, PostHog |

## Project Structure

```
cap2cal/
├── app/                  # Mobile app (React + Capacitor)
│   ├── src/
│   │   ├── pages/        # Screens (Camera, App, Settings, ...)
│   │   ├── components/   # UI components
│   │   ├── services/     # API, analytics, purchases
│   │   ├── hooks/        # Custom hooks (useCapture, useShare, ...)
│   │   ├── contexts/     # Firebase, App context
│   │   ├── db/           # Dexie local database
│   │   └── utils/        # Helpers, logger, i18n
│   └── native/           # iOS & Android native projects
├── backend/              # Firebase Cloud Functions
│   └── functions/src/
│       └── routes/       # analyse, findTickets, featureFlags, ...
├── web/                  # Landing page & marketing site
├── tools/                # Screenshot generation (Puppeteer)
└── docs/                 # Architecture and setup guides
```

## Getting Started

### Prerequisites

- Node.js 22+
- iOS: Xcode 15+ (macOS)
- Android: Android Studio

### Setup

```bash
git clone https://github.com/mulkatz/cap2cal.git
cd cap2cal

# App
cd app
npm install
cp .env.example .env  # fill in your Firebase config + API URLs

# Development (web preview)
npm run dev

# Build & run on device
npm run build
npx cap run ios       # or: npx cap run android
```

### Backend

```bash
cd backend/functions
npm install
# Configure Firebase secrets (Gemini API key, etc.)
firebase deploy --only functions
```

### Landing Page

```bash
cd web
npm install
cp .env.example .env  # fill in Firebase + PostHog config
npm run dev
```

## Features

- **AI event extraction** — Gemini-powered, handles complex posters with multiple events
- **Calendar export** — Google Calendar, Apple Calendar, Outlook, native device calendar
- **Ticket search** — Finds ticket links for detected events via Google Custom Search
- **Event history** — Local-first storage with favorites, filters, and image preview
- **Share** — Export event cards as PDF or image
- **Multi-language** — English, German, Spanish, French, Portuguese, and more
- **Offline-ready** — Events stored locally on-device, works without internet
- **Onboarding** — 3-screen tutorial flow
- **In-app purchases** — Pro subscription via RevenueCat (optional, can be disabled)
- **Feature flags** — Remote config for toggling features server-side
- **Crashlytics** — Error tracking with Firebase Crashlytics

## Architecture

The app follows a **local-first** approach — all event data lives in IndexedDB via Dexie. Firebase is used for auth (anonymous), analytics, remote config, and the backend API. The backend runs on Cloud Functions and uses Vertex AI (Gemini) for image analysis.

Key architectural decisions:

- **No Redux** — React Context + hooks for state management
- **Capacitor over React Native** — Single codebase for web + iOS + Android with web-standard tooling
- **Anonymous auth** — No sign-up friction, user gets a Firebase UID on first launch
- **Local-first storage** — Events persist even without internet, no server-side user data store

See [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) for the full system design.

## Documentation

- [Getting Started](./docs/GETTING-STARTED.md) — Setup guide
- [Architecture](./docs/ARCHITECTURE.md) — System design and data flow
- [RevenueCat Setup](./docs/REVENUECAT_SETUP.md) — In-app purchase configuration

## Contributing

Contributions are welcome! Please read the [Contributing Guide](./CONTRIBUTING.md) before submitting a PR.

## License

[MIT](./LICENSE)

## Author

Built by [Franz Benthin](https://github.com/mulkatz).
