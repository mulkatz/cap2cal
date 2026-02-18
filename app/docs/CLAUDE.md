# App Context

React 18 + Capacitor 7 mobile app. Runs natively on iOS and Android.

## Structure

```
src/
├── pages/          # Screens — App.tsx orchestrates via view state, not a router
├── components/
│   ├── ui/         # Presentational, reusable (CTAButton, Dialog, Backdrop)
│   └── features/   # Smart, domain-specific (EventCard, PaywallSheet, TicketButton)
├── services/       # API layer (api.ts, analytics, calendar, purchases)
├── hooks/          # Business logic (useCapture, useCalendarExport, useShare)
├── contexts/       # Global state (AppContext, DialogContext, FirebaseContext)
├── db/             # Dexie IndexedDB schema and queries
├── models/         # TypeScript type definitions
├── utils/          # Pure helpers (logger, dateTime, platform, errorHandler)
└── assets/         # Icons, images, translation JSON files
```

## Core Flow

```
Camera → useCapture → api.ts (POST base64 image + auth token)
  → Gemini AI extracts events → save to Dexie → ResultView → calendar export
```

## Key Patterns

**View state, not router.** `App.tsx` switches views via state (`home | loading | camera | result`), not URL routing.

**Dialog stack.** `DialogContext` manages a LIFO stack with hardware back button support. Push/pop dialogs, never render them conditionally.

**Service layer.** Components talk to hooks and contexts. Hooks talk to services. Services talk to Firebase/Capacitor. Never skip a layer.

**Auth tokens.** All API calls that cost money (`analyse`, `findTickets`, `findTicketPrice`) require a Firebase Bearer token. Get it via `getAuthToken()` from `FirebaseContext` and pass it to the API function.

**Platform branching.** Use `Capacitor.getPlatform()` for iOS/Android/web differences. Use `Capacitor.isNativePlatform()` to gate native-only features.

## Key Files

| File | Role |
|------|------|
| `pages/App.tsx` | Root orchestrator, view state, screen transitions |
| `hooks/useCapture.tsx` | Camera → image processing → API call → DB save |
| `services/api.ts` | All backend calls (analyse, findTickets, featureFlags) |
| `contexts/FirebaseContext.tsx` | Auth, analytics, feature flags, `getAuthToken()` |
| `db/db.ts` | Dexie schema — `eventItems` table stores all captured events |
| `services/purchases.service.ts` | RevenueCat subscription management |
| `utils/logger.ts` | Log levels (debug/info/warn/error), only warn+ in production |

## Naming

| Type | Pattern | Example |
|------|---------|---------|
| Components | `PascalCase.tsx` | `EventCard.tsx` |
| Hooks | `use*.tsx` | `useCapture.tsx` |
| Services | `*.service.ts` | `analytics.service.ts` |
| Utils | `camelCase.ts` | `dateTime.ts` |
| Types | `*.types.ts` | `api.types.ts` |
