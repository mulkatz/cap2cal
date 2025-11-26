# cap2cal System Architecture

## Overview

cap2cal is a mobile-first application ecosystem for capturing and managing event information through AI-powered image recognition.

## System Components

```
┌─────────────────────────────────────────────────────────────┐
│                        cap2cal System                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐         ┌──────────────┐                 │
│  │ Mobile App   │◄───────►│ Backend API  │                 │
│  │ (React +     │   HTTPS │ (AI/OCR)     │                 │
│  │  Capacitor)  │         └──────────────┘                 │
│  └──────────────┘               │                           │
│         │                       │                           │
│         │                       ▼                           │
│         │              ┌──────────────┐                    │
│         │              │   Firebase   │                    │
│         └─────────────►│  - Analytics │                    │
│                        │  - Crashlytics│                   │
│                        │  - RemoteConfig│                  │
│                        └──────────────┘                    │
│                                                              │
│  ┌──────────────┐         ┌──────────────┐                 │
│  │ Web Admin    │         │  Calendar    │                 │
│  │ (Future)     │         │  Services    │                 │
│  └──────────────┘         │  (Google/    │                 │
│                           │   Apple/     │                 │
│                           │   Outlook)   │                 │
│                           └──────────────┘                 │
└─────────────────────────────────────────────────────────────┘
```

## Mobile App Architecture

### Technology Stack

#### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **TailwindCSS** - Styling

#### Mobile Runtime
- **Capacitor** - Native bridge
- iOS deployment (App Store)
- Android deployment (Play Store)
- Web fallback (PWA)

#### State Management
- **React Context API** - Global state
- **Dexie** - Local database (IndexedDB)
- **Firebase Remote Config** - Feature flags

#### Backend Services
- Custom REST API - Event extraction (AI/OCR)
- Firebase Analytics - Usage tracking
- Firebase Crashlytics - Error monitoring
- Calendar APIs - Event export

### Application Layers

```
┌─────────────────────────────────────┐
│         Presentation Layer          │
│  (Pages, Components, UI)            │
├─────────────────────────────────────┤
│         Business Logic Layer        │
│  (Hooks, Contexts, Feature Logic)   │
├─────────────────────────────────────┤
│         Service Layer               │
│  (API, Analytics, Calendar, etc.)   │
├─────────────────────────────────────┤
│         Data Layer                  │
│  (Dexie DB, Local Storage)          │
├─────────────────────────────────────┤
│         Platform Layer              │
│  (Capacitor Native Plugins)         │
└─────────────────────────────────────┘
```

### Data Flow

#### Image Capture Flow
```
User Action (Camera Button)
  ↓
Permission Check (Capacitor Camera)
  ↓
Capture Limit Check (Free/Premium)
  ↓ (if exceeded)
Paywall Display
  ↓ (if allowed)
Camera UI (CameraView)
  ↓
Image Capture (Base64)
  ↓
Image Processing (Compression)
  ↓
API Request (Backend)
  ↓
Loading State (LoadingDialog)
  ↓
Response Parsing
  ↓
Save to DB (Dexie)
  ↓
Display Result (ResultView)
  ↓
Analytics Event (Firebase)
```

#### Calendar Export Flow
```
User Action (Export Button)
  ↓
Platform Detection
  ├─ Mobile: Capacitor Calendar Plugin
  │   ↓
  │   Permission Request
  │   ↓
  │   Native Calendar Integration
  │
  └─ Web: Calendar Link Generation
      ├─ Google Calendar URL
      ├─ Apple iCal (.ics download)
      └─ Outlook URL
```

### State Management Strategy

#### Local Component State
- `useState` for component-specific state
- `useRef` for DOM references and mutable values
- `useCallback` / `useMemo` for optimization

#### Global Application State
- **AppContext** - Current view, result data, navigation
- **DialogContext** - Modal stack, back button handling
- **FirebaseContext** - Analytics, feature flags, remote config
- **EffectsContext** - Visual effects coordination

