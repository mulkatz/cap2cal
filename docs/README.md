# Capture2Calendar (Cap2Cal)

**Never miss an event again!** Capture event posters or flyers with your camera and automatically add them to your favorite calendar application.

Capture2Calendar is a cross-platform mobile and web application that uses AI-powered vision processing to extract event details from photos and seamlessly integrate them into your calendar.

## Features

- **Smart Event Capture**: Take photos of event posters, flyers, or tickets
- **AI-Powered Extraction**: Automatically extracts event details including:
  - Title and description
  - Date and time (start and end)
  - Location and address
  - Event tags and categories
  - Ticket links and availability
- **Multi-Calendar Support**: Add events to:
  - Native device calendar (iOS/Android)
  - Google Calendar
  - Apple Calendar
  - Outlook
- **Event Management**:
  - Save and favorite events
  - View captured images
  - Share event details
  - Find ticket links
- **Cross-Platform**: Available as:
  - Progressive Web App (PWA)
  - Native iOS app
  - Native Android app
- **Internationalization**: Supports English and German with auto-detection

## Tech Stack

### Core Technologies
- **React 18.3** - UI framework
- **TypeScript 5.7** - Type-safe development
- **Vite 6.0** - Build tool and dev server
- **Capacitor 7.x** - Cross-platform native functionality

### UI & Styling
- **TailwindCSS 3.4** - Utility-first styling
- **React Router DOM 7.9** - Client-side routing
- **Embla Carousel** - Image gallery
- **React Modal Sheet** - Bottom sheet modals
- **React Hot Toast** - Toast notifications

### Data & Backend
- **Dexie** - IndexedDB wrapper for local storage
- **Firebase** - Analytics, Remote Config, and backend services
- **i18next** - Multi-language support
- **date-fns** - Date manipulation

### Mobile Features (Capacitor Plugins)
- Camera access
- Filesystem operations
- Native calendar integration
- Haptic feedback
- Native sharing

## Prerequisites

- **Node.js** (v18 or higher recommended)
- **npm** or **yarn**
- **Firebase project** (for backend services)
- **iOS development** (for iOS builds):
  - macOS
  - Xcode
  - CocoaPods
- **Android development** (for Android builds):
  - Android Studio
  - Android SDK

## Setup

### 1. Clone the repository

```bash
git clone <repository-url>
cd capture2calendar-web
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the root directory with your Firebase configuration:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### 4. Start development server

```bash
npm run dev
```

The application will be available at `http://localhost:9000`

## Development Workflow

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with hot module replacement |
| `npm run build` | Build for production (TypeScript + TailwindCSS + Vite) |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint code quality checks |
| `npm run format` | Format code with Prettier |
| `npm run update-dependencies` | Update npm packages |

## Building for Production

### Web (PWA)

```bash
npm run build
```

The built files will be in the `dist/` directory, ready for deployment to any static hosting service.

### Mobile Apps

#### iOS

1. Build the web app:
   ```bash
   npm run build
   ```

2. Sync with Capacitor:
   ```bash
   npx cap sync ios
   ```

3. Open in Xcode:
   ```bash
   npx cap open ios
   ```

4. Build and deploy from Xcode

#### Android

1. Build the web app:
   ```bash
   npm run build
   ```

2. Sync with Capacitor:
   ```bash
   npx cap sync android
   ```

3. Open in Android Studio:
   ```bash
   npx cap open android
   ```

4. Build and deploy from Android Studio

## Project Structure

```
/src
  ├── /api                    # API communication layer
  ├── /components             # React components
  │   ├── /buttons           # Button components
  │   ├── /carousel          # Carousel components
  │   ├── /dialogs           # Modal dialogs
  │   └── ...                # Other UI components
  ├── /contexts              # React context providers
  ├── /hooks                 # Custom React hooks
  ├── /layers                # Page/layout components
  ├── /models                # Data models and database
  ├── /helper                # Utility functions
  └── /assets                # Static assets
      ├── /icons             # SVG icons
      ├── /images            # Images
      ├── /meta              # PWA icons & splash screens
      └── /translations      # i18n files

/native
  ├── /ios                   # Native iOS project
  └── /android               # Native Android project

/dist                        # Production build output
```

## Configuration Files

- `capacitor.config.ts` - Capacitor configuration (App ID: `cx.franz.cap2cal`)
- `vite.config.ts` - Vite build configuration
- `tailwind.config.ts` - TailwindCSS configuration
- `manifest.json` - PWA manifest
- `firebase.json` - Firebase hosting configuration
- `tsconfig.json` - TypeScript configuration

## Backend APIs

The application communicates with two backend services:

1. **Image Analysis API**: `https://analyse4-u6pn2d2dsq-uc.a.run.app`
   - Analyzes captured images and extracts event data
   - Accepts base64 encoded images and language parameter

2. **Ticket Search API**: `https://findtickets-u6pn2d2dsq-uc.a.run.app`
   - Searches for ticket purchase links
   - Returns relevant ticket vendors

## Contributing

When contributing to this project:

1. Format your code: `npm run format`
2. Check for linting issues: `npm run lint`
3. Test on both web and mobile platforms if possible
4. Ensure TypeScript types are properly defined

## License

[Add your license information here]

## Contact

[Add contact information here]
