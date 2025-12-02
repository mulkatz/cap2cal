# Testing the New Home Screen

## ✅ Build Status
- **TypeScript:** ✅ No errors
- **Vite Build:** ✅ Complete
- **Bundle Size:** 1.42 MB (401 KB gzipped)
- **Status:** Ready for testing

---

## 🚀 Quick Start - Option 1: Web Preview

The dev server is running at: **http://localhost:9001/**

**To see the new home screen:**

1. Open `app/src/pages/App.tsx`
2. Find the HomeView import (around line 10)
3. Change:
   ```tsx
   import { HomeView } from './HomeView';
   ```
   To:
   ```tsx
   import { HomeViewNew as HomeView } from './HomeViewNew';
   ```
4. Save the file
5. Open http://localhost:9001/ in your browser

**Note:** Web preview has limitations (no native features), but you can see the design and layout.

---

## 📱 Quick Start - Option 2: iOS/Android

**For iOS:**
```bash
cd /Users/franz/Workspace/cap2cal/app
npm run build
npx cap sync ios
npx cap open ios
```

Then in Xcode:
1. Make the same import change in `App.tsx` (see above)
2. Run on simulator or device
3. Test all features

**For Android:**
```bash
cd /Users/franz/Workspace/cap2cal/app
npm run build
npx cap sync android
npx cap open android
```

Then in Android Studio:
1. Make the same import change in `App.tsx` (see above)
2. Run on emulator or device
3. Test all features

---

## 🧪 Testing Checklist

### **Empty State** (No Events)
To test, clear your database first:
1. Open Settings → Data Management → Clear Storage
2. Confirm deletion
3. Return to home screen

**What to verify:**
- ✅ "Ready to Capture?" header shows
- ✅ 3 feature highlight cards display
- ✅ Bounce arrow animation works
- ✅ No stats dashboard (hidden when empty)
- ✅ Quick actions grid shows (Import, History, Favorites, Settings)
- ✅ Capture button at bottom

### **With Events** (After Capturing)
Capture 3-5 events to test:

**What to verify:**
- ✅ Stats dashboard appears at top
- ✅ Animated counters count up
- ✅ Stats show correct numbers:
  - Total Events (should match your count)
  - Upcoming (events from today onwards)
  - This Month (events in current month)
- ✅ Quick actions grid shows
- ✅ History tile has badge with upcoming count
- ✅ Favorites tile has badge if you've favorited events
- ✅ Events preview shows (carousel of next 5 events)
- ✅ Event cards show correct data
- ✅ "See All" button works

### **Interactions**
Test all interactive elements:

**Stats Cards:**
- ✅ Hover effect (border highlight)
- ✅ Icon scales on hover
- ✅ Numbers animate on mount

**Quick Action Tiles:**
- ✅ Import button opens gallery picker
- ✅ History button opens history screen
- ✅ Favorites button opens history (filtered)
- ✅ Settings button opens settings
- ✅ Hover gradient appears
- ✅ Icons scale on hover
- ✅ Active press state (scale down)

**Events Preview:**
- ✅ Horizontal scroll works
- ✅ Cards show correct data
- ✅ Clicking card opens history to that event
- ✅ "See All" opens full history
- ✅ Date badges format correctly (Today/Tomorrow/Date)

**Capture Button:**
- ✅ Ripple effect on click
- ✅ Opens camera
- ✅ Loading spinner shows during processing

### **Translations**
Test in both languages:

**English (EN):**
1. Settings → Language → English
2. Return to home
3. Verify all text is in English

**German (DE):**
1. Settings → Language → Deutsch
2. Return to home
3. Verify all text is in German

### **Responsive Design**
Test on different screen sizes:
- ✅ iPhone SE (small screen)
- ✅ iPhone 14 Pro (notch)
- ✅ iPhone 14 Pro Max (large screen)
- ✅ Android phone (various sizes)
- ✅ Tablet (if supported)

**What to verify:**
- ✅ Safe area respected (notch, home indicator)
- ✅ Content scrolls properly
- ✅ No horizontal overflow
- ✅ Capture button always visible
- ✅ Stats cards fit in viewport
- ✅ Quick actions grid responsive

---

## 🐛 Troubleshooting