#### Persistent State
- **Dexie (IndexedDB)** - Event history, images
- **LocalStorage** - Settings, onboarding status, capture limits
- **Firebase Remote Config** - Feature flags (server-controlled)

### Security Considerations

#### Data Privacy
- Local-first architecture
- Images processed client-side before upload
- No user tracking beyond analytics
- GDPR compliant

#### API Security
- HTTPS only
- API key authentication
- Rate limiting on backend
- Input validation

#### Native Platform Security
- Sandboxed app storage
- Secure Capacitor plugin communication
- Permission-based access to camera/calendar
- Certificate pinning (future)

## Backend API

### Event Extraction Service

**Endpoint**: `POST /extract`

**Request**:
```json
{
  "i18n": "en",
  "image": "base64_encoded_image"
}
```

**Response Success**:
```json
{
  "status": "success",
  "data": {
    "id": "uuid",
    "title": "Event Name",
    "dateTimeFrom": {
      "date": "2024-03-15",
      "time": "19:00"
    },
    "location": {
      "city": "Berlin",
      "address": "Alexanderplatz 1"
    },
    "description": {
      "short": "Brief description",
      "long": "Full details..."
    },
    "tags": ["music", "concert"],
    "ticketDirectLink": "https://...",
    "ticketAvailableProbability": 0.85
  }
}
```

**Response Error**:
```json
{
  "status": "error",
  "data": {
    "reason": "PROBABLY_NOT_AN_EVENT"
  }
}
```

### Ticket Search Service

**Endpoint**: `POST /tickets/find`

**Request**:
```json
{
  "query": "Event name + location"
}
```

**Response**:
```json
{
  "ticketLinks": [
    "https://ticketmaster.com/...",
    "https://eventbrite.com/..."
  ]
}
```

## Firebase Integration

### Analytics
- User behavior tracking
- Feature usage metrics
- Conversion funnels
- Error tracking

### Crashlytics
- Crash reporting
- Non-fatal errors
- Custom logging
- User context

### Remote Config
- Feature flags
- A/B testing
- Gradual rollouts
- Emergency kill switches

## Deployment Architecture

### Mobile App Distribution

#### iOS
- Xcode build
- App Store Connect
- TestFlight for beta
- App Store distribution

#### Android
- Android Studio build
- Google Play Console
- Internal testing track
- Production release

### Web Deployment
- Vite production build
- Static hosting (Vercel/Netlify)
- PWA capabilities
- Service worker caching

## Performance Considerations

### Optimization Strategies
- Code splitting (React.lazy)
- Image compression before upload
- IndexedDB for offline capability
- Service worker for caching
- Lazy loading of heavy components

### Monitoring
- Firebase Performance Monitoring
- Analytics for user flows
- Crashlytics for errors
- Custom logging

## Scalability

### Current Limitations
- Client-side image processing
- API rate limits
- Free tier capture limits

### Future Improvements
- CDN for static assets
- GraphQL for flexible data fetching
- WebSocket for real-time features
- Microservices architecture
- Serverless functions

## Technology Decisions

### Why React + Capacitor?
- Single codebase for iOS/Android/Web
- Native performance
- Access to platform APIs
- Web technology expertise
- Faster iteration

### Why Context API (not Redux)?
- Simpler mental model
- Less boilerplate
- Sufficient for app complexity
- Better TypeScript support
- Easier to maintain

### Why Dexie (IndexedDB)?
- Offline-first capability
- Better than localStorage
- Query capabilities
- Reactivity with hooks
- Cross-browser support

### Why Firebase?
- Quick setup
- Real-time capabilities
- Analytics out of the box
- Crash reporting
- Remote config for flags

---

## Future Architecture Considerations

### Potential Additions
- GraphQL API layer
- Real-time collaboration
- Social features
- Advanced analytics dashboard
- Machine learning improvements
- Multi-language NLP

### Migration Paths
- Monorepo with Nx/Turborepo
- Microservices if scaling needed
- Separate admin web app
- API versioning strategy
