# Cap2Cal Product Roadmap

**Last Updated:** November 2024
**Status:** Active Development

---

## Executive Summary

Cap2Cal is a production-ready AI-powered event capture app preparing for App Store launch. This roadmap prioritizes improvements across features, infrastructure, design, and growth—balancing quick wins with long-term strategic initiatives.

---

## Current Status

### Strengths
- ✅ Solid technical foundation (React + Capacitor + Firebase)
- ✅ Working AI extraction with Gemini API
- ✅ Clean, modern UI with dark theme
- ✅ Comprehensive analytics integration
- ✅ Multi-language support (EN, DE)
- ✅ Local-first architecture with IndexedDB

### Critical Gaps
- ⚠️ No automated testing infrastructure
- ⚠️ No error tracking/crash reporting
- ⚠️ Large bundle size (performance concerns)
- ⚠️ Limited offline support
- ⚠️ Generic error messages

---

## Priorities

### Phase 1: Foundation (Weeks 1-4) - PRE-LAUNCH CRITICAL

**Goal:** Ensure quality and compliance before major launch

#### 1. Testing Infrastructure 🔴 CRITICAL
- Set up Jest + React Testing Library
- Write tests for core flows (capture → extract → save)
- E2E tests with Playwright/Detox
- Target: 60%+ test coverage
- CI integration with automated test runs

**Effort:** High | **Impact:** Very High

#### 2. Error Tracking 🔴 CRITICAL
- Integrate Sentry or similar
- Track unhandled exceptions and promise rejections
- Source map upload for readable stack traces
- User context attachment (anonymized)
- Release tracking for regression detection

**Effort:** Medium | **Impact:** Very High

#### 3. Performance Optimization
- Bundle size analysis and reduction (< 500KB goal)
- Code splitting for routes
- Lazy load heavy components
- API response caching (1-hour TTL for feature flags)
- Image compression before upload

**Effort:** Medium | **Impact:** High

#### 4. Legal Compliance
- Privacy policy review
- Data export/deletion features (GDPR)
- CCPA compliance for California users
- Terms of service update
- App Store compliance check

**Effort:** Medium | **Impact:** Very High

---

### Phase 2: UX Excellence (Weeks 5-8) - POST-LAUNCH

**Goal:** Improve user experience and reduce friction

#### 1. Event Editing Before Save
- Edit screen after AI extraction, before calendar save
- Fix common AI errors (date, time, location)
- Preview before committing
- Track edit frequency to measure AI accuracy

**Effort:** Medium | **Impact:** High

#### 2. Search & Filtering
- Full-text search across title, location, description
- Filter by date range (past, upcoming, this month)
- Filter by favorites
- Sort options (date, title, recently added)

**Effort:** Low | **Impact:** Medium

#### 3. Improved Error States
- User-friendly error messages (no technical jargon)
- Actionable recovery steps
- Helpful illustrations for each error type
- Context-specific guidance

**Effort:** Medium | **Impact:** High

#### 4. Loading States & Skeletons
- Skeleton screens for event library
- Progress indicators for AI extraction
- Shimmer effects during loading
- Optimistic UI updates

**Effort:** Medium | **Impact:** Medium

#### 5. Dark Mode (Full Implementation)
- System-aware dark theme (already has dark UI)
- Manual toggle in settings
- Camera preview optimization for low light
- WCAG AA contrast compliance

**Effort:** Medium | **Impact:** Medium

---

### Phase 3: Growth (Weeks 9-16) - SCALE USER BASE

**Goal:** Acquire and retain more users

#### 1. App Store Optimization (ASO)
- Keyword research and optimization
- Professional screenshots (before/after comparisons)
- 30-second app preview video
- Localized listings (Spanish, French, Italian)
- A/B test screenshots and descriptions

**Effort:** Medium | **Impact:** Very High

#### 2. A/B Testing Framework
- Firebase Remote Config experiments
- Test paywall placement strategies
- Test pricing tiers
- Test onboarding flows
- Statistical significance tracking

