# Cap2Cal Documentation

Welcome to the cap2cal project documentation. This directory contains project-wide documentation for the entire Cap2Cal ecosystem.

---

## 📚 Quick Navigation

### 🚀 Getting Started
Start here if you're new to the project:

- **[Getting Started Guide](./GETTING-STARTED.md)** - Install dependencies, build, and run the project
- **[Architecture Overview](./ARCHITECTURE.md)** - Understand the system design and tech stack
- **[Documentation Guide](./DOCUMENTATION-GUIDE.md)** - How we organize and maintain documentation

### 💻 For Developers

- **[Root CLAUDE.md](../CLAUDE.md)** - Complete project context for AI assistants
- **[App CLAUDE.md](../app/docs/CLAUDE.md)** - Mobile app deep dive for AI working on app code
- **[Tasks History](./TASKS.md)** - Project task tracking and completed work

### 📱 Mobile App Specific

Mobile app documentation is located in `/app/docs/`:
- **[App Documentation Index](../app/docs/README.md)** - Mobile app specific docs
- **[App CLAUDE.md](../app/docs/CLAUDE.md)** - Comprehensive context for AI assistants

### 💰 Monetization & Setup

- **[RevenueCat Setup](./REVENUECAT_SETUP.md)** - Complete guide for in-app purchase integration
- **[RevenueCat Toggle](./REVENUECAT_TOGGLE.md)** - Enable/disable monetization via environment variable

---

## 📋 Planning & Product

Strategic documents guiding the product roadmap:

### Current Documents

- **[Product Roadmap](./planning/ROADMAP.md)** ⭐
  - Consolidated feature roadmap with priorities, timeline, and metrics
  - Replaces previous IMPROVEMENT-ROADMAP and IMPROVEMENT-SUGGESTIONS docs
  - **Read this** for understanding what's planned, priorities, and implementation phases

- **[Onboarding & Monetization](./planning/ONBOARDING.md)** ⭐
  - User onboarding strategy and monetization models (Affiliate, Subscription, Hybrid)
  - Feature flags system and A/B testing framework
  - **Read this** for understanding user acquisition and revenue strategy

- **[Visual Inconsistencies](./planning/VISUAL_INCONSISTENCIES.md)**
  - Comprehensive design system audit
  - Documents hardcoded colors, typography issues, spacing inconsistencies
  - **Read this** before working on UI/design improvements

- **[Landing Page Concept](./planning/LANDING-PAGE-CONCEPT.md)**
  - Marketing website design and content strategy
  - Still relevant for future marketing site development

### Archived Documents

Older versions moved to `docs/archive/planning/` for reference:
- IMPROVEMENT-ROADMAP.md (replaced by ROADMAP.md)
- IMPROVEMENT-SUGGESTIONS.md (replaced by ROADMAP.md)
- LANGUAGE_ANALYSIS.md (completed analysis)
- ONBOARDING-MONETIZATION-CONCEPT.md (replaced by ONBOARDING.md)
- ONBOARDING-UI-IMPLEMENTATION.md (replaced by ONBOARDING.md)

---

## 📊 Strategy & Growth

Business strategy and analytics documentation:

- **[Growth Playbook](./strategy/GROWTH-PLAYBOOK.md)** (1446 lines)
  - User acquisition strategies (ASO, content marketing, referrals)
  - Retention and engagement tactics
  - AARRR funnel optimization (Acquisition, Activation, Retention, Revenue, Referral)
  - **Read this** for understanding growth strategy

- **[App Analytics](./strategy/APP-ANALYTICS.md)** (414 lines)
  - Analytics implementation guide
  - Event tracking strategy (40+ events)
  - Firebase Analytics integration
  - **Read this** before adding new analytics events

---

## 📢 Marketing Materials

App store listings, copy, and promotional content:

