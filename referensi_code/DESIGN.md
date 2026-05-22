---
name: Technical Precision System
colors:
  surface: '#faf9fe'
  surface-dim: '#dad9de'
  surface-bright: '#faf9fe'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f4f3f8'
  surface-container: '#eeedf2'
  surface-container-high: '#e8e7ec'
  surface-container-highest: '#e3e2e7'
  on-surface: '#1a1b1f'
  on-surface-variant: '#43474f'
  inverse-surface: '#2f3034'
  inverse-on-surface: '#f1f0f5'
  outline: '#747780'
  outline-variant: '#c4c6d0'
  surface-tint: '#405e92'
  primary: '#002653'
  on-primary: '#ffffff'
  primary-container: '#1a3c6e'
  on-primary-container: '#8aa8e0'
  inverse-primary: '#abc7ff'
  secondary: '#855300'
  on-secondary: '#ffffff'
  secondary-container: '#fea619'
  on-secondary-container: '#684000'
  tertiary: '#3e1f00'
  on-tertiary: '#ffffff'
  tertiary-container: '#5e3100'
  on-tertiary-container: '#db9960'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d7e3ff'
  primary-fixed-dim: '#abc7ff'
  on-primary-fixed: '#001b3f'
  on-primary-fixed-variant: '#264679'
  secondary-fixed: '#ffddb8'
  secondary-fixed-dim: '#ffb95f'
  on-secondary-fixed: '#2a1700'
  on-secondary-fixed-variant: '#653e00'
  tertiary-fixed: '#ffdcc2'
  tertiary-fixed-dim: '#feb87c'
  on-tertiary-fixed: '#2e1500'
  on-tertiary-fixed-variant: '#6b3b09'
  background: '#faf9fe'
  on-background: '#1a1b1f'
  surface-variant: '#e3e2e7'
  status-success: '#16A34A'
  status-danger: '#DC2626'
  status-warning: '#D97706'
  neutral-dark: '#1E293B'
  neutral-mid: '#64748B'
  neutral-light: '#F1F5F9'
  page-bg: '#F8FAFC'
typography:
  display-lg:
    fontFamily: Poppins
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Poppins
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  headline-sm:
    fontFamily: Poppins
    fontSize: 20px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.05em
  technical-data:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  headline-lg-mobile:
    fontFamily: Poppins
    fontSize: 26px
    fontWeight: '700'
    lineHeight: '1.2'
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  gutter: 16px
  margin-mobile: 16px
  margin-desktop: 32px
  touch-target-min: 44px
---

## Brand & Style

The design system is engineered for the high-stakes environment of integrated fleet inspections. The brand personality is **authoritative, technical, and dependable**, designed to instill confidence in regulatory oversight while maintaining the efficiency of a developer tool. 

The aesthetic is heavily influenced by **Vercel-inspired Minimalism and Corporate Modernism**. It prioritizes extreme legibility, high-contrast states, and a "clean-room" interface that minimizes cognitive load during complex multi-step workflows. The interface uses a refined color palette and strict structural geometry to convey a sense of "Information as a Service," ensuring that inspectors can make critical safety decisions with absolute clarity.

## Colors

The color strategy uses a **Functional Hierarchy** model. The primary Deep Blue anchors the application in authority and stability, while the Secondary Amber is reserved exclusively for high-priority interactive elements and global call-to-actions.

A semantic status system is strictly enforced:
- **Success (#16A34A):** Utilized for "Laik Jalan" (Fit for Service) indicators and valid document states.
- **Danger (#DC2626):** Reserved for "Tidak Laik" (Unfit) status and critical technical failures.
- **Warning (#D97706):** Indicates near-expiry items or non-critical alerts requiring attention.

Backgrounds utilize a subtle cool-gray scale (`#F8FAFC`) to allow white cards and primary text to pop with maximum contrast.

## Typography

This design system employs a three-tier type system:
1.  **Poppins (Headings):** Used for structural markers and page titles to provide a professional, geometric foundation.
2.  **Inter (Body):** The workhorse for all forms, descriptions, and data entry. It is chosen for its exceptional readability at small sizes on mobile screens.
3.  **JetBrains Mono (Technical):** Dedicated to technical identifiers such as License Plates, VIN numbers, and Ramp Check IDs. This ensures alphanumeric characters (like '0' and 'O') are never confused.

**Mobile Scaling:** Large display titles scale down by 20% on mobile devices to preserve screen real estate for inspection items.

## Layout & Spacing

The layout utilizes a **tight, consistent 4px grid system** to maintain a "scientific" and organized feel. 

- **Mobile (Primary):** A single-column fluid layout optimized for thumb-driven interaction. Tap targets are strictly enforced at a minimum of 44px height.
- **Desktop/Tablet:** A 12-column grid system with 24px gutters. Inspection forms utilize a centered container (max-width 800px) to prevent eye strain during data entry.
- **Vertical Rhythm:** Spacing between related form elements is 12px (3 units), while spacing between sections is 32px (8 units) to create clear visual separation without excessive scrolling.

## Elevation & Depth

To maintain a clean, Vercel-like aesthetic, the design system avoids heavy shadows. Instead, it uses **Tonal Layering** and **Ghost Borders**:

1.  **Surface Tiers:** The main canvas is `#F8FAFC`. Content lives on white (`#FFFFFF`) cards.
2.  **Borders:** Cards and input fields use a subtle 1px border (`#F1F5F9`). In an "active" or "focused" state, this border transitions to the Primary Navy.
3.  **Shadows:** When necessary (e.g., Modals or Bottom Navigation), a single "Soft-Elevated" shadow is used: `0px 4px 12px rgba(30, 41, 59, 0.05)`.
4.  **Status Depth:** Semantic states (Success/Danger) do not use elevation; they use full-bleed color floods or high-contrast side-borders to communicate urgency flatly and clearly.

## Shapes

The shape language is **Sharp and Disciplined**. A consistent radius of 6px is applied to all primary components (buttons, input fields, cards) to maintain a modern but professional appearance. 

- **Base Radius (6px):** Standard for buttons and inputs.
- **Large Radius (12px):** Used for dashboard cards and mobile containers to provide a slightly softer, "smooth" feel.
- **Interactive States:** Buttons should not change shape on hover or tap, but rather utilize subtle opacity shifts or color darkening to indicate interaction.

## Components

### Buttons & Inputs
- **Primary Action:** Solid Primary Navy with white text. 6px radius.
- **Secondary CTA:** Solid Amber with `#1E293B` text for high-visibility warnings or final submissions.
- **Inputs:** 1px border (`#F1F5F9`), background `#FFFFFF`. Focus state features a 2px Primary Navy ring.

### Inspection Toggles
- **Binary Selection:** Large, block-style toggles. "OK" turns solid Success Green; "Issue" turns solid Danger Red. These are designed as large touch targets (min 60px height) for field use.

### Cards
- **Inspection Item:** White background, 1px border. When a "Problem" is flagged, the card expands to reveal a "Technical Data" section (JetBrains Mono) and a photo upload slot.

### Status Badges
- **Laik/Tidak Laik:** Rectangular badges with 4px radius, uppercase Inter Bold text. Use solid semantic fills for immediate recognition at a distance.

### Navigation
- **Mobile:** Fixed bottom navigation with SVG icons and 12px labels. Active state indicated by a Primary Navy icon and a subtle 2px top-border on the tab.