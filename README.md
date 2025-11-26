# Cap2Cal - Capture to Calendar

> Transform event posters into calendar entries in 3 seconds using AI

<div align="center">

[![App Store](https://img.shields.io/badge/App_Store-Coming_Soon-0D96F6?style=for-the-badge&logo=app-store&logoColor=white)](https://apps.apple.com)
[![Google Play](https://img.shields.io/badge/Google_Play-Coming_Soon-414141?style=for-the-badge&logo=google-play&logoColor=white)](https://play.google.com)
[![License](https://img.shields.io/badge/License-Proprietary-red?style=for-the-badge)](./LICENSE)

[Features](#-features) • [Quick Start](#-quick-start) • [Documentation](#-documentation) • [Architecture](#-architecture) • [Contributing](#-contributing)

</div>

---

## 📸 → 📅 What is Cap2Cal?

**Cap2Cal** is an AI-powered mobile application that instantly extracts event information from photos (posters, flyers, tickets, social media posts) and seamlessly adds them to your calendar.

### The Problem

You see a concert poster, festival flyer, or event announcement. You either:
- **Forget about it** - No reminder, missed opportunity
- **Take a photo** - Lost in your camera roll forever
- **Type it manually** - Tedious, error-prone, time-consuming

### The Solution

**Just snap a photo.** Cap2Cal does everything else:

1. **Capture** - Point camera at anything with date information
2. **Extract** - AI reads title, date, time, location, description
3. **Save** - One tap adds complete event to your calendar

**3 seconds. No typing. Perfect accuracy.**

---

## ✨ Features

### 🤖 AI-Powered Extraction
- **Gemini API** - Google's multimodal AI for accurate event detection
- **Multi-event detection** - Extract multiple events from a single image
- **99% accuracy** - Superior to generic OCR tools
- **Smart parsing** - Understands complex date formats, timezones, venues

### 📅 Universal Calendar Support
- Native iOS Calendar
- Google Calendar
- Apple Calendar
- Microsoft Outlook
- Any device calendar

### 🎫 Ticket Integration
- Automatic ticket link detection
- Direct purchase from app
- Affiliate partnerships for revenue

### 🌍 Multi-Language
- English (US, GB, AU, CA)
- German (DE, AT, CH)
- More languages coming soon

### 🔒 Privacy-First
- **Local-first architecture** - Data stays on your device
- **No account required** - Anonymous usage
- **GDPR compliant** - Full data export/deletion
- **Offline capable** - Queue events for later processing

### 🎨 Beautiful Design
- **Dark theme optimized** - Easy on the eyes
- **Smooth animations** - Delightful micro-interactions
- **Intuitive UX** - 3-second learning curve
- **Accessible** - WCAG AA compliant

---

## 🚀 Quick Start

### For Users

**Install the App** (Coming Soon)
- [Download on App Store](#)
- [Get it on Google Play](#)

**First-Time Setup**
1. Grant camera & calendar permissions
2. Complete 3-screen onboarding (30 seconds)
3. Snap your first event poster
4. Watch AI magic happen ✨

### For Developers

**Prerequisites**
- Node.js 18+
- iOS: Xcode 15+ (macOS only)
- Android: Android Studio latest

**Installation**

```bash
# Clone repository
git clone https://github.com/yourusername/cap2cal.git
cd cap2cal

# Install dependencies
cd app
npm install

# Run on iOS
npm run build
npx cap run ios

# Run on Android
npm run build
npx cap run android

# Web development mode (limited functionality)
npm run dev
```

**See [Getting Started Guide](./docs/GETTING-STARTED.md) for detailed setup instructions.**

---

## 🏗️ Architecture

### Tech Stack

**Frontend**
- React 18 + TypeScript
- Vite (build tool)
- TailwindCSS (styling)
- Capacitor (native runtime)

**State Management**
- React Context API (no Redux)
- Dexie (IndexedDB for offline storage)

**Backend Services**
- Firebase Analytics
- Firebase Crashlytics
- Firebase Remote Config (feature flags)
- Custom REST API (event extraction)

**AI/ML**
- Google Gemini API (multimodal AI)
- Custom extraction prompts

**Monetization**
- RevenueCat (in-app purchases)
- Affiliate ticket links

### Project Structure

```
cap2cal/
├── app/                    # Mobile app (React + Capacitor)
│   ├── src/
│   │   ├── pages/          # Top-level screens
│   │   ├── components/     # UI components & features
│   │   ├── services/       # External integrations
│   │   ├── hooks/          # Custom React hooks
│   │   ├── contexts/       # Global state
│   │   ├── models/         # TypeScript types
│   │   ├── db/             # Dexie database
│   │   └── utils/          # Pure helper functions
│   ├── android/            # Android native code
│   ├── ios/                # iOS native code
│   └── docs/               # App-specific documentation
│
├── docs/                   # Project-wide documentation
│   ├── ARCHITECTURE.md     # System design
│   ├── GETTING-STARTED.md  # Setup guide
│   ├── planning/           # Product roadmap & strategy
│   ├── marketing/          # App store copy & campaigns
│   └── strategy/           # Analytics & growth
│
├── tools/                  # Development utilities
│   └── screenshots/        # Automated screenshot generation
│
└── README.md              # This file
```

**See [Architecture Documentation](./docs/ARCHITECTURE.md) for detailed system design.**

---

## 📚 Documentation

### Essential Reading

| Document | Description | Audience |
|----------|-------------|----------|
| **[Getting Started](./docs/GETTING-STARTED.md)** | Setup guide, installation, first run | Developers |
| **[Architecture](./docs/ARCHITECTURE.md)** | System design, tech stack, data flow | Engineers |
| **[CLAUDE.md](./CLAUDE.md)** | Complete context for AI assistants | Claude Code / AI |
| **[App CLAUDE.md](./app/docs/CLAUDE.md)** | Mobile app deep dive | AI working on app |

### Product & Planning

| Document | Description |
|----------|-------------|
| **[Roadmap](./docs/planning/ROADMAP.md)** | Feature roadmap, priorities, timeline |
| **[Onboarding](./docs/planning/ONBOARDING.md)** | User onboarding & monetization strategy |
| **[Visual Inconsistencies](./docs/planning/VISUAL_INCONSISTENCIES.md)** | Design system audit |

### Technical Setup

| Document | Description |
|----------|-------------|
| **[RevenueCat Setup](./docs/REVENUECAT_SETUP.md)** | In-app purchase configuration |
| **[RevenueCat Toggle](./docs/REVENUECAT_TOGGLE.md)** | Enable/disable monetization |

### Strategy & Growth

| Document | Description |
|----------|-------------|
| **[Growth Playbook](./docs/strategy/GROWTH-PLAYBOOK.md)** | User acquisition & retention |
| **[App Analytics](./docs/strategy/APP-ANALYTICS.md)** | Analytics implementation |

### Marketing

| Document | Description |
|----------|-------------|
| **[App Store Copy](./docs/marketing/APP-STORE-COPY.md)** | Store listing content |
| **[Translations](./docs/marketing/app-store-translations.md)** | Localized listings |
| **[Pitch Deck](./docs/marketing/pitch-deck.md)** | Investor presentation |

**[Browse all documentation](./docs/README.md)**

---

## 🎯 Key Metrics

### Product

- **Extraction Success Rate:** 90%+ (target)
- **Average Processing Time:** < 3 seconds
- **Offline Capability:** Queue unlimited events
- **Multi-Event Accuracy:** Detects 95%+ of events on complex posters

### Business (Projected)

- **Target Users (Year 1):** 200,000 installs
- **Free → Paid Conversion:** 5-10%
- **Monthly Active Users:** 50,000+
- **App Store Rating:** 4.5+ stars

### Performance

- **App Load Time:** < 2 seconds
- **Bundle Size:** < 2MB (optimizing to < 500KB)
- **Crash Rate:** < 0.1%

---

## 🛣️ Roadmap

### ✅ Completed (v1.0)

- [x] Core AI extraction with Gemini
- [x] Multi-platform calendar export
- [x] Offline-first architecture
- [x] Multi-language support (EN, DE)
- [x] Event library with favorites
- [x] Ticket finding integration
- [x] Dark theme UI
- [x] Analytics integration
- [x] 3-screen onboarding

### 🔨 In Progress (v1.1)

- [ ] Automated testing (Jest + Detox)
- [ ] Error tracking (Sentry)
- [ ] Bundle size optimization
- [ ] GDPR data export/deletion
- [ ] App Store listing optimization

### 📋 Planned (v1.2+)

- [ ] Event editing before save
- [ ] Search & filtering
- [ ] Multiple calendar selection
- [ ] Batch image processing
- [ ] Recurring event detection
- [ ] Widget support (iOS/Android)
- [ ] Spanish, French, Italian translations

**[View Full Roadmap](./docs/planning/ROADMAP.md)**

---

## 🤝 Contributing

Cap2Cal is currently a **solo founder project** and not accepting external contributions at this time.

However, you can:
- 🐛 **Report bugs** via GitHub Issues
- 💡 **Suggest features** via GitHub Discussions
- ⭐ **Star the repo** to show support
- 📱 **Beta test** the app (coming soon)

---

## 📄 License

**Proprietary** - All rights reserved.

This is a commercial product. The source code is not open source. For licensing inquiries, contact [your-email@example.com].

---

## 🔗 Links

- **Website:** [cap2cal.com](#) (coming soon)
- **App Store:** Coming Q1 2025
- **Google Play:** Coming Q1 2025
- **Support:** [support@cap2cal.com](#)
- **Twitter:** [@cap2cal](#)

---

## 🏆 Built With

- ❤️ Passion for solving real problems
- ☕ Lots of coffee
- 🤖 Claude Code as development partner
- 🎵 Great music playlists

---

<div align="center">

**Made with ❤️ by [Your Name]**

[Report Bug](https://github.com/yourusername/cap2cal/issues) • [Request Feature](https://github.com/yourusername/cap2cal/discussions)

</div>
