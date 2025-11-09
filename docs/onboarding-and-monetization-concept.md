# Onboarding & Monetization Strategy
## Cap2Cal User Experience & Revenue Optimization

**Version:** 2.0
**Date:** 2025-01-08
**Status:** Draft for Implementation

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Business Model Options](#business-model-options)
3. [Current State Analysis](#current-state-analysis)
4. [Onboarding Flow Design](#onboarding-flow-design)
5. [Monetization Strategy A: Affiliate Revenue](#monetization-strategy-a-affiliate-revenue)
6. [Monetization Strategy B: Subscription Revenue](#monetization-strategy-b-subscription-revenue)
7. [Monetization Strategy C: Hybrid Model](#monetization-strategy-c-hybrid-model)
8. [User Journey & Touchpoints](#user-journey--touchpoints)
9. [UI/UX Specifications](#uiux-specifications)
10. [Technical Implementation Guide](#technical-implementation-guide)
11. [Analytics & Optimization](#analytics--optimization)
12. [A/B Testing Framework](#ab-testing-framework)
13. [Implementation Roadmap](#implementation-roadmap)

---

## Executive Summary

Cap2Cal has **two potential revenue streams** that can be tested independently or combined:

### Revenue Stream #1: Affiliate Commissions
- Users get **unlimited free captures**
- Revenue from "Find Tickets" affiliate link clicks
- Volume-based model (more users = more clicks = more revenue)
- Lower friction, broader user base

### Revenue Stream #2: Subscription Plans
- Users pay for **unlimited captures** after free tier (5/month)
- Recurring revenue from Pro subscriptions
- Predictable MRR, fewer users but higher ARPU
- Backend infrastructure already complete

### Recommended Approach: TEST BOTH
Use the existing `paid_only` Remote Config flag to A/B test between models:
- **`paid_only: false`** → Affiliate model (unlimited captures, promote ticket links)
- **`paid_only: true`** → Subscription model (limit captures, promote Pro upgrade)
- **Hybrid:** Combine both (free users see affiliate links, Pro users don't)

This document provides implementation guidance for **all three strategies** so you can optimize based on real data.

**Key Insight:** The backend is ready. We need to build:
1. Onboarding (same for all models)
2. Affiliate link optimization UI (for affiliate/hybrid)
3. Subscription paywall UI (for subscription/hybrid)

---

## Business Model Options

### Model Comparison

| Factor | Affiliate Model | Subscription Model | Hybrid Model |
|--------|----------------|-------------------|--------------|
| **User Friction** | Low (unlimited free) | Medium (5 captures/month) | Low-Medium |
| **Revenue Predictability** | Low (depends on clicks) | High (recurring MRR) | Medium-High |
| **Scalability** | High (more users = more clicks) | Medium (conversion-limited) | High |
| **ARPU** | Low ($0.10-0.50/user/month) | High ($2-5/user/month) | Medium-High |
| **User Base Size** | Large (no paywall) | Smaller (paywall limits) | Large |
| **Time to Revenue** | Immediate (first ticket click) | Delayed (after 5 captures) | Immediate + Recurring |
| **Churn Risk** | N/A (all users free) | Medium (subscription fatigue) | Low (multiple revenue streams) |
| **Implementation Complexity** | Low (UI changes only) | Medium (payment integration) | High (both systems) |

---

### Model A: Affiliate Revenue Only

**Strategy:** Keep app completely free, monetize through ticket affiliate links

#### How It Works
1. User captures unlimited events (no capture limits)
2. "Find Tickets" button prominently displayed on every event card
3. Clicking "Find Tickets" → searches for tickets via affiliate program
4. User purchases ticket → Cap2Cal earns commission (5-15% typical)

#### Revenue Assumptions
- **Conversion Rate:** 5-10% of events have available tickets
- **Click-Through Rate:** 20-30% of users click "Find Tickets"
- **Purchase Conversion:** 2-5% of clicks result in ticket purchase
- **Average Commission:** $2-5 per ticket sold
- **Monthly Revenue per 1000 Users:** $20-100

#### Pros ✅
- Zero friction (no paywalls, no limits)
- Aligns with user intent (people want to attend events)
- Scales with user growth
- No payment integration needed
- Better App Store ratings (free = happier users)
- Viral growth potential (people share free apps)

#### Cons ❌
- Unpredictable revenue (depends on event types)
- Not all events have ticketing (birthday parties, local gatherings)
- Low commission rates (need high volume)
- Dependent on affiliate program quality
- Revenue lags behind user growth

#### Best For
- Early stage: Building large user base
- Event types: Concerts, sports, festivals, theater
- Geographic focus: Major cities with active event scenes

#### Remote Config Setup
```json
{
  "paid_only": false,
  "show_affiliate_links": true,
  "affiliate_link_prominence": "high"
}
```

---

### Model B: Subscription Revenue Only

**Strategy:** Free tier (5 captures/month), paid Pro tier (unlimited)

#### How It Works
1. User gets 5 free captures per month
2. After 5 captures → hard paywall
3. Upgrade to Pro ($4.99/month or $24.99/year) for unlimited
4. No affiliate links shown (cleaner UX for paying customers)

#### Revenue Assumptions
- **Free to Paid Conversion:** 5-10% of users upgrade
- **Average Subscription:** $30/year (annual plan preferred)
- **Churn Rate:** 5% monthly
- **Monthly Revenue per 1000 Users:** $150-300

#### Pros ✅
- Predictable recurring revenue (MRR)
- Higher ARPU than affiliate model
- Clear value proposition (unlimited captures)
- Independent of event types (all events count)
- Easier financial forecasting
- Premium brand positioning

#### Cons ❌
- Higher user friction (paywall)
- Smaller user base (most users won't pay)
- Requires payment integration (RevenueCat, Stripe)
- Potential for negative reviews ("should be free")
- Churn management overhead
- Customer support for billing issues

#### Best For
- Power users: People who capture >5 events/month
- Professional users: Event planners, organizers
- Value-focused positioning: Premium tool for serious users

#### Remote Config Setup
```json
{
  "paid_only": true,
  "free_capture_limit": 5,
  "show_affiliate_links": false
}
```

---

### Model C: Hybrid (RECOMMENDED)

**Strategy:** Combine affiliate revenue (free users) + subscription revenue (Pro users)

#### How It Works
1. **Free Tier (Unlimited Captures)**
   - No capture limits
   - "Find Tickets" affiliate links shown prominently
   - Optional upgrade to Pro

2. **Pro Tier ($2.99-4.99/month)**
   - Unlimited captures (same as free)
   - **No affiliate links** (cleaner, ad-free experience)
   - Priority support
   - Early access to features
   - Cloud sync (future)
   - Batch export (future)

#### Revenue Assumptions
- **90% Free Users:** Generate affiliate revenue ($0.20/user/month)
- **10% Pro Users:** Generate subscription revenue ($3/user/month)
- **Blended ARPU:** $0.18 + $0.30 = **$0.48/user/month**
- **Monthly Revenue per 1000 Users:** $480

#### Pros ✅
- Two revenue streams (diversified)
- No paywall (keeps free users engaged)
- Higher conversion (Pro is optional, not required)
- Better positioning (Pro = ad-free experience)
- Scales both ways (volume + quality)
- Retains all users (no one blocked)

#### Cons ❌
- More complex implementation (both systems)
- Need to balance affiliate vs Pro messaging
- Risk of cannibalizing Pro sales (if free is too good)
- Requires ongoing optimization (which links to show, when)

#### Best For
- Long-term sustainability
- Maximizing total revenue
- Balancing growth + monetization
- Broad user base with power user segment

#### Remote Config Setup
```json
{
  "paid_only": false,
  "free_capture_limit": 999999,
  "show_affiliate_links": true,
  "hide_affiliate_for_pro": true,
  "affiliate_link_prominence": "medium"
}
```

---

### Decision Framework

#### Choose Affiliate Model If:
- You want rapid user growth
- Your target events have high ticketing rates (concerts, sports)
- You don't want to manage subscriptions/payments yet
- App Store ratings are critical (free apps rate higher)

#### Choose Subscription Model If:
- You need predictable revenue for investors/planning
- Your users capture many events (>5/month)
- You're building premium features worth paying for
- You can justify the value clearly

#### Choose Hybrid Model If:
- You want to maximize total revenue
- You're unsure which model works better (test both!)
- You have time to implement both systems
- You want to serve both casual and power users

---

### Recommended Testing Sequence

**Phase 1 (Months 1-3): Affiliate Only**
- Set `paid_only: false`
- Focus on growth and user acquisition
- Optimize affiliate link placement and CTR
- Measure: DAU, affiliate clicks, commission revenue

**Phase 2 (Months 4-6): Add Subscription Option**
- Keep unlimited captures (no hard paywall)
- Add optional Pro upgrade with benefits
- Measure: free-to-paid conversion, Pro user retention

**Phase 3 (Months 7+): Optimize Mix**
- A/B test hard paywall for subset of users
- Compare total revenue: affiliate-only vs hybrid vs subscription-only
- Choose winning model based on data

---

## Current State Analysis

### What Works Well
✅ **Backend Infrastructure Complete**
- Firebase Anonymous Auth working
- User tracking in Firestore (captureCount, isPro)
- Remote Config for limits (free_capture_limit: 5)
- Limit enforcement logic functional (403 error on exceeded)
- Comprehensive analytics implementation

✅ **Core Product Experience**
- Smooth camera → capture → extraction flow
- Beautiful event cards with rich data
- Multi-calendar export options
- Share intent support (Android)

### Critical Gaps
❌ **No Onboarding**
- Users dropped directly to home screen
- No explanation of how the app works
- No permission primer
- No value proposition communicated

❌ **No Monetization UI**
- Backend returns 403 on limit exceeded
- No paywall dialog
- No upgrade promotion
- No pricing display
- No purchase flow

❌ **No User Education**
- No indication of free capture limit
- No remaining captures counter
- No "why upgrade" messaging

---

## Onboarding Flow Design

### Philosophy
**"Show, Don't Tell" + "Progressive Disclosure"**

Users want to use the app, not read tutorials. The onboarding should:
1. Communicate value in 10 seconds
2. Get users to first capture in <60 seconds
3. Teach through doing, not reading
4. Set expectations about free tier limits

### Recommended Flow: 3-Screen Welcome Sequence

#### Screen 1: Value Proposition (5 seconds)
**Goal:** Instantly communicate what the app does

```
┌─────────────────────────────────┐
│                                 │
│     [Hero Image/Animation]      │
│   (Poster → Calendar Event)     │
│                                 │
│   Turn Event Posters into       │
│   Calendar Invites              │
│                                 │
│   Just snap a photo, we'll      │
│   handle the rest ✨            │
│                                 │
│         [Next Button]           │
│                                 │
│      ● ○ ○      [Skip]          │
└─────────────────────────────────┘
```

**Content:**
- **Headline:** "Turn Event Posters into Calendar Invites"
- **Subheadline:** "Just snap a photo, we'll handle the rest"
- **Visual:** Animated sequence showing poster photo → extracted event → calendar
- **CTA:** "Next" button (primary), "Skip" link (subtle)

**Implementation:**
- Lottie animation or step-by-step visual
- Auto-advance after 5 seconds or user tap
- Swipeable carousel

---

#### Screen 2: How It Works (5 seconds)
**Goal:** Show the 3-step process

```
┌─────────────────────────────────┐
│                                 │
│        How It Works             │
│                                 │
│   1. 📸 Capture                 │
│      Photo any event poster     │
│                                 │
│   2. 🤖 Extract                 │
│      AI reads all the details   │
│                                 │
│   3. 📅 Save                    │
│      Export to your calendar    │
│                                 │
│         [Next Button]           │
│                                 │
│      ○ ● ○      [Skip]          │
└─────────────────────────────────┘
```

**Content:**
- **3 Simple Steps:** Capture → Extract → Save
- **Icons:** Camera, AI sparkle, Calendar
- **Subtext:** Brief one-liner for each step
- **Visual:** Small preview images of each step

**Implementation:**
- Static screen with icons and text
- Minimal, scannable layout
- Focus on speed

---

#### Screen 3: Free Trial + Permissions Primer (10 seconds)
**Goal:** Set expectations & request permissions

```
┌─────────────────────────────────┐
│                                 │
│    Ready to Get Started?        │
│                                 │
│   ✅ First 5 captures FREE      │
│   ✅ No credit card required    │
│   ✅ Works with all calendars   │
│                                 │
│   We'll need access to:         │
│   📸 Camera - to capture events │
│   📅 Calendar - to save events  │
│                                 │
│    [Get Started Button]         │
│                                 │
│      ○ ○ ●      [Skip]          │
└─────────────────────────────────┘
```

**Content:**
- **3 Benefit Bullets:** First 5 free, no credit card, works everywhere
- **Permission Primer:** Explain camera + calendar access
- **CTA:** "Get Started" → closes onboarding, goes to home

**Implementation:**
- Don't request permissions yet (do it just-in-time)
- Set flag in localStorage: `hasSeenOnboarding: true`
- Track analytics: `onboarding_completed`

---

### When to Show Onboarding

**Trigger:** First app open, before showing home screen

**Logic:**
```typescript
if (!localStorage.getItem('hasSeenOnboarding')) {
  showOnboarding();
} else {
  showHomScreen();
}
```

**Skip Conditions:**
- User came via share intent → Skip onboarding, go straight to extraction
- User explicitly taps "Skip" → Mark as seen, continue to home

**Repeat Access:**
- Add "How It Works" button in settings/help
- Allow users to replay onboarding anytime

---

### Alternative: Contextual Onboarding (Progressive Approach)

Instead of upfront screens, teach during first use:

**Option B: Zero-Friction Onboarding**
1. **First Open:** Show tooltip on camera button: "Tap here to capture your first event poster"
2. **After First Capture:** Show tooltip on export button: "Tap to add to your calendar"
3. **After Second Capture:** Show bottom banner: "💡 Tip: You have 3 free captures remaining"

**Recommendation:** Start with **3-Screen Welcome** for initial launch, then A/B test against contextual approach after 3 months.

---

## Monetization Strategy A: Affiliate Revenue

### Overview

If you choose the **Affiliate Model** or **Hybrid Model**, optimizing the "Find Tickets" feature is critical for revenue generation. This section provides guidance on maximizing affiliate click-through rates and conversions.

### Current Implementation

Your app already has a "Find Tickets" button on event cards that searches for ticket purchase links via the `findTickets` backend API. This is the foundation for affiliate revenue.

---

### Affiliate Revenue Optimization Strategy

#### 1. Prominent Ticket Link Placement

**Goal:** Make finding tickets easy and visible

##### Event Card - Primary CTA
```
┌─────────────────────────────────┐
│  Concert: Taylor Swift          │
│  Dec 15, 2025 • 7:00 PM        │
│  Madison Square Garden          │
│                                 │
│  ┌───────────────────────────┐ │
│  │  🎫 Find Tickets          │ │  ← PRIMARY BUTTON
│  └───────────────────────────┘ │
│                                 │
│  [Export to Calendar]           │  ← Secondary button
│  [Share Event]                  │
│                                 │
└─────────────────────────────────┘
```

**Design Principles:**
- **High Contrast:** Use vibrant color (blue, purple, or brand color)
- **Large Touch Target:** Full-width button, 48pt+ height
- **Icon + Text:** Ticket emoji + clear label
- **Above the Fold:** Visible without scrolling
- **A/B Test Positions:** Test above vs below calendar export

---

#### 2. Smart Ticket Detection

**Goal:** Only show "Find Tickets" when tickets are likely available

**Implementation Strategy:**

##### Option A: Show Always (Simplest)
```typescript
// Always show button, let backend handle search
<Button onClick={handleFindTickets}>
  🎫 Find Tickets
</Button>
```

**Pros:** Simplest implementation, no false negatives
**Cons:** Shows for events without tickets (birthday parties, etc.)

##### Option B: Event Type Detection (Smarter)
```typescript
// Show based on event tags/keywords
const hasTicketingKeywords = event.tags?.some(tag =>
  ['concert', 'sports', 'festival', 'theater', 'show', 'game'].includes(tag.toLowerCase())
);

const eventTitleSuggestsTickets = /concert|show|game|festival|tour|performance/i.test(event.title);

const shouldShowTickets = hasTicketingKeywords || eventTitleSuggestsTickets;

{shouldShowTickets && (
  <Button onClick={handleFindTickets}>
    🎫 Find Tickets
  </Button>
)}
```

**Pros:** Reduces friction, only shows when relevant
**Cons:** May miss some ticketed events

##### Option C: Backend Prediction (Best)
```typescript
// Backend returns `hasTicketsAvailable: boolean` during extraction
if (event.hasTicketsAvailable) {
  <Button onClick={handleFindTickets}>
    🎫 Find Tickets
  </Button>
}
```

**Implementation:**
Add to Gemini AI prompt during extraction:
```
Determine if this event likely has tickets available for purchase.
Return hasTicketsAvailable: true for concerts, sports events, festivals, theater, etc.
Return hasTicketsAvailable: false for private events, birthdays, meetings, etc.
```

**Pros:** Most accurate, leverages AI
**Cons:** Requires backend changes

**Recommendation:** Start with Option A (show always), then upgrade to Option C after testing

---

#### 3. Ticket Link UI Enhancements

##### A. Loading State
```
[Finding tickets...]  ← Spinner animation
```

##### B. Success State (Tickets Found)
```
┌─────────────────────────────────┐
│  🎫 Tickets Available!          │
│                                 │
│  Ticketmaster • From $45        │  ← Price preview
│  [Buy Tickets →]                │
│                                 │
│  StubHub • From $52             │
│  [Buy Tickets →]                │
└─────────────────────────────────┘
```

**Features:**
- Show multiple ticket providers
- Display price ranges (if available from API)
- Direct links to purchase pages
- Track which provider gets clicks (for optimization)

##### C. No Tickets Found State
```
┌─────────────────────────────────┐
│  ℹ️ No tickets found            │
│                                 │
│  This event may be private or   │
│  tickets aren't available yet.  │
│                                 │
│  [OK]                           │
└─────────────────────────────────┘
```

**Options:**
- Don't show error (just hide button after search)
- Show gentle message
- Suggest user can still export to calendar

---

#### 4. Affiliate Link Tracking & Attribution

**Goal:** Track which clicks generate revenue

##### Analytics Events
```typescript
// When user taps "Find Tickets"
logEvent('ticket_search_initiated', {
  event_title: event.title,
  event_type: event.tags[0],
  has_location: !!event.location,
});

// When ticket links are found
logEvent('ticket_links_found', {
  event_title: event.title,
  provider_count: ticketProviders.length,
  providers: ticketProviders.map(p => p.name).join(','),
});

// When user taps specific ticket link
logEvent('ticket_link_clicked', {
  event_title: event.title,
  provider: provider.name,
  price_range: provider.priceRange,
  affiliate_id: provider.affiliateId,
});
```

##### Conversion Tracking
Use UTM parameters or affiliate tracking IDs:
```typescript
const affiliateUrl = `${ticketUrl}?utm_source=cap2cal&utm_medium=app&utm_campaign=event_${eventId}&ref=cap2cal_${userId}`;
```

**Track in Firebase Analytics:**
- Click-through rate (CTR): % of users who click "Find Tickets"
- Provider preference: Which ticket providers get most clicks
- Event type correlation: Which events drive most ticket searches
- Conversion rate: % of clicks that result in purchases (if affiliate program provides this data)

---

#### 5. Gamification & Engagement

**Goal:** Encourage users to check ticket links

##### A. "Ticket Alerts" Feature
```
┌─────────────────────────────────┐
│  🔔 Ticket Alert Set!           │
│                                 │
│  We'll notify you when tickets  │
│  become available for:          │
│  "Taylor Swift Concert"         │
│                                 │
│  [OK]                           │
└─────────────────────────────────┘
```

**Implementation:**
- User can "watch" events for ticket availability
- Backend periodically checks if tickets are available
- Push notification when tickets found
- Drives re-engagement + affiliate clicks

##### B. "Popular Events" Section
```
┌─────────────────────────────────┐
│  🔥 Trending Events             │
│                                 │
│  🎤 Taylor Swift Tour           │
│  🎫 Tickets from $89            │
│                                 │
│  ⚽ Lakers vs Warriors          │
│  🎫 Tickets from $45            │
└─────────────────────────────────┘
```

**Strategy:**
- Show popular ticketed events in saved events view
- Curate high-commission events
- Drive additional ticket searches beyond captured events

---

#### 6. A/B Testing for Affiliate Optimization

##### Test 1: Button Placement
- **Control:** "Find Tickets" below calendar export
- **Variant A:** "Find Tickets" above calendar export (primary CTA)
- **Metric:** Click-through rate

##### Test 2: Button Copy
- **Control:** "🎫 Find Tickets"
- **Variant A:** "🎫 Buy Tickets"
- **Variant B:** "🎫 Get Tickets Now"
- **Variant C:** "🎫 Tickets Available"
- **Metric:** Click-through rate

##### Test 3: Price Display
- **Control:** No price shown, just provider names
- **Variant A:** Show "From $XX" price preview
- **Metric:** Click-through rate + conversion (if trackable)

##### Test 4: Timing of Ticket CTA
- **Control:** Show immediately on event card
- **Variant A:** Show after calendar export (upsell)
- **Variant B:** Show in push notification 24h before event
- **Metric:** Total affiliate clicks per user

---

#### 7. Affiliate Partner Selection

**Recommended Partners:**

##### A. Ticketmaster Affiliate Program
- **Commission:** 4-8% per sale
- **Coverage:** Major concerts, sports, theater (US, UK, EU)
- **API:** Yes (for price/availability checking)
- **Approval:** Medium difficulty

##### B. StubHub Affiliate (eBay Partner Network)
- **Commission:** 5-7% per sale
- **Coverage:** Secondary market (resale tickets)
- **API:** Limited
- **Approval:** Easy

##### C. Eventbrite
- **Commission:** 10-20% per sale (varies by event)
- **Coverage:** Independent events, local shows
- **API:** Excellent (event search, availability)
- **Approval:** Easy

##### D. SeatGeek
- **Commission:** 5-10% per sale
- **Coverage:** Sports, concerts, theater
- **API:** Yes
- **Approval:** Medium

##### E. Regional Partners
- **Europe:** Eventim, See Tickets
- **Asia:** BookMyShow (India), Viagogo
- **Australia:** Ticketek

**Strategy:**
- Start with 2-3 partners (Ticketmaster + Eventbrite + regional)
- Show all available options to users (maximize conversion)
- Track which partners drive most revenue
- Negotiate better rates as volume grows

---

#### 8. Remote Config for Affiliate Features

**Config Parameters:**

```json
{
  "show_affiliate_links": true,
  "affiliate_link_prominence": "high",
  "ticket_button_position": "above_export",
  "ticket_button_text": "🎫 Find Tickets",
  "show_ticket_prices": true,
  "enabled_affiliates": ["ticketmaster", "eventbrite", "stubhub"],
  "ticket_search_auto_trigger": false,
  "hide_affiliate_for_pro": true
}
```

**Use Cases:**
- **A/B Testing:** Toggle features for user cohorts
- **Pro User Experience:** Hide affiliate links for paying users
- **Regional Optimization:** Enable different partners by country
- **Emergency Off Switch:** Disable if affiliate program suspended

---

#### 9. Revenue Projections

**Scenario Analysis:**

##### Conservative (Affiliate Only)
- **Monthly Active Users:** 1,000
- **Avg Captures per User:** 3
- **% Events with Tickets:** 15%
- **Ticket Link CTR:** 20%
- **Purchase Conversion:** 3%
- **Avg Commission:** $3

**Calculation:**
- 1,000 users × 3 captures = 3,000 events/month
- 3,000 × 15% ticketed = 450 ticketed events
- 450 × 20% CTR = 90 clicks
- 90 × 3% purchase = 2.7 sales/month
- 2.7 × $3 = **$8/month**

**Per 1,000 MAU: $8**

##### Moderate (Optimized Affiliate)
- **Monthly Active Users:** 1,000
- **Avg Captures per User:** 5 (higher engagement)
- **% Events with Tickets:** 25% (better targeting)
- **Ticket Link CTR:** 35% (optimized UI)
- **Purchase Conversion:** 5%
- **Avg Commission:** $4

**Calculation:**
- 1,000 × 5 = 5,000 events
- 5,000 × 25% = 1,250 ticketed events
- 1,250 × 35% = 437 clicks
- 437 × 5% = 22 sales
- 22 × $4 = **$88/month**

**Per 1,000 MAU: $88**

##### Aggressive (Hybrid Model)
- **Monthly Active Users:** 1,000
  - 900 free users (affiliate revenue)
  - 100 Pro users (subscription revenue)
- **Free User Affiliate Revenue:** 900 × $0.088 = $79/month
- **Pro User Subscription Revenue:** 100 × $3/month = $300/month
- **Total Revenue:** **$379/month**

**Per 1,000 MAU: $379 (blended)**

---

### Implementation Checklist for Affiliate Model

**Phase 1: Basic Implementation**
- [ ] Add prominent "Find Tickets" button to event cards
- [ ] Implement loading/success/error states
- [ ] Add analytics tracking (click, found, no results)
- [ ] Test with 2-3 affiliate partners
- [ ] Set up affiliate accounts (Ticketmaster, Eventbrite)

**Phase 2: Optimization**
- [ ] Add smart ticket detection (event type filtering)
- [ ] Show price previews (if API supports)
- [ ] A/B test button placement and copy
- [ ] Track conversion rates per partner
- [ ] Add Remote Config toggles

**Phase 3: Advanced Features**
- [ ] Implement ticket price alerts
- [ ] Add "trending events" section
- [ ] Build affiliate dashboard (revenue tracking)
- [ ] Negotiate higher commission rates
- [ ] Add regional affiliate partners

---

## Monetization Strategy B: Subscription Revenue

### Philosophy
**"Soft Paywall with Progressive Engagement"**

**Note:** This section applies only if you enable `paid_only: true` in Remote Config.

Users should:
1. Experience value before seeing pricing
2. Be gently reminded of limits before hitting them
3. Understand benefits, not just features
4. Have multiple upgrade touchpoints

### Overview

This strategy implements a freemium model where users get a limited number of captures for free, then must upgrade to Pro for unlimited access. All the UI components and flows described here are **optional** - controlled by the `paid_only` Remote Config flag.

---

### Monetization Tiers

#### Free Tier
- **5 captures per month** (configurable via Remote Config)
- All core features unlocked
- Calendar export to all platforms
- Access to saved events history

#### Pro Tier (Subscription)
- **Unlimited captures**
- Priority support (email response <24h)
- Early access to new features
- Ad-free experience (if you add ads later)
- Sync across devices (future feature)
- Advanced export options (future: batch export, recurring events)

#### Lifetime Tier (One-Time Purchase)
- All Pro features forever
- Best value (equivalent to 2 years of monthly)
- Support the app's development

---

### Pro Plan Touchpoints

#### 1. After Third Capture (Soft Nudge)
**Goal:** Create awareness before hitting limit

**UI:** Bottom sheet that slides up after successful third extraction

```
┌─────────────────────────────────┐
│                                 │
│   Great work! 🎉                │
│   You've used 3 of 5 free       │
│   captures this month           │
│                                 │
│   Want unlimited captures?      │
│   Upgrade to Pro                │
│                                 │
│   [Maybe Later]  [See Plans]    │
│                                 │
└─────────────────────────────────┘
```

**Content:**
- **Positive tone:** Celebrate progress
- **Informational:** Show usage counter
- **Soft CTA:** "See Plans" (not "Upgrade Now")
- **Easy dismiss:** "Maybe Later" is prominent

**Behavior:**
- Show once per session
- Dismissible (don't block flow)
- Track: `upgrade_prompt_shown` (trigger: '3rd_capture')

---

#### 2. Fifth Capture (Final Warning)
**Goal:** Last chance before hitting wall

**UI:** Bottom sheet after fifth successful extraction

```
┌─────────────────────────────────┐
│                                 │
│   📸 Last Free Capture Used     │
│                                 │
│   You've captured 5 events      │
│   this month. Upgrade to Pro    │
│   for unlimited captures!       │
│                                 │
│   ✅ Unlimited events           │
│   ✅ Priority support           │
│   ✅ Future features            │
│                                 │
│   Starting at just $2.99/month  │
│                                 │
│   [Not Now]    [Upgrade to Pro] │
│                                 │
└─────────────────────────────────┘
```

**Content:**
- **Clear message:** "Last Free Capture Used"
- **Benefits list:** 3 key pro features
- **Pricing teaser:** Show starting price
- **Strong CTA:** "Upgrade to Pro" (primary button)

**Behavior:**
- Auto-dismisses after 10 seconds
- Can be dismissed with "Not Now"
- Track: `upgrade_prompt_shown` (trigger: '5th_capture')

---

#### 3. Limit Reached (Hard Paywall)
**Goal:** Convert or set expectation for next month

**UI:** Full-screen modal (blocks further captures)

```
┌─────────────────────────────────┐
│         [Close X]               │
│                                 │
│         🔒                      │
│   You've reached your           │
│   monthly limit                 │
│                                 │
│   You've used all 5 free        │
│   captures this month.          │
│                                 │
│   Upgrade to Pro for unlimited  │
│   captures, or wait until your  │
│   limit resets on Feb 1.        │
│                                 │
│   ┌─────────────────────────┐  │
│   │   Upgrade to Pro        │  │
│   │   Unlimited • $2.99/mo  │  │
│   └─────────────────────────┘  │
│                                 │
│   [View My Saved Events]        │
│                                 │
└─────────────────────────────────┘
```

**Content:**
- **Empathetic tone:** Not punishing, just informing
- **Clear next steps:** Upgrade OR wait for reset
- **Alternative action:** "View My Saved Events" (keep engaged)
- **Reset date:** Show when limit resets

**Behavior:**
- Triggered by 403 `LIMIT_REACHED` error from backend
- Cannot be dismissed (modal)
- Close button brings back to home (camera disabled)
- Track: `paywall_shown` (trigger: 'limit_reached')

**Implementation:**
Replace current generic error dialog in `NotCaptured.atom.tsx` with dedicated paywall dialog.

---

#### 4. Saved Events Sheet (Persistent Promotion)
**Goal:** Ambient upgrade reminder for engaged users

**UI:** Upgrade banner at top of saved events list

```
┌─────────────────────────────────┐
│   Saved Events                  │
│                                 │
│   ┌───────────────────────────┐ │
│   │ ⭐ Upgrade to Pro         │ │
│   │ Unlimited captures        │ │
│   │           [Upgrade →]     │ │
│   └───────────────────────────┘ │
│                                 │
│   Today                         │
│   ├─ Concert at Music Hall      │
│   └─ Birthday Party             │
│                                 │
└─────────────────────────────────┘
```

**Content:**
- **Compact banner:** Doesn't obstruct main content
- **Single benefit:** "Unlimited captures"
- **Subtle CTA:** Small "Upgrade →" button

**Behavior:**
- Only show for free users
- Tapping opens pricing sheet
- Dismissible (close icon), stays hidden for 7 days
- Track: `upgrade_banner_tapped` (location: 'saved_events')

---

#### 5. Settings Page (Always Accessible)
**Goal:** Let users upgrade anytime

**UI:** Dedicated "Upgrade to Pro" section in settings

```
┌─────────────────────────────────┐
│   Settings                      │
│                                 │
│   Account                       │
│   ┌───────────────────────────┐ │
│   │ Status: Free              │ │
│   │ Captures: 3/5 used        │ │
│   │                           │ │
│   │ [Upgrade to Pro]          │ │
│   └───────────────────────────┘ │
│                                 │
│   General                       │
│   ├─ Language                   │
│   ├─ Notifications              │
│   └─ ...                        │
│                                 │
└─────────────────────────────────┘
```

**Content:**
- **Account section:** Show current tier and usage
- **Progress indicator:** Visual bar showing captures used
- **Upgrade button:** Always visible

**Behavior:**
- If Pro user: Show "Pro" badge instead of upgrade button
- Tapping opens pricing sheet
- Track: `settings_opened`, `upgrade_tapped` (location: 'settings')

---

### Pricing Sheet (Universal)

**UI:** Bottom sheet modal shown from all touchpoints

```
┌─────────────────────────────────┐
│   Upgrade to Pro                │
│                                 │
│   ┌─ MOST POPULAR ─────────┐   │
│   │ Annual                  │   │
│   │ $24.99/year            │   │
│   │ Save 40% • $2.08/month │   │
│   └─────────────────────────┘   │
│                                 │
│   ┌─────────────────────────┐   │
│   │ Monthly                 │   │
│   │ $4.99/month            │   │
│   └─────────────────────────┘   │
│                                 │
│   ┌─ BEST VALUE ────────────┐   │
│   │ Lifetime                │   │
│   │ $49.99 one-time        │   │
│   │ All features forever    │   │
│   └─────────────────────────┘   │
│                                 │
│   ✅ Unlimited captures         │
│   ✅ Priority support           │
│   ✅ Early access to features   │
│   ✅ Cancel anytime             │
│                                 │
│   [Subscribe →]                 │
│                                 │
│   Restore Purchases             │
│                                 │
└─────────────────────────────────┘
```

**Features:**
- **3 Pricing Options:** Annual (recommended), Monthly, Lifetime
- **Visual Hierarchy:** Highlight recommended plan
- **Value Props:** Show 4-5 key benefits
- **Restore Link:** For users who already purchased
- **Legal Links:** Terms of Service, Privacy Policy

**Behavior:**
- Selecting plan → highlights selection
- "Subscribe" button → initiates purchase flow
- Track: `pricing_viewed`, `plan_selected`, `purchase_initiated`

---

## Monetization Strategy C: Hybrid Model (RECOMMENDED)

### Overview

The **Hybrid Model** combines the best of both worlds: affiliate revenue from free users + subscription revenue from Pro users. This maximizes total revenue while keeping the app accessible to all users.

### Key Differentiators

#### Free Users
- **Unlimited captures** (no paywall)
- See "Find Tickets" affiliate links prominently
- All core features available
- Ads or affiliate promotions visible

#### Pro Users ($2.99-4.99/month)
- **Unlimited captures** (same as free)
- **No affiliate links** (cleaner, ad-free experience)
- Priority support
- Early access to new features
- Cloud sync (future)
- Batch export (future)
- Pro badge in settings

### Why Hybrid Works Best

1. **No Paywall Friction:** Free users never hit a capture limit, keeping engagement high
2. **Two Revenue Streams:** Diversified income (affiliate + subscriptions)
3. **Clear Upgrade Value:** Pro = "ad-free experience" is easy to understand
4. **Higher Conversion:** Pro is optional, not required (less resentment)
5. **Scalability:** Grows both ways (more free users = more affiliate clicks, power users upgrade)

---

### Implementation Strategy

#### Remote Config Setup
```json
{
  "paid_only": false,
  "free_capture_limit": 999999,
  "show_affiliate_links": true,
  "hide_affiliate_for_pro": true,
  "affiliate_link_prominence": "medium",
  "pro_benefits": ["ad_free", "priority_support", "early_access"]
}
```

#### User Experience Flows

##### Free User Flow
```
Capture Event
  ├─ AI Extraction succeeds
  ├─ Event card displayed
  ├─ "Find Tickets" button shown (prominent)
  ├─ User clicks → Affiliate link
  └─ Optional "Upgrade to Pro" banner (dismissible)
```

##### Pro User Flow
```
Capture Event
  ├─ AI Extraction succeeds
  ├─ Event card displayed
  ├─ "Find Tickets" button HIDDEN
  ├─ Clean, ad-free interface
  └─ Pro badge visible in settings
```

#### Upgrade Touchpoints for Hybrid Model

Unlike the subscription-only model, Pro upgrades in the Hybrid model are **entirely optional**. Position Pro as a premium experience, not a requirement.

##### 1. Settings Page "Upgrade to Pro" Section
```
┌─────────────────────────────────┐
│   Settings                      │
│                                 │
│   ⭐ Upgrade to Pro              │
│   ┌───────────────────────────┐ │
│   │ Enjoy an ad-free,         │ │
│   │ distraction-free          │ │
│   │ experience                │ │
│   │                           │ │
│   │ [See Pro Benefits]        │ │
│   └───────────────────────────┘ │
│                                 │
└─────────────────────────────────┘
```

**Tone:** Aspirational, not pushy

##### 2. Dismissible Banner on Saved Events
```
┌─────────────────────────────────┐
│   Saved Events            [X]   │
│                                 │
│   ┌───────────────────────────┐ │
│   │ 💎 Upgrade to Pro         │ │
│   │ Remove ads & get priority │ │
│   │ support    [Learn More]   │ │
│   └───────────────────────────┘ │
│                                 │
│   Today                         │
│   ├─ Concert at...              │
└─────────────────────────────────┘
```

**Behavior:**
- Shown max once per day
- Dismissible (close icon)
- Stays hidden for 7 days after dismiss

##### 3. After 10th Capture (Engagement Milestone)
```
┌─────────────────────────────────┐
│                                 │
│   🎉 You're on a roll!          │
│   You've captured 10 events     │
│                                 │
│   Love Cap2Cal? Upgrade to Pro  │
│   for an ad-free experience     │
│                                 │
│   [Maybe Later]  [See Pro Plans]│
│                                 │
└─────────────────────────────────┘
```

**Timing:** After user demonstrates engagement (10 captures)
**Tone:** Celebratory, not limiting

##### 4. "Try Pro Free for 7 Days" (Optional)
```
┌─────────────────────────────────┐
│                                 │
│   ✨ Try Pro Free for 7 Days    │
│                                 │
│   ✅ Ad-free experience         │
│   ✅ Priority support           │
│   ✅ Early feature access       │
│                                 │
│   Cancel anytime, no charge     │
│   until trial ends              │
│                                 │
│   [Start Free Trial]            │
│                                 │
└─────────────────────────────────┘
```

**Strategy:** Free trial increases conversion (standard for subscription apps)
**Note:** Requires payment provider setup (RevenueCat handles this)

---

### Pro Benefits to Promote (Hybrid Model)

Since free users already get unlimited captures, Pro benefits must focus on **quality of experience**:

#### Core Benefits
1. **Ad-Free Experience**
   - No affiliate ticket links
   - No promotional banners
   - Clean, distraction-free interface

2. **Priority Support**
   - Email response <24h
   - Direct access to developer
   - Bug fixes prioritized

3. **Early Access to Features**
   - Beta features before public release
   - Vote on feature roadmap
   - Exclusive features (see Future Features below)

#### Future Pro-Only Features (Upsell Opportunities)

1. **Cloud Sync**
   - Sync events across devices
   - Access from web dashboard
   - Never lose events

2. **Batch Export**
   - Export multiple events at once
   - Create calendar bundles
   - Share event collections

3. **Advanced Editing**
   - Edit AI-extracted details before export
   - Create recurring events
   - Custom calendar categories

4. **Smart Notifications**
   - Reminders before events
   - Traffic alerts for event location
   - Ticket price drop alerts

5. **Event Analytics**
   - Personal event stats
   - Most attended venues
   - Event type breakdowns

6. **API Access**
   - Integrate with other apps
   - Automation workflows
   - Developer tools

**Strategy:** Launch with simple Pro tier (ad-free + support), add premium features over time to increase perceived value and justify higher pricing.

---

### Revenue Comparison: Hybrid vs Others

**Scenario: 1,000 Monthly Active Users**

#### Affiliate Only
- 1,000 free users × $0.088/user = **$88/month**
- **Churn:** N/A (all users free)
- **ARPU:** $0.088

#### Subscription Only (paid_only: true)
- 100 Pro users (10% conversion) × $3/month = **$300/month**
- 900 users blocked or churned
- **Churn:** 5%/month
- **ARPU:** $0.30 (only counting paying users)

#### Hybrid (RECOMMENDED)
- 900 free users × $0.088 = $79/month (affiliate revenue)
- 100 Pro users × $3/month = $300/month (subscription revenue)
- **Total:** **$379/month**
- **Churn:** 2% (Pro users), 0% (free users)
- **Blended ARPU:** $0.379

**Winner:** Hybrid generates **30% more revenue** than subscription alone, **330% more** than affiliate alone.

---

### Analytics for Hybrid Model

Track both affiliate AND subscription metrics:

#### Affiliate Metrics (Free Users)
```
ticket_search_initiated
  → ticket_links_found
  → ticket_link_clicked
  → ticket_purchase_completed (if trackable)
```

#### Subscription Metrics (All Users)
```
upgrade_prompt_shown (trigger: 'settings' | '10th_capture' | 'banner')
  → pricing_viewed
  → plan_selected
  → trial_started (if offering free trial)
  → purchase_completed
```

#### User Cohorts
- **Free Users (Non-Pro):** Track affiliate revenue per user
- **Pro Users:** Track LTV, churn rate, features used
- **Trial Users:** Track trial-to-paid conversion

#### Key Questions to Answer
1. What % of revenue comes from affiliates vs subscriptions?
2. Do Pro users engage more than free users?
3. Which Pro features are most valued?
4. What triggers the highest upgrade conversions?
5. Does hiding affiliate links increase Pro conversions?

---

### Implementation Checklist for Hybrid Model

**Phase 1: Affiliate Foundation**
- [ ] Implement prominent "Find Tickets" for free users
- [ ] Hide affiliate links for Pro users
- [ ] Track affiliate clicks and conversions
- [ ] Set up affiliate partnerships

**Phase 2: Pro Subscription**
- [ ] Create "Upgrade to Pro" UI in settings
- [ ] Implement dismissible Pro banner
- [ ] Add 10th capture celebration + upgrade prompt
- [ ] Integrate payment provider (RevenueCat)

**Phase 3: Differentiation**
- [ ] Add "Pro" badge in settings
- [ ] Ensure affiliate links hidden for Pro users
- [ ] Implement priority support email workflow
- [ ] Add Pro-only features (cloud sync, batch export, etc.)

**Phase 4: Optimization**
- [ ] A/B test Pro messaging
- [ ] Test free trial vs no trial
- [ ] Optimize affiliate link prominence
- [ ] Monitor revenue mix (affiliate vs subscription)

---

## User Journey & Touchpoints

### First-Time User Journey

```
App Open
  ├─ Onboarding Screen 1 (Value Prop)
  ├─ Onboarding Screen 2 (How It Works)
  ├─ Onboarding Screen 3 (Free Trial + Permissions)
  └─ Home Screen
      │
      ├─ Capture 1 ✅ → Success! (No promotion)
      ├─ Capture 2 ✅ → Success! (No promotion)
      ├─ Capture 3 ✅ → Success! + Soft nudge: "2 captures left"
      ├─ Capture 4 ✅ → Success! (No promotion)
      ├─ Capture 5 ✅ → Success! + Warning: "Last free capture"
      └─ Capture 6 ❌ → PAYWALL: "Limit reached"
          │
          ├─ Upgrade to Pro → Purchase flow → Pro user ✅
          └─ Maybe later → View saved events (camera disabled)
```

### Returning Free User Journey

```
App Open (Month 2)
  └─ Home Screen
      ├─ Capture counter resets to 0/5
      ├─ Can capture 5 more events
      └─ Same promotion sequence repeats
```

### Pro User Journey

```
App Open (After Upgrade)
  └─ Home Screen
      ├─ No capture counter displayed
      ├─ No upgrade prompts
      ├─ "Pro" badge in settings
      └─ Unlimited captures ✅
```

### Share Intent User Journey (Android)

```
Share Image → Cap2Cal
  ├─ Skip onboarding (direct to extraction)
  ├─ Process image
  └─ If limit reached → Show paywall immediately
```

---

## UI/UX Specifications

### Design Principles

1. **Non-Intrusive:** Never block core flow until absolutely necessary (limit reached)
2. **Value-First:** Always lead with benefits, not features
3. **Progressive:** Increase urgency as limit approaches (3rd → 5th → 6th capture)
4. **Transparent:** Show remaining captures clearly
5. **Reversible:** Easy to dismiss non-blocking prompts
6. **Respectful:** Don't spam with upgrade messages

### Visual Design Guidelines

#### Color Scheme
- **Free Tier Badge:** Neutral gray `#6B7280`
- **Pro Tier Badge:** Premium gold `#F59E0B`
- **Upgrade CTAs:** Primary brand color (existing button color)
- **Warning States:** Soft amber `#FCD34D` (not red, not alarming)
- **Limit Reached:** Gentle red `#F87171`

#### Typography
- **Headlines:** Bold, 20-24px
- **Body:** Regular, 16px
- **Subtext:** Light, 14px
- **Pricing:** Large bold for price, small light for period

#### Spacing
- **Padding:** Follow existing app padding (16px)
- **Bottom Sheets:** Follow existing design system
- **Buttons:** Existing button styles (primary, secondary)

#### Animations
- **Bottom Sheets:** Slide up from bottom (300ms ease)
- **Modals:** Fade in (200ms)
- **Counters:** Smooth number transitions
- **Success States:** Subtle bounce on completion

### Accessibility

- **Screen Readers:** All text must be readable
- **Touch Targets:** Minimum 44x44pt tap areas
- **Color Contrast:** WCAG AA compliant (4.5:1 ratio)
- **Focus States:** Clear keyboard navigation
- **Reduced Motion:** Respect prefers-reduced-motion

---

## Technical Implementation Guide

### Phase 1: Data Layer (Already Complete ✅)

The backend infrastructure is ready:

```typescript
// User document structure (Firestore)
interface User {
  captureCount: number;      // Incremented on each capture
  isPro: boolean;            // Subscription status
  lastCaptureAt: Timestamp;  // Last capture timestamp
}

// Remote Config
{
  paid_only: false,           // Enable/disable paid mode
  free_capture_limit: 5       // Number of free captures
}
```

**No backend changes needed!** Just need to:
1. Update `isPro: true` when user purchases
2. Toggle `paid_only: true` when ready to enforce limits

---

### Phase 2: Frontend State Management

#### A. Add Subscription State to AppContext

**File:** `src/context/AppContext.tsx`

```typescript
// Add to AppState interface
interface AppState {
  // ... existing fields
  subscription: {
    isPro: boolean;
    captureCount: number;
    captureLimit: number;
    hasSeenOnboarding: boolean;
    lastUpgradePrompt: 'none' | '3rd_capture' | '5th_capture' | 'limit_reached';
  };
}

// Add actions
type AppAction =
  | { type: 'SET_SUBSCRIPTION_STATUS'; isPro: boolean }
  | { type: 'INCREMENT_CAPTURE_COUNT' }
  | { type: 'SET_CAPTURE_LIMIT'; limit: number }
  | { type: 'SET_ONBOARDING_SEEN' }
  | { type: 'SET_UPGRADE_PROMPT_SHOWN'; trigger: string };
```

#### B. Sync with Firebase

**File:** `src/hooks/useAuth.ts` (new file)

```typescript
export const useAuth = () => {
  const { user, firestore } = useFirebase();
  const { dispatch } = useApp();

  useEffect(() => {
    if (!user) return;

    // Subscribe to user document
    const unsubscribe = firestore
      .collection('users')
      .doc(user.uid)
      .onSnapshot((doc) => {
        const data = doc.data();
        dispatch({
          type: 'SET_SUBSCRIPTION_STATUS',
          isPro: data.isPro || false,
        });
        dispatch({
          type: 'INCREMENT_CAPTURE_COUNT',
          count: data.captureCount || 0,
        });
      });

    return unsubscribe;
  }, [user]);
};
```

#### C. Fetch Remote Config Limit

**File:** `src/hooks/useRemoteConfig.ts` (extend existing)

```typescript
export const useCaptureLimitConfig = () => {
  const { remoteConfig } = useFirebase();
  const { dispatch } = useApp();

  useEffect(() => {
    const limit = remoteConfig.getNumber('free_capture_limit');
    dispatch({ type: 'SET_CAPTURE_LIMIT', limit });
  }, [remoteConfig]);
};
```

---

### Phase 3: Onboarding Implementation

#### A. Create Onboarding Component

**File:** `src/components/Onboarding.tsx`

```typescript
export const Onboarding = () => {
  const [step, setStep] = useState(0);
  const { dispatch } = useApp();
  const { logEvent } = useAnalytics();

  const screens = [
    <OnboardingValueProp />,
    <OnboardingHowItWorks />,
    <OnboardingFreeTrial />,
  ];

  const handleComplete = () => {
    localStorage.setItem('hasSeenOnboarding', 'true');
    dispatch({ type: 'SET_ONBOARDING_SEEN' });
    logEvent('onboarding_completed', { duration: Date.now() - startTime });
  };

  const handleSkip = () => {
    logEvent('onboarding_skipped', { step });
    handleComplete();
  };

  return (
    <div className="onboarding">
      {screens[step]}
      <OnboardingNavigation
        step={step}
        totalSteps={screens.length}
        onNext={() => setStep(step + 1)}
        onSkip={handleSkip}
        onComplete={handleComplete}
      />
    </div>
  );
};
```

#### B. Individual Screen Components

**File:** `src/components/onboarding/OnboardingValueProp.tsx`

```typescript
export const OnboardingValueProp = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center h-full p-8">
      <img
        src="/assets/onboarding-hero.png"
        alt="Event capture animation"
        className="w-64 h-64 mb-8"
      />
      <h1 className="text-2xl font-bold text-center mb-4">
        {t('onboarding.value_prop.title')}
      </h1>
      <p className="text-center text-gray-600">
        {t('onboarding.value_prop.subtitle')}
      </p>
    </div>
  );
};
```

#### C. Show Onboarding on First Launch

**File:** `src/App.tsx`

```typescript
export const App = () => {
  const { subscription } = useApp();

  if (!subscription.hasSeenOnboarding) {
    return <Onboarding />;
  }

  return <MainApp />;
};
```

---

### Phase 4: Upgrade Prompts Implementation

#### A. Create Upgrade Prompt Component

**File:** `src/components/UpgradePrompt.tsx`

```typescript
interface UpgradePromptProps {
  trigger: '3rd_capture' | '5th_capture' | 'limit_reached';
  onDismiss: () => void;
  onUpgrade: () => void;
}

export const UpgradePrompt = ({ trigger, onDismiss, onUpgrade }: UpgradePromptProps) => {
  const { t } = useTranslation();
  const { logEvent } = useAnalytics();

  useEffect(() => {
    logEvent('upgrade_prompt_shown', { trigger });
  }, []);

  const content = {
    '3rd_capture': {
      title: t('upgrade.3rd_capture.title'),
      message: t('upgrade.3rd_capture.message'),
      dismissible: true,
      blocking: false,
    },
    '5th_capture': {
      title: t('upgrade.5th_capture.title'),
      message: t('upgrade.5th_capture.message'),
      dismissible: true,
      blocking: false,
    },
    'limit_reached': {
      title: t('upgrade.limit_reached.title'),
      message: t('upgrade.limit_reached.message'),
      dismissible: false,
      blocking: true,
    },
  }[trigger];

  return (
    <Sheet open onOpenChange={content.dismissible ? onDismiss : undefined}>
      <SheetContent>
        <h2>{content.title}</h2>
        <p>{content.message}</p>
        <ProFeatureList />
        <Button onClick={onUpgrade}>
          {t('upgrade.cta')}
        </Button>
        {content.dismissible && (
          <Button variant="ghost" onClick={onDismiss}>
            {t('upgrade.maybe_later')}
          </Button>
        )}
      </SheetContent>
    </Sheet>
  );
};
```

#### B. Trigger Logic in Capture Flow

**File:** `src/hooks/useCapture.ts` (extend existing)

```typescript
export const useCapture = () => {
  const { subscription, dispatch } = useApp();
  const { captureCount, captureLimit, isPro } = subscription;

  const handleCaptureSuccess = () => {
    // Existing success logic...

    if (isPro) return; // No prompts for Pro users

    // Determine if we should show upgrade prompt
    if (captureCount === 3) {
      showUpgradePrompt('3rd_capture');
    } else if (captureCount === 5) {
      showUpgradePrompt('5th_capture');
    }

    dispatch({ type: 'INCREMENT_CAPTURE_COUNT' });
  };

  const showUpgradePrompt = (trigger: string) => {
    // Prevent showing same prompt twice in one session
    if (sessionStorage.getItem(`prompt_${trigger}_shown`)) return;

    sessionStorage.setItem(`prompt_${trigger}_shown`, 'true');

    // Add to dialog stack
    pushDialog({
      component: <UpgradePrompt trigger={trigger} />,
    });
  };
};
```

#### C. Handle Limit Reached Error

**File:** `src/services/capture.service.ts` (extend existing error handling)

```typescript
export const captureImage = async (image: File) => {
  try {
    const response = await api.analyse(image);
    return response;
  } catch (error) {
    if (error.code === 'LIMIT_REACHED') {
      // Show paywall
      pushDialog({
        component: <UpgradePrompt trigger="limit_reached" />,
      });
      return;
    }
    // Other error handling...
  }
};
```

---

### Phase 5: Pricing Sheet Implementation

#### A. Create Pricing Component

**File:** `src/components/PricingSheet.tsx`

```typescript
const PRICING_PLANS = [
  {
    id: 'monthly',
    name: 'Monthly',
    price: 4.99,
    period: 'month',
    badge: null,
  },
  {
    id: 'annual',
    name: 'Annual',
    price: 24.99,
    period: 'year',
    savings: '40%',
    pricePerMonth: 2.08,
    badge: 'MOST POPULAR',
  },
  {
    id: 'lifetime',
    name: 'Lifetime',
    price: 49.99,
    period: 'one-time',
    badge: 'BEST VALUE',
  },
];

export const PricingSheet = ({ onClose }: { onClose: () => void }) => {
  const [selectedPlan, setSelectedPlan] = useState('annual');
  const { logEvent } = useAnalytics();

  useEffect(() => {
    logEvent('pricing_viewed', {});
  }, []);

  const handlePurchase = async () => {
    logEvent('purchase_initiated', { plan: selectedPlan });

    // Integrate with payment provider (RevenueCat, Stripe, etc.)
    await initiatePurchase(selectedPlan);
  };

  return (
    <Sheet open onOpenChange={onClose}>
      <SheetContent>
        <h2 className="text-2xl font-bold mb-6">Upgrade to Pro</h2>

        {PRICING_PLANS.map((plan) => (
          <PricingCard
            key={plan.id}
            plan={plan}
            selected={selectedPlan === plan.id}
            onSelect={() => setSelectedPlan(plan.id)}
          />
        ))}

        <ProFeatureList />

        <Button onClick={handlePurchase} className="w-full mt-6">
          Subscribe →
        </Button>

        <button onClick={handleRestorePurchases} className="text-sm text-gray-500 mt-4">
          Restore Purchases
        </button>
      </SheetContent>
    </Sheet>
  );
};
```

#### B. Create Pricing Card Component

**File:** `src/components/PricingCard.tsx`

```typescript
interface PricingCardProps {
  plan: PricingPlan;
  selected: boolean;
  onSelect: () => void;
}

export const PricingCard = ({ plan, selected, onSelect }: PricingCardProps) => {
  return (
    <button
      onClick={onSelect}
      className={`
        w-full p-4 mb-3 rounded-lg border-2 transition-all
        ${selected ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}
      `}
    >
      {plan.badge && (
        <span className="text-xs font-bold text-blue-600 mb-2 block">
          {plan.badge}
        </span>
      )}

      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-bold text-lg">{plan.name}</h3>
          {plan.pricePerMonth && (
            <p className="text-sm text-gray-500">
              Save {plan.savings} • ${plan.pricePerMonth}/month
            </p>
          )}
        </div>
        <div className="text-right">
          <span className="text-2xl font-bold">${plan.price}</span>
          <span className="text-sm text-gray-500">/{plan.period}</span>
        </div>
      </div>
    </button>
  );
};
```

---

### Phase 6: Payment Integration

**Recommended: RevenueCat**

#### Why RevenueCat?
- ✅ Handles App Store + Google Play subscriptions
- ✅ Cross-platform (iOS, Android, web)
- ✅ Receipt validation built-in
- ✅ Subscription analytics
- ✅ Free tier available (up to $2.5k MRR)

#### Setup Steps

1. **Install SDK**
```bash
npm install react-native-purchases
```

2. **Configure RevenueCat**

**File:** `src/services/purchases.service.ts`

```typescript
import Purchases from 'react-native-purchases';

export const initializePurchases = async () => {
  await Purchases.configure({
    apiKey: process.env.REVENUECAT_API_KEY!,
  });
};

export const initiatePurchase = async (planId: string) => {
  try {
    const { customerInfo } = await Purchases.purchasePackage(planId);

    if (customerInfo.entitlements.active['pro']) {
      // Update Firestore
      await updateUserProStatus(true);

      // Log analytics
      logEvent('purchase_completed', { plan: planId });

      return true;
    }
  } catch (error) {
    if (error.userCancelled) {
      logEvent('purchase_cancelled', { plan: planId });
    } else {
      logEvent('purchase_failed', { plan: planId, error: error.message });
    }
    return false;
  }
};

export const restorePurchases = async () => {
  const { customerInfo } = await Purchases.restorePurchases();
  const isPro = customerInfo.entitlements.active['pro'] !== undefined;
  await updateUserProStatus(isPro);
  return isPro;
};

const updateUserProStatus = async (isPro: boolean) => {
  const { user, firestore } = getFirebase();
  await firestore.collection('users').doc(user.uid).update({ isPro });
};
```

3. **Configure Products in RevenueCat Dashboard**
- Create entitlement: "pro"
- Add products: monthly ($4.99), annual ($24.99), lifetime ($49.99)
- Link to App Store Connect / Google Play Console

4. **Handle Subscription Status**

**File:** `src/hooks/usePurchases.ts`

```typescript
export const usePurchases = () => {
  const { dispatch } = useApp();

  useEffect(() => {
    // Listen for subscription changes
    const listener = Purchases.addCustomerInfoUpdateListener((customerInfo) => {
      const isPro = customerInfo.entitlements.active['pro'] !== undefined;
      dispatch({ type: 'SET_SUBSCRIPTION_STATUS', isPro });
    });

    return () => listener.remove();
  }, []);
};
```

#### Alternative: Stripe (for Web/PWA)

If focusing on web distribution:

```typescript
import { loadStripe } from '@stripe/stripe-js';

export const initiatePurchase = async (planId: string) => {
  const stripe = await loadStripe(process.env.STRIPE_PUBLIC_KEY!);

  const { sessionId } = await api.createCheckoutSession(planId);

  await stripe.redirectToCheckout({ sessionId });
};
```

**Backend:** Add Cloud Function for checkout session creation

---

### Phase 7: Capture Counter UI

#### A. Add Counter to Home Screen

**File:** `src/views/SplashView.tsx` (extend existing)

```typescript
export const SplashView = () => {
  const { subscription } = useApp();
  const { captureCount, captureLimit, isPro } = subscription;

  return (
    <div className="relative">
      {/* Existing splash content */}

      {!isPro && (
        <div className="absolute top-4 right-4 bg-white/90 rounded-full px-4 py-2 shadow-lg">
          <span className="text-sm font-medium">
            {captureCount}/{captureLimit} captures
          </span>
        </div>
      )}
    </div>
  );
};
```

#### B. Add Progress Bar to Settings

**File:** `src/components/SettingsSheet.tsx` (extend existing)

```typescript
export const SettingsSheet = () => {
  const { subscription } = useApp();

  return (
    <Sheet>
      <SheetContent>
        <h2>Settings</h2>

        {/* Account Section */}
        <div className="mb-6">
          <h3 className="font-bold mb-2">Account</h3>
          {subscription.isPro ? (
            <div className="flex items-center">
              <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                ⭐ Pro
              </span>
            </div>
          ) : (
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Captures Used</span>
                <span>{subscription.captureCount}/{subscription.captureLimit}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all"
                  style={{
                    width: `${(subscription.captureCount / subscription.captureLimit) * 100}%`,
                  }}
                />
              </div>
              <Button onClick={openPricingSheet} className="w-full mt-4">
                Upgrade to Pro
              </Button>
            </div>
          )}
        </div>

        {/* Rest of settings... */}
      </SheetContent>
    </Sheet>
  );
};
```

---

## Analytics & Optimization

### Key Metrics to Track

#### Onboarding Funnel
```
onboarding_started
  → onboarding_screen_viewed (step: 1/2/3)
  → onboarding_completed
  → onboarding_skipped (step: number)
```

**Target:** >70% completion rate

#### Upgrade Funnel
```
upgrade_prompt_shown (trigger: '3rd_capture' | '5th_capture' | 'limit_reached')
  → pricing_viewed
  → plan_selected (plan: 'monthly' | 'annual' | 'lifetime')
  → purchase_initiated
  → purchase_completed
  → purchase_failed | purchase_cancelled
```

**Target:** 5-10% conversion from limit_reached to purchase_completed

#### Engagement Metrics
```
app_opened
  → capture_initiated
  → extraction_succeeded
  → calendar_exported
  → event_saved
```

**Target:** >3 captures per user before churn

#### Revenue Metrics
- **Free-to-Paid Conversion Rate:** % of free users who upgrade
- **Time to Conversion:** Days between first capture and purchase
- **LTV (Lifetime Value):** Revenue per user over lifetime
- **Churn Rate:** % of Pro users who cancel subscription
- **MRR (Monthly Recurring Revenue):** Total monthly revenue from subscriptions

### Analytics Implementation

**File:** `src/hooks/useAnalytics.ts` (extend existing)

```typescript
// Onboarding events
export const logOnboardingStarted = () => {
  logEvent('onboarding_started', {});
};

export const logOnboardingScreenViewed = (step: number) => {
  logEvent('onboarding_screen_viewed', { step });
};

export const logOnboardingCompleted = (duration: number) => {
  logEvent('onboarding_completed', { duration_seconds: duration / 1000 });
};

export const logOnboardingSkipped = (step: number) => {
  logEvent('onboarding_skipped', { step });
};

// Upgrade events
export const logUpgradePromptShown = (trigger: string) => {
  logEvent('upgrade_prompt_shown', { trigger });
};

export const logPricingViewed = () => {
  logEvent('pricing_viewed', {});
};

export const logPlanSelected = (plan: string) => {
  logEvent('plan_selected', { plan });
};

export const logPurchaseInitiated = (plan: string, price: number) => {
  logEvent('purchase_initiated', { plan, price, currency: 'USD' });
};

export const logPurchaseCompleted = (plan: string, price: number, revenue: number) => {
  logEvent('purchase_completed', {
    plan,
    price,
    currency: 'USD',
    value: revenue, // For Google Analytics revenue tracking
  });
};

export const logPurchaseFailed = (plan: string, error: string) => {
  logEvent('purchase_failed', { plan, error });
};

export const logPurchaseCancelled = (plan: string) => {
  logEvent('purchase_cancelled', { plan });
};
```

### User Properties

Set these properties to enable cohort analysis:

```typescript
export const setUserProperties = (properties: {
  isPro: boolean;
  captureCount: number;
  daysSinceInstall: number;
  hasSeenOnboarding: boolean;
}) => {
  analytics.setUserProperties({
    subscription_status: properties.isPro ? 'pro' : 'free',
    capture_count: String(properties.captureCount),
    days_since_install: String(properties.daysSinceInstall),
    has_seen_onboarding: String(properties.hasSeenOnboarding),
  });
};
```

---

## Pricing Strategy

### Recommended Pricing

#### Option A: Standard SaaS Pricing
- **Free:** 5 captures/month
- **Monthly:** $4.99/month
- **Annual:** $29.99/year ($2.49/month, save 50%)
- **Lifetime:** $59.99 one-time

#### Option B: Lower Entry Point
- **Free:** 3 captures/month
- **Monthly:** $2.99/month
- **Annual:** $19.99/year ($1.66/month, save 44%)
- **Lifetime:** $39.99 one-time

#### Option C: Aggressive Free Tier
- **Free:** 10 captures/month (generous)
- **Monthly:** $4.99/month
- **Annual:** $39.99/year ($3.33/month, save 33%)
- **Lifetime:** $79.99 one-time

### Pricing Psychology Tips

1. **Anchor with Annual:** Show annual first to make monthly seem expensive
2. **Highlight Savings:** "Save 50%" badge on annual plan
3. **Lifetime as Premium:** Position as best value for committed users
4. **No Free Trial Needed:** 5 free captures IS the trial
5. **Round Numbers:** Avoid $4.95, use $4.99 (psychological pricing)

### Regional Pricing

Consider regional pricing for international markets:

| Region | Monthly | Annual | Lifetime |
|--------|---------|--------|----------|
| US/CA/UK/AU | $4.99 | $29.99 | $59.99 |
| EU | €4.49 | €26.99 | €49.99 |
| India | ₹199 | ₹999 | ₹1999 |
| Brazil | R$14.99 | R$89.99 | R$179.99 |

**Implementation:** RevenueCat automatically handles regional pricing via App Store/Google Play.

---

## A/B Testing Recommendations

### Test 1: Onboarding Length
- **Control:** 3-screen onboarding
- **Variant A:** 1-screen value prop only
- **Variant B:** No onboarding (contextual tooltips)
- **Metric:** Time to first capture, retention rate

### Test 2: Free Capture Limit
- **Control:** 5 captures/month
- **Variant A:** 3 captures/month
- **Variant B:** 10 captures/month
- **Metric:** Free-to-paid conversion rate

### Test 3: Upgrade Prompt Timing
- **Control:** After 3rd and 5th capture
- **Variant A:** After 2nd and 4th capture (more aggressive)
- **Variant B:** After 4th capture only (less intrusive)
- **Metric:** Conversion rate, user annoyance (feedback)

### Test 4: Pricing Display
- **Control:** Annual plan highlighted
- **Variant A:** Monthly plan highlighted
- **Variant B:** Lifetime plan highlighted
- **Metric:** Revenue per user, plan selection distribution

### Test 5: Paywall Messaging
- **Control:** Feature-focused ("Unlimited captures")
- **Variant A:** Benefit-focused ("Never miss an event")
- **Variant B:** Social proof ("Join 10,000+ Pro users")
- **Metric:** Conversion rate

### Implementation with Firebase Remote Config

```typescript
const onboardingVariant = remoteConfig.getString('onboarding_variant');

if (onboardingVariant === 'short') {
  return <ShortOnboarding />;
} else if (onboardingVariant === 'none') {
  return <ContextualTooltips />;
} else {
  return <StandardOnboarding />;
}
```

---

## Implementation Roadmap

### Phase 1: Foundation (Week 1)
**Goal:** Set up data layer and analytics

- [ ] Add subscription state to AppContext
- [ ] Implement useAuth hook (sync Firestore → app state)
- [ ] Add capture counter UI to home screen
- [ ] Implement analytics for upgrade funnel
- [ ] Test limit enforcement (toggle `paid_only` in Remote Config)

**Deliverable:** App displays capture counter, backend enforces limits

---

### Phase 2: Onboarding (Week 2)
**Goal:** Create first-time user experience

- [ ] Design onboarding screens (3 screens)
- [ ] Implement Onboarding component
- [ ] Add i18n translations (EN, DE)
- [ ] Implement skip logic
- [ ] Add "How It Works" to settings
- [ ] Implement onboarding analytics

**Deliverable:** New users see onboarding on first launch

---

### Phase 3: Upgrade Prompts (Week 3)
**Goal:** Show upgrade messaging at right times

- [ ] Create UpgradePrompt component (3 variants)
- [ ] Implement trigger logic (3rd, 5th, limit reached)
- [ ] Replace generic error dialog with paywall
- [ ] Add upgrade banner to saved events sheet
- [ ] Add upgrade section to settings
- [ ] Implement upgrade analytics

**Deliverable:** Free users see upgrade prompts at key moments

---

### Phase 4: Pricing & Purchase Flow (Week 4)
**Goal:** Enable users to purchase Pro

- [ ] Create PricingSheet component
- [ ] Design pricing cards (3 tiers)
- [ ] Set up RevenueCat account
- [ ] Configure products in App Store Connect & Google Play Console
- [ ] Integrate RevenueCat SDK
- [ ] Implement purchase flow
- [ ] Implement restore purchases
- [ ] Test purchases (sandbox)
- [ ] Implement purchase analytics

**Deliverable:** Users can purchase Pro subscription

---

### Phase 5: Pro User Experience (Week 5)
**Goal:** Ensure Pro users have great experience

- [ ] Hide upgrade prompts for Pro users
- [ ] Add "Pro" badge to settings
- [ ] Remove capture counter for Pro users
- [ ] Implement subscription management (view status, cancel)
- [ ] Add priority support email link
- [ ] Test subscription lifecycle (purchase → active → cancel → restore)

**Deliverable:** Pro users have premium experience

---

### Phase 6: Polish & Testing (Week 6)
**Goal:** Optimize and prepare for launch

- [ ] Test entire flow end-to-end
- [ ] Add error handling for purchase failures
- [ ] Implement offline handling
- [ ] Add loading states
- [ ] Accessibility audit
- [ ] Localization review (DE translations)
- [ ] Set up A/B testing infrastructure
- [ ] Create internal testing checklist

**Deliverable:** Production-ready onboarding & monetization

---

### Phase 7: Soft Launch (Week 7)
**Goal:** Test with real users, gather feedback

- [ ] Keep `paid_only: false` in Remote Config
- [ ] Launch to 10% of users via Remote Config
- [ ] Monitor analytics daily
- [ ] Collect user feedback
- [ ] Fix critical issues
- [ ] Optimize based on data

**Deliverable:** Validated monetization strategy

---

### Phase 8: Full Launch (Week 8)
**Goal:** Enable monetization for all users

- [ ] Toggle `paid_only: true` in Remote Config
- [ ] Announce Pro plan via email/social
- [ ] Monitor conversion rates
- [ ] Provide customer support
- [ ] Iterate based on feedback

**Deliverable:** Full monetization live

---

## Success Criteria

### Onboarding
- ✅ **Completion Rate:** >70% of users complete onboarding
- ✅ **Time to First Capture:** <2 minutes after app open
- ✅ **Drop-off Analysis:** Identify which screen causes most exits

### Monetization
- ✅ **Conversion Rate:** 5-10% of free users upgrade to Pro
- ✅ **Time to Conversion:** Average 7-14 days between install and purchase
- ✅ **Preferred Plan:** Annual plan represents >50% of purchases
- ✅ **Churn Rate:** <5% monthly churn for Pro subscribers
- ✅ **MRR Growth:** 10-20% month-over-month growth

### User Experience
- ✅ **Support Tickets:** <1% of users contact support about limits
- ✅ **App Store Ratings:** Maintain >4.5 stars after monetization launch
- ✅ **Retention:** 30-day retention >40% for free users, >80% for Pro users

---

## Appendix: Copy & Messaging

### Onboarding Copy

#### Screen 1: Value Prop
```
Headline: Turn Event Posters into Calendar Invites
Subheadline: Just snap a photo, we'll handle the rest
```

#### Screen 2: How It Works
```
Step 1: Capture
Photo any event poster or flyer

Step 2: Extract
AI reads the date, time, and location

Step 3: Save
Export to your calendar in one tap
```

#### Screen 3: Free Trial
```
Headline: Ready to Get Started?

Bullets:
✅ First 5 captures FREE
✅ No credit card required
✅ Works with all calendars

Permissions:
We'll need access to:
📸 Camera - to capture event posters
📅 Calendar - to save events to your schedule
```

---

### Upgrade Prompts Copy

#### 3rd Capture (Soft Nudge)
```
Headline: Great work! 🎉
Body: You've used 3 of 5 free captures this month.

Want unlimited captures? Upgrade to Pro.

CTA: See Plans | Maybe Later
```

#### 5th Capture (Final Warning)
```
Headline: 📸 Last Free Capture Used
Body: You've captured 5 events this month. Upgrade to Pro for unlimited captures!

Benefits:
✅ Unlimited events
✅ Priority support
✅ Early access to features

Pricing: Starting at just $2.99/month

CTA: Upgrade to Pro | Not Now
```

#### Limit Reached (Paywall)
```
Headline: 🔒 You've reached your monthly limit
Body: You've used all 5 free captures this month.

Upgrade to Pro for unlimited captures, or wait until your limit resets on [Date].

CTA: Upgrade to Pro | View My Saved Events
```

---

### Pricing Sheet Copy

```
Headline: Upgrade to Pro

Plan 1: Annual (MOST POPULAR)
$24.99/year
Save 40% • Just $2.08/month

Plan 2: Monthly
$4.99/month

Plan 3: Lifetime (BEST VALUE)
$49.99 one-time
All features forever

Benefits:
✅ Unlimited captures
✅ Priority support
✅ Early access to new features
✅ Cancel anytime

CTA: Subscribe →

Footer: Restore Purchases
```

---

### Pro Features List (Reusable)

**Short Version (3 items):**
```
✅ Unlimited captures
✅ Priority support
✅ Early access to features
```

**Medium Version (5 items):**
```
✅ Unlimited event captures
✅ Priority email support (<24h response)
✅ Early access to new features
✅ Ad-free experience
✅ Export to multiple calendars at once
```

**Long Version (7 items):**
```
✅ Unlimited event captures per month
✅ Priority email support with <24h response time
✅ Early access to beta features
✅ Completely ad-free experience
✅ Batch export to multiple calendars
✅ Cloud sync across all devices (coming soon)
✅ Advanced event templates (coming soon)
```

---

### Email & Notification Copy

#### Welcome Email (Post-Onboarding)
```
Subject: Welcome to Cap2Cal! 🎉

Hi there,

Thanks for downloading Cap2Cal! You're now just a photo away from never missing an event again.

Here's what you can do:
• Capture 5 events for free this month
• Export to Google Calendar, Apple Calendar, or Outlook
• Save and favorite your events

Need help? Reply to this email anytime.

Happy capturing!
— The Cap2Cal Team
```

#### Limit Warning Email (After 4th Capture)
```
Subject: You have 1 free capture left this month

Hi,

Just a heads up: you've used 4 of your 5 free captures this month.

Want unlimited captures? Upgrade to Cap2Cal Pro for just $2.99/month.

[Upgrade to Pro]

Your limit will reset on [Date].

— The Cap2Cal Team
```

#### Limit Reached Email
```
Subject: You've reached your monthly limit

Hi,

You've used all 5 free captures this month. Great job staying on top of your events!

Your limit will reset on [Date], or you can upgrade to Pro for unlimited captures anytime.

[Upgrade to Pro]

— The Cap2Cal Team
```

---

## Translations (German)

### Onboarding

```typescript
{
  "onboarding": {
    "value_prop": {
      "title": "Verwandle Event-Poster in Kalendereinträge",
      "subtitle": "Einfach fotografieren, wir erledigen den Rest"
    },
    "how_it_works": {
      "title": "So funktioniert's",
      "step1": "Erfassen - Fotografiere ein Event-Poster",
      "step2": "Extrahieren - KI liest alle Details",
      "step3": "Speichern - Exportiere in deinen Kalender"
    },
    "free_trial": {
      "title": "Bereit loszulegen?",
      "bullet1": "Erste 5 Erfassungen KOSTENLOS",
      "bullet2": "Keine Kreditkarte erforderlich",
      "bullet3": "Funktioniert mit allen Kalendern",
      "permissions": "Wir benötigen Zugriff auf:",
      "camera": "Kamera - um Event-Poster zu erfassen",
      "calendar": "Kalender - um Events zu speichern"
    }
  },
  "upgrade": {
    "3rd_capture": {
      "title": "Gute Arbeit! 🎉",
      "message": "Du hast 3 von 5 kostenlosen Erfassungen diesen Monat genutzt. Möchtest du unbegrenzte Erfassungen? Upgrade auf Pro."
    },
    "5th_capture": {
      "title": "📸 Letzte kostenlose Erfassung genutzt",
      "message": "Du hast 5 Events diesen Monat erfasst. Upgrade auf Pro für unbegrenzte Erfassungen!"
    },
    "limit_reached": {
      "title": "🔒 Du hast dein monatliches Limit erreicht",
      "message": "Du hast alle 5 kostenlosen Erfassungen diesen Monat genutzt. Upgrade auf Pro für unbegrenzte Erfassungen, oder warte bis dein Limit am [Datum] zurückgesetzt wird."
    },
    "cta": "Auf Pro upgraden",
    "maybe_later": "Vielleicht später"
  }
}
```

---

## Final Recommendations

### Which Business Model Should You Choose?

**Our Recommendation: Start with Affiliate Model, Evolve to Hybrid**

#### Phase 1 (Launch → Month 3): Affiliate Only
```json
{
  "paid_only": false,
  "show_affiliate_links": true,
  "affiliate_link_prominence": "high"
}
```

**Rationale:**
- ✅ Zero friction → maximize user acquisition and growth
- ✅ No payment integration needed → faster launch
- ✅ Better App Store ratings (free apps rate higher)
- ✅ Prove affiliate revenue model works
- ✅ Build large user base first

**Focus:**
- Onboarding optimization
- Affiliate link CTR optimization
- User growth and retention
- Data collection on which events drive ticket clicks

---

#### Phase 2 (Month 4-6): Add Optional Pro (Hybrid Model)
```json
{
  "paid_only": false,
  "free_capture_limit": 999999,
  "show_affiliate_links": true,
  "hide_affiliate_for_pro": true
}
```

**Rationale:**
- ✅ Keep all existing users (no one blocked)
- ✅ Add second revenue stream for power users
- ✅ Test subscription willingness without risk
- ✅ Pro = "ad-free experience" is clear value prop

**Focus:**
- Pro tier implementation (RevenueCat integration)
- A/B test Pro messaging and pricing
- Track conversion rates
- Optimize revenue mix

---

#### Phase 3 (Month 7+): Optimize Based on Data

**If affiliate revenue is strong:** Stay with Hybrid, keep it optional
**If subscription conversions are high:** Consider hard paywall for new users (A/B test)
**If both are working:** Keep Hybrid, optimize both streams

---

### Do's ✅

#### For All Models
1. **Show onboarding to everyone** - even simple apps benefit from orientation
2. **Track everything** - analytics are critical for optimization
3. **A/B test everything** - pricing, messaging, timing, button placement
4. **Don't forget Android share intent users** - they skip onboarding
5. **Mobile-first design** - optimize for thumb-friendly interactions

#### For Affiliate Model
6. **Make "Find Tickets" prominent** - it's your revenue driver
7. **Partner with multiple providers** - Ticketmaster + Eventbrite + regional
8. **Track affiliate performance** - clicks, providers, event types
9. **Optimize for high-ticketing events** - concerts, sports, festivals

#### For Subscription/Hybrid Model
10. **Use soft paywall approach** - educate before blocking (if using limits)
11. **Highlight annual plan** - better for revenue and retention
12. **Use RevenueCat** - saves weeks of payment integration work
13. **Don't block before value is shown** - let users experience the app first

---

### Don'ts ❌

#### For All Models
1. **Don't launch without analytics** - you'll be flying blind
2. **Don't make onboarding skippable too easily** - hide skip button until 5 seconds
3. **Don't skip user testing** - test flows with real users before launch
4. **Don't ignore feedback** - App Store reviews reveal monetization friction

#### For Affiliate Model
5. **Don't show tickets for all events** - filter to ticketed events only (concerts, sports, etc.)
6. **Don't rely on one partner** - diversify affiliate relationships
7. **Don't make affiliate links look like ads** - integrate naturally into event cards

#### For Subscription Model
8. **Don't set prices too low** - undervaluing hurts long-term sustainability
9. **Don't spam upgrade prompts** - max 2-3 nudges before hard limit
10. **Don't forget to test purchases** - use sandbox accounts thoroughly
11. **Don't enable hard paywall (`paid_only: true`) until you have data** - test affiliate first

---

### Quick Start Guide

**Want to launch ASAP? Do This:**

#### Week 1-2: Onboarding Only
1. Implement 3-screen onboarding
2. Add onboarding analytics
3. Test with beta users
4. Launch with `paid_only: false` (no limits)

**Result:** Users see onboarding, unlimited free captures, existing "Find Tickets" button

#### Week 3-4: Optimize Affiliate Links (Optional)
5. Make "Find Tickets" more prominent
6. Add affiliate link analytics
7. Test button copy and placement
8. Set up affiliate partnerships (Ticketmaster, Eventbrite)

**Result:** Basic affiliate revenue starts flowing

#### Week 5-8: Add Pro Subscription (Optional)
9. Implement "Upgrade to Pro" UI in settings
10. Integrate RevenueCat
11. Add payment flow
12. Keep captures unlimited (Hybrid model)

**Result:** Dual revenue streams (affiliate + subscriptions)

---

### Decision Tree

```
Start Here: Do you need revenue immediately?
  │
  ├─ YES → Go with Subscription Model
  │         - Implement hard paywall (5 captures/month)
  │         - Integrate payments (RevenueCat)
  │         - Focus on conversion optimization
  │         - Higher revenue per user, smaller user base
  │
  └─ NO → Go with Affiliate Model
            - Keep unlimited captures
            - Optimize "Find Tickets" button
            - Build large user base
            - Add subscriptions later (Hybrid)
            - Higher user growth, lower initial revenue

Recommendation: Start with Affiliate → Grow users → Add subscriptions → Test both (Hybrid)
```

---

### Remote Config Testing Matrix

Use Remote Config to A/B test different models:

| User Cohort | `paid_only` | `show_affiliate_links` | Result |
|-------------|-------------|------------------------|--------|
| **Control (50%)** | false | true | Affiliate Model |
| **Variant A (25%)** | true | false | Subscription Model |
| **Variant B (25%)** | false | true + hide for Pro | Hybrid Model |

**After 30 days, compare:**
- Total revenue per cohort
- User retention rates
- App Store ratings
- Support ticket volume

**Choose the winner based on:**
1. Total revenue (primary metric)
2. User satisfaction (ratings, NPS)
3. Long-term retention
4. Scalability

---

**Next Steps:**
1. **Decide your Phase 1 model** (recommendation: Affiliate Only)
2. Review this document with your team
3. Create design mockups for onboarding screens
4. If doing subscriptions: Set up RevenueCat account
5. If doing affiliate: Set up Ticketmaster/Eventbrite accounts
6. Start Phase 1 implementation (onboarding first)
7. Schedule weekly progress reviews

---

**Document Owner:** Franz
**Last Updated:** 2025-01-08
**Version:** 2.0 (Dual Revenue Model)
**Status:** Ready for Implementation
