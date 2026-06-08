---
name: Timovi
colors:
  surface: '#121414'
  surface-dim: '#121414'
  surface-bright: '#383939'
  surface-container-lowest: '#0d0e0f'
  surface-container-low: '#1b1c1c'
  surface-container: '#1f2020'
  surface-container-high: '#292a2a'
  surface-container-highest: '#343535'
  on-surface: '#e3e2e2'
  on-surface-variant: '#b9ccb2'
  inverse-surface: '#e3e2e2'
  inverse-on-surface: '#303031'
  outline: '#84967e'
  outline-variant: '#3b4b37'
  surface-tint: '#00e639'
  primary: '#ebffe2'
  on-primary: '#003907'
  primary-container: '#00ff41'
  on-primary-container: '#007117'
  inverse-primary: '#006e16'
  secondary: '#c8c6c7'
  on-secondary: '#303031'
  secondary-container: '#49494a'
  on-secondary-container: '#bab8b9'
  tertiary: '#fbf8fb'
  on-tertiary: '#303032'
  tertiary-container: '#dedcde'
  on-tertiary-container: '#616063'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#72ff70'
  primary-fixed-dim: '#00e639'
  on-primary-fixed: '#002203'
  on-primary-fixed-variant: '#00530e'
  secondary-fixed: '#e5e2e3'
  secondary-fixed-dim: '#c8c6c7'
  on-secondary-fixed: '#1b1b1c'
  on-secondary-fixed-variant: '#474647'
  tertiary-fixed: '#e4e2e4'
  tertiary-fixed-dim: '#c8c6c8'
  on-tertiary-fixed: '#1b1b1d'
  on-tertiary-fixed-variant: '#474649'
  background: '#121414'
  on-background: '#e3e2e2'
  surface-variant: '#343535'
typography:
  display-lg:
    fontFamily: Geist
    fontSize: 48px
    fontWeight: '600'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.2'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: '0'
  code-sm:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '450'
    lineHeight: '1.5'
  label-caps:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '500'
    lineHeight: '1'
    letterSpacing: 0.05em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 4px
  xs: 8px
  sm: 16px
  md: 24px
  lg: 40px
  xl: 64px
  gutter: 16px
  margin-mobile: 16px
  margin-desktop: 32px
---

## Brand & Style
The design system embodies "The Minimal Creator" aesthetic—a high-performance, opinionated framework designed for solo founders who value speed over decoration. The brand personality is technical, direct, and authoritative, functioning like a sophisticated command-line interface wrapped in a premium SaaS shell.

The visual style is a hybrid of **Minimalism** and **Modern Technical** aesthetics. It prioritizes information density and clarity, using whitespace not just for breathing room, but as a functional separator. The emotional response should be one of "quiet power"—the feeling of a tool that stays out of the way until it is needed, then executes with absolute precision.

## Colors
The palette is rooted in a "Terminal Dark" philosophy. The background is a deep, near-black charcoal to minimize eye strain during long sessions.

- **Primary (Electric Green):** Reserved exclusively for high-intent actions, success states, and active cursors. It represents the "AI pulse."
- **Secondary/Surface:** Deep grays used to define containers and workspace regions.
- **Accents:** A monochromatic scale of grays provides hierarchy. 
- **Borders:** Subtle, low-contrast borders replace shadows to define structure, maintaining a flat, high-performance feel.

## Typography
Typography is the primary driver of the interface. We use **Geist** for headings to convey a sharp, modern technical edge. **Inter** handles body copy for maximum legibility across all screen types. **JetBrains Mono** is used for "meta-information," such as status labels, timestamps, and actual code snippets, reinforcing the developer-centric nature of the product.

Hierarchy is established through weight and color rather than excessive size jumps. Body text should maintain high contrast against the dark background, while labels should be slightly dimmed to create a clear visual map.

## Layout & Spacing
The system uses a **fixed-fluid hybrid grid**. Content is contained within a max-width of 1280px for readability, but the functional "sidebar" and "utility" panels utilize fluid width to adapt to the browser.

- **Grid:** 12-column system for desktop, 4-column for mobile.
- **Rhythm:** A 4px baseline grid ensures tight, mathematical alignment.
- **Density:** High. Components are packed closer together than in traditional consumer apps to reflect a professional workstation.

## Elevation & Depth
This design system avoids traditional drop shadows. Depth is communicated through **Tonal Layering** and **Subtle Outlines**:

- **Level 0 (Background):** Pure charcoal (#0A0A0A).
- **Level 1 (Cards/Panels):** Slightly lighter surface (#121212) with a 1px border (#262626).
- **Level 2 (Popovers/Modals):** Lighter gray (#1A1A1B) with a more pronounced border (#333333).
- **Active State:** Elements may gain a primary color "glow" (0px 0px 8px) or a high-contrast white border to signify focus.

## Shapes
The shape language is "Soft-Technical." We use a conservative 4px (0.25rem) radius for standard UI elements. This provides a hint of modernity without sacrificing the precision of a sharp-edged grid. Larger containers like cards use 8px (0.5rem), while internal elements like input fields and tags remain at 4px.

## Components

### Buttons
- **Primary:** Solid Electric Green background with black text. No shadow, square-ish.
- **Secondary:** Transparent with a 1px gray border. Text is white.
- **Ghost:** Text only, turns primary color on hover.

### Inputs & Fields
Inputs are dark-filled containers with a bottom-border emphasis. When focused, the border changes to the primary green and a thin "caret" cursor blinks in the same color. Labeling uses **JetBrains Mono** in uppercase above the field.

### Chips & Tags
Used for status (e.g., "In Progress", "Deployed"). These are styled like terminal tags: monochrome backgrounds with monospaced text.

### Cards
Cards are flat containers. They do not use shadows. They use a 1px border. On hover, the border color brightens slightly, and the "Primary" accent color may appear as a 2px top-stripe.

### Terminal Output
A specific component for AI logs. It uses a pure black background, no padding on the sides, and JetBrains Mono text. Key terms are syntax-highlighted in the primary color.