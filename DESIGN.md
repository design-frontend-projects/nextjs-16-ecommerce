# Vercel Design System

Frontend deployment. Black and white precision, Geist font.

## Visual Theme & Atmosphere

Vercel takes frontend deployment as its base, then sharpens it through black and white precision, Geist font. It is a strong fit for developer platforms, monochrome precision designs, and infrastructure marketing.

- **Mood**: Clean, precise, technical, trustworthy
- **Density**: Low to medium - whitespace is a feature
- **Design Philosophy**: Minimalism through subtraction, precision through typography

## Color Palette & Roles

| Role | Light | Dark | Usage |
|------|-------|------|-------|
| `--background` | `#ffffff` (oklch(100% 0 0)) | `#0a0a0a` (oklch(15% 0.05 260)) | Page background |
| `--foreground` | `#171717` (oklch(25% 0.15 260)) | `#f8f8f8` (oklch(90% 0.02 260)) | Primary text |
| `--primary` | `#000000` (oklch(65% 0.2 270)) | `#ffffff` (oklch(92% 0 0)) | Primary actions, brand |
| `--primary-foreground` | `#ffffff` | `#0a0a0a` | Text on primary |
| `--secondary` | `#f5f5f5` (oklch(80% 0.1 190)) | `#1a1a1a` (oklch(40% 0.06 260)) | Secondary surfaces |
| `--secondary-foreground` | `#171717` | `#f8f8f8` | Text on secondary |
| `--muted` | `#f0f0f0` (oklch(90% 0.02 260)) | `#141414` (oklch(30% 0.04 260)) | Muted backgrounds |
| `--muted-foreground` | `#737373` (oklch(60% 0.05 260)) | `#b3b3b3` (oklch(65% 0.05 260)) | Secondary text |
| `--border` | `#e4e4e4` (oklch(88% 0.03 260)) | `#262626` (oklch(30% 0.04 260)) | Borders, dividers |
| `--input` | `#e4e4e4` | `#262626` | Form inputs |
| `--ring` | `#a3a3a3` (oklch(65% 0.2 270)) | `#737373` | Focus rings |

## Typography Rules

**Primary Font**: Geist (system variable, fallback to Inter, then system-ui)

| Level | Font Size | Weight | Line Height | Usage |
|-------|-----------|--------|-------------|-------|
| H1 | 48-60px | 800 | 1.1 | Page titles, hero headings |
| H2 | 32-40px | 700 | 1.2 | Section titles |
| H3 | 24px | 600 | 1.3 | Subsection titles |
| H4 | 20px | 600 | 1.4 | Card titles, labels |
| Body | 16-18px | 400 | 1.5 | Paragraph text |
| Small | 14px | 400 | 1.5 | Captions, meta |
| Micro | 12px | 400 | 1.5 | Labels, hints |

**Geist Font Stack**:
```css
--font-geist: 'Geist', 'Inter', ui-sans-serif, system-ui, sans-serif;
font-family: var(--font-geist);
```

## Component Stylings

### Buttons

```css
/* Primary Button */
.btn-primary {
  background-color: var(--primary);
  color: var(--primary-foreground);
  border: 1px solid transparent;
  padding: 0.75rem 1.5rem;
  font-weight: 500;
  border-radius: 0.5rem;
  transition: background-color 150ms ease;
}
.btn-primary:hover {
  opacity: 0.9;
}

/* Outline Button */
.btn-outline {
  background-color: transparent;
  color: var(--foreground);
  border: 1px solid var(--border);
  padding: 0.75rem 1.5rem;
  font-weight: 500;
  border-radius: 0.5rem;
  transition: all 150ms ease;
}
.btn-outline:hover {
  background-color: var(--muted);
}
```

### Cards

```css
.card {
  background-color: var(--background);
  border: 1px solid var(--border);
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}
```

### Inputs

```css
.input {
  background-color: var(--background);
  border: 1px solid var(--border);
  color: var(--foreground);
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: border-color 150ms ease, box-shadow 150ms ease;
}
.input:focus {
  outline: none;
  border-color: var(--ring);
  box-shadow: 0 0 0 2px var(--ring);
}
```

### Navigation

```css
.nav-link {
  color: var(--foreground);
  font-weight: 400;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  transition: background-color 150ms ease, color 150ms ease;
}
.nav-link:hover {
  background-color: var(--muted);
}
.nav-link.active {
  background-color: var(--primary);
  color: var(--primary-foreground);
}
```

## Layout Principles

- **Container Width**: 1200px max-width (lg), 1400px (2xl)
- **Padding**: 2rem (default), 1rem (tight), 4rem (loose)
- **Grid**: 12-column with 24px gutters on desktop, 16px on mobile
- **Whitespace**: Generous whitespace between sections (4-8rem)
- **Content Max Width**: 65ch characters per line for readability

## Depth & Elevation

| Level | Shadow | Usage |
|-------|--------|-------|
| 0 | none | Base surfaces |
| 1 | 0 1px 3px rgba(0,0,0,0.05) | Cards, inputs |
| 2 | 0 4px 6px rgba(0,0,0,0.07) | Floating elements |
| 3 | 0 8px 12px rgba(0,0,0,0.1) | Modals, dropdowns |

## Do's and Don'ts

**Do**:
- Use generous whitespace to create visual hierarchy
- Let typography carry the visual weight
- Use monochrome with single accent color for CTAs
- Align elements to a consistent grid
- Use subtle hover states (opacity changes, not color shifts)
- Keep navigation minimal and obvious

**Don't**:
- Use gradients or colorful backgrounds
- Add decorative elements that don't serve a purpose
- Use more than 2-3 font sizes in a single view
- Add shadows just for decoration
- Use rounded corners on everything (be selective)
- Add animations for animation's sake

## Responsive Behavior

| Breakpoint | Width | Usage |
|------------|-------|-------|
| xs | < 20rem | Mobile single column |
| sm | 20-32rem | Mobile landscape, small tablets |
| md | 32-48rem | Tablets, small laptops |
| lg | 48-64rem | Desktops, small monitors |
| xl | 64-80rem | Large monitors |
| 2xl | 80rem+ | Extra large displays |

**Mobile Strategy**:
- Stack elements vertically
- Reduce padding by 50%
- Hide non-essential decorative elements
- Touch targets: 44px minimum

## Agent Prompt Guide

When building UI in this style:

1. Use `var(--background)`, `var(--foreground)`, `var(--primary)` for colors
2. Apply Geist font family
3. Use high contrast (black/white/gray scale)
4. Let whitespace create breathing room
5. Typography should be the primary visual element
6. Keep interactions subtle (opacity, subtle elevation)
7. Use monospace for code elements

**Quick Color Reference**:
```
Background: #ffffff (light) / #0a0a0a (dark)
Text: #171717 (light) / #f8f8f8 (dark)
Primary: #000000 (light) / #ffffff (dark)
Border: #e4e4e4 (light) / #262626 (dark)
```