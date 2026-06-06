# Design canvas scaling philosophy

This document describes a layout and scaling approach for building a fixed-size product UI (for example a 2560×1440 design) that scales cleanly to any viewport without zooming the page or applying `transform: scale()` to the whole app.

---

## Core idea

Treat the app as a **single design surface** with known width and height at “design scale.” Express almost all layout in **rem**, where **1rem equals a fixed number of design pixels** (commonly **16px**). When the window is smaller or larger than that surface, **change the root font size** so every rem-based size grows or shrinks together. The artboard keeps the same rem dimensions; only the pixel size of one rem changes.

```
At scale 1:     1rem = 16px   →  artboard 160rem wide = 2560px
At scale 0.5:   1rem = 8px    →  artboard still 160rem wide = 1280px on screen
```

The design is **letterboxed** (contain fit): the full canvas fits inside the viewport; aspect ratio is preserved; you may get empty margin around the canvas.

---

## The three layers

### 1. Design tokens (math, not CSS yet)

Pick:

- **Design width and height** in pixels (e.g. 2560 × 1440).
- **Root pixel size** (e.g. 16px per rem).

Derive:

- **Canvas width in rem** = design width ÷ root pixel size (2560 ÷ 16 = **160rem**).
- **Canvas height in rem** = design height ÷ root pixel size (1440 ÷ 16 = **90rem**).

Keep these numbers in one place so JS and CSS stay aligned.

### 2. Fixed artboard (structure)

- Outer shell: centers the canvas in the viewport (flex or grid).
- **Artboard element**: `width` and `height` set to the canvas rem values (e.g. `160rem` × `90rem`).
- Everything for the product UI lives **inside** this box.

The artboard does **not** use `transform: scale()`. Scaling is entirely via rem.

### 3. Runtime scale (one knob)

On load and on resize:

1. Read viewport size (typically `window.innerWidth` / `innerHeight`).
2. Compute **scale** = min(viewportWidth / designWidth, viewportHeight / designHeight) — “contain” fit.
3. Set **`document.documentElement.style.fontSize`** = rootPixelSize × scale (e.g. `16 * scale` + `px`).

All rem values in the tree now map to scaled pixels. The artboard still measures 160rem × 90rem in CSS, but those rem units are physically smaller or larger on screen.

Optional: set `body` width/height to the viewport so scroll and background behave predictably; keep the artboard centered inside.

---

## How to author CSS

### Prefer rem for product layout

Use rem for:

- Widths, heights, padding, margin, gap
- Border radius (when you want it to scale)
- Font sizes
- Icon boxes (e.g. `1.375rem` for a 22px icon at design scale)

Comment in rem with the design-pixel equivalent when helpful: `/* 22px @ 16px root */`.

### Design-time mental model

When the designer says “32px,” you write **`2rem`** (32 ÷ 16). The app is designed in pixel space; implementation is rem space tied to the chosen root.

### Hairlines and 1px borders

A true 1px line can be `0.0625rem` (1 ÷ 16) so it scales with the UI. Some teams keep certain borders or focus rings in **px** on purpose so they stay visually constant; that is a deliberate exception.

### What not to do on the artboard

- Avoid scaling the whole artboard with CSS `transform: scale()` — it blurs text, breaks hit targets inconsistently, and fights with nested transforms.
- Avoid putting **`rem` in SVG `width` / `height` attributes** — browsers often treat those as user units, not CSS rem, which produces tiny icons. Size SVGs with CSS on the element, or use `<img>` / background-image for icons.

---

## JavaScript responsibilities (minimal)

The scaling layer should only:

1. Define design dimensions and root pixel size.
2. Compute contain scale from viewport vs design size.
3. Apply root `font-size` (and optionally viewport-sized body).
4. Re-run on resize (debounce if needed).

Routing, data, and components stay separate; they inherit scale automatically.

---

## Viewport and embedding

- Use a **stable viewport** for scale math (e.g. `innerWidth` / `innerHeight`) unless you have a reason to use visual viewport APIs.
- If the app runs in an **iframe**, the iframe’s size is the viewport; same formulas apply.
- **Fallback**: set `html { font-size: 16px; }` in CSS so the layout is reasonable before JS runs.

---

## Exceptions (use sparingly)

| Use px (or fixed values) when | Why |
|------------------------------|-----|
| Focus outlines, some borders | Stay visible at all scales |
| Sub-pixel graph/grid patterns | Keep dots/lines readable after scale |
| Legacy tokens (`border-radius: 10px`) | Migrate to rem over time if you want full consistency |
| Media inside SVG viewBox | Geometry is in user units, not rem |

Document exceptions so the next contributor knows they are intentional.

---

## Checklist for a new project

1. Choose design size (W × H) and root size (e.g. 16px/rem).
2. Define canvas as W/rem × H/rem on the artboard element.
3. Implement contain scale → root `font-size` on load + resize.
4. Build UI inside the artboard using rem (and `% / flex / grid within the artboard).
5. Size icons via CSS or `<img>`, not rem in SVG attributes.
6. Keep one source of truth for design W, H, and root px (shared by CSS variables and JS).

---

## Why this works well

- **One scale factor** drives the whole UI; no per-component zoom logic.
- **Design fidelity**: proportions match the comp at any size that fits the screen.
- **Predictable**: designers and developers share “16px = 1rem at 100% scale.”
- **Simple debugging**: inspect root `font-size` and multiply rem × effective root px to verify sizes.

---

## Summary

**Fixed rem canvas + dynamic root font-size + contain fit** is the philosophy: the product is always laid out in design rem space; the browser viewport only decides how large one rem is in pixels. Build new screens entirely in rem inside the artboard, scale the root, and avoid transform-based page scaling.
