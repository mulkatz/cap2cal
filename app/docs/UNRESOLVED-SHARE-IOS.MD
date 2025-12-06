# iOS PDF Image Loading Issue - Investigation Log

**Status:** UNRESOLVED
**Date:** December 6, 2024
**Severity:** High - Blocks PDF sharing on first attempt on iOS
**Platforms Affected:** iOS only (Android works fine)

---

## Problem Description

### Symptoms
- Event images do not appear in generated PDFs on iOS on the **first share attempt**
- Image appears correctly on the **second share attempt** (and subsequent attempts)
- Android works correctly on first attempt every time
- Space is reserved for the image in the PDF (layout correct), but the actual image data doesn't render

### User Reports
- "only working on seconds try again"
- "We still have the problem that image (probably not always but most of the time renders on seconds time, sometimes also on first time I think) on ios"
- "it seems as if the image was there (there is lots of free space on the card, where the image should be). But it's not displayed on the pdf (on first try)"
- Initially worked on result screen first try, event history second try only (suggesting stacking context differences)
- "Now also in result view it works on second attempt only"

### Technical Context
- Image is stored as base64 data URL in IndexedDB
- Screenshot taken using `html-to-image` library (`toPng()`)
- Running in iOS WKWebView (Capacitor)
- Interactive PDF generated using `jsPDF`
- Share functionality uses Capacitor Share API

---

## Key Observations

### What Works
✅ Android: First attempt always works
✅ iOS: Second attempt always works
✅ PDF generation itself works (layout, clickable links, all elements except image)
✅ All interactive elements (ticket button, location, footer links) work correctly

### What Doesn't Work
❌ iOS: Image not displayed on first share attempt
❌ Image element exists in DOM (space reserved)
❌ Image src is set correctly
❌ Timing delays don't help (even 7 seconds)

