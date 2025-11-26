# Cap2Cal - Complete Project Context for AI Assistants

**Purpose:** This document provides comprehensive context for AI assistants (Claude Code, GitHub Copilot, etc.) working on the Cap2Cal project.

**Scope:** Project-wide context. For mobile app-specific details, see [`app/docs/CLAUDE.md`](./app/docs/CLAUDE.md).

---

## Project Overview

**Cap2Cal** (Capture to Calendar) is a production-ready mobile application that uses AI-powered image recognition to extract event information from photos and add them to users' calendars.

### Core Value Proposition

Users can snap a photo of any event poster, flyer, ticket, or social media post, and Cap2Cal:
1. **Extracts** all event details using Google Gemini AI (title, date, time, location, description, ticket links)
2. **Saves** the event to their preferred calendar (Google, Apple, Outlook, etc.)
3. **Finds** tickets automatically through affiliate partnerships

**3 seconds. No typing. Perfect accuracy.**

### Tech Stack Summary

- **Frontend:** React 18 + TypeScript + TailwindCSS
- **Build:** Vite (fast bundler with HMR)
- **Mobile Runtime:** Capacitor (cross-platform native iOS/Android)
- **State:** React Context API + Dexie (IndexedDB)
- **Backend:** Firebase (Analytics, Crashlytics, Remote Config) + Custom REST API
- **AI:** Google Gemini API (multimodal vision + text)
- **Monetization:** RevenueCat (in-app purchases) + Affiliate links

### Platforms

- **iOS** - Native app via Capacitor (App Store deployment ready)
- **Android** - Native app via Capacitor (Google Play deployment ready)
- **Web** - PWA fallback (limited functionality, no in-app purchases)

---

## Repository Structure

```
cap2cal/
├── app/                          # Mobile app (React + Capacitor)
│   ├── src/                      # Application source code
│   │   ├── pages/                # Top-level screens (App.tsx, HomeView, CameraView, etc.)
│   │   ├── components/           # UI components
│   │   │   ├── ui/               # Atomic, reusable UI elements
│   │   │   └── features/         # Business logic components
│   │   ├── services/             # External integrations (API, calendar, analytics, purchases)
│   │   ├── hooks/                # Custom React hooks
│   │   ├── contexts/             # React Context providers
│   │   ├── models/               # TypeScript type definitions
│   │   ├── db/                   # Dexie (IndexedDB) configuration
│   │   ├── utils/                # Pure helper functions
│   │   └── assets/               # Static resources (icons, translations, images)
│   ├── android/                  # Android native project
│   ├── ios/                      # iOS native project
│   ├── public/                   # Static assets served at build time
│   └── docs/                     # App-specific documentation
│       ├── CLAUDE.md             # ⭐ Mobile app deep dive for AI
│       └── README.md             # App documentation index
│
├── docs/                         # Project-wide documentation
│   ├── README.md                 # Documentation hub
│   ├── ARCHITECTURE.md           # System architecture overview
│   ├── GETTING-STARTED.md        # Setup guide for developers
│   ├── DOCUMENTATION-GUIDE.md    # How we organize docs
│   ├── TASKS.md                  # Project task history
│   ├── planning/                 # Product planning & roadmap
│   │   ├── ROADMAP.md            # ⭐ Feature roadmap & priorities
│   │   ├── ONBOARDING.md         # Onboarding & monetization strategy
│   │   └── VISUAL_INCONSISTENCIES.md  # Design system audit
│   ├── marketing/                # App store & campaigns
│   │   ├── APP-STORE-COPY.md     # Store listing content
│   │   ├── app-store-translations.md  # Localized listings
│   │   └── pitch-deck.md         # Investor presentation
│   └── strategy/                 # Business strategy
│       ├── GROWTH-PLAYBOOK.md    # User acquisition & retention
│       └── APP-ANALYTICS.md      # Analytics implementation
│
├── tools/                        # Development utilities
│   └── screenshots/              # Automated screenshot generation tool
│       ├── README.md             # Tool documentation
│       └── SCREENSHOTS.md        # Screenshot guide
│
├── README.md                     # ⭐ Project introduction (you are here)
├── CLAUDE.md                     # ⭐ This file - project-wide AI context
└── .gitignore                    # Git ignored files
```

---

## Key Documentation

### For AI Assistants (You!)

| File | Purpose | When to Read |
|------|---------|--------------|
| **[/CLAUDE.md](./CLAUDE.md)** | This file - project-wide context | Working on anything |
| **[/app/docs/CLAUDE.md](./app/docs/CLAUDE.md)** | Mobile app deep dive | Working on React/Capacitor code |
| **[/docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)** | System design | Understanding architecture |
| **[/docs/planning/ROADMAP.md](./docs/planning/ROADMAP.md)** | Feature roadmap | Planning new features |

