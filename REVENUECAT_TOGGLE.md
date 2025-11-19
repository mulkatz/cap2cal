# RevenueCat Enable/Disable Toggle

RevenueCat can be easily enabled or disabled via an environment variable without changing any code.

## Current Status

**RevenueCat is currently: DISABLED** ✅

This is recommended for initial App Store submission to avoid issues with test API keys in production.

---

## How to Enable/Disable

### Disable RevenueCat (Current Setting)

In `/app/.env`:

```bash
VITE_REVENUECAT_ENABLED=false
```

**When disabled:**
- RevenueCat SDK will not initialize
- Paywall will not be shown to users
- No in-app purchase functionality
- Capture limits will still work via backend, but won't trigger paywall
- App can be submitted to App Store without RevenueCat issues

### Enable RevenueCat

In `/app/.env`:

```bash
VITE_REVENUECAT_ENABLED=true
```

**When enabled:**
- RevenueCat SDK initializes on app start
- Paywall shows when users hit capture limit
- Full in-app purchase functionality
- Requires valid production API keys (not test keys)

---

## Workflow for App Store Submission

### Phase 1: Initial Submission (Current)

```bash
# .env
VITE_REVENUECAT_ENABLED=false
```

1. Submit app to App Store with RevenueCat disabled
2. Get through App Review without in-app purchase complications
3. Release version 1.0 to users with generous or unlimited free tier

### Phase 2: Enable Monetization (Later)

Once app is approved and released:

1. Complete RevenueCat setup (see `REVENUECAT_SETUP.md`)
2. Create products in App Store Connect
3. Get production API keys from RevenueCat
4. Update `.env`:
   ```bash
   VITE_REVENUECAT_ENABLED=true
   VITE_REVENUECAT_API_KEY_IOS=your_production_key
   VITE_REVENUECAT_API_KEY_ANDROID=your_production_key
   ```
5. Build and submit version 1.1 with in-app purchases
6. Add in-app purchase info to App Store listing
7. Submit for review

---

## Important Notes

### Backend Capture Limits

Even with RevenueCat disabled, the backend still enforces capture limits via Firebase Remote Config:

**Current settings** (in `/backend/remoteconfig.template.json`):
```json
{
  "paid_only": false,
  "free_capture_limit": 2
}
```

**For generous free tier during initial release:**

Update Remote Config in Firebase Console:
```json
{
  "paid_only": false,
  "free_capture_limit": 999999  // Effectively unlimited
}
```

Or set a reasonable limit like 20-50 captures for free users.

### Environment Variable Must Be String

Important: The value must be the **string** `"true"` or `"false"`, not a boolean.

```bash
# ✅ Correct
VITE_REVENUECAT_ENABLED=true
VITE_REVENUECAT_ENABLED=false

# ❌ Wrong (will be treated as disabled)
VITE_REVENUECAT_ENABLED=1
VITE_REVENUECAT_ENABLED=yes
```

### Rebuild Required

After changing the `.env` file, you must rebuild the app:

```bash
npm run build
npx cap sync
npx cap run ios    # or android
```

---

## Testing

### Test with RevenueCat Disabled

```bash
# Set in .env
VITE_REVENUECAT_ENABLED=false

# Build and run
npm run build && npx cap sync && npx cap run ios
```

**Expected behavior:**
- App works normally
- No paywall appears (even if limit reached)
- Console shows: `[Purchases] RevenueCat is disabled via VITE_REVENUECAT_ENABLED flag`

### Test with RevenueCat Enabled

```bash
# Set in .env
VITE_REVENUECAT_ENABLED=true

# Build and run
npm run build && npx cap sync && npx cap run ios
```

**Expected behavior:**
- RevenueCat initializes on app start
- Paywall appears when user hits capture limit
- In-app purchases work (with valid API keys)
- Console shows: `[Purchases] RevenueCat initialized for user: <uid>`

---

## Code Implementation

The flag is checked in multiple places:

1. **`initializePurchases()`** - Exits early if disabled
2. **`isPurchasesAvailable()`** - Returns false if disabled
3. **`pushError()`** in `useCapture.tsx` - Skips paywall if disabled

All RevenueCat code remains in place and ready to activate when needed.

---

## Deployment Checklist

### Before App Store Submission

- [ ] Set `VITE_REVENUECAT_ENABLED=false` in `.env`
- [ ] Build app: `npm run build && npx cap sync`
- [ ] Test on device - verify no paywall appears
- [ ] Check console logs - should see "RevenueCat is disabled"
- [ ] Archive and submit to App Store

### Before Enabling Monetization

- [ ] App successfully released on App Store
- [ ] RevenueCat account created and configured
- [ ] Products created in App Store Connect (`subscription_monthly_1`, `subscription_yearly_1`)
- [ ] Production API keys obtained from RevenueCat
- [ ] Products tested in sandbox environment
- [ ] Backend webhook deployed and tested
- [ ] Remote Config updated with desired capture limits

### Enabling RevenueCat

- [ ] Update `.env`: `VITE_REVENUECAT_ENABLED=true`
- [ ] Update API keys to production keys (not test keys)
- [ ] Build and test thoroughly on device
- [ ] Verify purchases work in sandbox
- [ ] Submit version 1.1 to App Store
- [ ] Update App Store listing with in-app purchase info

---

## Troubleshooting

### Issue: "Using test API key in production"

**Solution:** You're seeing this because RevenueCat is enabled with test keys.

Either:
1. Disable RevenueCat: `VITE_REVENUECAT_ENABLED=false`
2. OR use production API keys from RevenueCat Dashboard

### Issue: Paywall not showing when enabled

Check:
1. `.env` has `VITE_REVENUECAT_ENABLED=true` (string "true")
2. App was rebuilt after changing `.env`
3. User has reached capture limit
4. Console logs show RevenueCat initialized

### Issue: App rejected for in-app purchases

If RevenueCat is disabled, your app doesn't have in-app purchases. Make sure:
- Don't mention subscriptions in App Store listing
- Don't include screenshots showing pricing
- Remove any "Pro" or "Premium" language if there's no way to purchase

---

**Current recommendation:** Keep RevenueCat **disabled** for initial App Store submission, then enable in a future update.