**Effort:** Medium | **Impact:** High

#### 3. Referral Program
- Give 10 free captures per referral
- Friend gets 10 bonus captures too
- Unique referral codes
- Referral tracking and analytics
- Viral loop mechanics

**Effort:** High | **Impact:** High

#### 4. Additional Languages
- Spanish (500M speakers)
- French (300M speakers)
- Italian (85M speakers)
- Professional translation (not automated)
- Cultural adaptation (date formats, etc.)

**Effort:** Medium per language | **Impact:** High

#### 5. Push Notifications (Smart & Respectful)
- Event reminders (1 day, 1 hour before)
- Re-engagement for dormant users (gentle nudge)
- New feature announcements
- Personalized weekly digest
- Easy opt-out

**Effort:** Medium | **Impact:** Medium

---

### Phase 4: Advanced Features (Weeks 17-24) - DIFFERENTIATION

**Goal:** Add unique features competitors don't have

#### 1. Multiple Calendar Support
- Fetch available calendars from device
- User chooses destination calendar
- Remember last-used calendar
- Visual calendar color coding

**Effort:** Medium | **Impact:** High

#### 2. Recurring Events Detection
- AI detects "Every Monday", "Weekly", "Monthly"
- Generate calendar recurrence rules (RRULE)
- User confirms/edits recurrence
- Preview upcoming occurrences

**Effort:** High | **Impact:** Medium

#### 3. Batch Image Processing
- Queue multiple images in one session
- Show progress ("Processing 3 of 7...")
- Extract all events from batch
- Review all before bulk save

**Effort:** Medium | **Impact:** Medium

#### 4. OCR Fallback Mode
- Fallback to pure OCR if Gemini fails
- Google Cloud Vision API or Tesseract
- Cost-effective backup
- Graceful degradation strategy

**Effort:** Medium | **Impact:** Medium

#### 5. Widget Support (iOS/Android)
- Home screen widget showing next event
- Quick capture button widget
- Lock screen widget (iOS 16+)
- Live Activities for event countdown

**Effort:** High | **Impact:** Medium

---

### Phase 5: Platform & Ecosystem (Weeks 25+) - LONG-TERM

**Goal:** Build platform value and ecosystem

#### 1. Calendar Sync (Two-Way)
- Bidirectional Google Calendar sync
- Outlook/Microsoft Calendar integration
- Apple Calendar cloud sync
- Conflict resolution

**Effort:** Very High | **Impact:** Medium

#### 2. Social Features
- Share event library with friends
- Friend invites to events
- Social proof ("5 friends are attending")
- Public profiles (optional)

**Effort:** Very High | **Impact:** High (Growth)

#### 3. Smart Suggestions
- Recommend events based on history
- Location-based event discovery
- "People like you also attended..."
- Friend attending suggestions

**Effort:** Very High | **Impact:** Medium

#### 4. Integration Ecosystem
- Eventbrite/Meetup.com integration
- Spotify/Apple Music for event music
- Ticket platform partnerships
- Venue partnerships

**Effort:** Very High | **Impact:** Medium

---

## Quick Wins (Can Be Done Anytime)

### Design & Polish
- [ ] Unified design system (remove 30+ hardcoded colors)
- [ ] Consistent button components (5 different styles currently)
- [ ] Typography scale (11 sizes → 7 semantic sizes)
- [ ] Fix onboarding typo (`bg-primary/00`)
- [ ] Remove commented code and unused components

**Effort:** Low-Medium | **Impact:** High (Consistency)

### Code Quality
- [ ] Enable TypeScript strict mode
- [ ] Replace all `any` types with proper types
- [ ] Remove console.log statements (71 found)
- [ ] Add ESLint + Prettier pre-commit hooks
- [ ] Implement proper logging library

**Effort:** Medium | **Impact:** Medium (Maintainability)