- **[App Store Copy](marketing/deprecated/APP-STORE-COPY.md)** (397 lines)
  - Promotional text (170 characters)
  - App description (4000 characters)
  - Keywords and metadata
  - **Use this** for App Store/Google Play submissions

- **[Store Translations](marketing/deprecated/app-store-translations.md)** (587 lines)
  - Localized app store listings
  - Multi-language support (EN, DE, more planned)
  - **Use this** for international markets

- **[App Store Listing Guide](marketing/deprecated/app-store-listing.md)** (227 lines)
  - Store listing best practices
  - Screenshot requirements
  - Review guidelines

- **[Pitch Deck](marketing/deprecated/pitch-deck.md)** (910 lines)
  - Investor presentation content
  - Problem, solution, market, traction
  - **Use this** for fundraising conversations

- **[Pitch Deck Sources](marketing/deprecated/pitch-deck-sources.md)** (455 lines)
  - Supporting data and research
  - Market statistics
  - Competitor analysis

---

## 🛠️ Development Tools

Tools and utilities located in `/tools/`:

- **[Screenshot Tool](../tools/screenshots/README.md)**
  - Automated screenshot generation for App Store
  - Multi-language, multi-device support
  - See also: [SCREENSHOTS.md](../tools/screenshots/SCREENSHOTS.md)

---

## 📁 Documentation Structure

```
/docs/                           # Project-wide documentation (this directory)
  ├── README.md                 # This file - documentation index
  ├── ARCHITECTURE.md           # System architecture overview
  ├── GETTING-STARTED.md        # Initial setup guide
  ├── DOCUMENTATION-GUIDE.md    # Documentation standards and organization
  ├── TASKS.md                  # Project tasks and history
  ├── REVENUECAT_SETUP.md       # RevenueCat integration guide
  ├── REVENUECAT_TOGGLE.md      # RevenueCat enable/disable toggle
  │
  ├── planning/                 # Product planning & roadmap
  │   ├── ROADMAP.md            # ⭐ Consolidated feature roadmap (NEW)
  │   ├── ONBOARDING.md         # ⭐ Onboarding & monetization strategy (NEW)
  │   ├── VISUAL_INCONSISTENCIES.md  # Design system audit
  │   └── LANDING-PAGE-CONCEPT.md    # Marketing website concept
  │
  ├── archive/                  # Archived/superseded documents
  │   └── planning/             # Old planning docs (for reference only)
  │
  ├── marketing/                # Marketing materials
  │   ├── APP-STORE-COPY.md     # Store listing content
  │   ├── app-store-listing.md  # Listing best practices
  │   ├── app-store-translations.md  # Localized listings
  │   ├── pitch-deck.md         # Investor presentation
  │   └── pitch-deck-sources.md # Supporting data
  │
  └── strategy/                 # Business strategy
      ├── GROWTH-PLAYBOOK.md    # User acquisition & retention
      └── APP-ANALYTICS.md      # Analytics implementation

/app/docs/                       # Mobile app specific documentation
  ├── README.md                 # App documentation index
  └── CLAUDE.md                 # ⭐ AI assistant context for mobile app

/tools/screenshots/              # Screenshot generation tool
  ├── README.md                 # Tool documentation
  └── SCREENSHOTS.md            # Screenshot guide

/ (root)                         # Project root
  ├── README.md                 # ⭐ Project introduction & quick start
  └── CLAUDE.md                 # ⭐ Project-wide AI assistant context
```

---

## 🎯 For AI Assistants (Claude Code)

If you're an AI assistant working on this project, **start here:**

1. **[Root CLAUDE.md](../CLAUDE.md)** - Project-wide context (THIS IS ESSENTIAL)
2. **[App CLAUDE.md](../app/docs/CLAUDE.md)** - Mobile app deep dive
3. **[Architecture](./ARCHITECTURE.md)** - System design
4. **[Roadmap](./planning/ROADMAP.md)** - Feature priorities

