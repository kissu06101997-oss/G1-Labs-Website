import { NextRequest, NextResponse } from "next/server";
import { apiError } from "@/lib/auth";
import { listCatalogExperiments } from "@/lib/catalog";
import type { LabSubject } from "@/lib/types";

const VALID_SUBJECTS = new Set<LabSubject>(["chemistry", "physics", "biology"]);

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const labIdParam = searchParams.get("labId") ?? searchParams.get("subject");
  const gradeParam = searchParams.get("grade");
  const q = searchParams.get("q") ?? undefined;
  const includeMetadata = searchParams.get("meta") === "1";

  let subject: LabSubject | undefined;
  if (labIdParam) {
    if (!VALID_SUBJECTS.has(labIdParam as LabSubject)) {
      return apiError(400, "STATE_CONFLICT", "Invalid labId; expected chemistry, physics, or biology.");
    }
    subject = labIdParam as LabSubject;
  }

  let grade: number | undefined;
  if (gradeParam) {
    const parsed = Number(gradeParam);
    if (!Number.isInteger(parsed) || parsed < 6 || parsed > 12) {
      return apiError(400, "STATE_CONFLICT", "Invalid grade; expected integer 6–12.");
    }
    grade = parsed;
  }

  const rows = await listCatalogExperiments({ subject, grade, q });

  // Strict OpenAPI / ExperimentDefinition items when meta is not requested
  const items = includeMetadata
    ? rows
    : rows.map((row) => {
        const { manifestSha256: _m, engineAbi: _a, publishedAt: _p, retiredAt: _r, ...definition } = row;
        return definition;
      });

  return NextResponse.json({
    items,
    nextCursor: null,
  });
}