### Build Errors
If you see TypeScript errors:
```bash
cd /Users/franz/Workspace/cap2cal/app
npm run build
```
Check the output for specific errors.

### Import Errors
If components don't load:
1. Check `app/src/components/features/home/index.ts` exists
2. Verify all components are exported
3. Clear node_modules and reinstall:
   ```bash
   rm -rf node_modules
   npm install
   ```

### Translation Missing
If you see translation keys instead of text:
1. Check `app/src/assets/translations/en_GB.json`
2. Verify `home.*` keys exist
3. Restart the app

### Animations Not Working
If animations are choppy or missing:
1. Check `app/src/index.css` has `@keyframes fadeInUp`
2. Verify Tailwind compiled properly
3. Check browser/device supports CSS animations

### Stats Show Wrong Numbers
If stats don't match reality:
1. Check Dexie database in DevTools
2. Verify event dates are correct
3. Check date calculations in `StatsDashboard.tsx`

---

## 📸 Screenshots to Take

For documentation/app store:

1. **Empty state** - New user view
2. **Stats dashboard** - Top section with metrics
3. **Quick actions** - 2x2 grid of tiles
4. **Events preview** - Horizontal carousel
5. **Full screen** - Complete home screen with events
6. **Capture interaction** - Button with ripple effect

---

## 🎨 Design Review Checklist

### Visual Polish
- ✅ Glassmorphism effects render correctly
- ✅ Electric yellow (#E6DE4D) used consistently
- ✅ Spacing is consistent (Tailwind spacing scale)
- ✅ Typography hierarchy is clear
- ✅ Icons are consistent size and style
- ✅ Shadows are subtle and appropriate

### Animations
- ✅ Counter animations smooth (not jarring)
- ✅ Fade-in delays feel natural
- ✅ Hover states responsive
- ✅ No janky animations
- ✅ Transitions are smooth (300ms duration)

### UX
- ✅ Touch targets are 44px+ (accessibility)
- ✅ Interactive elements have clear feedback
- ✅ Loading states are clear
- ✅ Error states are handled
- ✅ Empty states are informative
- ✅ Navigation is intuitive

---

## 📊 Performance Check

### Bundle Size
Current: **1.42 MB** (401 KB gzipped)
- This is acceptable for initial MVP
- Future optimization: Code splitting, lazy loading

### Load Time
- Home screen should render < 1 second
- Stats should calculate < 100ms
- Animations should start immediately

### Memory
- Check for memory leaks (DevTools Performance tab)
- Verify no excessive re-renders
- Check React DevTools Profiler

---

## ✅ Acceptance Criteria

Before merging/deploying, verify:

1. **Functionality:**
   - ✅ All buttons work
   - ✅ All navigation works
   - ✅ Stats calculate correctly
   - ✅ Events display correctly
   - ✅ Translations work

2. **Design:**
   - ✅ Matches premium aesthetic
   - ✅ Animations smooth
   - ✅ Responsive on all devices
   - ✅ Safe areas respected

3. **Performance:**
   - ✅ No lag on interactions
   - ✅ Smooth scrolling
   - ✅ Fast load times

4. **Accessibility:**
   - ✅ Touch targets adequate
   - ✅ Color contrast acceptable
   - ✅ Text readable

5. **i18n:**
   - ✅ English complete
   - ✅ German complete
   - ✅ No missing keys

---

## 🚦 Next Steps After Testing

### If Issues Found
1. Document issues in GitHub Issues
2. Prioritize by severity
3. Fix critical bugs before merge
4. Re-test after fixes

### If All Tests Pass
1. Update app store screenshots
2. Add analytics events
3. Create migration plan
4. A/B test (10% rollout)
5. Monitor metrics
6. Full rollout

---

## 📝 Feedback Template

When testing, note:

**What works well:**
- [List what you like]

**What needs improvement:**
- [List issues, bugs, or suggestions]

**Design feedback:**
- [Visual/UX feedback]

**Performance:**
- [Any lag, slow loads, etc.]

**Translations:**
- [Any missing or incorrect translations]

---

**Happy Testing!** 🎉

If you encounter any issues, check the comprehensive documentation in `HOME_REDESIGN_SUMMARY.md`.
