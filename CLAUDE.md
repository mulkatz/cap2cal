# Cap2Cal

AI-powered mobile app that extracts event details from photos and adds them to your calendar.

## Monorepo Structure

| Directory | Purpose | Stack |
|-----------|---------|-------|
| `app/` | Mobile app | React 18, TypeScript, Vite, TailwindCSS, Capacitor 7 |
| `backend/` | API | Firebase Cloud Functions, Vertex AI (Gemini) |
| `web/` | Landing page | React, Framer Motion, PostHog |
| `tools/` | Screenshot automation | Puppeteer |

## Quick Start

```bash
# App
cd app && npm install && cp .env.example .env && npm run dev

# Backend
cd backend/functions && npm install && firebase deploy --only functions

# Web
cd web && npm install && cp .env.example .env && npm run dev
```

## Conventions

- **Commits**: Conventional Commits (`feat:`, `fix:`, `chore:`, etc.)
- **Exports**: Named exports, no default exports
- **Styling**: TailwindCSS only, no inline styles
- **State**: React Context + hooks, no Redux
- **Storage**: Dexie (IndexedDB), local-first
- **i18n**: All user-facing text via i18next
- **Services**: External integrations wrapped in service layer, never called directly from components

## Key Architecture Decisions

- **Capacitor over React Native** — single codebase for web + iOS + Android
- **Anonymous auth** — no sign-up friction, Firebase UID on first launch
- **Local-first** — events persist offline, no server-side user data
- **Feature flags** — Firebase Remote Config for toggling features

## Documentation

- [Architecture](./docs/ARCHITECTURE.md) — system design and data flow
- [Getting Started](./docs/GETTING-STARTED.md) — detailed setup guide
- [App Context](./app/docs/CLAUDE.md) — mobile app specifics
