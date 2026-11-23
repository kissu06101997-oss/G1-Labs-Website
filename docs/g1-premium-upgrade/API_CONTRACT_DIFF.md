# API Contract Diff & Database Migration Guide

## 1. Backward Compatibility Guarantee
All baseline routes from commit `50b83f8` (`GET /api/v1/catalog`, `POST /api/v1/launch`, `POST /api/v1/launch/redeem`, `GET /api/v1/sessions/[sessionId]`, `POST /api/v1/sessions/[sessionId]/actions`, `GET /api/v1/sessions/[sessionId]/checkpoints/[revision]`, `POST /api/v1/attempts/[attemptId]/submission`, `GET/POST /api/v1/teacher/classes/[classId]/assignments`, `GET /api/v1/teacher/classes/[classId]/reports`, `/api/auth/*`, `/api/admin/overview`, `/api/content/versions*`, `/api/health`, `/api/locale`) remain 100% backward compatible with all existing OpenAPI schemas and baseline E2E assertions.

---

## 2. Additive Database Migration (`db/migrations/002_upgrade_w01_w13.sql`)

| Table | Column Added | Type / Constraint | Purpose |
|---|---|---|---|
| `assignment_mode` | `rubric_id` | `text` (backfilled from experiment `modeConfigurations`) | Per-mode rubric binding (`Simulation` vs `Experiment` rubrics — W02) |
| `assignment` | `late_policy` | `text NOT NULL DEFAULT 'allow_late_flagged' CHECK (IN ('allow_late_flagged','block_new_after_due'))` | Explicit overdue policy enforcement & disclosure (W02) |
| `assignment` | `revision_number` | `integer NOT NULL DEFAULT 1 CHECK (>= 1)` | Immutable assignment amendment versioning (W02 / G1-20) |
| `assignment` | `supersedes_assignment_id` | `uuid` | Links amended revision to prior assignment row |
| `assignment` | `superseded_at` | `timestamptz` | Marks historical superseded revision while keeping foreign keys & attempts intact |
| `assignment` | `revision_notes` | `text` | Teacher amendment note |
| `attempt` | `is_preview` | `boolean NOT NULL DEFAULT false` | Explicitly separates teacher previews from student graded/practice attempts (G1-19) |
| `attempt` | `is_late` | `boolean NOT NULL DEFAULT false` | Flags past-due submissions under `allow_late_flagged` policy (W02) |

### Rollback Instructions
Because `002_upgrade_w01_w13.sql` is strictly additive (`ADD COLUMN IF NOT EXISTS`):
- Existing rows and foreign keys from `001_initial_schema.sql` are untouched.
- To roll back locally in a synthetic environment:
  ```sql
  ALTER TABLE attempt DROP COLUMN IF EXISTS is_preview, DROP COLUMN IF EXISTS is_late;
  ALTER TABLE assignment DROP COLUMN IF EXISTS late_policy, DROP COLUMN IF EXISTS revision_number, DROP COLUMN IF EXISTS supersedes_assignment_id, DROP COLUMN IF EXISTS superseded_at, DROP COLUMN IF EXISTS revision_notes;
  ALTER TABLE assignment_mode DROP COLUMN IF EXISTS rubric_id;
  DELETE FROM schema_migration WHERE version = '002_upgrade_w01_w13.sql';
  ```

---

## 3. Additive API Enhancements
1. **`GET /api/v1/catalog`**: Now accepts `stage` (`class-6`..`intermediate-2`) in addition to numeric `grade` (`6`..`12`).
2. **`POST /api/v1/launch`**:
   - Enforces `assignment.late_policy`: returns `409 STATE_CONFLICT` without creating an `attempt` when `block_new_after_due` and past due; sets `attempt.is_late = true` when `allow_late_flagged`.
   - Sets `attempt.is_preview = true` for teacher preview launches and records audit event `lab.teacher_preview_issued`.
   - Returns additive `isPreview` and `isLate` booleans in response JSON.
3. **`POST /api/v1/teacher/classes/[classId]/assignments`**:
   - Accepts optional additive fields `rubricByMode`, `latePolicy`, `supersedesAssignmentId`, and `revisionNotes`.
   - Creates immutable revision rows when amending an assignment, marking the superseded row with `superseded_at = now()` while preserving all existing student attempts and submissions.
4. **`POST /api/auth/sign-in` & `getCurrentSession()`**:
   - Rejects synthetic accounts when `ALLOW_LOCAL_SYNTHETIC_FIXTURES !== "true"`.
   - Validates active `role_grant` (`revoked_at IS NULL`) and `school_learner.active = true` on every session read.
   - Accepts optional `requestedRole` for principals with multiple role grants.
5. **`POST /api/admin/overview`**:
   - Disabling a principal immediately revokes open `auth_session` rows (`revoked_at = now()`).
