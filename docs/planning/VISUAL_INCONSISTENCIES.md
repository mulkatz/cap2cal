# Visual Inconsistencies Report

**Date:** 2025-11-12
**Status:** Analysis Complete - Ready for Implementation

## Executive Summary

This document catalogs visual inconsistencies found across the Cap2Cal application. The app lacks a cohesive design system, resulting in hardcoded colors, inconsistent typography, varied spacing patterns, and duplicated styling logic across components.

**Key Statistics:**
- 30+ instances of hardcoded colors (despite having a theme system)
- 11 different font sizes with no clear hierarchy
- 7 different border radius values
- 8 different icon sizes
- 5 different button component styles

---

## 1. Color System Issues

### 1.1 Defined Theme Colors
**Location:** `app/tailwind.config.ts:17-28`

```typescript
colors: {
  secondary: '#E0FDDCFF',
  accent: '#2C4156',
  accentElevated: '#41526a',
  primary: '#1E2E3F',
  primaryElevated: '#2C4156',
  primaryDark: '#1A2632',
  warn: '#FF2929',
  highlight: '#e6de4d',
  clickHighLight: '#e6de4d', // Duplicate of highlight
}
```

### 1.2 Hardcoded Colors Throughout Codebase

**Priority: CRITICAL**

| File | Line | Issue | Should Use |
|------|------|-------|------------|
| `CTAButton.tsx` | 39 | `bg-[#415970]` | `bg-accentElevated` |
| `CTAButton.tsx` | 49 | `#A0AEC0`, `#FFFFFF`, `#192632` in ClipLoader | Theme colors |
| `IconButton.tsx` | 19 | `border-[#2e3f50]`, `bg-[#415970]` | Theme colors |
| `MiniButton.tsx` | 26 | `from-[#1f2e3d] to-[#2C4156]` | Named gradient |
| `CaptureButton.tsx` | 30 | `from-[#1f2e3d] to-[#2C4156]` | Named gradient (duplicate) |
| `Card.group.tsx` | 17 | `border-[#415970]` | `border-accentElevated` |
| `EventCard.atom.tsx` | 130 | `from-[#2b3f54] to-[#2b3f54]/50` | Named gradient |
| `EventCard2.atom.tsx` | 163 | `from-[#1E2939] to-[#243145]` | Named gradient (different!) |

### 1.3 Mixing Theme and Default Tailwind Colors

**EventCard2** and **Sheet TestCard** use Tailwind's slate colors:
- `border-slate-700`
- `bg-slate-800/80`
- `text-slate-300`
- `text-slate-400`

These should map to theme colors for consistency.

### 1.4 Recommendations

1. **Extend Tailwind config with gradient definitions:**
```typescript
extend: {
  backgroundImage: {
    'gradient-primary': 'linear-gradient(to top, #1f2e3d, #2C4156)',
    'gradient-card': 'linear-gradient(to bottom, #2b3f54, rgba(43, 63, 84, 0.5))',
  }
}
```

2. **Replace all hardcoded colors** with theme references
3. **Remove duplicate** `clickHighLight` (use `highlight` only)
4. **Map slate colors** to theme equivalents

---

## 2. Typography System

### 2.1 Current Font Sizes

**Priority: CRITICAL**

11 different font sizes scattered across components:

| Size | Locations | Count |
|------|-----------|-------|
| `text-[12px]` | EventCard (time, details) | 3 uses |
| `text-[13px]` | EventCard, ToggleItem | 3 uses |
| `text-[14px]` | Feedback, CameraInstructionDialog, NotCaptured | 4 uses |
| `text-[15px]` | ExportChooser | 1 use |
| `text-[16px]` | CTAButton, CaptureButton, Sheet, MiniButton | 6 uses |
| `text-[18px]` | EventCard titles | 2 uses |
| `text-[21px]` | EventCard, Card | 2 uses |
| `text-[22px]` | Sheet, dialogs | 4 uses |
| `text-[26px]` | CaptureButton | 1 use |

**Issues:**
- No semantic naming (xs, sm, base, lg, xl)
- Many sizes differ by only 1-2px
- No clear hierarchy for headings vs body text

### 2.2 Recommendations

Define a typography scale in `tailwind.config.ts`:

```typescript
fontSize: {
  'xs': ['12px', { lineHeight: '16px' }],
  'sm': ['14px', { lineHeight: '20px' }],
  'base': ['16px', { lineHeight: '24px' }],
  'lg': ['18px', { lineHeight: '28px' }],
  'xl': ['21px', { lineHeight: '28px' }],
  '2xl': ['24px', { lineHeight: '32px' }],
  '3xl': ['28px', { lineHeight: '36px' }],
}
```

