# Architecture

## System Overview

```
┌──────────────────┐       HTTPS        ┌──────────────────┐
│                  │ ──────────────────► │                  │
│   Mobile App     │                     │  Cloud Functions │
│   React +        │ ◄──────────────────  │  (Firebase)      │
│   Capacitor      │    JSON response    │                  │
│                  │                     └────────┬─────────┘
└──────┬───────────┘                              │
       │                                          │
       │  Local storage                           │  Vertex AI
       ▼                                          ▼
┌──────────────────┐                     ┌──────────────────┐
│  IndexedDB       │                     │  Google Gemini   │
│  (Dexie)         │                     │  (Image → Event) │
└──────────────────┘                     └──────────────────┘
```

The system has two main parts: a **mobile app** that runs on iOS, Android, and web, and a **serverless backend** on Firebase Cloud Functions that handles AI-powered image analysis.

All user data stays on the device. The backend is stateless — it receives an image, extracts event details via Gemini, and returns structured data.

## Mobile App

### Stack

- **React 18** + **TypeScript** — UI framework
- **Vite** — Build tool with HMR
- **TailwindCSS** — Utility-first styling
- **Capacitor 7** — Native bridge for iOS and Android
- **Dexie** — IndexedDB wrapper for local event storage
- **i18next** — Internationalization (10 languages)

### Layer Architecture

```
┌─────────────────────────────────────────┐
│  Pages                                  │  Screens: Camera, Result, History, Settings
├─────────────────────────────────────────┤
│  Components                             │  Reusable UI: EventCard, Dialogs, Sheets
├─────────────────────────────────────────┤
│  Hooks                                  │  useCapture, useShare, useEvents, ...
├─────────────────────────────────────────┤
│  Contexts                               │  AppContext, FirebaseContext, DialogContext
├─────────────────────────────────────────┤
│  Services                               │  API, Analytics, Purchases, Calendar
├─────────────────────────────────────────┤
│  Data                                   │  Dexie DB (IndexedDB), LocalStorage
├─────────────────────────────────────────┤
│  Platform                               │  Capacitor plugins (Camera, Calendar, Share)
└─────────────────────────────────────────┘
```

**Key rule:** Components never call Firebase, Capacitor, or external APIs directly. Everything goes through the service layer.

### State Management

| Scope | Tool | Examples |
|-------|------|----------|
| Component | `useState`, `useRef` | Form inputs, UI toggles |
| Global | React Context | Current view, feature flags, dialog stack |
| Persistent | Dexie (IndexedDB) | Event history, captured images |
| Settings | LocalStorage | Language, onboarding status, capture count |
| Remote | Firebase Remote Config | Feature flags, capture limits |

### Core Data Flows

**Capture Flow:**
1. User takes photo or imports image
2. Image compressed client-side
3. Sent to `/analyse` Cloud Function with Firebase auth token
4. Gemini extracts event details (title, date, time, location, description)
5. Structured result returned and saved to local IndexedDB
6. User can export to calendar or share as PDF/image

**Calendar Export:**
- Native (iOS/Android): Capacitor Calendar plugin writes directly to device calendar
- Web: Generates Google Calendar URL, Apple .ics file, or Outlook link

## Backend

### Stack

- **Firebase Cloud Functions** (Node.js, TypeScript)
- **Vertex AI** (Gemini) for image-to-event extraction
- **Google Custom Search API** for ticket link discovery
- **Zod** for response validation

### Endpoints

| Endpoint | Auth | Purpose |
|----------|------|---------|
| `POST /analyse` | Bearer token | Extract event details from image via Gemini |
| `POST /findTickets` | Bearer token | Search for ticket links for a given event |
| `GET /featureFlags` | None | Return remote config values |

Every endpoint that costs money or mutates data requires a Firebase Bearer token (anonymous auth).

### AI Processing

The `/analyse` endpoint sends the image to Gemini with three parallel requests at slightly different temperature settings. The first valid response (validated against a Zod schema) wins. This improves both reliability and speed.

## Infrastructure

| Service | Purpose |
|---------|---------|
| **Firebase Auth** | Anonymous authentication (zero sign-up friction) |
| **Firebase Analytics** | Usage tracking and conversion funnels |
| **Firebase Crashlytics** | Crash and error reporting |
| **Firebase Remote Config** | Feature flags and capture limits |
| **RevenueCat** | In-app subscription management (optional, can be disabled) |

## Key Design Decisions

**Capacitor over React Native** — One web codebase serves iOS, Android, and web. Standard web tooling (Vite, TailwindCSS) works without native build complexity.

**Local-first storage** — All event data lives in IndexedDB on the device. No server-side user data store. The app works offline.

**Anonymous auth** — Users get a Firebase UID on first launch. No sign-up form, no email, no password. Minimal friction.

**Context API over Redux** — The app's state is simple enough that React Context + hooks handle everything cleanly without the boilerplate of a state management library.

**Service layer pattern** — Components are decoupled from platform APIs. Swapping Firebase for another backend or adding a new calendar provider only requires changes in the service layer.
