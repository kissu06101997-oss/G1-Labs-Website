import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  apiError,
  extractIdempotencyKey,
  getCurrentSession,
  recordAuditEvent,
  verifyCsrf,
} from "@/lib/auth";
import { canonicalJson, newUuid, sha256Hex } from "@/lib/crypto";
import { query, withTransaction } from "@/lib/db";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const publishAssignmentSchema = z
  .object({
    experimentId: z.string().min(1).max(350),
    contentVersion: z.string().min(1).max(350),
    rubricId: z.string().min(1).max(350),
    modes: z.array(z.enum(["simulation", "experiment"])).min(1).max(2),
    dueAt: z.string().datetime({ offset: true }),
    attemptLimit: z.number().int().min(1).max(20),
    localeBundleVersion: z.string().min(1).max(128),
  })
  .strict();

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ classId: string }> }
) {
  const auth = await getCurrentSession();
  if (!auth) return apiError(401, "NOT_AUTHORIZED", "Sign in required.");
  if (auth.role !== "teacher" && auth.role !== "school_admin") {
    return apiError(403, "NOT_AUTHORIZED", "Teacher or school administrator role required.");
  }

  const { classId } = await context.params;
  if (!UUID_RE.test(classId) || !auth.schoolId) {
    return apiError(404, "NOT_FOUND", "Class not found.");
  }

  if (auth.role === "teacher") {
    const owns = await query(
      `SELECT 1 FROM class_teacher WHERE school_id = $1 AND class_id = $2 AND principal_id = $3`,
      [auth.schoolId, classId, auth.principalId]
    );
    if (owns.rows.length === 0) return apiError(404, "NOT_FOUND", "Class not found.");
  } else {
    const exists = await query(
      `SELECT 1 FROM classroom WHERE school_id = $1 AND class_id = $2`,
      [auth.schoolId, classId]
    );
    if (exists.rows.length === 0) return apiError(404, "NOT_FOUND", "Class not found.");
  }

  const res = await query<{
    assignment_id: string;
    experiment_id: string;
    content_version: string;
    rubric_id: string;
    locale_bundle_version: string;
    due_at: Date | null;
    max_attempts: number;
    subject: string;
    title: string;
    modes: string[];
    submissions: string;
  }>(
    `SELECT
       a.assignment_id,
       a.experiment_id,
       a.content_version,
       a.rubric_id,
       a.locale_bundle_version,
       a.due_at,
       a.max_attempts,
       ev.subject,
       ev.definition->>'title' AS title,
       ARRAY_AGG(DISTINCT am.mode::text ORDER BY am.mode::text) AS modes,
       (
         SELECT count(DISTINCT asm.attempt_id)::text
         FROM assessment asm
         JOIN attempt att ON att.school_id = asm.school_id AND att.attempt_id = asm.attempt_id
         WHERE asm.school_id = a.school_id AND att.assignment_id = a.assignment_id AND asm.supersedes_id IS NULL
       ) AS submissions
     FROM assignment a
     JOIN experiment_version ev
       ON ev.experiment_id = a.experiment_id AND ev.content_version = a.content_version
     JOIN assignment_mode am
       ON am.school_id = a.school_id AND am.assignment_id = a.assignment_id
     WHERE a.school_id = $1 AND a.class_id = $2
     GROUP BY a.school_id, a.assignment_id, ev.subject, ev.definition
     ORDER BY a.created_at DESC`,
    [auth.schoolId, classId]
  );

  return NextResponse.json({
    items: res.rows.map((r) => ({
      assignmentId: r.assignment_id,
      experimentId: r.experiment_id,
      contentVersion: r.content_version,
      rubricId: r.rubric_id,
      localeBundleVersion: r.locale_bundle_version,
      dueAt: r.due_at ? r.due_at.toISOString() : null,
      attemptLimit: r.max_attempts,
      subject: r.subject,
      title: r.title,
      modes: r.modes,
      submissions: Number(r.submissions),
    })),
  });
}

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ classId: string }> }
) {
  const auth = await getCurrentSession();
  if (!auth) return apiError(401, "NOT_AUTHORIZED", "Sign in required.");
  if (!verifyCsrf(req, auth)) return apiError(400, "NOT_AUTHORIZED", "Missing or invalid X-CSRF-Token.");
  if (auth.role !== "teacher") {
    return apiError(403, "NOT_AUTHORIZED", "Only an assigned class teacher can publish assignments.");
  }

  const idempotencyKey = extractIdempotencyKey(req);
  if (!idempotencyKey) {
    return apiError(400, "STATE_CONFLICT", "Idempotency-Key header (16–128 chars) is required.");
  }

  const { classId } = await context.params;
  if (!UUID_RE.test(classId) || !auth.schoolId) {
    return apiError(404, "NOT_FOUND", "Class not found.");
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return apiError(400, "STATE_CONFLICT", "Invalid JSON payload.");
  }

  const parsed = publishAssignmentSchema.safeParse(body);
  if (!parsed.success) {
    return apiError(422, "ACTION_UNSUPPORTED", "Assignment request failed schema validation.");
  }

  const input = parsed.data;
  const uniqueModes = Array.from(new Set(input.modes));
  if (uniqueModes.length !== input.modes.length) {
    return apiError(422, "ACTION_UNSUPPORTED", "Duplicate modes are not allowed.");
  }

  const requestDigest = sha256Hex(canonicalJson(input));
  const scope = `assign:${auth.schoolId}:${classId}:${auth.principalId}`;

  const outcome = await withTransaction(async (client) => {
    // 1. Verify teacher is explicitly assigned to this school + class (AT-03)
    const ct = await client.query(
      `SELECT 1 FROM class_teacher WHERE school_id = $1 AND class_id = $2 AND principal_id = $3`,
      [auth.schoolId, classId, auth.principalId]
    );
    if (ct.rows.length === 0) {
      return { status: 404, error: { reasonCode: "NOT_FOUND" as const, detail: "Class not found." } };
    }

    // 2. Check idempotency
    const prev = await client.query<{
      request_digest: string;
      status_code: number;
      response_body: unknown;
    }>(
      `SELECT request_digest, status_code, response_body
       FROM idempotency_record WHERE scope = $1 AND idempotency_key = $2`,
      [scope, idempotencyKey]
    );
    if (prev.rows[0]) {
      if (prev.rows[0].request_digest !== requestDigest) {
        return {
          status: 409,
          error: {
            reasonCode: "IDEMPOTENCY_MISMATCH" as const,
            detail: "Idempotency-Key already used with a different assignment payload.",
          },
        };
      }
      return { status: prev.rows[0].status_code, body: prev.rows[0].response_body };
    }

    // 3. Verify experiment_version is publishable (not retired and not review_pending)
    const expRes = await client.query<{
      published_at: Date | null;
      retired_at: Date | null;
      definition: { publicationStatus: string; assessmentIds: string[] };
    }>(
      `SELECT published_at, retired_at, definition
       FROM experiment_version
       WHERE experiment_id = $1 AND content_version = $2`,
      [input.experimentId, input.contentVersion]
    );
    const expRow = expRes.rows[0];
    if (!expRow) {
      return { status: 404, error: { reasonCode: "NOT_FOUND" as const, detail: "Experiment version not found." } };
    }
    if (expRow.retired_at) {
      return { status: 410, error: { reasonCode: "VERSION_MISMATCH" as const, detail: "Experiment version is retired." } };
    }
    if (!expRow.published_at || expRow.definition.publicationStatus === "review_pending") {
      return {
        status: 422,
        error: {
          reasonCode: "MODEL_UNQUALIFIED" as const,
          detail: "Only approved or pilot-qualified experiments can be assigned to a class.",
        },
      };
    }

    const assignmentId = newUuid();
    await client.query(
      `INSERT INTO assignment
        (school_id, assignment_id, class_id, experiment_id, content_version, rubric_id, locale_bundle_version, due_at, max_attempts, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [
        auth.schoolId,
        assignmentId,
        classId,
        input.experimentId,
        input.contentVersion,
        input.rubricId,
        input.localeBundleVersion,
        input.dueAt,
        input.attemptLimit,
        auth.principalId,
      ]
    );

    for (const m of uniqueModes) {
      await client.query(
        `INSERT INTO assignment_mode (school_id, assignment_id, mode)
         VALUES ($1, $2, $3::lab_mode)`,
        [auth.schoolId, assignmentId, m]
      );
    }

    const responseBody = {
      assignmentId,
      status: "published" as const,
    };

    await client.query(
      `INSERT INTO idempotency_record (scope, idempotency_key, request_digest, status_code, response_body)
       VALUES ($1, $2, $3, 200, $4::jsonb)`,
      [scope, idempotencyKey, requestDigest, JSON.stringify(responseBody)]
    );

    await recordAuditEvent(
      {
        schoolId: auth.schoolId,
        actionType: "teacher.assignment_published",
        actorId: auth.principalId,
        subjectKey: `${classId}:${assignmentId}:${input.experimentId}@${input.contentVersion}`,
      },
      client
    );

    return { status: 200, body: responseBody };
  });

  if ("error" in outcome && outcome.error) {
    return apiError(outcome.status, outcome.error.reasonCode, outcome.error.detail);
  }
  return NextResponse.json(outcome.body, { status: outcome.status });
}
