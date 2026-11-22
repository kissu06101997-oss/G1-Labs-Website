import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, FileCheck2 } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { TeacherSidebar } from "@/components/TeacherSidebar";
import { getCurrentSession, getRequestLocale } from "@/lib/auth";
import { query } from "@/lib/db";
import { getDictionary, getExperimentCopy } from "@/lib/i18n";

export default async function TeacherDashboardPage() {
  const [auth, locale] = await Promise.all([getCurrentSession(), getRequestLocale()]);
  if (!auth) redirect("/sign-in?next=/teacher&role=teacher");
  if (auth.role !== "teacher" || !auth.schoolId) {
    redirect(auth.role === "student" ? "/student" : "/admin");
  }

  const dict = getDictionary(locale);

  const classesRes = await query<{
    class_id: string;
    label: string;
    grade: number;
    enrolled_learners: string;
    assigned_practicals: string;
    submitted_assessments: string;
  }>(
    `SELECT
       cl.class_id, cl.label, cl.grade,
       (SELECT count(*)::text FROM enrollment e WHERE e.school_id = cl.school_id AND e.class_id = cl.class_id AND e.withdrawn_at IS NULL) AS enrolled_learners,
       (SELECT count(*)::text FROM assignment a WHERE a.school_id = cl.school_id AND a.class_id = cl.class_id) AS assigned_practicals,
       (SELECT count(*)::text FROM assessment asm JOIN attempt att ON att.school_id = asm.school_id AND att.attempt_id = asm.attempt_id WHERE asm.school_id = cl.school_id AND att.class_id = cl.class_id AND asm.supersedes_id IS NULL) AS submitted_assessments
     FROM classroom cl
     JOIN class_teacher ct ON ct.school_id = cl.school_id AND ct.class_id = cl.class_id
     WHERE cl.school_id = $1 AND ct.principal_id = $2
     ORDER BY cl.grade DESC, cl.label ASC`,
    [auth.schoolId, auth.principalId]
  );

  const primaryClass = classesRes.rows[0] ?? null;

  const assignmentsRes = primaryClass
    ? await query<{
        assignment_id: string;
        experiment_id: string;
        content_version: string;
        due_at: Date | null;
        modes: string[];
        submissions: string;
      }>(
        `SELECT
           a.assignment_id, a.experiment_id, a.content_version, a.due_at,
           ARRAY_AGG(DISTINCT am.mode::text ORDER BY am.mode::text) AS modes,
           (
             SELECT count(DISTINCT asm.attempt_id)::text
             FROM assessment asm
             JOIN attempt att ON att.school_id = asm.school_id AND att.attempt_id = asm.attempt_id
             WHERE asm.school_id = a.school_id AND att.assignment_id = a.assignment_id AND asm.supersedes_id IS NULL
           ) AS submissions
         FROM assignment a
         JOIN assignment_mode am ON am.school_id = a.school_id AND am.assignment_id = a.assignment_id
         WHERE a.school_id = $1 AND a.class_id = $2
         GROUP BY a.school_id, a.assignment_id
         ORDER BY a.created_at DESC`,
        [auth.schoolId, primaryClass.class_id]
      )
    : { rows: [] };

  const enrolledCount = Number(primaryClass?.enrolled_learners ?? 0);

  return (
    <>
      <AppHeader variant="teacher" locale={locale} auth={auth} />

      <div className="mx-auto flex w-full max-w-[1480px] flex-1 flex-col lg:flex-row">
        <TeacherSidebar active="classes" locale={locale} schoolName={auth.schoolName} />

        <main id="main-content" className="flex-1 px-4 py-8 sm:px-8 lg:px-10">
          <div className="g1-eyebrow">{dict.teacher.workspaceEyebrow}</div>

          <div className="mt-2.5 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-[#0c2444] sm:text-[38px]">
                {primaryClass ? primaryClass.label : "No assigned classes"}
              </h1>
              <p className="mt-1.5 text-sm text-[#4b637a]">{dict.teacher.subtitle}</p>
            </div>
            <Link
              href="/teacher/assignments"
              className="g1-btn g1-btn-teal min-h-[48px] px-6"
              data-testid="teacher-assign-cta"
            >
              {dict.teacher.assignCta}
            </Link>
          </div>

          {/* 3 Clean Real-Data KPI Cards matching 05_Teacher_Dashboard.png */}
          <div className="mt-7 grid grid-cols-1 gap-5 sm:grid-cols-3">
            <div className="g1-card p-5">
              <div className="text-xs font-bold text-[#4b637a]">{dict.teacher.enrolledLearners}</div>
              <div className="mt-2 text-4xl font-extrabold tracking-tight text-[#0c2444]">
                {enrolledCount}
              </div>
            </div>
            <div className="g1-card p-5">
              <div className="text-xs font-bold text-[#4b637a]">{dict.teacher.assignedPracticals}</div>
              <div className="mt-2 text-4xl font-extrabold tracking-tight text-[#0c2444]">
                {Number(primaryClass?.assigned_practicals ?? 0)}
              </div>
            </div>
            <div className="g1-card p-5">
              <div className="text-xs font-bold text-[#4b637a]">{dict.teacher.submissionsCount}</div>
              <div className="mt-2 text-4xl font-extrabold tracking-tight text-[#0c2444]">
                {Number(primaryClass?.submitted_assessments ?? 0)}
              </div>
            </div>
          </div>

          {/* Assignments table matching 05_Teacher_Dashboard.png (responsive stacked on mobile) */}
          <section aria-labelledby="teacher-assignments-heading" className="g1-card mt-6 overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-5">
              <div>
                <h2 id="teacher-assignments-heading" className="text-xl font-extrabold text-[#0c2444]">
                  {dict.teacher.assignmentsHeading}
                </h2>
                <p className="mt-1 text-xs text-[#4b637a]">{dict.teacher.assignmentsSub}</p>
              </div>
              {primaryClass && <span className="g1-tag">{primaryClass.label}</span>}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="bg-[#f2f8fc] text-[11px] font-bold uppercase tracking-wider text-[#4b637a]">
                    <th className="px-6 py-3">Experiment</th>
                    <th className="px-4 py-3">Mode</th>
                    <th className="px-4 py-3">Submissions</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-6 py-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e8f0f5] text-sm">
                  {assignmentsRes.rows.map((asg) => {
                    const copy = getExperimentCopy(asg.experiment_id, locale);
                    const subCount = Number(asg.submissions);
                    return (
                      <tr key={asg.assignment_id}>
                        <td className="px-6 py-4">
                          <div className="font-bold text-[#0c2444]">
                            {copy.activityLabel} · {copy.shortTitle}
                          </div>
                          <div className="text-xs text-[#4b637a]">v{asg.content_version}</div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex flex-wrap gap-1.5">
                            {asg.modes.map((m) => (
                              <span
                                key={m}
                                className={`g1-tag ${m === "experiment" ? "g1-tag-green" : "g1-tag-blue"}`}
                              >
                                {m === "experiment" ? dict.common.experiment : dict.common.simulation}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-4 font-semibold text-[#133354]">
                          {subCount} / {enrolledCount}
                        </td>
                        <td className="px-4 py-4">
                          <span className="g1-tag">
                            {subCount > 0 ? "In progress" : "Assigned"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <Link
                            href={`/teacher/reports?classId=${primaryClass?.class_id}`}
                            className="inline-flex items-center gap-1 text-xs font-extrabold text-[#007875] hover:underline"
                          >
                            <span>{subCount > 0 ? "Review" : "Details"}</span>
                            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          {/* Evidence-based reports banner matching 05_Teacher_Dashboard.png */}
          <section className="g1-card mt-5 flex flex-wrap items-center justify-between gap-4 p-6">
            <div className="flex items-center gap-4">
              <div
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#e4f4ff] text-[#0663ab]"
                aria-hidden="true"
              >
                <FileCheck2 className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-lg font-extrabold text-[#0c2444]">
                  {dict.teacher.evidenceReportsHeading}
                </h2>
                <p className="mt-1 text-sm text-[#4b637a]">{dict.teacher.evidenceReportsDesc}</p>
              </div>
            </div>
            <Link
              href={primaryClass ? `/teacher/reports?classId=${primaryClass.class_id}` : "/teacher/reports"}
              className="g1-btn g1-btn-outline"
            >
              <span>{dict.teacher.openClassReport}</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </section>

          <p className="mt-6 text-xs text-[#5a7288]">{dict.teacher.syntheticNotice}</p>
        </main>
      </div>
    </>
  );
}
