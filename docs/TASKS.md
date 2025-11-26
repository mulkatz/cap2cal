# Project Tasks

## Current Tasks
- [x] Restructured project into mono repo with all sub-projects in one place
- [x] Fixed Firebase configuration

## Completed Tasks

### Onboarding Screen Improvements
- ✅ **First page**: Removed green/yellow gradient background from app icon - now displays clean icon only
- ✅ **Second screen**: Improved wording
  - Changed "Photo anything with date info" → "Take a photo of anything with date information on it"
  - Updated step title from "Save & Buy" → "Access Anytime"
  - Updated description to emphasize event storage and library: "AI reads all details and saves the event in your app library"
  - Added promotion of key features: "Export to calendar, share events, buy tickets, and navigate to locations"
- ✅ **Third screen**: Removed pulse animation effect from ticket icon
- ✅ **Fourth screen**: Improved wording
  - Enhanced bullet points to be more descriptive
  - Updated permission descriptions to be clearer
  - All text now sounds fresh, clear, and professional

All changes have been applied to both English (en_GB) and German (de_DE) translations.

### Code Organization
- ✅ Restructured app/src/ directory into professional structure
  - Created `/pages/` for top-level screens
  - Organized `/components/` into `/ui/` and `/features/`
  - Separated `/db/` from `/models/`
  - Moved services to `/services/`
  - Consolidated helpers into `/utils/`
- ✅ Removed legacy naming suffixes (.atom, .controller, .group)
- ✅ Fixed all import paths
- ✅ Added barrel exports for cleaner imports

### Documentation
- ✅ Created comprehensive documentation structure
- ✅ Added CLAUDE.md for AI assistant context
- ✅ Organized docs into `/docs/` (project-wide) and `/app/docs/` (app-specific)
- ✅ Established file naming conventions
- ✅ Moved development tools to `/tools/`
