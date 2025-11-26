#!/bin/bash

# Manual dSYM Upload Script for Firebase Crashlytics
# Use this to manually upload dSYM files to Firebase

echo "📤 Manual dSYM Upload to Firebase Crashlytics"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Paths
UPLOAD_SCRIPT="native/ios/App/Pods/FirebaseCrashlytics/upload-symbols"
GOOGLE_SERVICE_INFO="native/ios/App/App/GoogleService-Info.plist"

# Check if upload script exists
if [ ! -f "$UPLOAD_SCRIPT" ]; then
    echo -e "${RED}✗${NC} Upload script not found at: $UPLOAD_SCRIPT"
    echo "Run 'pod install' in native/ios/App/ first"
    exit 1
fi

# Check if GoogleService-Info.plist exists
if [ ! -f "$GOOGLE_SERVICE_INFO" ]; then
    echo -e "${RED}✗${NC} GoogleService-Info.plist not found"
    exit 1
fi

echo "🔍 Looking for dSYM files..."
echo ""

# Find dSYM files in common locations
DSYM_PATHS=(
    "$HOME/Library/Developer/Xcode/DerivedData"
    "native/ios/App/build"
    "native/ios/App/DerivedData"
)

FOUND_DSYMS=()

for SEARCH_PATH in "${DSYM_PATHS[@]}"; do
    if [ -d "$SEARCH_PATH" ]; then
        while IFS= read -r DSYM; do
            FOUND_DSYMS+=("$DSYM")
        done < <(find "$SEARCH_PATH" -name "*.dSYM" -type d 2>/dev/null)
    fi
done

if [ ${#FOUND_DSYMS[@]} -eq 0 ]; then
    echo -e "${YELLOW}⚠${NC}  No dSYM files found"
    echo ""
    echo "To generate dSYM files:"
    echo "  1. Open: open native/ios/App/App.xcworkspace"
    echo "  2. Build Settings → Debug Information Format → 'DWARF with dSYM File'"
    echo "  3. Build your project (⌘B)"
    echo ""
    exit 1
fi

echo -e "${GREEN}✓${NC} Found ${#FOUND_DSYMS[@]} dSYM file(s)"
echo ""

# Show found dSYMs
for i in "${!FOUND_DSYMS[@]}"; do
    DSYM="${FOUND_DSYMS[$i]}"
    BASENAME=$(basename "$DSYM")
    SIZE=$(du -sh "$DSYM" 2>/dev/null | cut -f1)
    echo "  [$i] $BASENAME ($SIZE)"
done

echo ""

# If only one dSYM, upload it automatically
if [ ${#FOUND_DSYMS[@]} -eq 1 ]; then
    SELECTED_DSYM="${FOUND_DSYMS[0]}"
    echo "Uploading: $(basename "$SELECTED_DSYM")"
else
    # Multiple dSYMs found, ask user to select
    echo -n "Select dSYM to upload [0-$((${#FOUND_DSYMS[@]}-1))]: "
    read SELECTION

    if [ "$SELECTION" -lt 0 ] || [ "$SELECTION" -ge ${#FOUND_DSYMS[@]} ]; then
        echo -e "${RED}✗${NC} Invalid selection"
        exit 1
    fi

    SELECTED_DSYM="${FOUND_DSYMS[$SELECTION]}"
fi

echo ""
echo "📤 Uploading to Firebase Crashlytics..."
echo ""

# Upload to Firebase
"$UPLOAD_SCRIPT" \
    -gsp "$GOOGLE_SERVICE_INFO" \
    -p ios \
    "$SELECTED_DSYM"

UPLOAD_STATUS=$?

echo ""

if [ $UPLOAD_STATUS -eq 0 ]; then
    echo -e "${GREEN}✅ Successfully uploaded to Firebase Crashlytics!${NC}"
    echo ""
    echo "View crashes at: https://console.firebase.google.com"
else
    echo -e "${RED}✗ Upload failed with status code: $UPLOAD_STATUS${NC}"
    echo ""
    echo "Troubleshooting:"
    echo "  1. Check your internet connection"
    echo "  2. Verify GoogleService-Info.plist is correct"
    echo "  3. Ensure Firebase project has Crashlytics enabled"
fi
