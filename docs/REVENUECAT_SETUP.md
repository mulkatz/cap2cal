# RevenueCat Setup

This guide covers enabling, configuring, and testing in-app purchases via RevenueCat.

## Enable/Disable Toggle

RevenueCat can be toggled via a single environment variable — no code changes needed:

```bash
# app/.env
VITE_REVENUECAT_ENABLED=true   # enable in-app purchases
VITE_REVENUECAT_ENABLED=false  # disable (default)
```

When disabled, the RevenueCat SDK won't initialize, no paywall is shown, and the app can be submitted without in-app purchase complications. All RevenueCat code stays in place and is ready to activate.

After changing the flag, rebuild: `npm run build && npx cap sync`

---

## Overview

Cap2Cal uses RevenueCat to manage in-app subscriptions across iOS and Android:

- **Plugin**: `@revenuecat/purchases-capacitor`
- **Entitlement**: `pro` — grants unlimited captures
- **Products**: `cap2cal_pro_monthly` and `cap2cal_pro_yearly`

Purchases only work on native iOS/Android apps. The web version does not support in-app purchases.

---

## Prerequisites

Before starting, ensure you have:

- [ ] Apple Developer Account ($99/year) - for iOS
- [ ] Google Play Developer Account ($25 one-time) - for Android
- [ ] Firebase project set up for Cap2Cal
- [ ] Access to App Store Connect (iOS)
- [ ] Access to Google Play Console (Android)
- [ ] RevenueCat account (free tier available)

---

## RevenueCat Account Setup

### 1. Create RevenueCat Account

