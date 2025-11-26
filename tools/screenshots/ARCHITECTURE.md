# Screenshot Automation Architecture

## Overview

This screenshot automation system uses **Puppeteer** to generate consistent, localized app store screenshots for Cap2Cal. The design prioritizes maintainability by using a single parameterized script instead of per-language configuration files.

## Key Design Decisions

### Why Puppeteer?

1. **Web-based app**: Cap2Cal is built with Capacitor, which is essentially a web app
2. **Single codebase**: One script handles all languages via parameters
3. **Easy to maintain**: Adding a new language requires just adding data, no new flows
4. **Fast iteration**: Run directly against dev server, no build/deploy needed
5. **CI/CD friendly**: Headless execution, simple npm scripts
6. **No mobile dependencies**: No need for Xcode, Android Studio, or simulators during development

### Architecture Principles

1. **Parameterized flows**: Language is a runtime parameter, not a compile-time constant
2. **Data-driven**: All language-specific content comes from `data/events.js`
3. **Separation of concerns**:
   - `data/` - Test data and fixtures
   - `scripts/` - Screenshot generation logic
   - `output/` - Generated screenshots (gitignored)
4. **Idempotent**: Each run starts from clean state (cleared localStorage/IndexedDB)
5. **Consistent state**: Same seed data = same screenshots every time

## Directory Structure

```
screenshots/
├── package.json                 # Dependencies and npm scripts
├── .gitignore                   # Ignore output and node_modules
├── README.md                    # User guide
├── ARCHITECTURE.md              # This file
├── data/
│   └── events.js                # Localized test data for all languages
├── scripts/
│   ├── generate-screenshots.js  # Main screenshot generator
│   └── generate-all.js          # Multi-language runner
└── output/                      # Generated screenshots (gitignored)
    ├── en-GB/
    │   ├── 01_onboarding_value_prop.png
    │   ├── 02_onboarding_how_it_works.png
    │   └── ...
    └── de-DE/
        ├── 01_onboarding_value_prop.png
        └── ...
```

## Data Flow

```
1. User runs: npm run screenshots:all
   ↓
2. generate-all.js loops through LANGUAGES array
   ↓
3. For each language:
   - Launch Puppeteer browser
   - Navigate to app with ?lng={language}
   - Clear app state (localStorage + IndexedDB)
   - Execute screenshot flows:
     a. Onboarding (4 screens)
     b. Home screen (1 screen)
     c. Event list with seeded data (2-3 screens)
   - Close browser
   ↓
4. Screenshots saved to output/{language}/
```

## Flow Details

### Flow 1: Onboarding
- **Purpose**: Capture onboarding screens showing app value
- **State**: Fresh install (no localStorage, empty IndexedDB)
- **Steps**:
  1. Load app with language param
  2. Wait for first onboarding screen
  3. Screenshot each screen
  4. Click "Next" between screens
- **Output**: `01_*.png` through `04_*.png`

### Flow 2: Home Screen
- **Purpose**: Show main app interface
- **State**: Onboarding completed (via localStorage flag)
- **Steps**:
  1. Set `hasSeenOnboarding` flag
  2. Reload app
  3. Wait for home screen to render
  4. Take screenshot
- **Output**: `05_home_screen.png`

### Flow 3: Event List
- **Purpose**: Show app with realistic event data
- **State**: Onboarding completed + seeded events in IndexedDB
- **Steps**:
  1. Set onboarding flag
  2. Inject language-specific events into IndexedDB
  3. Reload app
  4. Click to open event list
  5. Screenshot event list
  6. Click first event
  7. Screenshot event detail
- **Output**: `06_event_list.png`, `07_event_detail.png`

## Language Handling

### i18n Integration

Cap2Cal uses `i18next` with query string detection:
```javascript
// URL: http://localhost:5173?lng=de-DE
// Result: App loads in German
```

The screenshot script leverages this by appending `?lng={language}` to all page loads.

### Adding a New Language

**Step 1**: Add test data in `data/events.js`

```javascript
export const events = {
  'en-GB': [...],
  'de-DE': [...],
  'es-ES': [  // New language
    {
      id: "event-es-001",
      title: "Festival de Música de Verano 2025",
      // ... more fields
    }
  ]
};
```

**Step 2**: Add to language list in `scripts/generate-all.js`

```javascript
const LANGUAGES = ['en-GB', 'de-DE', 'es-ES'];
```