### For Humans

| File | Purpose |
|------|---------|
| **[/README.md](./README.md)** | Project introduction & quick start |
| **[/docs/GETTING-STARTED.md](./docs/GETTING-STARTED.md)** | Developer setup guide |
| **[/docs/README.md](./docs/README.md)** | Documentation index & navigation |

---

## Component Locations

When asked to work on specific features, here's where to find the code:

### Pages (Top-level Screens)
- **Main app orchestrator:** `app/src/pages/App.tsx`
- **Home screen:** `app/src/pages/HomeView.tsx`
- **Camera interface:** `app/src/pages/CameraView.tsx`
- **Results display:** `app/src/pages/ResultView.tsx`
- **Settings:** `app/src/pages/SettingsScreen.tsx`
- **Event history:** `app/src/pages/EventHistoryScreen.tsx`

### Components

**UI Components** (`app/src/components/ui/`)
- Buttons: `buttons/CTAButton.tsx`, `buttons/IconButton.tsx`, etc.
- Dialogs: `Dialog.tsx`, `Backdrop.tsx`, `LoaderAnimation.tsx`
- Image: `ImagePreview.tsx`
- Toast: `ToastProvider.tsx`

**Feature Components** (`app/src/components/features/`)
- Cards: `cards/EventCard.tsx`, `cards/CardController.tsx`
- Dialogs: `dialogs/PaywallSheet.tsx`, `dialogs/FeedbackDialog.tsx`, etc.
- Onboarding: `onboarding/OnboardingValueProp.tsx`, etc.
- Results: `results/` (event extraction result displays)

### Services (External Integrations)
- **API communication:** `app/src/services/api.ts`
- **Firebase Analytics:** `app/src/services/analytics.service.ts`
- **Calendar export:** `app/src/services/calendar.service.ts`
- **In-app purchases:** `app/src/services/purchases.service.ts`

### Hooks (Custom Logic)
- **Image capture flow:** `app/src/hooks/useCapture.tsx`
- **Calendar export:** `app/src/hooks/useCalendarExport.tsx`
- **Crash reporting:** `app/src/hooks/useCrashlytics.tsx`
- **Permissions:** `app/src/hooks/usePermissions.tsx`
- **Premium modals:** `app/src/hooks/usePremiumModals.tsx`
- **Share functionality:** `app/src/hooks/useShare.tsx`

### Contexts (Global State)
- **App state:** `app/src/contexts/AppContext.tsx` (view state, result data, navigation)
- **Dialogs:** `app/src/contexts/DialogContext.tsx` (dialog stack, back button handling)
- **Firebase:** `app/src/contexts/FirebaseContext.tsx` (analytics, feature flags)
- **Effects:** `app/src/contexts/EffectsContext.tsx` (visual effects coordination)

### Data Layer
- **Database:** `app/src/db/db.ts` (Dexie schema & config)
- **Models:** `app/src/models/` (TypeScript types)

### Utilities
- **Date/time:** `app/src/utils/dateTime.ts`
- **Image processing:** `app/src/utils/imageProcessing.ts`
- **Platform detection:** `app/src/utils/platform.ts`
- **Logging:** `app/src/utils/logger.ts`
- **Error handling:** `app/src/utils/errorHandler.ts`

---

## Common Workflows

### Adding a New Feature

1. **Check roadmap:** [`docs/planning/ROADMAP.md`](./docs/planning/ROADMAP.md) - Is it prioritized?
2. **Design data model:** Create types in `app/src/models/`
3. **Add service layer:** If external integration needed, add to `app/src/services/`
4. **Create custom hook:** Extract business logic to `app/src/hooks/`
5. **Build UI components:** Add to `app/src/components/ui/` (presentational) or `app/src/components/features/` (smart)
6. **Add analytics:** Log events in `app/src/services/analytics.service.ts`
7. **Update i18n:** Add strings to `app/src/assets/translations/`
8. **Test manually:** Run on iOS/Android simulators

### Fixing a Bug

1. **Reproduce:** Try to reproduce on device/simulator
2. **Check analytics:** Look for error patterns in `analytics.service.ts`
3. **Add logging:** Use `logger.ts` for debugging
4. **Fix & test:** Verify fix on both iOS and Android
5. **Update tests:** (when test infrastructure exists)

### Adding a New Screen

1. **Create page:** `app/src/pages/NewScreen.tsx`
2. **Update navigation:** Modify `app/src/pages/App.tsx` (uses state-based view switching, not router)
3. **Add to AppContext:** If new view state needed
4. **Add analytics:** Track screen views in `analytics.service.ts`

