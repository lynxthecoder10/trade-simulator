# Design System Documentation

This document defines the design tokens and systems for the Trade Simulator, emphasizing an "institutional fintech aesthetic".

## Typography

- **Numeric Font:** Must use `tabular-nums` for price alignment.
- **Font Stack:** Inter (or similar clean sans-serif) for general text.

```css
/* Core typography rule for numbers */
.tabular-nums {
  font-variant-numeric: tabular-nums;
}
```

## Color System (Semantic)

- **Background:** Deep rich dark mode (not pure black). E.g., `#0A0A0A` or `#0F172A`.
- **Surface/Card:** Slightly elevated dark color. E.g., `#171717` or `#1E293B`.
- **Text Primary:** `#F8FAFC`
- **Text Secondary:** `#94A3B8`
- **Profit (Bullish):** `#10B981` (Emerald 500)
- **Loss (Bearish):** `#EF4444` (Red 500)
- **Neutral:** `#64748B` (Slate 500)
- **Warning:** `#F59E0B` (Amber 500)
- **AI Insight/Brand:** `#6366F1` (Indigo 500) or `#8B5CF6` (Violet 500)

## Spacing & Density

High information density is required for trading applications.
- Use tight padding for tables and lists.
- Distinct visual boundaries between sections (using subtle borders).

## Animation

- Fast transitions (`duration-150`, `ease-in-out`). Do not use slow, bouncy animations.
