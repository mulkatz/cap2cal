# Firebase Crashlytics Setup Guide

## ✅ Completed Setup

- [x] Install @capacitor-firebase/crashlytics package
- [x] Configure Android (build.gradle, google-services.json)
- [x] Configure iOS (Podfile, GoogleService-Info.plist)
- [x] Create Crashlytics hooks and Error Boundary
- [x] Add developer mode toggle
- [x] Add translations (EN/DE)

## 🔧 iOS dSYM Configuration (Required for Crash Symbolication)

### Why dSYM Files are Needed

Without dSYM files, iOS crash reports will show memory addresses instead of readable function names:
```
❌ Bad:  0x00000001004a8c3c (crash at memory address)
✅ Good: useCrashlytics.tsx:78 logError() (readable stack trace)
```

### Step 1: Enable dSYM Generation

1. Open Xcode workspace:
   ```bash
   open native/ios/App/App.xcworkspace
   ```

2. Select **App** target → **Build Settings**

3. Search: **"Debug Information Format"**

4. Set to **"DWARF with dSYM File"** for:
   - Debug
   - Release

   ![Build Settings](https://firebase.google.com/static/docs/crashlytics/images/ios-dsym-setting.png)

### Step 2: Add Upload Script to Build Phase

This automatically uploads dSYM files after each build.

1. Select **App** target → **Build Phases** tab

2. Click **[+]** → **New Run Script Phase**

3. **Drag it AFTER "Embed Frameworks"** ⚠️ Order matters!

4. Name it: **"Upload dSYMs to Crashlytics"**

5. **Paste this exact script:**

```bash
# Upload dSYMs to Firebase Crashlytics
"${PODS_ROOT}/FirebaseCrashlytics/run"
```

6. **Add Input Files** (click the arrow next to "Input Files"):
   ```
   ${DWARF_DSYM_FOLDER_PATH}/${DWARF_DSYM_FILE_NAME}/Contents/Resources/DWARF/${TARGET_NAME}
   ${BUILT_PRODUCTS_DIR}/${INFOPLIST_PATH}
   ```

7. ✅ **Check**: "Run script: Based on dependency analysis"

### Step 3: Verify Setup

Run the verification script:
```bash
./verify-crashlytics-setup.sh
```

### Step 4: Test

1. Build on a **real iOS device** (not simulator)
   ```bash
   npx cap run ios
   ```

2. In the app: **Settings** → **Test Crash Reporting**

3. Confirm the test crash

4. Wait ~5 minutes

5. Check [Firebase Console](https://console.firebase.google.com) → Crashlytics

   You should see the crash with **readable stack traces** ✅

## 📱 Android Setup (Already Complete)

Android automatically includes debug symbols, no extra configuration needed! ✅

## 🔒 Production Builds

### iOS Archive/Release

For App Store builds, Xcode automatically:
1. Generates dSYM files
2. Runs the upload script
3. Sends symbols to Firebase

**No manual steps needed!** 🎉

### Android Release

For Play Store builds:
1. dSYMs are automatically included ✅
2. ProGuard mapping files are handled by Firebase Gradle plugin ✅

## 🐛 Troubleshooting

### "dSYMs not uploading"

**Check:**
1. Upload script is AFTER "Embed Frameworks" in Build Phases
2. Input Files are added correctly
3. Build output shows: "Uploading dSYMs to Firebase Crashlytics..."

**View build output:**
- Xcode → Report Navigator (⌘9) → Latest build → Check for upload messages

### "Crashes not appearing in Firebase"

**Common causes:**
1. Using iOS Simulator (Crashlytics requires real device)
2. Developer mode disabled in `.env` (set `VITE_DEVELOPER_MODE_ENABLED=true`)
3. Waiting < 5 minutes (Firebase processes crashes in batches)
4. GoogleService-Info.plist missing or incorrect

### "Crashes showing memory addresses, not code"

**This means dSYMs aren't uploaded:**
1. Check Build Phase script is present
2. Rebuild and check Xcode build log for upload confirmation
3. Manually upload dSYMs (see below)

### Manual dSYM Upload (Fallback)

If automatic upload fails:

```bash
# Find your dSYM file
find ~/Library/Developer/Xcode/DerivedData -name "*.dSYM" -type d

# Upload manually
native/ios/App/Pods/FirebaseCrashlytics/upload-symbols \
  -gsp native/ios/App/App/GoogleService-Info.plist \
  -p ios \
  path/to/your.app.dSYM
```

## 📊 Firebase Console

View crashes at: https://console.firebase.google.com

Navigate to:
**Crashlytics** → Select your app (iOS/Android) → View crashes

## 🔐 Privacy & GDPR

Crashlytics crash collection can be disabled:

```typescript
import { useCrashlytics } from './hooks/useCrashlytics';

const { setCrashlyticsCollectionEnabled } = useCrashlytics();

// Disable crash reporting (e.g., user opts out)
await setCrashlyticsCollectionEnabled(false);

// Re-enable
await setCrashlyticsCollectionEnabled(true);
```

## 📚 Additional Resources

- [Firebase Crashlytics iOS Guide](https://firebase.google.com/docs/crashlytics/get-started?platform=ios)
- [Firebase Crashlytics Android Guide](https://firebase.google.com/docs/crashlytics/get-started?platform=android)
- [Capacitor Firebase Crashlytics Plugin](https://github.com/capawesome-team/capacitor-firebase/tree/main/packages/crashlytics)

---

**Last Updated:** November 2024
**Crashlytics Version:** 7.4.0