1. Go to [RevenueCat](https://www.revenuecat.com/)
2. Click "Sign Up" and create an account
3. Verify your email address

### 2. Create a New Project

1. After logging in, click "Create Project"
2. Enter project details:
   - **Project Name**: `Cap2Cal`
   - **Platform**: Select both iOS and Android
3. Click "Create Project"

### 3. Get API Keys

1. Go to **Project Settings** → **API Keys**
2. Copy the following keys (you'll need these later):
   - **Public Apple SDK Key** (for iOS)
   - **Public Google SDK Key** (for Android)
   - **Secret API Key** (for backend integration, optional)

---

## App Store Connect Setup (iOS)

### 1. Create App in App Store Connect

1. Log in to [App Store Connect](https://appstoreconnect.apple.com/)
2. Go to **My Apps** → Click ➕ to create a new app
3. Fill in app details:
   - **Platform**: iOS
   - **Name**: Cap2Cal
   - **Primary Language**: English
   - **Bundle ID**: `cx.franz.cap2cal` (should match your Xcode project)
   - **SKU**: `cap2cal` (unique identifier)
4. Click "Create"

### 2. Create In-App Purchase Products

1. In your app page, go to **In-App Purchases**
2. Click ➕ to create a new in-app purchase

#### **Monthly Subscription** ($0.99/month)

1. Select **Auto-Renewable Subscription**
2. Enter details:
   - **Reference Name**: `Pro Monthly Subscription`
   - **Product ID**: `cap2cal_pro_monthly` (must match code)
   - **Subscription Group Name**: `Cap2Cal Pro` (create new group)
3. Click "Create"
4. Add pricing:
   - **Price**: $0.99 USD
   - Select other countries (RevenueCat will handle localization)
5. Add subscription duration:
   - **Duration**: 1 month
6. Add Localizations:
   - **Display Name**: `Pro Monthly`
   - **Description**: `Unlimited event captures with Pro monthly subscription`
7. Click "Save"

#### **Yearly Subscription** ($9.99/year)

1. Click ➕ to create another subscription
2. Select **Auto-Renewable Subscription**
3. Enter details:
   - **Reference Name**: `Pro Yearly Subscription`
   - **Product ID**: `cap2cal_pro_yearly` (must match code)
   - **Subscription Group**: Select `Cap2Cal Pro` (same group as monthly)
4. Click "Create"
5. Add pricing:
   - **Price**: $9.99 USD
6. Add subscription duration:
   - **Duration**: 1 year
7. Add Localizations:
   - **Display Name**: `Pro Yearly`
   - **Description**: `Unlimited event captures with Pro yearly subscription - Best Value!`
8. Click "Save"

### 3. Configure Subscription Group

1. Go to **Subscription Groups** → `Cap2Cal Pro`
2. Review subscription levels (monthly should be lower tier than yearly)
3. Configure:
   - **Introductory Offers**: Optional (e.g., 7-day free trial)
   - **Promotional Offers**: Optional
4. Submit for review once ready

### 4. Link App Store Connect to RevenueCat

1. In RevenueCat Dashboard, go to your iOS app
2. Click **App Store Connect**
3. Enter your **Team ID** (found in App Store Connect → Membership)
4. Upload **App Store Connect API Key**:
   - In App Store Connect, go to **Users and Access** → **Keys** → **App Store Connect API**
   - Click ➕ to create a new key
   - **Name**: `RevenueCat`
   - **Access**: `Developer` or `Admin`
   - Download the `.p8` file and upload to RevenueCat
5. Enter **Issuer ID** and **Key ID** from App Store Connect
6. Click "Save"

---

## Google Play Console Setup (Android)

### 1. Create App in Google Play Console

1. Log in to [Google Play Console](https://play.google.com/console/)
2. Click "Create app"
3. Fill in app details:
   - **App name**: Cap2Cal
   - **Default language**: English (United States)
   - **App or game**: App
   - **Free or paid**: Free (with in-app purchases)
4. Accept declarations and click "Create app"

### 2. Set Up App Details

1. Complete all required sections:
   - **Store listing** (screenshots, descriptions, etc.)
   - **App content** (privacy policy, content rating, etc.)
   - **Pricing and distribution**

### 3. Create In-App Products

1. Go to **Monetize** → **Products** → **Subscriptions**
2. Click "Create subscription"

#### **Monthly Subscription** ($0.99/month)

1. Enter details:
   - **Product ID**: `cap2cal_pro_monthly` (must match code)
   - **Name**: `Pro Monthly Subscription`
   - **Description**: `Unlimited event captures with Pro monthly subscription`
2. Add pricing:
   - **Price**: $0.99 USD
   - Select "Auto-convert prices to local currencies"
3. Set subscription period:
   - **Billing period**: 1 Month
   - **Free trial**: Optional (e.g., 7 days)
4. Click "Save"

#### **Yearly Subscription** ($9.99/year)

1. Click "Create subscription"
2. Enter details:
   - **Product ID**: `cap2cal_pro_yearly` (must match code)
   - **Name**: `Pro Yearly Subscription`
   - **Description**: `Unlimited event captures with Pro yearly subscription - Best Value!`
3. Add pricing:
   - **Price**: $9.99 USD
4. Set subscription period:
   - **Billing period**: 1 Year
5. Click "Save"

### 4. Activate Subscriptions

1. Review each subscription
2. Click "Activate" for each one
3. Subscriptions must be activated before testing

### 5. Link Google Play to RevenueCat

1. In RevenueCat Dashboard, go to your Android app
2. Click **Google Play**
3. Follow the instructions to set up service credentials:
   - Go to Google Play Console → **Setup** → **API access**
   - Link to Google Cloud project
   - Create service account credentials
   - Grant "View financial data" permission
   - Download JSON credentials file
   - Upload to RevenueCat
4. Click "Save"

---

## RevenueCat Configuration

### 1. Create Entitlements

1. In RevenueCat Dashboard, go to **Entitlements**
2. Click "New Entitlement"
3. Enter:
   - **Identifier**: `pro` (must match code: `ENTITLEMENT_ID = 'pro'`)
   - **Description**: `Pro features including unlimited captures`
4. Click "Create"

### 2. Create Products

1. Go to **Products** tab
2. RevenueCat should automatically sync your products from App Store Connect and Google Play
3. Verify that both products appear:
   - `cap2cal_pro_monthly`
   - `cap2cal_pro_yearly`

### 3. Create Offering

1. Go to **Offerings** tab
2. Click "New Offering"
3. Enter:
   - **Identifier**: `default` (RevenueCat fetches this by default)
   - **Description**: `Default subscription offering`
4. Click "Create"
5. Add packages to the offering:
   - Click "Add Package"
   - **Monthly Package**:
     - **Identifier**: `monthly`
     - **Product**: `cap2cal_pro_monthly` (iOS and Android)
     - **Entitlements**: `pro`
   - **Yearly Package**:
     - **Identifier**: `yearly`
     - **Product**: `cap2cal_pro_yearly` (iOS and Android)
     - **Entitlements**: `pro`
6. Set offering as "Current" (live offering)

---

## Environment Variables

### 1. App Environment Variables (Frontend)

Add RevenueCat API keys to `/app/.env`:

```bash
# RevenueCat API Keys
VITE_REVENUECAT_API_KEY_IOS=your_public_apple_sdk_key
VITE_REVENUECAT_API_KEY_ANDROID=your_public_google_sdk_key
```

**Where to find these:**
- RevenueCat Dashboard → Project Settings → API Keys
- Copy **Public Apple SDK Key** for iOS
- Copy **Public Google SDK Key** for Android

### 2. Backend Environment Variables

#### Option 1: Using Firebase Functions Config (Recommended for Production)

```bash
# Set the webhook secret (from RevenueCat webhook settings)
firebase functions:config:set revenuecat.webhook_secret="your_webhook_secret_here"

# Deploy the config
firebase deploy --only functions
```

#### Option 2: Using .env for Local Development

Create `/backend/functions/.env`:

```bash
REVENUECAT_WEBHOOK_SECRET=your_webhook_secret_here
```

**Where to find the webhook secret:**
- Will be generated when you set up the webhook in RevenueCat (next section)

---

## Backend Webhook Setup

The webhook ensures subscription status syncs from RevenueCat to your Firestore database.

### 1. Deploy Backend Function

```bash
# Navigate to root directory
cd /path/to/cap2cal

# Deploy only the webhook function
firebase deploy --only functions:revenuecatWebhook

# Or deploy all functions
firebase deploy --only functions
```

After deployment, copy the function URL:
```
https://us-central1-YOUR_PROJECT_ID.cloudfunctions.net/revenuecatWebhook
```

### 2. Configure Webhook in RevenueCat

1. Go to RevenueCat Dashboard → **Project Settings** → **Integrations** → **Webhooks**
2. Click "Add Webhook"
3. Enter:
   - **URL**: `https://us-central1-YOUR_PROJECT_ID.cloudfunctions.net/revenuecatWebhook`
   - **Events**: Select all events (recommended):
     - INITIAL_PURCHASE
     - RENEWAL
     - CANCELLATION
     - EXPIRATION
     - BILLING_ISSUE
     - PRODUCT_CHANGE
     - REFUND
     - etc.
4. Click "Create"
5. Copy the **Authorization Header** (this is your webhook secret)
6. Add this secret to your backend environment:
   ```bash
   firebase functions:config:set revenuecat.webhook_secret="Bearer_YOUR_SECRET_HERE"
   ```
7. Redeploy functions to apply the new config:
   ```bash
   firebase deploy --only functions:revenuecatWebhook
   ```

### 3. Test Webhook

1. In RevenueCat webhook settings, click "Send Test"
2. Check Firebase Functions logs to verify receipt:
   ```bash
   firebase functions:log
   ```
3. You should see logs like:
   ```
   [RevenueCat] Webhook signature verified
   [RevenueCat] Received webhook event
   ```

---

## Testing

Before testing purchases, build and deploy to a device (see [Getting Started](./GETTING-STARTED.md)).

### 1. iOS Sandbox Testing

#### Create Sandbox Test Account

1. Go to [App Store Connect](https://appstoreconnect.apple.com/)
2. Navigate to **Users and Access** → **Sandbox Testers**
3. Click ➕ to add a new tester
4. Fill in details (use a valid but non-existent email like `test@yourdomain.com`)
5. Verify the email if prompted

#### Test on Device/Simulator

1. Build and run the app on a physical device or simulator
2. **Sign out** of your real Apple ID in Settings → App Store
3. Don't sign in with sandbox account yet - wait for purchase prompt
4. In the app:
   - Trigger the paywall (e.g., reach capture limit)
   - Select a plan (Monthly or Yearly)
   - Click "Continue"
5. When prompted, sign in with your **sandbox test account**
6. Complete the purchase (you won't be charged)
7. Verify:
   - Purchase completes successfully
   - User becomes Pro (unlimited captures)
   - Firestore `users/{userId}` has `isPro: true`

#### Test Subscription Management

- **Cancel**: Go to Settings → App Store → Sandbox Account → Manage → Cancel subscription
- **Restore**: In app, click "Restore Purchases"
- **Renewal**: Sandbox subscriptions renew quickly (e.g., 5 minutes for monthly)

### 2. Android Testing

#### Enable Testing in Google Play Console

1. Go to [Google Play Console](https://play.google.com/console/)
2. Navigate to **Testing** → **Internal testing** or **Closed testing**
3. Create a test track and upload a signed APK/AAB
4. Add testers by email

#### Test on Device

1. Install the test build via internal testing track
2. Ensure tester account is added in Play Console
3. In the app:
   - Trigger the paywall
   - Select a plan
   - Complete purchase (test accounts won't be charged)
4. Verify Pro status

#### License Testing

Alternative: Use license testing for faster testing without internal track:

1. Go to **Settings** → **License Testing**
2. Add test Gmail accounts
3. Set test response to "PURCHASED" for auto-approval
4. Build and install APK directly (doesn't need to be signed for testing)

### 3. Webhook Testing

1. Make a test purchase (sandbox or real)
2. Check Firebase Functions logs:
   ```bash
   firebase functions:log --only revenuecatWebhook
   ```
3. Verify logs show:
   - `[RevenueCat] Webhook signature verified`
   - `[RevenueCat] Pro status ACTIVATED`
4. Check Firestore:
   - `users/{userId}` should have `isPro: true`
   - `users/{userId}/subscriptionEvents` should have event documents

---

## Troubleshooting

### Common Issues

#### 1. "Products Not Available"

**Symptoms**: Paywall shows but clicking "Continue" shows error "This plan is currently unavailable"

**Causes**:
- Products not activated in App Store Connect / Google Play Console
- Product IDs don't match between store and code
- App Store Connect / Google Play credentials not linked to RevenueCat
- RevenueCat hasn't synced products yet

**Solutions**:
- Verify product IDs match exactly:
  - Code: `cap2cal_pro_monthly` and `cap2cal_pro_yearly`
  - App Store Connect / Google Play: Same IDs
- Ensure products are "Ready to Submit" (iOS) or "Active" (Android)
- Check RevenueCat Dashboard → Products tab - products should appear
- Wait 24 hours for App Store to propagate changes
- Re-link App Store Connect / Google Play credentials in RevenueCat

#### 2. "Payment Failed"

**Symptoms**: Purchase flow starts but fails at payment step

**iOS Causes**:
- Not signed in with sandbox account
- Sandbox account not verified
- Wrong build configuration (using production instead of sandbox)

**iOS Solutions**:
- Sign out of real Apple ID in Settings → App Store
- Sign in with sandbox test account when prompted
- In Xcode, ensure "Signing & Capabilities" → "In-App Purchase" capability is added
- Clean build: Product → Clean Build Folder

**Android Causes**:
- Not using a test account registered in Play Console
- Payment method not set up on test account
- App not installed via testing track

**Android Solutions**:
- Add your Gmail to Internal Testing in Play Console
- Install app via internal testing link
- Verify payment method in Google Play

#### 3. "Purchase Successful but Still Not Pro"

**Symptoms**: Purchase completes, but user doesn't get Pro status (still sees capture limit)

**Causes**:
- Entitlement not configured correctly in RevenueCat
- Webhook not set up or failing
- Firebase user ID doesn't match RevenueCat app_user_id

**Solutions**:
- Check RevenueCat Dashboard → Customer → Search for user
  - Verify user has active `pro` entitlement
- Check Firebase Functions logs for webhook errors:
  ```bash
  firebase functions:log --only revenuecatWebhook
  ```
- Verify in Firestore that `users/{userId}` has `isPro: true`
- Manually set `isPro: true` in Firestore as temporary fix
- Call `refreshProStatus()` in app to re-check entitlements

#### 4. "Webhook Not Receiving Events"

**Symptoms**: Purchases work but Firestore isn't updated

**Causes**:
- Webhook URL incorrect
- Webhook authorization failing
- Function not deployed or has errors
- RevenueCat webhook not configured for all events

**Solutions**:
- Verify webhook URL in RevenueCat matches deployed function URL
- Check Firebase Functions logs:
  ```bash
  firebase functions:log
  ```
- Test webhook: RevenueCat Dashboard → Webhooks → Send Test
- Verify webhook secret is set:
  ```bash
  firebase functions:config:get
  ```
- Ensure all event types are selected in RevenueCat webhook settings

#### 5. "Restore Purchases Not Working"

**Symptoms**: User clicks "Restore Purchases" but nothing happens

**Causes**:
- User never purchased on this Apple/Google account
- User is signed in with different account than purchased with
- Purchase was refunded

**Solutions**:
- Verify user is signed in with correct App Store / Play Store account
- Check RevenueCat Dashboard → Customers → Search by email/receipt
- For iOS: Settings → App Store → Check signed-in account
- For Android: Play Store → Menu → Account → Verify account

#### 6. "Purchases Not Available in Web Browser"

**Symptoms**: Paywall shows but purchase doesn't work when running in web browser

**Cause**: In-app purchases are only available on native iOS/Android platforms. The Capacitor plugin only works on real devices/simulators, not in web browsers.

**Solution**:
- Build and run the app on iOS/Android: `npx cap run ios` or `npx cap run android`
- Do not test purchases in `npm run dev` (web browser)
- The code checks `Capacitor.isNativePlatform()` and shows appropriate messages

---

## Testing Checklist

Before going live, test the following:

### iOS
- [ ] Sandbox purchase (monthly)
- [ ] Sandbox purchase (yearly)
- [ ] Purchase confirmation shows in app
- [ ] Pro status activates (unlimited captures)
- [ ] Restore purchases works
- [ ] Webhook updates Firestore
- [ ] Subscription cancellation works
- [ ] Subscription renewal works (wait 5 min in sandbox)

### Android
- [ ] Test account purchase (monthly)
- [ ] Test account purchase (yearly)
- [ ] Purchase confirmation shows in app
- [ ] Pro status activates
- [ ] Restore purchases works
- [ ] Webhook updates Firestore
- [ ] Subscription cancellation works

### Backend
- [ ] Webhook receives INITIAL_PURCHASE event
- [ ] Webhook receives RENEWAL event
- [ ] Webhook receives CANCELLATION event
- [ ] Webhook receives EXPIRATION event
- [ ] Firestore `isPro` field updates correctly
- [ ] Subscription events logged in `subscriptionEvents` subcollection

---

## Resources

- [RevenueCat Docs](https://docs.revenuecat.com/)
- [App Store Connect Help](https://developer.apple.com/help/app-store-connect/)
- [Google Play Console Help](https://support.google.com/googleplay/android-developer/)
