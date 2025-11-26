# Documentation Structure Guide

## Overview

This document explains the documentation organization strategy for the cap2cal project.

## Documentation Philosophy

### Human vs AI Documentation
The project maintains **two types of documentation**:

1. **Human-facing documentation** - Guides, tutorials, references
   - Clear, concise, task-oriented
   - Examples and screenshots
   - Step-by-step instructions

2. **AI-facing documentation (CLAUDE.md)** - Context for AI assistants
   - Comprehensive technical details
   - Architecture patterns and conventions
   - Code examples and anti-patterns
   - Quick reference sections
   - Can be verbose and highly detailed

## File Naming Conventions

| Pattern | Usage | Examples |
|---------|-------|----------|
| `UPPERCASE.md` | Important reference documents | `CLAUDE.md`, `ARCHITECTURE.md`, `API-REFERENCE.md` |
| `Title-Case.md` | Guides and tutorials | `Getting-Started.md`, `Deployment-Guide.md` |
| `README.md` | Index/overview (always lowercase) | `README.md` |
| `kebab-case.md` | Supplementary docs | `troubleshooting-guide.md`, `best-practices.md` |

## Directory Structure

```
cap2cal/
│
├── README.md                          # Project overview (root)
│
├── docs/                              # Project-wide documentation
│   ├── README.md                     # Documentation index
│   ├── ARCHITECTURE.md               # System architecture
│   ├── GETTING-STARTED.md            # Setup guide
│   ├── DEPLOYMENT.md                 # Deployment guide (TODO)
│   └── DOCUMENTATION-GUIDE.md        # This file
│
├── app/                               # Mobile app sub-project
│   ├── README.md                     # App overview
│   └── docs/                         # App-specific documentation
│       ├── README.md                 # App docs index
│       ├── CLAUDE.md                 # ⭐ AI assistant context
│       ├── DEVELOPMENT.md            # Development guide (TODO)
│       ├── COMPONENTS.md             # Component reference (TODO)
│       ├── STATE-MANAGEMENT.md       # State & data guide (TODO)
│       └── DEPLOYMENT.md             # App deployment (TODO)
│
├── web/                               # Web sub-project (if exists)
│   └── docs/
│       ├── README.md
│       └── CLAUDE.md                 # Web-specific AI context
│
└── tools/                             # Development tools
    └── screenshots/                   # Screenshot generation tool
        ├── README.md
        └── package.json
```

## Documentation Scope

### Root `/docs/` - Project-Wide
**Contains**: Documentation applicable to the entire cap2cal ecosystem

- System architecture
- Getting started (all projects)
- Deployment strategies
- Contributing guidelines
- Code of conduct

**Example topics**:
- How the mobile app and backend communicate
- Overall technology choices
- Cross-project conventions
- Infrastructure and DevOps

### `/app/docs/` - Mobile App Specific
**Contains**: Documentation specific to the React + Capacitor mobile app

- App architecture and patterns
- Component library
- State management strategy
- Mobile-specific deployment
- CLAUDE.md for AI context

**Example topics**:
- React component structure
- Capacitor plugin usage
- iOS/Android build processes
- App-specific conventions

### `/tools/` - Development Tools
**Contains**: Utility projects and scripts

- Screenshot generation tool
- Build automation scripts
- Development utilities
- Testing helpers

## CLAUDE.md Files

### Purpose
CLAUDE.md files provide **comprehensive context for AI assistants** (particularly Claude Code) to understand:
- Project structure and organization
- Technology stack and architecture
- Code conventions and patterns
- Common workflows and tasks
- Quick reference information

### Location Strategy
**Each sub-project gets its own CLAUDE.md** because:
- Different tech stacks (React app vs Python backend)
- Different conventions and patterns
- Different architecture decisions
- AI assistants work on one sub-project at a time

### Content Structure
A good CLAUDE.md includes:

1. **Project Overview** - What it is, what it does
2. **Tech Stack** - All technologies with rationale
3. **Project Structure** - Directory tree with explanations
4. **Architecture & Patterns** - How code is organized
5. **Naming Conventions** - File and code standards
6. **Key Workflows** - How features work end-to-end
7. **Development Guidelines** - How to add features
8. **Design System** - UI patterns and styles
9. **Common Patterns** - Code you'll see frequently
10. **Do's and Don'ts** - Clear guidelines
11. **Quick Reference** - Important files and utilities

