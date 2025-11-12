# Screenshot Generation Guide

This project includes automated screenshot generation for App Store and Google Play listings.

## Quick Start

### 1. Start the dev server

```bash
cd app
npm run dev
```

Keep this running in one terminal.

### 2. Generate screenshots (in a new terminal)

```bash
cd screenshots
npm run screenshots:all
```

This will generate screenshots for all languages (English and German) and save them to `screenshots/output/`.

## What Gets Generated

For each language:
- `01_onboarding_value_prop.png` - Value proposition screen
- `02_onboarding_how_it_works.png` - How it works screen
- `03_onboarding_permissions.png` - Permissions screen
- `04_home_screen.png` - Main home screen
- `05_event_list.png` - Event list with sample data
- `06_event_detail.png` - Event detail view (if available)
- `07_capture_loading.png` - Photo capture loading state
- `08_capture_result.png` - Photo capture result showing extracted event

## Individual Languages

Generate screenshots for specific languages:

```bash
npm run screenshots:en  # English only
npm run screenshots:de  # German only
```

## How It Works

1. **Puppeteer** launches a headless Chrome browser
2. **Language parameter** sets the UI language via URL query param (`?lng=en-GB`)
3. **Test data** is injected into IndexedDB based on the language
4. **Navigation** follows predefined flows (onboarding, home, event list)
5. **Screenshots** are captured at each step

## Adding New Languages

1. Edit `screenshots/data/events.js` and add event data for the new language
2. Edit `screenshots/scripts/generate-all.js` and add the language code to `LANGUAGES` array
3. Run `npm run screenshots:all`

## Customization

See `screenshots/README.md` for detailed configuration options:
- Viewport sizes (different devices)
- Screenshot delays
- Navigation flows
- Custom selectors

## Troubleshooting

**Screenshots are blank:**
- Increase delays in `screenshots/scripts/generate-screenshots.js`
- Run with `headless: false` to watch the browser

**Can't find UI elements:**
- Update selectors in the capture functions
- Add `data-testid` attributes to components for reliable selection

**Database not seeding:**
- Check IndexedDB version matches your app (currently v3)
- Clear browser state between runs

For more details, see [screenshots/README.md](screenshots/README.md).
