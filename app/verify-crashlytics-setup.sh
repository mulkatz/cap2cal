#!/bin/bash

# Crashlytics Setup Verification Script
# This script checks if Firebase Crashlytics is properly configured for iOS

echo "🔍 Verifying Firebase Crashlytics Setup for iOS..."
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check 1: Podfile includes Crashlytics
echo "1️⃣  Checking Podfile..."
if grep -q "Firebase/Crashlytics" native/ios/App/Podfile; then
    echo -e "${GREEN}✓${NC} Firebase/Crashlytics found in Podfile"
else
    echo -e "${RED}✗${NC} Firebase/Crashlytics not found in Podfile"
fi

# Check 2: GoogleService-Info.plist exists
echo ""
echo "2️⃣  Checking GoogleService-Info.plist..."
if [ -f "native/ios/App/App/GoogleService-Info.plist" ]; then
    echo -e "${GREEN}✓${NC} GoogleService-Info.plist found"
else
    echo -e "${RED}✗${NC} GoogleService-Info.plist not found"
fi

# Check 3: FirebaseCrashlytics pod is installed
echo ""
echo "3️⃣  Checking if Crashlytics pod is installed..."
if [ -d "native/ios/App/Pods/FirebaseCrashlytics" ]; then
    echo -e "${GREEN}✓${NC} FirebaseCrashlytics pod installed"

    # Check for upload script
    if [ -f "native/ios/App/Pods/FirebaseCrashlytics/run" ]; then
        echo -e "${GREEN}✓${NC} Upload script found at Pods/FirebaseCrashlytics/run"
    else
        echo -e "${YELLOW}⚠${NC}  Upload script not found (might be in a different location)"
    fi
else
    echo -e "${RED}✗${NC} FirebaseCrashlytics pod not installed. Run 'pod install' in native/ios/App/"
fi

# Check 4: Build settings recommendations
echo ""
echo "4️⃣  Manual Checks Required in Xcode:"
echo -e "${YELLOW}→${NC} Open: native/ios/App/App.xcworkspace"
echo -e "${YELLOW}→${NC} Build Settings → Debug Information Format → Should be 'DWARF with dSYM File'"
echo -e "${YELLOW}→${NC} Build Phases → Should have 'Upload dSYMs to Crashlytics' run script"

echo ""
echo "5️⃣  To test Crashlytics:"
echo "   - Build and run on a real iOS device (simulators don't support Crashlytics)"
echo "   - Go to Settings → Test Crash Reporting"
echo "   - Check Firebase Console in ~5 minutes"

echo ""
echo "📚 Documentation:"
echo "   https://firebase.google.com/docs/crashlytics/get-started?platform=ios"