### Updating CLAUDE.md
Update when:
- Major architectural changes
- New patterns introduced
- Convention changes
- New workflows added
- Significant refactoring

## Creating New Documentation

### For Project-Wide Topics

1. **Determine if truly cross-project**
   - Does it apply to multiple sub-projects?
   - Is it about overall system architecture?

2. **Create in `/docs/`**
   ```bash
   # Create the document
   touch docs/YOUR-TOPIC.md

   # Add to index
   # Edit docs/README.md to include link
   ```

3. **Follow naming convention**
   - Important reference: `UPPERCASE.md`
   - Guide/tutorial: `Title-Case.md`

### For Sub-Project Specific Topics

1. **Create in sub-project docs**
   ```bash
   # For mobile app
   touch app/docs/YOUR-TOPIC.md

   # For web
   touch web/docs/YOUR-TOPIC.md
   ```

2. **Add to sub-project README**
   - Update `app/docs/README.md`

3. **Consider updating CLAUDE.md**
   - If it affects AI assistant context

### For Development Tools

1. **Add to `/tools/` directory**
   ```bash
   mkdir tools/your-tool
   touch tools/your-tool/README.md
   ```

2. **Document in tool's README**
   - Usage instructions
   - Configuration
   - Examples

## Documentation Best Practices

### Writing Style

#### Human Documentation
- **Clear and concise** - Get to the point
- **Task-oriented** - "How to..." format
- **Examples first** - Show, then explain
- **Progressive disclosure** - Simple → complex
- **Visual aids** - Diagrams, screenshots where helpful

#### AI Documentation (CLAUDE.md)
- **Comprehensive** - Include all relevant details
- **Context-rich** - Explain the "why"
- **Pattern-focused** - Show common patterns
- **Example-heavy** - Code examples throughout
- **Cross-referenced** - Link related concepts
- **Can be verbose** - AI can handle detail

### Maintenance

**Keep docs in sync with code**:
- Update docs in same PR as code changes
- Review docs during code review
- Quarterly documentation audit
- Archive outdated docs

**Link between docs**:
- Use relative links: `[link](./OTHER-DOC.md)`
- Create clear navigation paths
- Maintain consistent section structure

### Quality Checklist

Before committing documentation:
- [ ] Correct spelling and grammar
- [ ] Links work and are relative
- [ ] Code examples are tested
- [ ] Follows naming conventions
- [ ] Added to relevant README index
- [ ] Updated CLAUDE.md if needed
- [ ] Reviewed for accuracy

## Migration Guide

### If You Find Docs in Wrong Location

1. **Determine correct location** using this guide
2. **Move file** to correct directory
3. **Update all links** to the file
4. **Update index files** (READMEs)
5. **Create redirect** (optional, for critical docs)

### Example Migration
```bash
# Old location: app/ARCHITECTURE.md
# New location: docs/ARCHITECTURE.md

# Move file
git mv app/ARCHITECTURE.md docs/ARCHITECTURE.md

# Update links in other files
# Search: app/ARCHITECTURE.md
# Replace: ../docs/ARCHITECTURE.md

# Update index
# Edit docs/README.md
```

## FAQ

### Q: When should I create a new doc vs updating existing?
**A**: Update existing if the topic already has a doc. Create new if it's a distinct topic that deserves its own file.

### Q: Should I duplicate content between human and AI docs?
**A**: No. Human docs should be concise. AI docs (CLAUDE.md) can reference human docs but add context and patterns.

### Q: How detailed should CLAUDE.md be?
**A**: Very detailed. Include everything an AI assistant needs to understand the codebase. 5000-10000 words is fine.

### Q: Can I use markdown extensions?
**A**: Stick to standard markdown (CommonMark). GitHub-flavored markdown is OK. Avoid platform-specific extensions.

### Q: Should docs have table of contents?
**A**: Yes for docs over 200 lines. Use markdown TOC generators or manual lists.

### Q: How do I handle images in docs?
**A**: Store in `docs/images/` or `app/docs/images/`, reference with relative paths.

---

## Need Help?

- **Check existing docs** for examples
- **Review this guide** for structure
- **Ask in discussions** if unsure
- **Look at CLAUDE.md** for comprehensive context