**Step 3**: Run the generator

```bash
npm run screenshots:all
```

That's it! No new flow files, no duplicated logic.

## Configuration

### Viewport Settings

Currently configured for **iPhone 15 Pro Max** at 3x scale:
```javascript
viewport: {
  width: 1290,  // 430px * 3
  height: 2796, // 932px * 3
  deviceScaleFactor: 3,
}
```

To change device:
1. Look up device resolution (e.g., 390x844 for iPhone 15)
2. Multiply by scale factor (usually 3x for modern iOS)
3. Update CONFIG in `generate-screenshots.js`

### Timing Settings

```javascript
const CONFIG = {
  screenshotDelay: 1000,  // Wait before screenshot
  navigationDelay: 800,   // Wait after click/navigation
};
```

Increase these if:
- Screenshots are blank
- Elements not fully rendered
- Animations in progress

## Technical Details

### State Management

**localStorage**:
- `hasSeenOnboarding` - Controls onboarding visibility
- Cleared between flows for consistency

**IndexedDB** (Dexie):
- Database: `EventDB`
- Version: 3
- Tables: `eventItems`, `images`
- Seed function injects events via native IndexedDB API

### Browser Automation

Puppeteer runs in **non-headless mode** by default for debugging. For CI/CD:

```javascript
const browser = await puppeteer.launch({
  headless: true,  // Change this
  // ...
});
```

### Error Handling

- Graceful fallbacks for missing UI elements
- Timeout protection on selectors
- Detailed console logging for debugging
- Try/catch blocks around optional screenshots

## Extending the System

### Adding New Screenshot Scenarios

1. Create a new capture function:
```javascript
async function captureNewFlow(page, language, outputDir) {
  console.log('\n📸 Capturing new flow...');
  // Navigation and screenshot logic
}
```

2. Call it from `generateScreenshots()`:
```javascript
await captureNewFlow(page, language, outputDir);
```

3. Run to generate new screenshots

### Custom Selectors

For reliable selection, use:
- `data-testid` attributes (recommended)
- Class names (be careful with Tailwind)
- Text content (works but language-dependent)

Example:
```typescript
// In your React component
<button data-testid="open-event-list">Your Events</button>

// In Puppeteer script
await page.click('[data-testid="open-event-list"]');
```

### Post-Processing

All screenshots are raw PNG files. For post-processing:

```bash
# Add device frames with imagemagick
for file in output/en-GB/*.png; do
  convert "$file" -frame 20x20 "framed-$file"
done

# Compress for web
pngquant output/**/*.png --quality 80-95
```

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Generate Screenshots

on:
  workflow_dispatch: # Manual trigger
  push:
    branches: [main]
    paths:
      - 'app/src/**'
      - 'screenshots/**'

jobs:
  screenshots:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'

      - name: Install app dependencies
        run: |
          cd app
          npm ci

      - name: Install screenshot dependencies
        run: |
          cd screenshots
          npm ci

      - name: Start dev server
        run: |
          cd app
          npm run dev &
          npx wait-on http://localhost:5173

      - name: Generate screenshots
        run: |
          cd screenshots
          npm run screenshots:all

      - name: Upload screenshots
        uses: actions/upload-artifact@v3
        with:
          name: screenshots
          path: screenshots/output/
```

## Performance Considerations

- **Parallel generation**: Currently sequential for stability, but can parallelize by language
- **Browser reuse**: Could reuse browser instance across flows (faster but harder to debug)
- **Network idle**: Uses `waitForNetworkIdle()` which can be slow on slow networks
- **Screenshot size**: Full HD at 3x is large (~5MB each), consider compression

## Maintenance Tips

1. **Keep flows simple**: Complex flows are harder to maintain
2. **Test locally first**: Always run with `headless: false` when changing flows
3. **Version control test data**: Commit `events.js` changes to track what's in screenshots
4. **Document selectors**: Comment why each selector is used
5. **Regular regeneration**: Re-run screenshots periodically to catch UI regressions

## Future Improvements

- [ ] Add Android device presets
- [ ] Implement screenshot diffing (detect changes)
- [ ] Add tablet sizes
- [ ] Support dark mode screenshots
- [ ] Add accessibility features (high contrast, large text)
- [ ] Parallel language generation
- [ ] Custom screenshot annotations/overlays
- [ ] Integration with app store APIs for auto-upload