Replace all custom pixel sizes with these semantic names.

---

## 3. Spacing System

### 3.1 Padding Inconsistencies

**Priority: HIGH**

| Value | Components | Issue |
|-------|------------|-------|
| `p-1.5` | MiniButton, EventCard footer | Odd choice |
| `p-2` | Sheet FilterOption | |
| `p-2.5` | FilterOption items, OnboardingGetStarted | Odd choice |
| `p-3` | CTAButton | |
| `p-3.5` | IconButton, ToggleItem, CloseButton | Odd choice |
| `p-4` | PaywallSheet, EventCard2 | |
| `p-6` | Onboarding screens | |

**7 different padding values** with no clear system.

### 3.2 Gap Inconsistencies

| Value | Usage Count |
|-------|-------------|
| `gap-1` | Low |
| `gap-1.5` | Low |
| `gap-2` | Medium |
| `gap-2.5` | Low |
| `gap-3` | High |
| `gap-4` | Medium |
| `gap-5` | Medium |

### 3.3 Magic Numbers

**Examples:**
- `h-[38px]`, `h-[48px]` - EventCard
- `w-[calc(100%_+_8px)]` - EventCard
- `pr-[8px]` - EventCard
- `bottom-safe-offset-36` - CameraView
- `left-[20px]`, `top-[20px]` - CameraView

### 3.4 Recommendations

1. **Standardize on 4px base unit:**
   - Use only: `p-1` (4px), `p-2` (8px), `p-3` (12px), `p-4` (16px), `p-6` (24px), `p-8` (32px)
   - Remove half values (1.5, 2.5, 3.5)

2. **Create spacing constants** for magic numbers:
```typescript
// constants/spacing.ts
export const SPACING = {
  buttonHeight: 'h-12', // 48px
  iconButtonSize: 'h-12 w-12',
  cardPadding: 'p-4',
}
```

---

## 4. Border Radius

### 4.1 Current Usage

**Priority: MEDIUM**

7 different border radius values:

| Value | Components |
|-------|------------|
| `rounded-[4px]` | Sheet FilterOption button |
| `rounded-[5px]` | CTAButton, IconButton, ToggleItem |
| `rounded-md` | ExportChooser Entry, Feedback textarea |
| `rounded-lg` | Card, MiniButton, CaptureButton, dialogs |
| `rounded-xl` | PaywallSheet, EventCard2 |
| `rounded-2xl` | Onboarding screens, Sheet TestCard |
| `rounded-full` | CloseButton, progress indicators |

### 4.2 Key Inconsistencies

**Similar components with different radii:**
- CTAButton: `rounded-[5px]` (app/src/components/buttons/CTAButton.tsx:33)
- MiniButton: `rounded-lg` (app/src/components/buttons/MiniButton.tsx:26)
- Both are buttons but use different values!

### 4.3 Recommendations

Standardize on 4 values:
- `rounded-md` (6px) - Small buttons, inputs
- `rounded-lg` (8px) - Cards, dialogs, primary buttons
- `rounded-xl` (12px) - Large cards, sheets
- `rounded-full` - Circular elements

Remove `rounded-[4px]` and `rounded-[5px]` entirely.

---

## 5. Button Components

### 5.1 Current Implementations

**Priority: HIGH**

Five different button components with inconsistent styling:

#### CTAButton (`buttons/CTAButton.tsx`)
- Height: `h-[48px]`
- Border radius: `rounded-[5px]`
- Border: `border-[1px]`
- Padding: `p-3.5`
- Background: `bg-[#415970]` (hardcoded)
- Font: `text-[16px]`

#### MiniButton (`buttons/MiniButton.tsx`)
- Padding: `p-1.5`
- Border radius: `rounded-lg`
- Border: `border-[2px]`
- Background: Gradient `from-[#1f2e3d] to-[#2C4156]`
- Font: `text-[16px]`

#### IconButton (`buttons/IconButton.tsx`)
- Height: `h-[48px]`
- Border radius: `rounded-[5px]`
- Border: `border-[1px]`
- Background: `border-[#2e3f50] bg-[#415970]` (hardcoded)

#### CloseButton (`buttons/CloseButton.tsx`)
- Size: `h-[48px] w-[48px]`
- Inner: `h-[38px] w-[38px]`
- Border radius: `rounded-full`
- Border: `border-[1px]`

#### CaptureButton (`buttons/CaptureButton.tsx`)
- Camera: `h-[80px] w-[80px]`, `rounded-full`
- Home/Loading: `rounded-lg`, `border-[2px]`, gradient

### 5.2 Issues

1. **Height inconsistency:** 48px vs 80px
2. **Border width inconsistency:** 1px vs 2px
3. **Border radius inconsistency:** 5px vs 8px vs full
4. **Hardcoded colors** throughout
5. **Duplicate gradient definitions**

