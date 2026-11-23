# Implementation Plan — G1 Virtua Labs Premium Upgrade

**Baseline Commit:** `50b83f8c07dafb337f47cc31ac6c3c96af33f335` (`main`)
**Execution Date:** 2026-11-22 / 2026-11-23 IST
**Repository:** `E:\G1 Virtual Labs website` (existing Next.js 16 + TypeScript + PostgreSQL application upgraded in-place)

---

## 1. Authoritative Inputs Audited Before Code Changes
- Master Specification: `01_MASTER_PROMPT/G1_Virtua_Labs_Antigravity_Master_Prompt.md`
- Independent Codex Audit Package (`02_ORIGINAL_CODEX_AUDIT/`): `00_EXECUTIVE_VERDICT.md` through `08_ANTIGRAVITY_READY_REBUILD_BRIEF.md`, `AUDIT_MANIFEST.md`, and `EVIDENCE/live` + `EVIDENCE/qa` screenshots.
- Premium Visual Guidance (`03_PREMIUM_VISUAL_GUIDANCE/`): `CLASS_STRUCTURE.md`, `VISUAL_DIRECTION_AND_REVIEW.md`, `00_Aspirational_Premium_Homepage.png` through `05_Student_Dashboard.png`, HTML layout references, and illustration assets (`hero_laboratory.png`, `chemistry.png`, `physics.png`, `biology.png`, `zinc.png`, `refraction.png`, `onion.png`).
- Canonical Logo Check: `public/brand/g1-canonical-logo.png` (`278×50`, SHA-256 `94b8b12e4a13317df3e00b1a6e8604aec9fdb4074cf355b55658dc9739c77a65`) preserved byte-for-byte; `g1_exact_logo.png` from guidance package was explicitly excluded.

---

## 2. Executed Phases & Code Ownership

| Phase | Backlog IDs | Scope Executed | Primary Files Changed / Created |
|---|---|---|---|
| **Phase 0 — Discovery, Design System & Assets** | Prerequisite | Verified canonical logo hash; copied 7 approved lab illustration assets into `public/assets/labs/`; preserved Codex baseline screenshots in `docs/g1-premium-upgrade/screenshots/before/`; ran `.agents/skills/ui-ux-pro-max/scripts/search.py` and adapted `design-system/g1-virtua-labs/MASTER.md` + `tokens.css`. | `design-system/g1-virtua-labs/MASTER.md`, `design-system/g1-virtua-labs/tokens.css`, `public/assets/labs/*.png` |
| **Phase A — Functional Correctness & Integrity** | `W01–W06` | Additive DB migration (`002_upgrade_w01_w13.sql`); server-side assignment resolution (`allowedModes`, pinned `contentVersion`, `manifestSha256`, quota, IST due policy, teacher Preview lane); per-mode rubrics, publish preview & immutable assignment amendment; teacher & student criterion/observation evidence drill-down; session revocation & synthetic QA gating; resilient offline/retry player state without unhandled rejections; editorial checklist & replay counts. | `db/migrations/002_upgrade_w01_w13.sql`, `src/app/experiments/[experimentId]/page.tsx`, `src/components/ModeLauncher.tsx`, `src/app/api/v1/launch/route.ts`, `src/app/api/v1/teacher/classes/[classId]/assignments/route.ts`, `src/components/AssignmentBuilder.tsx`, `src/app/teacher/assignments/page.tsx`, `src/app/teacher/page.tsx`, `src/app/teacher/reports/page.tsx`, `src/app/student/page.tsx`, `src/components/StudentDashboardClient.tsx`, `src/lib/auth.ts`, `src/app/api/auth/sign-in/route.ts`, `src/components/SignInForm.tsx`, `src/lib/client-api.ts`, `src/components/LabPlayerClient.tsx`, `src/app/content/page.tsx`, `src/components/ContentWorkspaceClient.tsx` |
| **Phase B — Premium Light UI, 7 Education Levels & Telugu Parity** | `W07–W10` | Implemented canonical 7-stage module (`src/lib/education-stages.ts`) and tactile dimensional `<EducationStageRail />`; fixed `768px` tablet header clipping & `360px` excess width (`BrandLogo`, `LocaleToggle`, `AppHeader`); rebuilt homepage hero/subjects/practicals, catalogue 7-stage filtering, balanced 2-column subject hubs, premium 3-panel player with pointer hotspots + 2D DOM parity, dark navy student/teacher workspace rails, and complete Telugu (`te-IN`) localization. | `src/lib/education-stages.ts`, `src/components/EducationStageRail.tsx`, `src/app/globals.css`, `src/components/BrandLogo.tsx`, `src/components/LocaleToggle.tsx`, `src/components/AppHeader.tsx`, `src/components/TeacherSidebar.tsx`, `src/app/page.tsx`, `src/components/CatalogueView.tsx`, `src/app/laboratories/page.tsx`, `src/app/laboratories/[subject]/page.tsx`, `src/components/LabStageCanvas.tsx`, `src/lib/i18n.ts` |
| **Phase C — Institutional Completion, Tooling & QA** | `W11–W13` | Instant session revocation on principal disable; IST freshness stamps & bilingual admin views; ESLint 9 flat config (`eslint.config.mjs`); removed obsolete `interest-cohort=()` from `Permissions-Policy`; observable status + IST timestamp on `/help` device check; `Escape` key & `aria-current="page"` on mobile drawer; full Vitest + Playwright + Axe verification & matched screenshots. | `eslint.config.mjs`, `next.config.ts`, `src/app/admin/page.tsx`, `src/components/AdminWorkspaceClient.tsx`, `src/app/api/admin/overview/route.ts`, `src/app/api/v1/catalog/route.ts`, `src/components/DeviceCapabilityPanel.tsx`, `src/app/help/page.tsx`, `tests/unit/education-stages.test.ts`, `tests/e2e/upgrade-w01-w13.spec.ts` |

---

## 3. Explicitly Preserved Boundaries (Deferred Stage-2 Gates)
- No Unreal Engine or Unity folders on `D:\` were accessed or modified.
- No remote Git push or cloud deployment was executed.
- Qualified 3D WebGL/Babylon apparatus runtime (`F-14`, `G1-31`), physical optics/microscope dataset calibration (`AP-PHYS-10-9.10`, `AP-BIO-09-5.1`), external LTI 1.3 / AGS sync (`F-15`), optional AI tutor (`G1-30`), and independent school-device/AT/government production certification (`G1-28`, `G1-29`, `G1-39`) remain honestly disclosed and gated.