### Critical Clue
**The fact that it works on second attempt suggests:**
- The image data IS valid
- iOS CAN load and render it
- Something about the first attempt prevents iOS from decoding/rendering the image
- On second attempt, image is likely cached in iOS's memory/cache
- **This is NOT a pure timing issue** (since even long delays don't help)

---

## Attempted Solutions

### Attempt 1: Simple Timing Delay (500ms + RAF)
**Date:** Early in conversation
**Approach:**
```typescript
await new Promise((resolve) => setTimeout(resolve, 500));
await new Promise((resolve) => requestAnimationFrame(() => resolve()));
```
**Result:** ❌ Failed
**Notes:** Image still didn't appear on first attempt

---

### Attempt 2: Visibility Hidden/Visible Toggle
**Date:** Mid conversation
**Approach:**
- Set share card to `visibility: hidden`
- Toggle to `visibility: visible` before screenshot
- Toggle back to `hidden` after screenshot

**Result:** ❌ Failed (PDF was completely black)
**Notes:** `html-to-image` library cannot capture elements with `visibility: hidden`

---

### Attempt 3: Extended Timing Test (7 seconds)
**Date:** Mid conversation
**Approach:**
```typescript
await new Promise((resolve) => setTimeout(resolve, 7000));
```
**Result:** ❌ Failed
**Conclusion:** Timing is NOT the issue

---

### Attempt 4: Force DOM Element Decode
**Date:** Mid conversation
**Approach:**
```typescript
const img = shareCardRef.current?.querySelector('img');
if (img) {
  await img.decode();
}
```
**Result:** ❌ Failed
**Notes:** iOS still didn't render image on first attempt

---

### Attempt 5: Position Change (Fixed to Absolute)
**Date:** Mid conversation
**Approach:**
- Changed share card container from `position: fixed` to `position: absolute`
- Theory: iOS WKWebView has stacking context issues with fixed positioning

**Code:**
```typescript
// Before: position: fixed
// After: position: absolute
<div className="pointer-events-none absolute left-0 top-0 w-[400px] -translate-y-[99%]">
```
**Result:** ❌ Failed
**Notes:** Positioning was not the issue

---

### Attempt 6: Double-Screenshot with Visibility Toggle
**Date:** Mid conversation
**Approach:**
1. Make share card visible
2. Take first screenshot (prime iOS)
3. Hide and show again
4. Take second screenshot (use this one)

**Result:** ❌ Failed
**Notes:** Even the second screenshot in the same session didn't work

---

### Attempt 7: Remove and Re-set Image Source
**Date:** Mid conversation
**Approach:**
```typescript
const img = shareCardRef.current?.querySelector('img');
if (img) {
  const originalSrc = img.src;
  img.src = '';
  await new Promise(resolve => setTimeout(resolve, 50));
  img.src = originalSrc;
  await new Promise(resolve => {
    img.onload = () => resolve();
  });
}
```
**Result:** ❌ Failed
**Notes:** Forcing a re-load didn't help

---

### Attempt 8: Dynamic Image Insertion to Visible Card
**Date:** Late conversation
**Approach:**
1. Create fresh `<img>` element dynamically
2. Set `img.src = data.img.dataUrl`
3. Insert into the VISIBLE card (not hidden share card)
4. Wait for `img.onload` event
5. Screenshot the visible card
6. Remove image and restore

**Code:**
```typescript
photoElement = document.createElement('div');
const img = document.createElement('img');
img.src = data.img.dataUrl;
photoElement.appendChild(img);
cardElement.insertBefore(photoElement, cardElement.firstChild);

await new Promise<void>((resolve) => {
  if (img.complete && img.naturalWidth > 0) {
    resolve();
  } else {
    img.onload = () => resolve();
    img.onerror = () => resolve();
  }
});

const cardScreenshotDataUrl = await takeScreenshot(cardRef.current!);
photoElement.remove();
```
**Result:** ❌ Failed
**User Feedback:** "Its still not working"

---

### Attempt 9: Blob URL Instead of Data URL
**Date:** Latest attempt (Dec 6, 2024)
**Approach:**
- Convert data URL to Blob
- Create Object URL from Blob
- Use blob URL in img src instead of data URL
- Theory: iOS WKWebView handles blob URLs better than data URLs

**Code:**
```typescript
// useEffect to convert data URL to blob URL
useEffect(() => {
  if (!data.img?.dataUrl) {
    setImageBlobUrl(null);
    return;
  }

  const dataUrl = data.img.dataUrl;
  const arr = dataUrl.split(',');
  const mimeMatch = arr[0].match(/:(.*?);/);
  if (!mimeMatch) {
    console.error('Invalid data URL format');
    setImageBlobUrl(null);
    return;
  }

  const mime = mimeMatch[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  const blob = new Blob([u8arr], { type: mime });
  const objectUrl = URL.createObjectURL(blob);
  setImageBlobUrl(objectUrl);

  return () => {
    URL.revokeObjectURL(objectUrl);
  };
}, [data.img?.dataUrl]);

// Image src with fallback
<img src={imageBlobUrl || data.img.dataUrl} />
```

**Initial Result:** ❌ Failed - Share functionality completely broken (dialog closed without sharing)
**Cause:** Blob URL state variable not ready when `handleShare` was called, and waiting logic used state variable in closure (didn't update)

**Refinement:**
- Fixed waiting logic to check DOM element directly instead of state variable
- Added fallback: `imageBlobUrl || data.img.dataUrl`
- Increased wait time to 500ms for conditional elements
- Added detailed console logging

**Final Result:** ❌ Not tested (user decided to stop attempts)

---

### Attempt 10: Make Share Card Always Visible (Behind Dialog)
**Date:** Latest attempt (Dec 6, 2024)
**Approach:**
- Don't hide the share card at all
- Keep it always visible but positioned behind the dialog (z-index)
- Theory: iOS will always have it rendered, so screenshot should work

**Status:** Implemented but not tested (part of Attempt 9)

---

## Additional Issue Discovered

### Android: Ticket Button Sometimes Invisible
**Date:** Dec 6, 2024
**Symptom:** On Android, ticket button sometimes doesn't display in PDF (space reserved but button invisible)
**User Quote:** "Since there is some calculation involved when rendering the ticket button it's mounted later, maybe this is the issue here"
**Analysis:** Ticket button is conditionally rendered based on async data. If screenshot happens before button mounts, it won't be in PDF
**Attempted Fix:** 500ms wait for conditional elements
**Status:** Not confirmed if fixed

---

## Technical Analysis

### Why Second Attempt Works
1. **iOS Image Caching:** On first attempt, iOS decodes and caches the image
2. **Memory Persistence:** Image stays in iOS WKWebView's memory cache
3. **Instant Availability:** On second attempt, cached image loads instantly
4. **Render Pipeline:** Cached images skip iOS's normal loading/decoding pipeline

### iOS WKWebView Known Issues
- **Data URL Limitations:** WKWebView has known issues with large data URLs
- **Security Policies:** Stricter than desktop Safari regarding resource loading
- **Process Isolation:** WKWebView runs in separate process with different memory model
- **Rendering Pipeline:** Different from mobile Safari
- **Stacking Contexts:** Issues with fixed positioning and transforms

### Hypotheses Tested
1. ❌ Timing issue (need to wait longer) - **Disproven** (7 seconds didn't help)
2. ❌ Element must be visible - **Disproven** (visible elements still failed)
3. ❌ Stacking context issue - **Disproven** (fixed vs absolute didn't help)
4. ❌ Image src must be set after element is visible - **Disproven**
5. ❌ Need fresh Image object - **Disproven**
6. ❓ Data URL vs Blob URL - **Inconclusive** (implementation had bugs, not tested properly)

### Hypotheses Not Tested
1. ⏳ **Native iOS code intervention required** - May need to use native iOS APIs to force image loading
2. ⏳ **Different screenshot library** - Try alternatives to `html-to-image` (e.g., `dom-to-image`, `html2canvas`)
3. ⏳ **Pre-render image in hidden canvas** - Draw image to canvas first, then use canvas as source
4. ⏳ **Convert to PNG before storing** - Store actual PNG blob in IndexedDB instead of data URL
5. ⏳ **Use img element elsewhere on page** - Have a hidden img element that keeps image in memory
6. ⏳ **WKWebView configuration** - May need to change WKWebView settings in native iOS code
7. ⏳ **Safari Web Inspector** - Connect iOS device to Mac and inspect WebView to see actual errors

---

## Code Locations

### Primary Files
- **EventCard Component:** `/app/src/components/features/cards/EventCard.tsx`
    - Lines 175-209: Blob URL conversion useEffect
    - Lines 235-407: handleShare function
    - Lines 584-593: Share card variant image rendering

- **Screenshot Hook:** `/app/src/hooks/useEventCardScreenshot.tsx`
    - Returns data URL (not file URI) for WKWebView compatibility

- **Share Hook:** `/app/src/hooks/useShare.tsx`
    - Handles native sharing via Capacitor Share API

- **PDF Generator:** `/app/src/utils/pdfGenerator.ts`
    - Takes screenshot data URL and generates PDF with clickable areas

### Key Dependencies
- `html-to-image` - Screenshot library
- `jspdf` - PDF generation
- `@capacitor/filesystem` - File system access
- `@capacitor/share` - Native sharing

---

## Current Code State

### Share Card Structure
```typescript
{/* Hidden Share Variant Card (for PDF generation only) */}
{!isShareVariant && (
  <div
    ref={shareCardContainerRef}
    className="pointer-events-none absolute left-0 top-0 w-[400px] -translate-y-[99%]"
    aria-hidden="true"
    style={{ visibility: 'hidden', zIndex: -1 }}>
    <Card ref={shareCardRef} ...>
      {/* Event Photo - Uses blob URL if available, falls back to data URL */}
      {data.img?.id && (
        <div className="w-full">
          <img
            src={imageBlobUrl || data.img.dataUrl}
            alt={title || 'Event'}
            className="h-auto w-full rounded-t-[20px] object-contain"
          />
        </div>
      )}
      {/* ... rest of card content ... */}
    </Card>
  </div>
)}
```

### Share Function Flow
```typescript
const handleShare = async () => {
  // 1. Fetch ticket link if needed
  // 2. Make share card visible
  shareCardContainerRef.current.style.visibility = 'visible';

  // 3. Wait for image to load
  if (data.img?.id) {
    const shareCardImg = shareCardRef.current?.querySelector('img');
    await new Promise((resolve) => {
      if (shareCardImg.complete && shareCardImg.naturalWidth > 0) {
        resolve();
      } else {
        shareCardImg.onload = () => resolve();
        shareCardImg.onerror = () => resolve();
        setTimeout(() => resolve(), 5000); // 5s timeout
      }
    });
  }

  // 4. Wait for conditional elements (ticket button)
  await new Promise((resolve) => setTimeout(resolve, 500));

  // 5. Force reflow
  shareCardRef.current!.offsetHeight;

  // 6. Take screenshot
  const cardScreenshotDataUrl = await takeScreenshot(shareCardRef.current!);

  // 7. Hide share card
  shareCardContainerRef.current.style.visibility = 'hidden';

  // 8. Generate PDF and share
  // ...
};
```

---

## Console Logs for Debugging

Current implementation includes detailed logging:

```
[Share] Waiting for image to load...
[Share] Image already loaded
[Share] Waiting for conditional elements...
[Share] Taking screenshot...
[Share] Screenshot result: success
```

Or on failure:
```
[Share] Image failed to load
[Share] Image load timeout
[Share] Screenshot result: failed
```

---

## Recommended Next Steps

### High Priority
1. **Test with Safari Web Inspector**
    - Connect iOS device to Mac
    - Enable Web Inspector in Safari
    - Check for console errors, network issues, or security warnings
    - Inspect actual image element state in WKWebView

2. **Try Different Screenshot Library**
    - Test with `dom-to-image-more` (fork with better browser support)
    - Test with native `html2canvas`
    - Compare results across libraries

3. **Canvas Pre-rendering Approach**
   ```typescript
   const canvas = document.createElement('canvas');
   const ctx = canvas.getContext('2d');
   const img = new Image();
   img.src = data.img.dataUrl;
   await img.decode();
   canvas.width = img.naturalWidth;
   canvas.height = img.naturalHeight;
   ctx.drawImage(img, 0, 0);
   const canvasDataUrl = canvas.toDataURL('image/png');
   // Use canvasDataUrl as img src
   ```

### Medium Priority
4. **Store PNG Blobs Instead of Data URLs**
    - Convert images to PNG blobs when storing in IndexedDB
    - Create object URLs on demand
    - May reduce memory pressure on iOS

5. **Hidden Persistent Image Element**
    - Keep a hidden `<img>` element on the page at all times
    - Update its src when event changes
    - Forces iOS to keep image in memory
    - Use same image reference in share card

6. **Native iOS Capacitor Plugin**
    - Create custom Capacitor plugin
    - Use native iOS APIs to force WKWebView image loading
    - May have more control over rendering pipeline

### Low Priority
7. **WKWebView Configuration Changes**
    - Investigate iOS native configuration options
    - May need to adjust cache policies, security settings
    - Requires native iOS development knowledge

8. **Alternative Sharing Strategy**
    - Generate PDF on backend instead of client-side
    - Send image data to server, generate PDF there
    - Download and share PDF
    - More reliable but requires backend infrastructure

---

## Workarounds (Not Implemented)

### Workaround 1: Always Share Twice
- Automatically trigger share flow twice
- Discard first result, use second
- User doesn't see the difference
- **Pros:** Guaranteed to work
- **Cons:** Slower, wasteful, hacky

### Workaround 2: Pre-warm on App Load
- When app loads, silently render share cards for all events
- Forces iOS to cache images
- **Pros:** First share would work
- **Cons:** Memory intensive, may hurt performance

### Workaround 3: Remove Images from PDF
- Simply don't include images in shared PDFs
- Show text-only event cards
- **Pros:** No issues
- **Cons:** Much less appealing, defeats purpose

---

## Resources

### Related Issues
- [html-to-image iOS issues](https://github.com/bubkoo/html-to-image/issues?q=is%3Aissue+ios)
- [WKWebView image loading](https://developer.apple.com/forums/tags/wkwebview)
- [Capacitor iOS WebView](https://capacitorjs.com/docs/ios/troubleshooting)

### Alternative Libraries
- [dom-to-image-more](https://github.com/1904labs/dom-to-image-more) - Fork with better browser support
- [html2canvas](https://html2canvas.hertzen.com/) - Popular alternative
- [modern-screenshot](https://github.com/qq15725/modern-screenshot) - Modern approach

### Debugging Tools
- Safari Web Inspector (iOS device debugging)
- Xcode Device Console (native iOS logs)
- Remote debugging via USB

---

## Summary

After **10 distinct approaches** and multiple variations, the iOS image loading issue remains **unresolved**. The core problem is that iOS WKWebView does not render images from data URLs on the first screenshot attempt, but works perfectly on subsequent attempts (due to caching).

**Key Takeaway:** This appears to be a fundamental limitation or quirk of iOS WKWebView's rendering pipeline that cannot be solved purely with JavaScript timing or DOM manipulation. The solution likely requires:
1. Native iOS intervention, OR
2. A completely different approach to image handling (canvas, different library, backend generation), OR
3. Identifying and fixing the root cause via Safari Web Inspector

The issue is **high severity** as it blocks core functionality (PDF sharing) but has the **workaround** of sharing twice (not user-friendly).

---

**Document Last Updated:** December 6, 2024
**Next Review:** When attempting new solutions or when Safari Web Inspector reveals new information
