# Cap2Cal

AI-powered mobile app that extracts event details from photos and exports them to your calendar. Production app on [iOS](https://apps.apple.com/app/capture2calendar/id6754225481) and [Android](https://play.google.com/store/apps/details?id=cx.franz.cap2cal).

## Monorepo

| Directory | What | Stack |
|-----------|------|-------|
| `app/` | Mobile app | React 18, TypeScript, Vite, TailwindCSS, Capacitor 7 |
| `backend/` | Cloud Functions | Firebase Functions, Vertex AI (Gemini), Zod |
| `web/` | Landing page | React, Framer Motion, PostHog |
| `tools/` | Screenshots | Puppeteer |

## Development

```bash
# App (web preview)
cd app && npm install && cp .env.example .env
npm run dev

# Backend (local emulator)
cd backend/functions && npm install
npm run serve

# Landing page
cd web && npm install && cp .env.example .env
npm run dev
```

Build and run on device:
```bash
cd app && npm run build && npx cap run ios   # or: npx cap run android
```

## Conventions

- **Commits**: conventional commits — `feat:`, `fix:`, `chore:`, `refactor:`, `style:`, `docs:`
- **Exports**: named exports only, no default exports
- **Styling**: TailwindCSS, no inline styles
- **State**: React Context + hooks, no Redux
- **Storage**: Dexie (IndexedDB), local-first, no server-side user data
- **i18n**: all UI text via i18next, never hardcode strings
- **Services**: wrap external APIs in service layer — components never call Firebase/Capacitor directly

## Architecture

- **Capacitor over React Native** — single web codebase for iOS + Android + web
- **Anonymous auth** — Firebase UID on first launch, zero sign-up friction
- **Local-first** — all event data in IndexedDB, works offline
- **Feature flags** — Firebase Remote Config controls features server-side
- **Auth on all endpoints** — every Cloud Function that costs money or mutates data requires a Firebase Bearer token

## Docs

See [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) for system design and [`app/docs/CLAUDE.md`](./app/docs/CLAUDE.md) for app-specific patterns.
