# cap2cal - Capture to Calendar

## Project Overview

**cap2cal** is a production-ready mobile application that uses AI-powered image recognition to extract event information from photos (posters, tickets, flyers) and seamlessly export them to users' calendars. Built with React and Capacitor, it delivers a native mobile experience on iOS and Android.

### Core Value Proposition
Users can capture an event poster with their camera, and the app automatically extracts:
- Event title and description
- Date and time (start/end)
- Location details
- Ticket links and availability
- Tags and categorization

The processed event can then be exported to Google Calendar, Apple Calendar, Outlook, or shared via native share functionality.

---

## Tech Stack

### Frontend Framework
- **React 18** - Functional components with hooks
- **TypeScript/TSX** - Strict type safety throughout
- **Vite** - Modern build tool with fast HMR
- **TailwindCSS** - Utility-first styling with custom design system

### Mobile Platform
- **Capacitor** - Cross-platform native runtime (iOS/Android/Web)
- Native plugins: Camera, Calendar, Filesystem, Share, Screen Orientation, Haptics

### State Management
- **React Context API** - Global state (no Redux/Zustand)
  - `AppContext` - Application state and navigation
  - `DialogContext` - Modal/dialog stack management
  - `FirebaseContext` - Analytics, feature flags, remote config
  - `EffectsContext` - Visual effects coordination

### Data Layer
- **Dexie** - IndexedDB wrapper for offline-first local storage
- **Firebase** - Backend services (Analytics, Crashlytics, Remote Config)
- Custom REST API - Event extraction service (AI/OCR backend)

### Internationalization & UX
- **i18next** - Multi-language support
- **react-hot-toast** - Toast notifications
- **lucide-react** - Icon system
- **react-modal-sheet** - Bottom sheet components

---

## Project Structure

```
app/src/
├── pages/                           # Top-level screen components
│   ├── App.tsx                     # Root orchestrator with view state management
│   ├── HomeView.tsx                # Main landing screen
│   ├── CameraView.tsx              # Camera capture interface
│   ├── ResultView.tsx              # Event extraction results
│   ├── SettingsScreen.tsx          # App settings
│   └── EventHistoryScreen.tsx      # Saved events history
│
├── components/
│   ├── ui/                         # Atomic, reusable UI elements (design system)
│   │   ├── buttons/                # CTAButton, IconButton, MiniButton, CloseButton
│   │   ├── Dialog.tsx              # Base dialog component
│   │   ├── Backdrop.tsx            # Overlay backdrop
│   │   ├── LoaderAnimation.tsx     # Loading spinner
│   │   ├── ImagePreview.tsx        # Image display with controls
│   │   ├── ToastProvider.tsx       # Toast notification provider
│   │   └── ErrorBoundary.tsx       # React error boundary
│   │
│   └── features/                   # Business logic components
│       ├── cards/                  # Event card components
│       │   ├── EventCard.tsx       # Single event display
│       │   ├── CardGroup.tsx       # Card container with styling
│       │   └── CardController.tsx  # Card with actions (export, delete, etc.)
│       ├── dialogs/                # Feature-specific dialogs
│       │   ├── PaywallSheet.tsx    # Premium upsell
│       │   ├── FeedbackDialog.tsx  # User feedback form
│       │   ├── PermissionDenied.tsx # Permission request
│       │   ├── ExportChooser.tsx   # Calendar export options
│       │   └── [8 more dialogs]
│       ├── modals/                 # Premium and upgrade modals
│       ├── onboarding/             # First-time user experience
│       ├── results/                # Event extraction result displays
│       ├── BenefitsList.tsx        # Premium features list
│       └── TicketButton.tsx        # Ticket search/purchase CTA
│
├── services/                        # External integrations & business logic
│   ├── api.ts                      # Backend API communication (event extraction)
│   ├── analytics.service.ts        # Firebase Analytics wrapper
│   ├── calendar.service.ts         # Calendar export logic (Google/Apple/Outlook)
│   └── purchases.service.ts        # In-app purchase management
│
├── hooks/                           # Custom React hooks
│   ├── useCapture.tsx              # Image capture orchestration
│   ├── useCalendarExport.tsx       # Calendar export flow
│   ├── useCrashlytics.tsx          # Crash reporting integration
│   ├── usePermissions.tsx          # Native permissions handling
│   ├── usePremiumModals.tsx        # Premium feature gating
│   ├── useShare.tsx                # Native share functionality
│   └── [3 more hooks]
│
├── contexts/                        # React Context providers
│   ├── AppContext.tsx              # App state: view, result data, navigation
│   ├── DialogContext.tsx           # Dialog stack with back handler management
│   ├── EffectsContext.tsx          # Visual effects (splash, animations)
│   └── FirebaseContext.tsx         # Analytics, feature flags, remote config
│
├── models/                          # TypeScript type definitions
│   ├── api.types.ts                # API request/response types
│   ├── CaptureEvent.ts             # Event domain model
│   └── mocks.ts                    # Mock data for development
│
├── db/                              # Database layer
│   └── db.ts                       # Dexie configuration & schema
│
├── utils/                           # Pure helper functions
│   ├── dateTime.ts                 # Date/time formatting
│   ├── imageProcessing.ts          # Image manipulation
│   ├── platform.ts                 # Platform detection
│   ├── logger.ts                   # Logging utility
│   ├── errorHandler.ts             # Error processing
│   ├── reviewPrompt.ts             # App review logic
│   ├── captureLimit.ts             # Free tier limits
│   ├── dataManagement.ts           # Local data operations
│   ├── i18n.ts                     # i18next configuration
│   └── [5 more utilities]
│
├── assets/                          # Static resources
│   ├── icons/                      # Custom SVG icons
│   ├── images/                     # Example images, screenshots
│   ├── translations/               # i18n language files
│   └── meta/                       # App metadata
│
└── types/                           # Global TypeScript declarations
    ├── dev.d.ts                    # Development type augmentations
    └── vite-env.d.ts               # Vite environment types
```

