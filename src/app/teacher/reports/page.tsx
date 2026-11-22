import Link from "next/link";
import { redirect } from "next/navigation";
import { Download, ShieldCheck } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { TeacherSidebar } from "@/components/TeacherSidebar";
import { getCurrentSession, getRequestLocale } from "@/lib/auth";
import { query } from "@/lib/db";
import { getDictionary, getExperimentCopy } from "@/lib/i18n";

export default async function TeacherReportsPage(props: {
  searchParams: Promise<{ classId?: string }>;
}) {
  const [auth, locale, sp] = await Promise.all([
    getCurrentSession(),
    getRequestLocale(),
    props.searchParams,
  ]);
  if (!auth) redirect("/sign-in?next=/teacher/reports&role=teacher");
  if (auth.role !== "teacher" || !auth.schoolId) redirect("/");

  const dict = getDictionary(locale);

  const classesRes = await query<{ class_id: string; label: string; grade: number }>(
    `SELECT cl.class_id, cl.label, cl.grade
     FROM classroom cl
     JOIN class_teacher ct ON ct.school_id = cl.school_id AND ct.class_id = cl.class_id
     WHERE cl.school_id = $1 AND ct.principal_id = $2
     ORDER BY cl.grade DESC`,
    [auth.schoolId, auth.principalId]
  );

  const activeClass =
    classesRes.rows.find((c) => c.class_id === sp.classId) ?? classesRes.rows[0] ?? null;

  const reportsRes = activeClass
    ? await query<{
        assessment_id: string;
        attempt_id: string;
        learner_id: string;
        display_name: string;
        experiment_id: string;
        content_version: string;
        mode: string;
        rubric_version: string;
        result: {
          gradeState: string;
          criteriaPassed?: number;
          criteriaTotal?: number;
          evidenceIds?: string[];
          summary?: string;
        };
        created_at: Date;
      }>(
        `SELECT
           asm.assessment_id, asm.attempt_id, att.learner_id, pc.display_name,
           att.experiment_id, att.content_version, att.mode::text, asm.rubric_version,
           asm.result, asm.created_at
         FROM assessment asm
         JOIN attempt att ON att.school_id = asm.school_id AND att.attempt_id = asm.attempt_id
         JOIN school_learner sl ON sl.school_id = att.school_id AND sl.learner_id = att.learner_id
         JOIN principal_credential pc ON pc.principal_id = sl.principal_id
         WHERE asm.school_id = $1 AND att.class_id = $2 AND asm.supersedes_id IS NULL
         ORDER BY asm.created_at DESC`,
        [auth.schoolId, activeClass.class_id]
      )
    : { rows: [] };

  return (
    <>
      <AppHeader variant="teacher" locale={locale} auth={auth} />
      <div className="mx-auto flex w-full max-w-[1480px] flex-1 flex-col lg:flex-row">
        <TeacherSidebar active="reports" locale={locale} schoolName={auth.schoolName} />

        <main id="main-content" className="flex-1 space-y-6 px-4 py-8 sm:px-8 lg:px-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="g1-eyebrow">{dict.teacher.workspaceEyebrow}</div>
              <h1 className="mt-2.5 text-3xl font-extrabold tracking-tight text-[#0c2444]">
                {dict.teacher.evidenceReportsHeading}
              </h1>
              <p className="mt-1 text-sm text-[#4b637a]">
                {activeClass ? activeClass.label : "No authorized class"} · {dict.teacher.evidenceReportsDesc}
              </p>
            </div>
            {activeClass && (
              <a
                href={`/api/v1/teacher/classes/${activeClass.class_id}/reports?format=csv`}
                className="g1-btn g1-btn-outline"
                data-testid="teacher-export-csv"
              >
                <Download className="h-4 w-4" aria-hidden="true" />
                <span>{dict.teacher.exportCsv}</span>
              </a>
            )}
          </div>

          <div className="g1-hint flex items-center gap-2.5">
            <ShieldCheck className="h-4 w-4 shrink-0 text-[#007875]" aria-hidden="true" />
            <span>
              Tenant-isolated report: only submissions from classes assigned to your account in{" "}
              <strong>{auth.schoolName}</strong> appear here. CSV exports write an immutable entry
              to <code>audit_event</code>.
            </span>
          </div>

          <section className="g1-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="bg-[#f2f8fc] text-[11px] font-bold uppercase tracking-wider text-[#4b637a]">
                    <th className="px-6 py-3">Learner (Pseudonymous)</th>
                    <th className="px-4 py-3">Experiment &amp; Version</th>
                    <th className="px-4 py-3">Mode</th>
                    <th className="px-4 py-3">Rubric Result</th>
                    <th className="px-4 py-3">Confirmed Evidence</th>
                    <th className="px-6 py-3">Submitted</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e8f0f5]">
                  {reportsRes.rows.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-sm text-[#4b637a]">
                        No submitted attempts recorded yet for this class.
                      </td>
                    </tr>
                  ) : (
                    reportsRes.rows.map((r) => (
                      <tr key={r.assessment_id}>
                        <td className="px-6 py-4">
                          <div className="font-bold text-[#0c2444]">{r.display_name}</div>
                          <div className="font-mono text-[11px] text-[#4b637a]">
                            {r.learner_id.slice(0, 13)}…
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="font-bold text-[#0c2444]">
                            {getExperimentCopy(r.experiment_id, locale).shortTitle}
                          </div>
                          <div className="font-mono text-xs text-[#4b637a]">
                            {r.experiment_id} · v{r.content_version}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <span className={`g1-tag ${r.mode === "experiment" ? "g1-tag-green" : "g1-tag-blue"}`}>
                            {r.mode === "experiment" ? dict.common.experiment : dict.common.simulation}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="font-extrabold text-[#046c49]">
                            {r.result.criteriaPassed ?? 0} / {r.result.criteriaTotal ?? 0} · {r.result.gradeState}
                          </div>
                          <div className="font-mono text-[11px] text-[#4b637a]">{r.rubric_version}</div>
                        </td>
                        <td className="px-4 py-4 text-xs text-[#133354]">
                          {r.result.evidenceIds?.length ?? 0} confirmed record(s)
                        </td>
                        <td className="px-6 py-4 text-xs text-[#4b637a]">
                          {new Date(r.created_at).toLocaleString("en-IN")}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <p className="text-xs text-[#5a7288]">
            External LMS grade sync (1EdTech LTI 1.3 / AGS) is a separately authorized future
            integration contract and is not active in this local pilot.{" "}
            <Link href="/help" className="font-bold text-[#007875] hover:underline">
              Platform readiness &amp; governance
            </Link>
          </p>
        </main>
      </div>
    </>
  );
}
