# App Context

Mobile app built with React 18 + Capacitor 7. Runs on iOS, Android, and web.

## Project Structure

```
app/src/
├── pages/          # Screens (App.tsx orchestrates view state)
├── components/
│   ├── ui/         # Atomic, reusable (CTAButton, Dialog, Backdrop)
│   └── features/   # Smart, domain-specific (EventCard, PaywallSheet)
├── services/       # External integrations (api, analytics, calendar, purchases)
├── hooks/          # Business logic (useCapture, useCalendarExport, useShare)
├── contexts/       # Global state (AppContext, DialogContext, FirebaseContext)
├── db/             # Dexie (IndexedDB) schema
├── models/         # TypeScript types
├── utils/          # Pure helpers (logger, dateTime, platform, i18n)
└── assets/         # Icons, images, translations
```

## Core Flow

```
Camera → useCapture hook → api.ts (POST image) → Gemini AI → save to Dexie → ResultView → calendar export
```

## Key Patterns

- **View state, not router**: `App.tsx` uses state-based view switching (`home | camera | loading | result`)
- **Dialog stack**: `DialogContext` manages a stack with hardware back button support
- **Service layer**: Components use hooks/contexts, never call Firebase/Capacitor directly
- **Platform detection**: `Capacitor.getPlatform()` for iOS/Android/web branching

## Important Files

| File | Purpose |
|------|---------|
| `pages/App.tsx` | Root orchestrator, view state management |
| `hooks/useCapture.tsx` | Image capture + API call + error handling |
| `services/api.ts` | Backend communication (analyse, findTickets, featureFlags) |
| `contexts/FirebaseContext.tsx` | Auth, analytics, feature flags, remote config |
| `db/db.ts` | Dexie database schema |
| `services/purchases.service.ts` | RevenueCat in-app purchases |

## Naming Conventions

| Type | Pattern | Example |
|------|---------|---------|
| Components | `PascalCase.tsx` | `EventCard.tsx` |
| Hooks | `use*.tsx` | `useCapture.tsx` |
| Services | `*.service.ts` | `analytics.service.ts` |
| Utils | `camelCase.ts` | `dateTime.ts` |
