# UX Control Inventory — G1 Virtua Labs (Upgraded Phase 2)

Every visible button, tab, link, input, and disclosure control in the upgraded application executes a real route, state change, or server API action. Zero decorative/fake controls exist.

| Route | Control / Component | Action & Backing Handler |
|---|---|---|
| Global Header (`AppHeader`) | Canonical G1 Logo (`BrandLogo`) | Navigates to `/` (or active workspace in player variant) |
| Global Header (`AppHeader`) | Primary Nav (`Laboratories`, `For teachers`, `Help` / Role links) | Routes to `/laboratories`, `/teacher` (or `/sign-in?role=teacher`), `/help`, `/student`, `/admin`, `/content` |
| Global Header (`AppHeader`) | `English / తెలుగు` (`LocaleToggle`) | `POST /api/locale` (updates `g1_locale` cookie + `router.refresh()`); WCAG 2.5.3 label-in-name compliant |
| Global Header (`AppHeader`) | `Sign in` / Role badge / `Sign out` | Routes to `/sign-in` or workspace; `POST /api/auth/sign-out` revokes DB session and redirects to `/` |
| Global Header (`AppHeader`) | Mobile Menu Toggle & Drawer | Opens/closes mobile navigation with `aria-current="page"` and `Escape` key dismissal + focus restoration |
| `/` (Homepage) | 7-Stage `<EducationStageRail />` (`Class 6`..`Inter 2nd Year`) | Links directly to `/laboratories?grade=6`..`12` with honest per-stage availability subtitle |
| `/` (Homepage) | `Explore laboratories →` / `How the labs work` | Navigates to `/laboratories` and `/help` |
| `/` (Homepage) | Subject Cards (`Chemistry`, `Physics`, `Biology`) | Navigates to `/laboratories/chemistry`, `/laboratories/physics`, `/laboratories/biology` |
| `/` (Homepage) | Mode Explanation Cards (`Simulation Mode` Blue, `Experiment Mode` Green) | Non-clickable informational cards (per Usefulness Gate) |
| `/` (Homepage) | Featured Practical Cards (3 items) | Navigates to `/experiments/[experimentId]` |
| `/laboratories` & `/laboratories/[subject]` | 7-Stage `<EducationStageRail />` + `All 7 stages` | Updates `?grade=` URL filter and reloads matching practicals or honest under-review empty state |
| `/laboratories` & `/laboratories/[subject]` | Search input, Subject, Class (all 7 stages), Availability selects, `Apply`, `Reset filters` | Synchronizes URL query params (`?subject=&grade=&q=&availability=`) preserving browser Back history |
| `/laboratories` | Left Refine Rail (`Subjects`, `Publication Status`) | Interactive `<button aria-pressed>` filters updating URL params |
| `/laboratories` & `/laboratories/[subject]` | Experiment Cards (`View experiment →`) | Single card action navigating to `/experiments/[experimentId]` |
| `/experiments/[experimentId]` | `Start guided practical` / `Preview Simulation Mode` (Blue) | Calls `POST /api/v1/launch` (with pinned `contentVersion` & `manifestSha256`) → `POST /api/v1/launch/redeem` → `/player/[sessionId]` |
| `/experiments/[experimentId]` | `Start investigation` / `Preview Experiment Mode` (Green) | Same launch+redeem flow; disabled with explicit bilingual reason if disallowed by assignment, quota reached, locked past due, or review-pending |
| `/experiments/[experimentId]` | `Resume saved assignment session →` (when active) | Resumes existing open assignment session at `/player/[sessionId]` |
| `/experiments/[experimentId]` | Provenance `<details>` disclosure | Reveals experiment ID, science model ID, source edition references, and pinned manifest SHA-256 |
| `/player/[sessionId]` | Stage Pointer Hotspots (`stage-hotspot-*`), `Equipment list`, `Accessible controls` (2D DOM), `Check and continue`, `Run supported calculation`, `Record comparison` | All execute the exact same server action pipeline `POST /api/v1/sessions/[sessionId]/actions` with `X-CSRF-Token`, `Idempotency-Key`, and `expectedRevision` |
| `/player/[sessionId]` | `Reset view` | Resets canvas zoom and closes equipment drawer |
| `/player/[sessionId]` | `Retry pending action` / `Reconnect & sync` (`W05`) | Re-dispatches failed offline action with preserved `Idempotency-Key` or syncs latest confirmed server checkpoint |
| `/player/[sessionId]` | `Submit practical` | Calls `POST /api/v1/attempts/[attemptId]/submission` binding confirmed server observation IDs to rubric |
| `/student` | `Resume lab`, Assignment `Open`/`Resume lab`, expandable `View details` on `#results` | Resumes saved checkpoint, opens assignment-pinned detail page, expands own rubric criteria & confirmed observations + read-only session replay |
| `/teacher` | `+ Assign experiment`, `Preview`, `Inspect evidence`, `Open report & evidence` | Navigates to `/teacher/assignments`, `/experiments/[id]` (teacher preview), and `/teacher/reports` |
| `/teacher/assignments` | Assignment Builder (`class`, `experiment`, `Simulation`/`Experiment` checkboxes, IST date+time, `latePolicy`, `attemptLimit`, `Publish`, `Amend`) | Calls `POST /api/v1/teacher/classes/[classId]/assignments` creating version-pinned or immutable amended revision (`Rev #N`) |
| `/teacher/reports` | Class selector, Assignment filter, `Apply filter`, `Export audited CSV`, expandable `Inspect criteria & evidence`, `Open session replay` | Filters scoped reports, downloads formula-safe audited CSV, reveals criterion pass/fail and server observations |
| `/admin` | `Disable` / `Re-enable` (School Admin) | Calls `POST /api/admin/overview`, revokes active sessions on disable, writes `audit_event` |
| `/content` | Draft submission form + 5-point checklist (Editor); `Approve & publish`, `Rollback / Retire` (Reviewer) | Calls `POST /api/content/versions` and `POST /api/content/versions/[reviewId]/decision` enforcing two-person separation |
| `/help` | `Re-run check` (`DeviceCapabilityPanel`) | Queries `/api/health` and browser capabilities, updates live status region with IST timestamp |