These files contain:
- ✅ Project overview and tech stack
- ✅ Architecture patterns and conventions
- ✅ Code standards and best practices
- ✅ Common workflows and patterns
- ✅ Quick reference for development
- ✅ Where to find specific code/features

**Note:** CLAUDE.md files are optimized for AI comprehension and contain more technical detail than human-facing documentation.

---

## 📝 Documentation Conventions

### File Naming

- **UPPERCASE.md** - Important reference documents (ARCHITECTURE.md, CLAUDE.md, TASKS.md)
- **Title-Case.md** - Guides and how-tos (Getting-Started.md)
- **README.md** - Always lowercase, serves as directory index
- **kebab-case.md** - Supplementary docs (app-store-listing.md, pitch-deck.md)

### Directory Organization

- **`/docs/`** - Project-wide documentation (you are here)
- **`/app/docs/`** - Mobile app specific
- **`/tools/*/`** - Tool-specific docs in tool directory
- **`/docs/archive/`** - Superseded documents (reference only)

### Subdirectories in `/docs/`

- **`planning/`** - Product roadmap, feature planning, design strategy
- **`marketing/`** - App store materials, campaigns, pitch content
- **`strategy/`** - Business strategy, analytics, growth tactics
- **`archive/`** - Old versions of documents (kept for reference)

---

## ✍️ Contributing to Documentation

When adding or updating documentation:

1. **Determine scope**: Project-wide or sub-project specific?
2. **Choose location**: `/docs/` or `/app/docs/` or `/tools/*/`
3. **Follow naming**: Use appropriate convention (UPPERCASE, Title-Case, kebab-case)
4. **Add to index**: Update relevant README.md
5. **Update CLAUDE.md**: If it affects AI assistant context
6. **Link related docs**: Create navigation between related documents

See **[Documentation Guide](./DOCUMENTATION-GUIDE.md)** for complete guidelines.

---

## 📊 Documentation Stats

### Current Active Documents

| Category | Files | Total Lines |
|----------|-------|-------------|
| **Planning** | 4 files | ~3,500 lines (after consolidation) |
| **Marketing** | 5 files | ~3,000 lines |
| **Strategy** | 2 files | ~1,900 lines |
| **Technical** | 7 files | ~2,000 lines |
| **Total** | 18 files | ~10,400 lines |

### Recent Improvements (November 2024)

- ✅ **Consolidated planning docs** - Reduced from 8,500 → 3,500 lines
  - Created ROADMAP.md (merged IMPROVEMENT-ROADMAP + IMPROVEMENT-SUGGESTIONS)
  - Created ONBOARDING.md (merged 5,000 lines of onboarding docs)
- ✅ **Created archive system** - Moved 5 outdated docs to `docs/archive/`
- ✅ **Professional README.md** - Stunning project introduction in root
- ✅ **Root CLAUDE.md** - Project-wide AI assistant context
- ✅ **Updated this index** - Clear navigation and organization

---

## 🔍 Need Help?

- **Quick reference:** Use this README for navigation
- **Technical details:** Check [ARCHITECTURE.md](./ARCHITECTURE.md)
- **Setup guide:** See [GETTING-STARTED.md](./GETTING-STARTED.md)
- **AI context:** Read [CLAUDE.md](../CLAUDE.md) or [app/docs/CLAUDE.md](../app/docs/CLAUDE.md)
- **Roadmap:** Check [planning/ROADMAP.md](./planning/ROADMAP.md)

---

## 📅 Documentation Maintenance

**Last Major Update:** November 2024
**Next Review:** After Phase 1 completion (testing & optimization)
**Maintained By:** Project owner

### Maintenance Checklist

- [ ] Update docs when major features are added
- [ ] Archive superseded documents (don't delete)
- [ ] Keep CLAUDE.md files in sync with code changes
- [ ] Update README.md when structure changes
- [ ] Review quarterly for accuracy

---

**📖 Happy reading! If you have questions or find issues, please create a GitHub issue or discussion.**
