# Getting Started

## Prerequisites

- **Node.js 22+** — [nodejs.org](https://nodejs.org/)
- **iOS:** Xcode 15+ and CocoaPods (`sudo gem install cocoapods`)
- **Android:** Android Studio with Android SDK and JDK 17+

## Setup

```bash
git clone https://github.com/mulkatz/cap2cal.git
cd cap2cal
```

### Mobile App

```bash
cd app
npm install
cp .env.example .env   # fill in Firebase config + API URLs
```

**Web preview** (fastest way to develop):
```bash
npm run dev            # opens at http://localhost:5173
```

**Run on device:**
```bash
npm run build
npx cap run ios        # or: npx cap run android
```

### Backend

```bash
cd backend/functions
npm install
npm run serve          # starts Firebase emulator
```

For production deployment:
```bash
firebase deploy --only functions
```

### Landing Page

```bash
cd web
npm install
cp .env.example .env   # fill in Firebase + PostHog config
npm run dev
```

## Environment Variables

Each subproject has a `.env.example` file. Copy it to `.env` and fill in the values:

| Variable | Where | Description |
|----------|-------|-------------|
| `VITE_FIREBASE_*` | `app/.env` | Firebase project config |
| `VITE_ANALYSE_API_URL` | `app/.env` | URL of the `analyse` Cloud Function |
| `VITE_FIND_TICKETS_API_URL` | `app/.env` | URL of the `findTickets` Cloud Function |
| `VITE_FEATURE_FLAGS_API_URL` | `app/.env` | URL of the `featureFlags` Cloud Function |
| `VITE_REVENUECAT_*` | `app/.env` | RevenueCat API keys (optional, see [RevenueCat Setup](./REVENUECAT_SETUP.md)) |
| `VITE_FIREBASE_*` | `web/.env` | Firebase config for the landing page |
| `VITE_PUBLIC_POSTHOG_*` | `web/.env` | PostHog analytics config |

The backend uses [Firebase Secret Manager](https://firebase.google.com/docs/functions/config-env#secret-manager) instead of `.env` files. See `backend/functions/.env.example` for the required secrets and set them with:

```bash
firebase functions:secrets:set SECRET_NAME
```

## Building for Production

```bash
# Build web assets
cd app && npm run build

# Sync and open native projects
npx cap sync
npx cap open ios       # Archive in Xcode → Product → Archive
npx cap open android   # Build → Generate Signed Bundle/APK
```

## Troubleshooting

**iOS pod install fails:**
```bash
cd app/native/ios/App && rm -rf Pods Podfile.lock && pod install
```

**Android build fails:**
```bash
cd app/native/android && ./gradlew clean
```

**Port 5173 in use:**
```bash
npm run dev -- --port 3000
```

## Next Steps

- Read the [Architecture](./ARCHITECTURE.md) to understand the system design
- Check [CONTRIBUTING.md](../CONTRIBUTING.md) before submitting changes
- See [RevenueCat Setup](./REVENUECAT_SETUP.md) if you want to enable in-app purchases