---

## Architecture & Design Patterns

### View State Management (Not Router-Based)
The app uses **state-based view switching** rather than React Router. `App.tsx` manages the current view:

```typescript
type AppState = 'home' | 'camera' | 'loading' | 'result';
```

Views are conditionally rendered based on this state, with smooth animations between transitions.

### State Management Philosophy
- **Local State First** - `useState` for component-local state
- **Context for Global** - Contexts for truly global concerns (auth, dialogs, analytics)
- **No Redux/Zustand** - Deliberately kept simple with Context API
- **Server State** - Firebase for remote config/feature flags

### Component Architecture

#### UI Components (`components/ui/`)
- **Atomic** - Single responsibility, highly reusable
- **Presentational** - No business logic, only props
- **Styled** - TailwindCSS with `cn()` utility for conditional classes
- **Example**: `CTAButton`, `Dialog`, `Backdrop`

#### Feature Components (`components/features/`)
- **Smart** - Contains business logic and state
- **Domain-specific** - Tied to app features (events, premium, onboarding)
- **Composed** - Built from UI components
- **Example**: `EventCard`, `PaywallSheet`, `Onboarding`

### Service Layer Pattern
Services encapsulate external integrations and keep components clean:

```typescript
// ✅ Good - Component uses service
const { logAnalyticsEvent } = useFirebaseContext();
logAnalyticsEvent(AnalyticsEvent.CAPTURE_STARTED);

// ❌ Bad - Direct Firebase SDK calls in components
firebase.analytics().logEvent('capture_started');
```

### Custom Hooks Pattern
Complex logic is extracted into custom hooks:
- `useCapture` - Orchestrates camera, permissions, image processing, API calls
- `useCalendarExport` - Manages calendar export flow with permission handling
- `usePremiumModals` - Centralized premium feature gating

### Dialog Management
Uses a **stack-based dialog system** with back button handling:

```typescript
const dialogs = useDialogContext();

// Push dialog onto stack
dialogs.push(<MyDialog onClose={dialogs.pop} />);

// Register hardware back button handler
dialogs.registerBackHandler('myDialog', () => {
  dialogs.pop();
  return true; // handled
});
```

---

## Naming Conventions & Standards

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
- **No default exports** (except legacy components) - Use named exports for better refactoring
- **Explicit types** - No implicit `any`, always define types
- **Functional components** - No class components
- **Hooks for logic** - Extract reusable logic into custom hooks
- **Services for I/O** - Keep components pure, move side effects to services

### Import Organization
```typescript
// 1. External dependencies
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

// 2. Capacitor plugins
import { Camera } from '@capacitor/camera';

// 3. Internal - absolute imports from src/
import { useAppContext } from '../contexts/AppContext';
import { EventCard } from '../components/features/cards/EventCard';
import { db } from '../db/db';

// 4. Assets
import { IconCamera } from '../assets/icons';
```