### Adding Translation

1. **Edit translation files:** `app/src/assets/translations/en.json`, `de.json`
2. **Use in component:** `const { t } = useTranslation(); return <h1>{t('key.path')}</h1>;`
3. **Test:** Switch language in device settings

### Deploying

**iOS:**
```bash
npm run build          # Build web assets
npx cap sync ios       # Sync with iOS project
npx cap open ios       # Open in Xcode
# In Xcode: Product → Archive → Distribute
```

**Android:**
```bash
npm run build          # Build web assets
npx cap sync android   # Sync with Android project
npx cap open android   # Open in Android Studio
# In Android Studio: Build → Generate Signed Bundle/APK
```

---

## Architecture Patterns

### State Management

**Philosophy:** Keep it simple. No Redux/Zustand.

- **Local state first** - `useState` for component-specific state
- **Context for global** - `AppContext`, `DialogContext`, `FirebaseContext`, `EffectsContext`
- **Persistent state** - Dexie (IndexedDB) for events/images, LocalStorage for settings

### Component Architecture

**UI Components** (`components/ui/`)
- Atomic, single responsibility
- Presentational only (no business logic)
- Props-driven, reusable
- Example: `CTAButton`, `Dialog`, `Backdrop`

**Feature Components** (`components/features/`)
- Smart components with business logic
- Domain-specific (events, premium, onboarding)
- Composed from UI components
- Example: `EventCard`, `PaywallSheet`, `Onboarding`

### Service Layer Pattern

Services encapsulate external integrations:

```typescript
// ✅ Good - Component uses service
const { logAnalyticsEvent } = useFirebaseContext();
logAnalyticsEvent(AnalyticsEvent.CAPTURE_STARTED);

// ❌ Bad - Direct SDK calls in components
firebase.analytics().logEvent('capture_started');
```

### Custom Hooks Pattern

Complex logic extracted into hooks:
- `useCapture` - Orchestrates camera, permissions, image processing, API calls
- `useCalendarExport` - Manages calendar export with permission handling
- `usePremiumModals` - Centralized premium feature gating

---

## Naming Conventions

### Files & Components

| Type | Convention | Example |
|------|-----------|---------|
| React Components | PascalCase `.tsx` | `EventCard.tsx`, `SettingsScreen.tsx` |
| Hooks | camelCase `use*.tsx` | `useCapture.tsx`, `usePermissions.tsx` |
| Services | camelCase `.service.ts` | `analytics.service.ts`, `calendar.service.ts` |
| Utils | camelCase `.ts` | `dateTime.ts`, `imageProcessing.ts` |
| Types/Models | PascalCase or camelCase `.ts` | `CaptureEvent.ts`, `api.types.ts` |
| Barrel Exports | `index.ts` | `components/ui/index.ts` |

### Code Style

- **No default exports** (except legacy components) - Use named exports
- **Explicit types** - No implicit `any`, always define types
- **Functional components** - No class components
- **Hooks for logic** - Extract reusable logic into custom hooks
- **Services for I/O** - Keep components pure

---

## Technology Decisions

### Why React + Capacitor?

- Single codebase for iOS/Android/Web
- Native performance with access to platform APIs
- Web technology expertise (faster iteration)
- Easier to maintain than separate native apps

### Why Context API (not Redux)?

- Simpler mental model
- Less boilerplate
- Sufficient for app complexity
- Better TypeScript support
- Easier to maintain for solo developer

### Why Dexie (IndexedDB)?

- Offline-first capability
- Better than localStorage for structured data
- Query capabilities
- Reactivity with hooks (`useLiveQuery`)
- Cross-browser support

### Why Firebase?

- Quick setup
- Real-time analytics
- Crash reporting (Crashlytics)
- Remote config for feature flags
- Free tier sufficient for MVP

---

## Development Guidelines

### DO:
✅ Follow the established directory structure
✅ Use TypeScript strictly (no `any`)
✅ Add analytics events for new features
✅ Update i18n strings for UI text
✅ Test on actual devices (iOS/Android)
✅ Use custom hooks for reusable logic
✅ Keep components focused and small
✅ Add error boundaries around risky code
✅ Use services for external integrations
✅ Document complex logic with comments

### DON'T:
❌ Mix UI and business logic in components
❌ Use inline styles (use Tailwind)
❌ Create new directories without planning
❌ Skip TypeScript type definitions
❌ Hardcode strings (use i18n)
❌ Duplicate utility functions
❌ Make direct Firebase SDK calls from components
❌ Add dependencies without discussing
❌ Break naming conventions
❌ Commit with failing builds