### 5.3 Recommendations

Create a unified `Button` component with variants:

```typescript
// Button.tsx
type ButtonVariant = 'primary' | 'secondary' | 'icon' | 'close' | 'mini'
type ButtonSize = 'sm' | 'md' | 'lg'

<Button variant="primary" size="md">Click me</Button>
<Button variant="icon" size="md"><IconCamera /></Button>
```

All styling rules centralized in one component.

---

## 6. Card Components

### 6.1 Current Implementations

**Priority: HIGH**

#### Card (`Card.group.tsx`)
- Border: `border-[2px] border-[#415970]` (hardcoded)
- Background: `bg-primaryDark`
- Border radius: `rounded-lg`
- Highlight: `border-highlight`

#### EventCard (`EventCard.atom.tsx:130`)
- Background: `bg-gradient-to-b from-[#2b3f54] to-[#2b3f54]/50`
- Extends Card component

#### EventCard2 (`EventCard2.atom.tsx:163`)
- Background: `bg-gradient-to-br from-[#1E2939] to-[#243145]`
- Border: `border-slate-700` (Tailwind default)

### 6.2 Issues

1. **Two event card implementations** with different gradients
2. **No clear reason** for two versions
3. **Inconsistent color usage:** EventCard2 uses slate, not theme colors
4. **Commented alternative gradient** in EventCard.atom.tsx:129

### 6.3 Recommendations

1. Unify to single EventCard component
2. Use theme colors only
3. Remove commented code
4. Add variants if needed: `<EventCard variant="default" | "compact" />`

---

## 7. Shadows

### 7.1 Current Usage

**Priority: MEDIUM**

Mix of Tailwind built-in and custom shadows:

**Tailwind Shadows:**
- `shadow-md` - IconButton, ToggleItem
- `shadow-lg` - PaywallSheet, EventCard2
- `shadow-xl` - PrivacyPage
- `shadow-2xl` - Onboarding screens, Sheet TestCard

**Custom Shadows:**
- `shadow-[0_4px_14px_rgba(0,0,0,0.7)]` - CaptureButton:20
- `shadow-[0_2px_6px_rgba(0.2,0.2,0.2,0.4)]` - MiniButton, CaptureButton
- `shadow-[0px_0px_8px_2px_rgba(0,0,0,0.33)]` - Playground

### 7.2 Recommendations

Extend Tailwind with app-specific shadows:

```typescript
boxShadow: {
  'button': '0 2px 6px rgba(0, 0, 0, 0.4)',
  'card': '0 4px 14px rgba(0, 0, 0, 0.7)',
  'elevated': '0 8px 24px rgba(0, 0, 0, 0.5)',
}
```

Use semantic names and standardize across all components.

---

## 8. Icon Sizing

### 8.1 Current Sizes

**Priority: MEDIUM**

8 different icon sizes with no clear scale:

| Size (px) | Usage | File Reference |
|-----------|-------|----------------|
| 10 | IconTriangleRight | EventCard |
| 14 | IconClose | CloseButton |
| 18 | IconClose | Sheet |
| 24 | IconCamera3, ClipLoader | CaptureButton |
| 30 | IconBulb | SplashView |
| 32 | IconCheck | MultiResultDialog |
| 34 | IconDownload, IconBurger | Various |
| 40 | IconCamera3 | CameraInstructionDialog |

### 8.2 Recommendations

Standardize on 5 sizes:
- **16px** - Small inline icons
- **20px** - Regular inline icons
- **24px** - Standard UI icons
- **32px** - Large feature icons
- **48px** - Hero icons

Create icon size constants:

```typescript
// constants/icons.ts
export const ICON_SIZES = {
  xs: 16,
  sm: 20,
  md: 24,
  lg: 32,
  xl: 48,
}
```

---

## 9. Dialog & Sheet Components

### 9.1 Backdrop Inconsistencies

**Priority: MEDIUM**

| Component | Backdrop | Blur |
|-----------|----------|------|
| Dialog | `from-black/50 to-black/20` (gradient) | No |
| Sheet | `rgba(0, 0, 0, 0.7)` (solid) | No |
| PaywallSheet | `rgba(0, 0, 0, 0.7)` (solid) | Yes (4px) |

### 9.2 Recommendations

1. Standardize backdrop to `rgba(0, 0, 0, 0.7)` with optional blur
2. Add backdrop blur to all modal overlays for consistency
3. Update Dialog component to match Sheet implementation

---

## 10. Onboarding Screens

### 10.1 General Consistency

