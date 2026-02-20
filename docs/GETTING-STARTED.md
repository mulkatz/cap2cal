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
| `VITE_API_URL` | `app/.env` | Backend API URL |
| `VITE_FIREBASE_*` | `app/.env` | Firebase project config |
| `VITE_REVENUECAT_*` | `app/.env` | RevenueCat API keys (optional) |

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