### Accessibility
- [ ] Fix ESLint a11y violations (currently warnings)
- [ ] Add ARIA labels to all interactive elements
- [ ] Keyboard navigation for dialogs/sheets
- [ ] WCAG AA color contrast verification
- [ ] Screen reader optimization

**Effort:** Medium | **Impact:** High (Inclusion & App Store)

---

## Metrics to Track

### Product Health
- **Extraction Success Rate:** Target 90%+ (currently unknown)
- **Edit Rate:** Track % of events edited before save (target < 20%)
- **Calendar Save Success:** Target 95%+
- **App Crashes per Session:** Target < 0.1%
- **App Load Time:** Target < 2 seconds

### Business KPIs
- **DAU/MAU Ratio:** Target 20%+ (healthy engagement)
- **Free → Paid Conversion:** Target 5%+
- **Monthly Churn Rate:** Target < 5%
- **Lifetime Value (LTV):** Track and optimize
- **Cost per Acquisition:** Track for each channel

### Growth KPIs
- **Weekly Active Users (WAU):** Target +10% WoW
- **Organic Install Rate:** Target 70%+ organic
- **App Store Rating:** Maintain 4.5+ stars
- **Retention (Day 1/7/30):** Target 40% / 20% / 10%

---

## Success Milestones

### 3 Months Post-Launch
- 10,000+ installs
- 4.5+ star rating on both stores
- 5%+ conversion to paid
- 60%+ test coverage
- Zero critical bugs in production

### 6 Months Post-Launch
- 50,000+ installs
- 10,000+ monthly active users
- 10%+ conversion to paid
- $5,000+ MRR
- 3 additional languages live

### 12 Months Post-Launch
- 200,000+ installs
- 50,000+ monthly active users
- 15%+ conversion to paid
- $30,000+ MRR
- Featured in App Store

---

## Risk Mitigation

### Technical Risks
- **Gemini API changes:** Abstract AI layer to support multiple providers
- **iOS/Android breaking changes:** Automated testing, slow OS adoption
- **Firebase lock-in:** Keep business logic portable

### Business Risks
- **Low conversion rate:** A/B test aggressively, improve value prop
- **High CAC:** Focus on organic growth, referrals, ASO
- **Competitor with more features:** Focus on best-in-class UX, speed

### Regulatory Risks
- **GDPR violations:** Compliance audit, legal review
- **App Store rejection:** Follow guidelines strictly
- **AI regulations (EU AI Act):** Monitor legislation, transparency in AI usage

---

## Cost Optimization

### Current Cost Drivers
1. Gemini API calls (per image processed)
2. Firebase Cloud Functions (compute time)
3. Firebase Firestore (reads/writes)
4. Google Custom Search API (ticket search)

### Optimization Strategies
- Aggressive caching (reduce API calls by 30%)
- Image compression before upload
- Batch Firestore writes
- Monitor and alert on unusual costs
- **Target:** < $0.10/month per user at scale

---

## Implementation Guidelines

### How to Use This Roadmap

1. **Phases are flexible** - Adjust based on feedback and metrics
2. **Quick wins can be done anytime** - Fill gaps between phases
3. **User feedback guides priorities** - Not all features need to be built
4. **Ship fast, measure, iterate** - Data-driven decisions
5. **Quality over quantity** - Better to do 5 things excellently than 20 poorly

### Not on the Roadmap (Yet)

These ideas are interesting but not priorities right now:
- Email campaigns (requires email collection)
- Gamification (badges, streaks, leaderboards)
- Advanced analytics dashboard for users
- Machine learning improvements
- Separate admin web app
- API for third-party developers

They may be added based on user demand and product-market fit signals.

---

## Document Version Control

**Version:** 2.0
**Created:** November 2024
**Next Review:** After Phase 1 completion
**Owner:** Product & Engineering

---

**Remember:** This is a living document. Update it based on learnings, user feedback, and market changes. Priorities may shift—that's healthy!
