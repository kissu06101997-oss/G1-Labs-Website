# Design Decisions — G1 Scientific Observatory

## 1. UI/UX Pro Max Skill Invocation & Audit Record
- **Skill Path:** `.agents/skills/ui-ux-pro-max/scripts/search.py`
- **Queries Executed:**
  1. `python .agents/skills/ui-ux-pro-max/scripts/search.py "virtual science laboratory education catalogue simulation teacher dashboard andhra pradesh bilingual" --design-system --persist -p "G1 Virtua Labs" --tokens css`
  2. `python .agents/skills/ui-ux-pro-max/scripts/search.py "accessibility contrast focus responsive table filter tabs empty state" --domain ux`
  3. `python .agents/skills/ui-ux-pro-max/scripts/search.py "layout responsive header form cards" --stack nextjs`
- **Persisted Output:** `design-system/g1-virtua-labs/MASTER.md`, `design-system/g1-virtua-labs/tokens.json`, `design-system/g1-virtua-labs/tokens.css`.

### Recommendations Accepted from UI/UX Pro Max
1. **WCAG 2.2 Focus Appearance & Compact Control Semantics:** Applied `3px solid #0663ab` focus ring (`outline-offset: 3px`) and native `<button aria-pressed>` / `<Link aria-current="page">` semantics for the 7-stage class rail and catalogue filters (never clickable `<div>` tags).
2. **Responsive Table Overflow Wrappers:** Wrapped all teacher, admin, and editorial tables in `overflow-x-auto` containers with visible borders.
3. **Minimalism & Swiss Grid Hierarchy:** Clear card boundaries, tabular numerals (`font-mono`), no emojis as functional UI icons (Lucide SVG icons used throughout), and `prefers-reduced-motion` support.

### Raw Automated Suggestions Overruled (Per Brand & Accessibility Rules)
1. **Overruled Raw Fonts (`Exo` + `Roboto Mono`):** Replaced with `Inter` + `Noto Sans Telugu` loaded in `src/app/layout.tsx` to guarantee academic legibility and prevent Telugu ottulu/matra clipping (`html[lang^="te"]` uses `line-height: 1.65` and `letter-spacing: 0`).
2. **Overruled Raw Palette (`#2563EB` primary / `#059669` accent with black text):** Replaced with the approved **G1 Scientific Observatory** bright palette from `04_DESIGN_SYSTEM_REMEDIATION_SPEC.md`:
   - Canvas `#F4FAFE`, Card `#FFFFFF`, Ice Section `#E6F2FA`, Deep Ice `#D8EAF4`
   - Navy Ink `#0C2444` (>13:1 on white), Slate Secondary `#38546C` (>7.2:1 on white)
   - Brand Teal `#007875` → `#00635F` (≥5.3:1 with white text across entire gradient)
   - **Simulation Mode = Blue** `#0663AB` → `#064F8B` (≥6.2:1 with white text)
   - **Experiment Mode = Green** `#046C49` → `#06563C` (≥6.5:1 with white text)
   - Functional control border `#7894AA` (≥3:1 non-text contrast against `#FFFFFF`/`#F8FCFF`)

---

## 2. Canonical Brand Mark & Asset Provenance
- **Canonical Logo:** `public/brand/g1-canonical-logo.png` (`278×50`, SHA-256 `94b8b12e4a13317df3e00b1a6e8604aec9fdb4074cf355b55658dc9739c77a65`). Rendered exclusively via `src/components/BrandLogo.tsx` with preserved `278/50` aspect ratio and responsive width (`144px` mobile, `174px` tablet, `222px` desktop) to eliminate 768px and 360px overflow.
- **Laboratory Concept Artwork (`public/assets/labs/`):**
  - `hero_laboratory.png`, `chemistry.png`, `physics.png`, `biology.png`, `zinc.png`, `refraction.png`, `onion.png` sourced directly from the owner-supplied `03_PREMIUM_VISUAL_GUIDANCE/assets/` package.
  - Every card and hero image carries an explicit media qualifier caption (`Concept illustration`, `Optics concept render`, `Illustrative specimen study`, `Review-pending preview`) so concept artwork is never mistaken for calibrated laboratory measurements.
  - Existing neutral vector apparatus diagrams (`activity23_concept.svg`, `physics_slab.svg`, `onion_microscopy.svg`) are preserved inside `/experiments/[experimentId]` and `/player/[sessionId]` for clear scientific diagramming.

---

## 3. Accessibility & Responsive Design Resolutions
- **768px Tablet Clipping Fix (`W07`):** Removed fixed inline `width: 222px` on `BrandLogo`, tuned `md:` navigation gaps and padding in `AppHeader.tsx`, and switched homepage 3-card strips to `lg:grid-cols-3` so `Sign in` fits cleanly within `768px` (`box.x + box.width <= 768`) with zero text truncation.
- **WCAG 2.1 SC 2.5.3 (Label in Name):** Updated `LocaleToggle.tsx` `aria-label` to include its visible label text (`"English / తెలుగు — Switch language to Telugu"`).
- **Color Contrast Fix:** Verified all Simulation/Experiment mode indicators and stage save badges pass Axe WCAG 2.2 AA (`>= 4.5:1` normal text, `>= 3:1` UI components) with 0 serious or critical violations.
