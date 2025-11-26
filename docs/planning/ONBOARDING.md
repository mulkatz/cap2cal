# Cap2Cal Onboarding & Monetization Strategy

**Last Updated:** November 2024
**Status:** Implemented & Production-Ready

---

## Overview

Cap2Cal features a 3-screen onboarding carousel and flexible monetization system controlled by Firebase Remote Config. This allows real-time A/B testing of business models without code deployments.

---

## Onboarding Flow

### Design Philosophy

**"Show, Don't Tell"** - Demonstrate value rather than explaining features
**"Everything, Not Just Posters"** - Universal date-information extraction

### Screen Sequence

#### Screen 1: Value Proposition
- **Message:** "Turn Everything into Calendar Events"
- **Subtitle:** "Posters, flyers, social posts, invites — we handle the rest"
- **Visual:** Camera → Arrow → Calendar icons
- **Purpose:** Communicate broad applicability beyond just event posters

#### Screen 2: How It Works
1. **Capture** - Photo anything with date info
2. **Extract** - AI reads all details
3. **Save & Buy** - Export to calendar and find tickets

**Purpose:** Break down the 3-second workflow

#### Screen 3: Get Started
- ✅ Instant event extraction
- ✅ Works with all calendars
- ✅ Secure & private
- **CTA:** "Let's Go!" button

**Purpose:** Build trust and remove friction

---

## Monetization Models

### Current Implementation

Three models supported via Remote Config flags:

#### Model A: Affiliate Revenue (Free App)
```json
{
  "paid_only": false,
  "show_affiliate_links": true
}
```

**Strategy:**
- Unlimited free captures for all users
- Revenue from "Find Tickets" affiliate links
- 5-15% commission on ticket purchases
- Low friction, broad user base

**Revenue Estimate:** $20-100 per 1000 users/month

**Best For:** Early stage, building user base, concert/festival events

#### Model B: Subscription Revenue
```json
{
  "paid_only": true,
  "free_capture_limit": 5,
  "show_paywall": true
}
```

**Strategy:**
- 5 free captures per month
- $4.99/month or $24.99/year for unlimited
- Hard paywall after limit
- Predictable MRR

**Revenue Estimate:** $150-300 per 1000 users/month

**Best For:** Mature product, recurring revenue, premium positioning

#### Model C: Hybrid (Recommended)
```json
{
  "paid_only": false,
  "show_affiliate_links": true,
  "show_premium_features": true
}
```

**Strategy:**
- Unlimited captures for everyone
- Affiliate links for free users
- Optional Pro tier for:
  - Ad-free experience
  - Priority support
  - Advanced features (batch processing, recurring events)
  - Remove affiliate links

**Revenue Estimate:** $100-250 per 1000 users/month

**Best For:** Balancing growth and revenue

---

## Feature Flags System

### Remote Config Structure

```json
{
  "paid_only": boolean,
  "free_capture_limit": number,
  "show_affiliate_links": boolean,
  "show_paywall": boolean,
  "premium_annual_price": "24.99",
  "premium_monthly_price": "4.99"
}
```

### Conditional UI Behavior

Based on feature flags, the app adapts:

**When `paid_only = false` (Free/Affiliate Model):**
- ✅ Unlimited captures
- ✅ "Find Tickets" button prominent on event cards
- ❌ No paywall dialogs
- ✅ Affiliate links in results

**When `paid_only = true` (Subscription Model):**
- ⚠️ Capture counter displayed
- ⚠️ Paywall after reaching limit
- ✅ Premium upgrade prompts
- ❌ Affiliate links hidden for Pro users

**When Hybrid Mode:**
- ✅ Best of both worlds
- ✅ Affiliate revenue from free users
- ✅ Subscription revenue from Pro users
- ✅ Maximize total revenue

---

## User Journey

### First-Time User Experience

1. **App Launch** → Onboarding carousel (3 screens)
2. **Request Permissions** → Camera, Calendar (with explanations)
3. **First Capture** → Guided experience with tips
4. **Result View** → Celebrate success, show features
5. **Save to Calendar** → Demonstrate value immediately
6. **Re-engagement** → Smart notifications (if enabled)

### Activation Metrics

**Target:** 70%+ of new users complete first capture within 24 hours

**Key Moments:**
- Complete onboarding: Track completion rate
- Grant permissions: Track approval rate
- First capture: Most critical conversion
- First save: Core value delivered
- Second capture: Habit formation begins

---

## Monetization Touchpoints

### Free Tier Experience

**Affiliate Model:**
- "Find Tickets" button on every event card
- Search results show affiliate ticket links
- Commission earned on purchases (5-15%)
- Zero friction for users

**Subscription Model:**
- Capture counter in UI (e.g., "2 of 5 captures used")
- Soft paywall at 4 captures (can still browse)
- Hard paywall at 5 captures
- "Upgrade to Pro" CTA

### Premium Tier Experience

**When User Hits Paywall (Subscription Model):**
1. Beautiful modal with benefits list
2. Social proof ("Join 10,000+ Pro users")
3. Pricing options (monthly/annual)
4. One-tap purchase via RevenueCat
5. Immediate unlock after purchase