---

## Key Workflows

### 1. Image Capture → Event Extraction Flow

```
User taps capture
  ↓
CameraView (pages/CameraView.tsx)
  ↓
useCapture hook checks:
  - Permissions (usePermissions)
  - Capture limit (captureLimit.ts)
  - If limit reached → show PaywallSheet
  ↓
Capture image (Capacitor Camera API)
  ↓
Process image (imageProcessing.ts)
  ↓
Send to API (services/api.ts)
  ↓
setState('loading') - show LoadingDialog
  ↓
API returns event data
  ↓
Save to DB (db/db.ts - Dexie)
  ↓
setState('result') - show ResultView
  ↓
User exports to calendar (calendar.service.ts)
```

### 2. Calendar Export Flow

```
User clicks "Add to Calendar"
  ↓
CardController.tsx
  ↓
Check platform (platform.ts)
  ↓
If mobile: useCalendarExport
  ├─ Check permissions
  ├─ Request if needed
  └─ Use Capacitor Calendar plugin
  ↓
If web: ExportChooser dialog
  ├─ Generate .ics file OR
  └─ Create calendar links (Google/Outlook)
```

### 3. Premium Feature Gating

```
User tries premium feature
  ↓
usePremiumModals hook
  ↓
Check subscription status (purchases.service.ts)
  ↓
If not premium → show PaywallSheet
  ↓
User initiates purchase
  ↓
Track with Analytics
  ↓
Update subscription state
```

---

## Development Guidelines

### When Adding New Features

1. **Create types first** in `models/` - Define your data shape
2. **Add service if needed** in `services/` - External integration layer
3. **Create custom hook** in `hooks/` - Reusable logic
4. **Build UI components** in `components/ui/` - Atomic elements
5. **Compose feature component** in `components/features/` - Business logic
6. **Add analytics events** in `services/analytics.service.ts`
7. **Update i18n strings** in `assets/translations/`

### Code Quality Standards

```typescript
// ✅ Good - Type-safe, clear intent
interface CaptureOptions {
  quality: number;
  allowEditing: boolean;
}

const captureImage = async (options: CaptureOptions): Promise<string> => {
  // Implementation
};

// ❌ Bad - Implicit types, unclear
const captureImage = async (quality, editing) => {
  // Implementation
};
```

### Testing Approach
- **Manual QA** on real devices (iOS/Android)
- **Screenshot mode** for automated screenshot generation
- **Feature flags** for gradual rollouts
- **Error boundaries** for crash isolation
- **Crashlytics** for production error tracking

### Performance Considerations
- **Lazy loading** - Code splitting with React.lazy (not heavily used yet)
- **Image optimization** - Compress before upload
- **Offline-first** - Dexie for local storage
- **Analytics batching** - Firebase handles automatically
- **Memoization** - React.memo on expensive components

---

## Design System

### Color Palette
Defined in `all.css` with CSS variables and Tailwind extensions:
- **Primary**: Highlight color for CTAs
- **Background**: Black (`#000`) for dark theme
- **Text**: White with opacity variations
- **Accent**: Dynamic based on theme

### Typography
- System fonts for native feel
- Tailwind utility classes for sizing
- i18next for all user-facing text

### Spacing & Layout
- **Safe areas** - Capacitor safe area handling
- **dvh units** - Dynamic viewport height
- **Flexbox** - Primary layout method
- **Grid** - For card layouts

### Animations
- **Fade transitions** - `animate-fadeIn` class
- **Slide sheets** - `react-modal-sheet`
- **Haptic feedback** - Capacitor Haptics on interactions
- **Page transitions** - State-based view switching

---

## Firebase Integration

### Analytics Events
Centralized in `services/analytics.service.ts`:

```typescript
export enum AnalyticsEvent {
  APP_OPENED = 'app_opened',
  CAMERA_OPENED = 'camera_opened',
  IMAGE_CAPTURED = 'image_captured',
  CAPTURE_SUCCESS = 'capture_success',
  EXPORT_CALENDAR = 'export_calendar',
  PREMIUM_UPGRADE = 'premium_upgrade',
  // ... 30+ more events
}
```

### Feature Flags
Remote config for gradual rollouts:
- `in_app_rating` - Enable/disable review prompts
- Capture limits for free users
- Feature availability toggles

### Crashlytics
Automatic crash reporting with:
- Custom logging (`logger.ts`)
- Error boundaries in React
- Hook-based integration (`useCrashlytics`)

