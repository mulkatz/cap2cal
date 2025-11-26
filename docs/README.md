# cap2cal Documentation

Welcome to the cap2cal project documentation. This is a multi-project repository containing mobile app, web, and backend components.

## Documentation Structure

```
/docs/                           # Project-wide documentation (this directory)
  ├── README.md                 # This file - documentation index
  ├── ARCHITECTURE.md           # System architecture overview
  ├── GETTING-STARTED.md        # Initial setup guide
  ├── DOCUMENTATION-GUIDE.md    # Documentation standards
  ├── REVENUECAT_SETUP.md       # RevenueCat integration
  ├── REVENUECAT_TOGGLE.md      # RevenueCat configuration
  ├── TASKS.md                  # Project tasks and history
  │
  ├── marketing/                # Marketing materials
  │   ├── APP-STORE-COPY.md
  │   ├── app-store-listing.md
  │   ├── app-store-translations.md
  │   ├── pitch-deck.md
  │   └── pitch-deck-sources.md
  │
  ├── strategy/                 # Business strategy
  │   ├── APP-ANALYTICS.md      # Analytics strategy
  │   └── GROWTH-PLAYBOOK.md    # Growth strategy
  │
  └── planning/                 # Product planning
      ├── IMPROVEMENT-ROADMAP.md
      ├── IMPROVEMENT-SUGGESTIONS.md
      ├── LANDING-PAGE-CONCEPT.md
      ├── LANGUAGE_ANALYSIS.md
      ├── ONBOARDING-MONETIZATION-CONCEPT.md
      ├── ONBOARDING-UI-IMPLEMENTATION.md
      └── VISUAL_INCONSISTENCIES.md

/app/docs/                       # Mobile app specific documentation
  ├── README.md                 # App documentation index
  ├── CLAUDE.md                 # ⭐ AI assistant context
  ├── DEVELOPMENT.md            # Development workflow (TODO)
  ├── COMPONENTS.md             # Component reference (TODO)
  └── STATE-MANAGEMENT.md       # State & data guide (TODO)

/tools/screenshots/              # Screenshot generation tool
  ├── README.md                 # Tool documentation
  ├── ARCHITECTURE.md           # Tool architecture
  └── SCREENSHOTS.md            # Screenshot guide
```

---

## Quick Navigation

### 🚀 Getting Started
- **[Setup Guide](./GETTING-STARTED.md)** - Install dependencies and run the project
- **[Architecture](./ARCHITECTURE.md)** - Understand the system design
- **[Documentation Guide](./DOCUMENTATION-GUIDE.md)** - How we organize docs

### 📱 Mobile App
- **[App Documentation](../app/docs/README.md)** - Mobile app specific docs
- **[CLAUDE.md](../app/docs/CLAUDE.md)** - Complete context for AI assistants
- **[Development Guide](../app/docs/DEVELOPMENT.md)** - Workflow and conventions (TODO)

### 💰 Monetization & Setup
- **[RevenueCat Setup](./REVENUECAT_SETUP.md)** - In-app purchase integration
- **[RevenueCat Configuration](./REVENUECAT_TOGGLE.md)** - Toggle setup

### 📊 Strategy & Planning
- **[Analytics Strategy](./strategy/APP-ANALYTICS.md)** - Usage tracking approach
- **[Growth Playbook](./strategy/GROWTH-PLAYBOOK.md)** - User acquisition strategy
- **[Improvement Roadmap](./planning/IMPROVEMENT-ROADMAP.md)** - Future enhancements
- **[Feature Suggestions](./planning/IMPROVEMENT-SUGGESTIONS.md)** - Ideas backlog

### 📢 Marketing
- **[App Store Copy](./marketing/APP-STORE-COPY.md)** - Store listing content
- **[Store Translations](./marketing/app-store-translations.md)** - Localized listings
- **[Pitch Deck](./marketing/pitch-deck.md)** - Investor presentation

### 🛠️ Development Tools
- **[Screenshot Tool](../tools/screenshots/README.md)** - Automated screenshot generation

### ✅ Tasks
- **[Project Tasks](./TASKS.md)** - Current and completed tasks

---

## For AI Assistants (Claude Code)

Each sub-project contains a **CLAUDE.md** file specifically designed for AI assistants:
- **[`/app/docs/CLAUDE.md`](../app/docs/CLAUDE.md)** - Mobile app complete context

These files contain:
- ✅ Project overview and tech stack
- ✅ Architecture patterns and conventions
- ✅ Code standards and best practices
- ✅ Common workflows and patterns
- ✅ Quick reference for development

**Note**: CLAUDE.md files are optimized for AI comprehension and contain more technical detail than human-facing documentation.

---

## Documentation Conventions

### File Naming
- **UPPERCASE.md** - Important reference documents
  - Examples: `ARCHITECTURE.md`, `CLAUDE.md`, `TASKS.md`
- **Title-Case.md** - Guides and how-tos
  - Examples: `Getting-Started.md`, `Deployment-Guide.md`
- **README.md** - Always lowercase, serves as directory index
- **kebab-case.md** - Supplementary docs
  - Examples: `app-store-listing.md`, `pitch-deck.md`

### Directory Organization
- **`/docs/`** - Project-wide documentation
- **`/app/docs/`** - Mobile app specific
- **`/web/docs/`** - Web project specific (future)
- **`/tools/*/`** - Tool-specific docs in tool directory

### Subdirectories in `/docs/`
- **`marketing/`** - App store, campaigns, pitch materials
- **`strategy/`** - Business strategy, analytics, growth
- **`planning/`** - Product roadmap, feature planning, design

---

## Contributing to Documentation

When adding or updating documentation:

1. **Determine scope**: Project-wide or sub-project specific?
2. **Choose location**: `/docs/` or `/app/docs/` or `/tools/*/`
3. **Follow naming**: Use appropriate convention (UPPERCASE, Title-Case)
4. **Add to index**: Update relevant README.md
5. **Update CLAUDE.md**: If it affects AI assistant context
6. **Link related docs**: Create navigation between related documents

See **[Documentation Guide](./DOCUMENTATION-GUIDE.md)** for complete guidelines.

---

## Documentation Quality

All documentation should:
- ✅ Use clear, concise language
- ✅ Include code examples where relevant
- ✅ Link to related documents
- ✅ Follow markdown best practices
- ✅ Be kept up-to-date with code changes

---

**Last Updated**: Documentation structure reorganized November 2024
