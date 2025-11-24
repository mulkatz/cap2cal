# Cap2Cal Screenshot Generator

Automated screenshot generation for App Store and Google Play listings in multiple languages.

## Overview

This tool uses Puppeteer to automatically generate consistent app screenshots across all supported languages. It handles:
- Language-specific UI content
- Localized test data
- Consistent viewport/device sizing
- Automated navigation flows

## Prerequisites

1. **Node.js** v18 or higher
2. **Running dev server** - Your Cap2Cal app must be running on `http://localhost:5173` (or specify custom URL)

## Installation

```bash
cd screenshots
npm install
```

## Usage

### Generate screenshots for all languages

```bash
npm run screenshots:all
```

This will generate screenshots for all configured languages (currently: en-GB, de-DE).

### Generate screenshots for a specific language

```bash
# English
npm run screenshots:en

# German
npm run screenshots:de
```

### Custom options

```bash
# Specify custom app URL
node scripts/generate-screenshots.js --lang=en-GB --url=http://localhost:3000

# Use different language
node scripts/generate-screenshots.js --lang=de-DE
```

## Workflow

1. **Start your dev server** (in the main app directory):
   ```bash
   cd ../app
   npm run dev
   ```

2. **Run the screenshot generator** (in this directory):
   ```bash
   npm run screenshots:all
   ```

3. **Find your screenshots** in `output/<language>/`:
   - `01_onboarding_value_prop.png` - Value proposition screen
   - `02_onboarding_how_it_works.png` - How it works screen
   - `03_onboarding_permissions.png` - Permissions screen
   - `04_home_screen.png` - Main home screen
   - `05_event_list.png` - Event list view
   - `06_event_detail.png` - Event detail view
   - `07_capture_loading.png` - Photo capture loading state
   - `08_capture_result.png` - Event extraction result
   - `09_settings.png` - Settings screen

## Configuration

### Viewport Settings

Edit `scripts/generate-screenshots.js` to customize:

```javascript
const CONFIG = {
  appUrl: 'http://localhost:5173',
  viewport: {
    width: 1290,  // iPhone 15 Pro Max
    height: 2796,
    deviceScaleFactor: 3,
  },
  screenshotDelay: 1000,
  navigationDelay: 800,
};
```

### Device Presets

Common device sizes (all at 3x scale factor):

| Device | Width | Height |
|--------|-------|--------|
| iPhone 15 Pro Max | 1290 | 2796 |
| iPhone 15 Pro | 1179 | 2556 |
| iPhone 15 | 1170 | 2532 |
| iPad Pro 12.9" | 2048 | 2732 |

### Adding New Languages

1. **Add translations** to `data/events.js`:
   ```javascript
   export const events = {
     'en-GB': [...],
     'de-DE': [...],
     'fr-FR': [...]  // Add new language
   };
   ```

2. **Update language list** in `scripts/generate-all.js`:
   ```javascript
   const LANGUAGES = ['en-GB', 'de-DE', 'fr-FR'];
   ```

3. **Run the generator**:
   ```bash
   npm run screenshots:all
   ```

## Test Data

Sample events are defined in `data/events.js` with realistic, localized content for each language:

- Festival events
- Conferences
- Birthday parties
- Wellness retreats
- Conventions

Each event includes:
- Title, description, tags
- Date/time information
- Location details
- Ticket search queries
- Favorite status

### Real Example Image

The screenshot system now uses a real event poster image (`event-capture-example.png`) instead of dummy data for testing image processing flows. This image is automatically seeded into the test database and linked to the first event, providing authentic visual representation in screenshots.

## Troubleshooting

### "Connection refused" error
- Make sure your dev server is running: `cd ../app && npm run dev`
- Check the URL is correct (default: http://localhost:5173)

### Screenshots are blank or missing content
- Increase `screenshotDelay` in CONFIG
- Check browser console logs (set `headless: false` to see browser)

### Can't find UI elements
- Update selectors in `captureEventList()` function
- Add `data-testid` attributes to your components for easier selection

### Database not seeding
- Clear browser storage: run with `clearAppState()` before seeding
- Check IndexedDB schema version matches your app (currently v3)

## CI/CD Integration

For automated screenshot generation in CI:

```yaml
# Example GitHub Actions
- name: Generate Screenshots
  run: |
    cd app && npm run dev &
    sleep 5  # Wait for server to start
    cd ../screenshots
    npm install
    npm run screenshots:all
```

Set `headless: true` in the Puppeteer config for CI environments.

## Output Structure

```
output/
├── en-GB/
│   ├── 01_onboarding_value_prop.png
│   ├── 02_onboarding_how_it_works.png
│   ├── 03_onboarding_permissions.png
│   ├── 04_home_screen.png
│   ├── 05_event_list.png
│   ├── 06_event_detail.png
│   ├── 07_capture_loading.png
│   ├── 08_capture_result.png
│   └── 09_settings.png
└── de-DE/
    ├── 01_onboarding_value_prop.png
    ├── ...
    └── 09_settings.png
```

## Maintenance

When your app UI changes:

1. **Update flows** in `generate-screenshots.js` (selectors, navigation steps)
2. **Update test data** in `data/events.js` if data structure changes
3. **Regenerate all** screenshots: `npm run screenshots:all`

## Tips

- **Consistent state**: Screenshots always start from a clean state (cleared storage)
- **Visual verification**: Run with `headless: false` to watch the automation
- **Custom flows**: Extend `generate-screenshots.js` to add new screenshot scenarios
- **Batch editing**: Use ImageMagick or similar tools for post-processing all screenshots at once
