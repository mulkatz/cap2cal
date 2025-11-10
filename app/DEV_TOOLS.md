# Development Tools

## Paywall Testing

When running the app in development mode (`npm run dev`), you have access to special testing functions via the browser console.

### Available Functions

#### 1. Trigger Paywall Sheet
```javascript
window.__triggerPaywall()
```
Instantly opens the paywall bottom sheet to test the UI, copy, and user flow.

#### 2. Trigger Error Dialogs
```javascript
window.__triggerError('LIMIT_REACHED')
```
Simulates the limit reached error, which will show the paywall sheet (if `featureFlags.paid_only` is enabled).

**Available Error Types:**
- `'LIMIT_REACHED'` - Shows paywall sheet
- `'PROBABLY_NOT_AN_EVENT'` - Shows "not an event" error dialog
- `'IMAGE_TOO_BLURRED'` - Shows blurry image error
- `'LOW_CONTRAST_OR_POOR_LIGHTING'` - Shows lighting error
- `'TEXT_TOO_SMALL'` - Shows text size error
- `'OVERLAPPING_TEXT_OR_GRAPHICS'` - Shows overlapping content error
- `'UNKNOWN'` - Shows generic error

### Usage Example

1. Start the dev server:
   ```bash
   npm run dev
   ```

2. Open the browser console (F12 or Cmd+Option+I on Mac)

3. Run the function:
   ```javascript
   window.__triggerPaywall()
   ```

4. The paywall sheet will appear, and you can test:
   - Plan selection (Monthly vs Annual)
   - CTA button text updates
   - Close behavior
   - Analytics tracking (check console for events)

### Analytics Tracking

When triggered via dev functions, analytics events are logged with `trigger: 'dev_test'` to differentiate them from real user events.

### Production Note

These functions are **automatically removed** in production builds. They only exist when `import.meta.env.DEV` is true.
