import { redirect } from "next/navigation";
import { AppHeader } from "@/components/AppHeader";
import { AssignmentBuilder } from "@/components/AssignmentBuilder";
import { TeacherSidebar } from "@/components/TeacherSidebar";
import { getCurrentSession, getRequestLocale } from "@/lib/auth";
import { listCatalogExperiments } from "@/lib/catalog";
import { query } from "@/lib/db";
import { getDictionary, getExperimentCopy } from "@/lib/i18n";

export default async function TeacherAssignmentsPage() {
  const [auth, locale] = await Promise.all([getCurrentSession(), getRequestLocale()]);
  if (!auth) redirect("/sign-in?next=/teacher/assignments&role=teacher");
  if (auth.role !== "teacher" || !auth.schoolId) redirect("/");

  const dict = getDictionary(locale);

  const [classesRes, experiments] = await Promise.all([
    query<{ class_id: string; label: string; grade: number }>(
      `SELECT cl.class_id, cl.label, cl.grade
       FROM classroom cl
       JOIN class_teacher ct ON ct.school_id = cl.school_id AND ct.class_id = cl.class_id
       WHERE cl.school_id = $1 AND ct.principal_id = $2
       ORDER BY cl.grade DESC`,
      [auth.schoolId, auth.principalId]
    ),
    listCatalogExperiments(),
  ]);

  const classIds = classesRes.rows.map((c) => c.class_id);
  const existingRes =
    classIds.length > 0
      ? await query<{
          assignment_id: string;
          class_label: string;
          experiment_id: string;
          content_version: string;
          rubric_id: string;
          due_at: Date | null;
          max_attempts: number;
          modes: string[];
        }>(
          `SELECT
             a.assignment_id, cl.label AS class_label, a.experiment_id, a.content_version,
             a.rubric_id, a.due_at, a.max_attempts,
             ARRAY_AGG(DISTINCT am.mode::text ORDER BY am.mode::text) AS modes
           FROM assignment a
           JOIN classroom cl ON cl.school_id = a.school_id AND cl.class_id = a.class_id
           JOIN assignment_mode am ON am.school_id = a.school_id AND am.assignment_id = a.assignment_id
           WHERE a.school_id = $1 AND a.class_id = ANY($2::uuid[])
           GROUP BY a.school_id, a.assignment_id, cl.label
           ORDER BY a.created_at DESC`,
          [auth.schoolId, classIds]
        )
      : { rows: [] };

  return (
    <>
      <AppHeader variant="teacher" locale={locale} auth={auth} />
      <div className="mx-auto flex w-full max-w-[1480px] flex-1 flex-col lg:flex-row">
        <TeacherSidebar active="assignments" locale={locale} schoolName={auth.schoolName} />

        <main id="main-content" className="flex-1 space-y-6 px-4 py-8 sm:px-8 lg:px-10">
          <div>
            <div className="g1-eyebrow">{dict.teacher.workspaceEyebrow}</div>
            <h1 className="mt-2.5 text-3xl font-extrabold tracking-tight text-[#0c2444]">
              {dict.teacher.assignmentsHeading}
            </h1>
          </div>

          <AssignmentBuilder
            classes={classesRes.rows.map((c) => ({
              classId: c.class_id,
              label: c.label,
              grade: c.grade,
            }))}
            experiments={experiments}
          />

          <section className="g1-card overflow-hidden">
            <div className="border-b border-[#e8f0f5] px-6 py-4">
              <h2 className="text-lg font-extrabold text-[#0c2444]">Published class assignments</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="bg-[#f2f8fc] text-[11px] font-bold uppercase tracking-wider text-[#4b637a]">
                    <th className="px-6 py-3">Class</th>
                    <th className="px-4 py-3">Experiment</th>
                    <th className="px-4 py-3">Rubric</th>
                    <th className="px-4 py-3">Modes</th>
                    <th className="px-4 py-3">Attempts</th>
                    <th className="px-6 py-3">Due</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e8f0f5]">
                  {existingRes.rows.map((row) => (
                    <tr key={row.assignment_id}>
                      <td className="px-6 py-3.5 font-semibold text-[#0c2444]">{row.class_label}</td>
                      <td className="px-4 py-3.5">
                        <div className="font-bold text-[#0c2444]">
                          {getExperimentCopy(row.experiment_id, locale).shortTitle}
                        </div>
                        <div className="font-mono text-xs text-[#4b637a]">
                          {row.experiment_id} · v{row.content_version}
                        </div>
                      </td>
                      <td className="px-4 py-3.5 font-mono text-xs text-[#4b637a]">{row.rubric_id}</td>
                      <td className="px-4 py-3.5">
                        <div className="flex flex-wrap gap-1.5">
                          {row.modes.map((m) => (
                            <span
                              key={m}
                              className={`g1-tag ${m === "experiment" ? "g1-tag-green" : "g1-tag-blue"}`}
                            >
                              {m === "experiment" ? dict.common.experiment : dict.common.simulation}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-[#133354]">{row.max_attempts}</td>
                      <td className="px-6 py-3.5 text-xs text-[#4b637a]">
                        {row.due_at ? new Date(row.due_at).toLocaleDateString("en-IN") : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