**Premium Features:**
- Unlimited captures (core value)
- Priority support
- Advanced features (batch, recurring, etc.)
- Ad-free experience
- Remove affiliate links (cleaner UX)

---

## A/B Testing Strategy

### What to Test

1. **Onboarding Length:** 3 screens vs. 5 screens
2. **Pricing:** $4.99 vs. $5.99 vs. $7.99 monthly
3. **Free Tier Limit:** 3 vs. 5 vs. 10 captures
4. **Paywall Timing:** Immediate vs. after 3 captures
5. **Business Model:** Affiliate vs. Subscription vs. Hybrid
6. **Affiliate Prominence:** High vs. Medium vs. Low

### Test Framework

Use Firebase Remote Config + Analytics:

```typescript
// Example: Test affiliate link prominence
const affiliateProminence = await getRemoteConfig('affiliate_prominence');
// Values: 'high' | 'medium' | 'low'

// Track conversion
logAnalyticsEvent('AFFILIATE_LINK_CLICKED', {
  prominence: affiliateProminence,
  userId: userId
});
```

### Success Metrics

- **Onboarding completion rate:** Target 60%+
- **Free → Paid conversion:** Target 5%+
- **Affiliate click-through:** Target 20%+
- **Affiliate purchase conversion:** Target 2%+
- **Day 1/7/30 retention:** Target 40% / 20% / 10%

---

## Implementation Status

### ✅ Completed

- [x] 3-screen onboarding carousel
- [x] Firebase Remote Config integration
- [x] Conditional UI system
- [x] RevenueCat subscription integration
- [x] Affiliate link support (Find Tickets)
- [x] Capture limit tracking
- [x] Paywall dialogs
- [x] Premium upgrade flow
- [x] Analytics tracking for all touchpoints

### 🔨 In Progress

- [ ] A/B test dashboard (Firebase Console)
- [ ] Advanced feature gates (batch, recurring)
- [ ] Pro badge in UI
- [ ] Referral program integration

### 📋 Planned

- [ ] Email capture during onboarding (optional)
- [ ] Personalized onboarding based on use case
- [ ] Interactive tutorial mode
- [ ] Testimonials in paywall
- [ ] Lifetime pricing tier

---

## Recommendations

### For Launch (Phase 1)

**Use Affiliate Model** (`paid_only: false`)
- Lowest friction, fastest growth
- Build user base and usage data
- Test which events have ticketing demand
- Gather reviews and ratings
- Refine product-market fit

### Post-Launch (Phase 2)

**Introduce Hybrid Model**
- Keep free tier unlimited
- Add optional Pro tier ($24.99/year)
- Pro benefits: Advanced features, no ads, priority support
- Test conversion rates with different Pro feature sets
- Measure impact on retention and LTV

### Mature Product (Phase 3)

**Optimize Based on Data**
- If affiliate revenue > subscription: Double down on affiliate
- If subscription revenue > affiliate: Consider removing affiliate
- If hybrid works best: Optimize both revenue streams
- Continuously A/B test pricing and features

---

## Key Learnings

### What Works

✅ **Short onboarding** - 3 screens is optimal
✅ **Immediate value** - Let users capture during onboarding
✅ **Flexible monetization** - Remote Config allows real-time testing
✅ **Clear benefits** - Users understand "unlimited" instantly
✅ **Low friction** - Affiliate model builds user base faster

### What to Avoid

❌ **Too many screens** - Users skip onboarding
❌ **Aggressive paywall** - Hurts retention and ratings
❌ **Complex pricing** - Keep it simple: monthly or annual
❌ **Hidden costs** - Be transparent about what's free vs. paid
❌ **Early monetization** - Build trust first, monetize second

---

## Analytics Events

### Onboarding

- `ONBOARDING_STARTED`
- `ONBOARDING_SCREEN_VIEWED` (screen: 1/2/3)
- `ONBOARDING_COMPLETED`
- `ONBOARDING_SKIPPED`

### Monetization

- `PAYWALL_SHOWN` (reason: capture_limit / feature_gate)
- `SUBSCRIPTION_PURCHASE_INITIATED` (tier: monthly/annual)
- `SUBSCRIPTION_PURCHASE_SUCCESS`
- `SUBSCRIPTION_PURCHASE_FAILED`
- `AFFILIATE_LINK_CLICKED` (event_id, event_title)
- `AFFILIATE_LINK_CONVERTED` (assumed, tracked via affiliate dashboard)

### Retention

- `APP_OPENED` (session_count)
- `CAPTURE_COMPLETED` (capture_count)
- `EVENT_SAVED_TO_CALENDAR`
- `USER_RETURNED` (days_since_last_open)

---

## Support & Documentation

For implementation details, see:
- **Frontend:** `app/src/components/onboarding/`
- **Backend:** `backend/functions/` (feature flags, webhooks)
- **RevenueCat Setup:** `docs/REVENUECAT_SETUP.md`
- **Analytics:** `docs/strategy/APP-ANALYTICS.md`

For questions or changes to onboarding/monetization strategy, consult this document first. All major changes should be A/B tested before full rollout.

---

**Remember:** The goal is to maximize long-term user value, not short-term revenue. Build trust, deliver value, and monetization will follow naturally.