---

## Capacitor Plugins & Native Features

### Camera
- Custom camera interface (not native picker)
- Real-time preview with HTML5 video
- Base64 image capture
- Permission handling

### Calendar
- Native calendar integration
- Create events programmatically
- Permission scopes (read/write)
- Platform-specific handling

### Share
- Native share sheet
- Share event details
- Export .ics files
- Platform-aware

### Filesystem
- Temporary file storage
- Image caching
- .ics file generation

### Screen Orientation
- Lock to portrait mode
- Prevent landscape rotation

### Haptics
- Tap feedback
- Success/error vibrations
- Platform-aware (iOS/Android)

---

## Internationalization

### Supported Languages
Configuration in `utils/i18n.ts`:
- English (default)
- Additional languages in `assets/translations/`

### Usage Pattern
```typescript
const { t } = useTranslation();

return (
  <button>{t('capture.button')}</button>
);
```

### Best Practices
- All user-facing text via i18n
- Keys organized by feature
- Interpolation for dynamic content

---

## Premium/Subscription Model

### Free Tier Limits
- Capture limit (configurable via feature flags)
- Tracked in `utils/captureLimit.ts`
- Local storage counter
- Reset logic

### Premium Features
- Unlimited captures
- Priority support
- Advanced export options
- Ticket search integration

### Paywall Strategy
- Non-intrusive (after limit reached)
- Value-focused messaging
- `PaywallSheet` component
- Analytics tracking

---

## Error Handling Philosophy

### Graceful Degradation
```typescript
try {
  await riskyOperation();
} catch (error) {
  logger.error('Context', 'Description', error);
  // Show user-friendly message
  // Fallback to alternative flow
  // Track in Crashlytics
}
```

### User Feedback
- Toast notifications for transient errors
- Dialog for critical errors
- `ErrorBoundary` for React errors
- Offline indicators

### Logging Strategy
- Development: Console logs
- Production: Crashlytics only
- Custom logger wrapper
- Context-aware messages

---

## Common Patterns You'll See

### Conditional Rendering with cn()
```typescript
import { cn } from '../utils';

<div className={cn(
  'base-class',
  isActive && 'active-class',
  isPremium ? 'premium-style' : 'free-style'
)} />
```

### Dialog Pattern
```typescript
const dialogs = useDialogContext();

const showConfirmation = () => {
  dialogs.push(
    <Dialog onClose={dialogs.pop}>
      <Card>
        {/* Dialog content */}
      </Card>
    </Dialog>
  );
};
```

### Platform Detection
```typescript
import { Capacitor } from '@capacitor/core';

const platform = Capacitor.getPlatform(); // 'ios' | 'android' | 'web'
const isNative = Capacitor.isNativePlatform();
```

### Safe Area Handling
```typescript
// Tailwind utility classes
<div className="bottom-safe-offset-0" />
<div className="top-safe-offset-0" />
```

---

## When Working on This Codebase

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

## Technical Debt & Future Improvements

### Known Limitations
- No comprehensive test suite (manual QA only)
- Some legacy default exports remain
- Image processing could be optimized further
- Offline sync strategy could be more robust

### Potential Enhancements
- Add unit tests (Jest/Vitest)
- Implement end-to-end tests (Playwright)
- Add Sentry for better error tracking
- Optimize bundle size (code splitting)
- Add progressive web app features
- Implement background sync

---

## Quick Reference

### Most Important Files
- `pages/App.tsx` - Application orchestrator
- `hooks/useCapture.tsx` - Core capture logic
- `services/api.ts` - Backend integration
- `db/db.ts` - Database schema
- `contexts/AppContext.tsx` - Global state

### Most Used Utilities
- `cn()` - Conditional class names
- `logger` - Logging
- `platform.ts` - Platform detection
- `dateTime.ts` - Date formatting

### Analytics Events to Know
- `APP_OPENED` - App launch
- `IMAGE_CAPTURED` - Photo taken
- `CAPTURE_SUCCESS` - Event extracted
- `EXPORT_CALENDAR` - Calendar export
- `PREMIUM_UPGRADE` - Subscription purchase

---

## Getting Help

This is a **solo founder project** with high standards for code quality. When in doubt:
1. Check existing patterns in the codebase
2. Follow the conventions in this document
3. Keep it simple and maintainable
4. Prioritize user experience
5. Test on real devices

**Remember**: This is a production app serving real users. Every change matters.
