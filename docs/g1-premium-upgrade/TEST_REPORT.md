# Verification & Test Report — G1 Virtua Labs Premium Upgrade

**Date:** 2026-11-23 IST
**Baseline Commit:** `50b83f8c07dafb337f47cc31ac6c3c96af33f335`
**Environment:** Windows local isolated synthetic QA (`127.0.0.1:3000` production Next.js 16.4.6 build + local PGlite PostgreSQL socket at `127.0.0.1:54329` with `001_initial_schema.sql` + `002_upgrade_w01_w13.sql` + synthetic seed).

---

## 1. Automated Verification Summary

| Check | Command | Outcome | Details |
|---|---|---|---|
| **Canonical Logo Integrity** | `Get-FileHash public\brand\g1-canonical-logo.png -Algorithm SHA256` & Playwright `/brand/g1-canonical-logo.png` fetch | **PASS** | Exact SHA-256 `94b8b12e4a13317df3e00b1a6e8604aec9fdb4074cf355b55658dc9739c77a65` (`278×50` unmodified) |
| **TypeScript Static Check** | `npm run typecheck` (`tsc --noEmit`) | **PASS (0 errors)** | Zero TypeScript errors across all app, API, and test modules |
| **ESLint 9 Flat Config (`W12`)** | `npm run lint` (`eslint .`) | **PASS (0 errors)** | Exits 0 using `eslint.config.mjs` (0 errors, 17 minor non-blocking warnings) |
| **Unit & Contract Tests** | `npm run test:unit` (`vitest run`) | **PASS (15/15)** | 3 test suites: `education-stages.test.ts` (4), `science-adapters.test.ts` (8), `contracts.test.ts` (3) |
| **Production Build** | `npm run build` (`next build`) | **PASS** | Clean Turbopack build, 34 route patterns compiled |
| **Baseline Gate W E2E + Axe** | `npx playwright test tests/e2e/g1-virtua-labs.spec.ts` | **PASS (4/4)** | `AT-01`, `AT-02/05/06`, `AT-03/04`, `AT-02/03/07` API invariants all passed (16.3s) |
| **Upgrade W01–W13 E2E + Axe** | `npx playwright test tests/e2e/upgrade-w01-w13.spec.ts` | **PASS (4/4)** | `U01` (logo, headers, 7 stages, 2-col hub), `U02` (768/390/360 reflow, mobile Escape, Telugu, Help IST check), `U03` (W01 one-mode + pinned old version after newer publish, W02 amendment, W03 drill-down, W06 review), `U04` (W05 offline recovery with 0 uncaught errors, W09 player, W11 admin, WCAG 2.2 AA Axe) (20.0s) |

---

## 2. Viewport, Locale & Accessibility Matrix Verified
- **`1600×900` Desktop (EN & TE):** Homepage, Catalogue (all 7 stages + empty stage), Chemistry 2-card hub, Assigned Detail (Simulation-only), Student Dashboard, Teacher Dashboard, Teacher Reports (evidence drill-down), Simulation Player, Experiment Player, Offline Player Recovery, School Admin, State Admin, Content Reviewer, Help.
- **`768×1024` Tablet (EN):** Verified `Sign in` bounding box `(x + width) <= 768`, `scrollWidth <= innerWidth`, zero header clipping, zero card text truncation.
- **`390×844` & `360×800` Mobile (EN):** Verified zero horizontal overflow (`scrollWidth <= innerWidth`), mobile drawer active `aria-current="page"`, and `Escape` key closing drawer.
- **Axe WCAG 2.0/2.1/2.2 A/AA Scans (`@axe-core/playwright`):** Zero `critical` or `serious` violations across Homepage, Catalogue, Subject Hub, Experiment Detail, Help, Student Dashboard, Teacher Dashboard, Simulation Player, and Experiment Player.
- **Security Headers (`W13`):** Confirmed `Permissions-Policy` no longer contains obsolete `interest-cohort=()`.

---

## 3. Residual Risks & Non-Automated Checks Remaining
- Manual assistive-technology testing with NVDA/JAWS in Telugu (`te-IN`) has not been executed and requires human AT QA before production deployment.
- Real classroom hardware (4 GB RAM / low-end Chromebook / integrated GPU) profiling and multi-user load / PostgreSQL RLS / disaster-recovery testing remain gated for Stage-2 deployment readiness.