**Status: GOOD** - Most onboarding screens follow consistent patterns:
- Outer container: `rounded-2xl border-2 border-accentElevated bg-primaryDark p-6 shadow-2xl`
- Responsive: `p-6 sm:p-8`
- Icon backgrounds: Consistent gradient and ring pattern

### 10.2 Issues Found

**OnboardingHowItWorks:21** - Typo/Bug:
```tsx
bg-primary/00  // Double zero - should be /0 or /10?
```

**Recommendation:** Fix typo, likely should be `bg-primary/0` or `bg-primary/10`

---

## 11. Code Quality Issues

### 11.1 Commented Code

**Priority: LOW**

Multiple instances of commented-out styles that should be removed:

| File | Line | Issue |
|------|------|-------|
| `EventCard.atom.tsx` | 129 | Alternative gradient commented out |
| `ImagePreview.tsx` | 16-22 | Border styling commented out |
| `CaptureButton.tsx` | 18-19 | Alternative gradient commented out |
| `index.css` | 70 | Background commented out |

### 11.2 Unused Components

**Sheet.tsx:271-321** - Complete `TestCard` component that's never used in the app.

**Recommendation:** Remove or move to a separate storybook/examples file.

---

## 12. Responsive Design

### 12.1 Current State

**Priority: LOW**

Some components use Tailwind's `sm:` breakpoint:
- OnboardingValueProp: `sm:p-8`, `sm:h-20`
- OnboardingHowItWorks: `sm:gap-5`, `sm:text-3xl`
- OnboardingGetStarted: `sm:p-8`, `sm:h-6`

### 12.2 Issues

1. Not all components have responsive variants
2. No clear breakpoint strategy
3. Inconsistent application across similar components

### 12.3 Recommendations

1. Define breakpoint strategy (mobile-first)
2. Document which components need responsive variants
3. Apply consistently across all major UI components

---

## Implementation Roadmap

### Phase 1: Design System Foundation (Priority: CRITICAL)
**Estimated effort: 2-4 hours**

1. Extend `tailwind.config.ts` with:
   - Typography scale (replace 11 sizes with 7 semantic sizes)
   - Named gradients for backgrounds
   - Shadow definitions
   - Icon size constants

2. Create `constants/` directory with:
   - `colors.ts` - Export theme color mappings
   - `spacing.ts` - Export spacing constants
   - `icons.ts` - Export icon size constants

3. Update theme to remove `clickHighLight` duplicate

### Phase 2: Component Unification (Priority: HIGH)
**Estimated effort: 4-6 hours**

1. **Button components:**
   - Create unified `Button.tsx` with variants
   - Migrate all button usage
   - Delete separate button files

2. **Card components:**
   - Unify EventCard and EventCard2
   - Use named gradients from config
   - Remove hardcoded colors

3. **Replace all hardcoded colors** (30+ instances)
   - Use find/replace with theme references
   - Test each component after change

### Phase 3: Standardization (Priority: MEDIUM)
**Estimated effort: 3-4 hours**

1. Replace custom font sizes with typography scale
2. Standardize border radius across all components
3. Update shadows to use defined scale
4. Standardize icon sizes
5. Fix backdrop inconsistencies in dialogs/sheets

### Phase 4: Polish & Cleanup (Priority: LOW)
**Estimated effort: 1-2 hours**

1. Remove all commented code
2. Delete unused TestCard component
3. Fix OnboardingHowItWorks typo (`bg-primary/00`)
4. Add consistent responsive patterns
5. Replace magic numbers with named constants

---

## Total Estimated Effort

**10-16 hours** for complete implementation across all phases.

Recommend tackling Phase 1 and Phase 2 first for maximum impact (6-10 hours), as these address the critical visual inconsistency issues.

---

## Testing Checklist

After implementation, verify:

- [ ] No hardcoded hex colors remain in components
- [ ] All font sizes use semantic names (text-xs, text-sm, etc.)
- [ ] Button components have consistent sizing and styling
- [ ] Card backgrounds use named gradients
- [ ] Shadows use defined scale
- [ ] Icons use standardized sizes
- [ ] Spacing follows 4px base unit system
- [ ] Border radius standardized to 4 values
- [ ] All commented code removed
- [ ] No unused components
- [ ] Responsive patterns consistent

---

## References

All file paths and line numbers are accurate as of 2025-11-12 based on codebase exploration.

Key files to modify:
- `app/tailwind.config.ts` - Add design system extensions
- `app/src/components/buttons/` - Unify button components
- `app/src/components/Card.group.tsx` - Update card styling
- `app/src/components/EventCard.atom.tsx` - Replace hardcoded colors
- All component files with hardcoded colors (see Section 1.2)

---

**Document Status:** Ready for implementation review
**Next Step:** Review with team and prioritize phases for implementation
