# Getting Started with cap2cal

This guide will help you set up the cap2cal development environment and get the project running locally.

## Prerequisites

### Required Software
- **Node.js** - v18+ ([Download](https://nodejs.org/))
- **npm** - v9+ (comes with Node.js)
- **Git** - Latest version ([Download](https://git-scm.com/))

### For iOS Development (Optional)
- **macOS** - Required for iOS development
- **Xcode** - Latest version from App Store
- **CocoaPods** - `sudo gem install cocoapods`
- **iOS Simulator** - Installed with Xcode

### For Android Development (Optional)
- **Android Studio** - Latest version ([Download](https://developer.android.com/studio))
- **Android SDK** - Installed via Android Studio
- **Java Development Kit (JDK)** - v11+

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/cap2cal.git
cd cap2cal
```

### 2. Install Dependencies

```bash
# Navigate to app directory
cd app

# Install npm packages
npm install
```

### 3. Configure Environment

Create a `.env` file in the `app/` directory:

```bash
# Copy example environment file
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# API Configuration
VITE_API_URL=https://your-api-endpoint.com

# Firebase Configuration (optional for local dev)
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_APP_ID=your_app_id
```

**Note**: For development, you can use mock data without Firebase configuration.

## Running the Application

### Web Development Mode

```bash
# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

**Hot Module Replacement (HMR)** is enabled - changes will reflect immediately.

### iOS Simulator

```bash
# Build and sync with iOS
npx cap sync ios

# Open in Xcode
npx cap open ios

# Or run directly
npx cap run ios
```

**First Time Setup**:
1. Xcode will open
2. Select a simulator (iPhone 15 Pro recommended)
3. Click the Play button or press `⌘R`

### Android Emulator

```bash
# Build and sync with Android
npx cap sync android

# Open in Android Studio
npx cap open android

# Or run directly
npx cap run android
```

**First Time Setup**:
1. Android Studio will open
2. Create an emulator if needed (Pixel 7 recommended)
3. Click Run button

## Project Structure Overview

```
cap2cal/
├── app/                    # Mobile app (React + Capacitor)
│   ├── src/               # Source code
│   ├── android/           # Android native project
│   ├── ios/               # iOS native project
│   ├── public/            # Static assets
│   └── docs/              # App-specific documentation
│
├── docs/                   # Project-wide documentation
│   ├── README.md          # Documentation index
│   ├── ARCHITECTURE.md    # System architecture
│   └── GETTING-STARTED.md # This file
│
└── README.md              # Project overview
```

See [app/docs/CLAUDE.md](../app/docs/CLAUDE.md) for detailed structure explanation.

## Development Workflow

### 1. Create a Feature Branch

```bash
git checkout -b feature/your-feature-name
```

### 2. Make Changes

- Edit files in `app/src/`
- Follow [code conventions](../app/docs/CLAUDE.md#naming-conventions--standards)
- Add TypeScript types for new code
- Update i18n strings if adding UI text

### 3. Test Your Changes

```bash
# Run in browser
npm run dev

# Test on iOS
npx cap run ios

# Test on Android
npx cap run android
```

### 4. Build for Production

```bash
# Build web assets
npm run build

# Sync with native platforms
npx cap sync

# Build iOS (in Xcode)
npx cap open ios
# Product → Archive

# Build Android (in Android Studio)
npx cap open android
# Build → Generate Signed Bundle/APK
```

## Common Tasks

### Adding a New Component

```typescript
// app/src/components/ui/MyButton.tsx
import { cn } from '../../utils';

interface MyButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

export const MyButton = ({ label, onClick, variant = 'primary' }: MyButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        'px-4 py-2 rounded',
        variant === 'primary' && 'bg-blue-500 text-white',
        variant === 'secondary' && 'bg-gray-500 text-white'
      )}
    >
      {label}
    </button>
  );
};
```

### Adding a Custom Hook

```typescript
// app/src/hooks/useMyHook.tsx
import { useState, useEffect } from 'react';

export const useMyHook = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    // Hook logic
  }, []);

  return { data };
};
```

### Adding Analytics Event

```typescript
// 1. Add event to analytics.service.ts
export enum AnalyticsEvent {
  MY_NEW_EVENT = 'my_new_event',
}

// 2. Use in component
const { logAnalyticsEvent } = useFirebaseContext();
logAnalyticsEvent(AnalyticsEvent.MY_NEW_EVENT, {
  param1: 'value',
});
```

### Adding Translation

```json
// app/src/assets/translations/en.json
{
  "myFeature": {
    "title": "My Feature",
    "description": "Feature description"
  }
}
```

```typescript
// In component
const { t } = useTranslation();
return <h1>{t('myFeature.title')}</h1>;
```

## Troubleshooting

### Node Modules Issues

```bash
# Clear and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Build Errors

```bash
# Clean build
rm -rf dist
npm run build
```

### iOS Build Fails

```bash
# Clean iOS build
cd ios/App
rm -rf Pods Podfile.lock
pod install
```

### Android Build Fails

```bash
# Clean Android build
cd android
./gradlew clean
```

### Port Already in Use

```bash
# Kill process on port 5173
lsof -ti:5173 | xargs kill -9

# Or use different port
npm run dev -- --port 3000
```

## Next Steps

Once you have the project running:

1. **Read the documentation**
   - [Architecture Overview](./ARCHITECTURE.md)
   - [App Development Guide](../app/docs/DEVELOPMENT.md)
   - [Component Reference](../app/docs/COMPONENTS.md)

2. **Explore the codebase**
   - Start with `app/src/pages/App.tsx`
   - Review the [project structure](../app/docs/CLAUDE.md#project-structure)
   - Understand [state management](../app/docs/STATE-MANAGEMENT.md)

3. **Make your first change**
   - Fix a small bug
   - Add a new UI component
   - Improve existing functionality

4. **Test on real devices** (recommended)
   - iOS: Connect iPhone and run from Xcode
   - Android: Connect Android device and run from Android Studio

## Getting Help

- **Documentation**: Check `/docs` and `/app/docs`
- **AI Assistant Context**: See [CLAUDE.md](../app/docs/CLAUDE.md)
- **Common Patterns**: Review existing code for examples
- **Issues**: Check the issue tracker

---

**Welcome to cap2cal development!** 🎉