---

## Performance Considerations

### Current Issues

- **Bundle size:** Currently ~1.6MB (optimizing to < 500KB)
- **Image processing:** Synchronous, can freeze UI
- **No lazy loading:** All components loaded upfront

### Optimization Strategy

- Code splitting (React.lazy) for routes
- Web Workers for image processing
- IndexedDB for offline capability
- Service worker for caching
- Image compression before upload

---

## Security & Privacy

### Data Privacy

- **Local-first architecture** - Data stays on device
- **No user tracking** beyond analytics
- **Anonymous auth** - No email/password required
- **GDPR compliant** - Data export/deletion features

### API Security

- **HTTPS only** for all API calls
- **API key authentication** for backend
- **Rate limiting** on backend (Firebase Functions)
- **Input validation** on both client and server

---

## Testing Strategy

### Current State

⚠️ **No automated tests yet** - Critical gap, addressed in Phase 1 roadmap

### Planned Testing (Phase 1)

- **Unit tests:** Jest + React Testing Library for components/utils
- **Integration tests:** API, database, services
- **E2E tests:** Playwright or Detox for critical user flows
- **Target:** 60%+ code coverage

### Manual Testing

- **Real devices required:** Test on actual iOS and Android devices
- **Multiple OS versions:** iOS 14+, Android 10+
- **Screenshot mode:** Automated screenshot generation (`tools/screenshots/`)

---

## Common Pitfalls

### 1. Capacitor is NOT a Browser

❌ **Don't** test in-app purchases in browser (`npm run dev`)
✅ **Do** test on iOS/Android (`npx cap run ios`)

### 2. State-Based Routing (No React Router)

App uses view state switching, not URL-based routing:

```typescript
// App.tsx manages view state
type AppState = 'home' | 'camera' | 'loading' | 'result';
```

### 3. Image Processing is Expensive

- Always compress images before upload
- Show loading states during processing
- Consider Web Workers for heavy operations

### 4. Feature Flags Control UX

Don't hardcode business logic:

```typescript
// ✅ Good - Use Remote Config
const showPaywall = await getRemoteConfig('paid_only');

// ❌ Bad - Hardcoded
const showPaywall = true;
```

---

## Environment Variables

### Required for Development

```bash
# app/.env
VITE_API_URL=https://your-api-endpoint.com
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_REVENUECAT_API_KEY_IOS=your_ios_key
VITE_REVENUECAT_API_KEY_ANDROID=your_android_key
VITE_REVENUECAT_ENABLED=false  # Disable for development
```

**See [REVENUECAT_SETUP.md](./docs/REVENUECAT_SETUP.md) for complete configuration.**

---

## Quick Commands

```bash
# Development
npm run dev                    # Web development server (limited)
npx cap run ios                # Run on iOS simulator
npx cap run android            # Run on Android emulator

# Building
npm run build                  # Build web assets
npx cap sync                   # Sync with native projects
npx cap open ios               # Open in Xcode
npx cap open android           # Open in Android Studio

# Useful
npx cap update                 # Update Capacitor
npm update                     # Update npm packages
```

---

## Getting Help

### For AI Assistants

When stuck or need more context:

1. **Check app-specific docs:** [`app/docs/CLAUDE.md`](./app/docs/CLAUDE.md)
2. **Check architecture:** [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md)
3. **Check roadmap:** [`docs/planning/ROADMAP.md`](./docs/planning/ROADMAP.md)
4. **Read existing code:** Codebase has consistent patterns
5. **Ask clarifying questions:** Better to ask than assume

### For Humans

- **Documentation:** Check `/docs` and `/app/docs`
- **Issues:** Check the issue tracker
- **Common patterns:** Review existing code for examples

---

## Project Status

**Current Version:** 1.0 (Pre-Launch)
**Target Launch:** Q1 2025
**Active Development:** Yes
**Production Ready:** Mobile apps yes, backend yes, testing infrastructure in progress

### Recent Changes (November 2024)

- ✅ Restructured documentation
- ✅ Consolidated planning docs (ROADMAP.md, ONBOARDING.md)
- ✅ Created professional README.md
- ✅ Added root CLAUDE.md (this file)
- 🔨 Improving visual consistency
- 🔨 Setting up testing infrastructure

---

## This is a Solo Founder Project

**Remember:**
- High standards for code quality
- Every change matters (production app)
- User experience is paramount
- Ship fast, measure, iterate
- Ask questions when uncertain

---

**Last Updated:** November 2024
**Next Review:** After Phase 1 completion (testing & optimization)
