"use client";

import Link from "next/link";
import {
  ArrowRight,
  Atom,
  CheckCircle2,
  ClipboardList,
  Clock,
  FlaskConical,
  HelpCircle,
  Home,
  Leaf,
  BarChart3,
} from "lucide-react";
import { getDictionary, getExperimentCopy } from "@/lib/i18n";
import type { LabSubject, Locale } from "@/lib/types";

export interface StudentDashboardData {
  activeSessions: Array<{
    sessionId: string;
    attemptId: string;
    experimentId: string;
    contentVersion: string;
    mode: "simulation" | "experiment";
    revision: number;
    stepIndex: number;
    totalSteps: number;
    savedAt: string;
    subject: LabSubject;
    title: string;
    grade: number;
  }>;
  assignments: Array<{
    assignmentId: string;
    classId: string;
    classLabel: string;
    experimentId: string;
    contentVersion: string;
    rubricId: string;
    dueAt: string | null;
    maxAttempts: number;
    subject: LabSubject;
    title: string;
    grade: number;
    modes: string[];
    activeSessionId: string | null;
    submittedAttempts: number;
    status: "not_started" | "in_progress" | "submitted";
  }>;
  results: Array<{
    assessmentId: string;
    attemptId: string;
    experimentId: string;
    contentVersion: string;
    mode: "simulation" | "experiment";
    subject: LabSubject;
    rubricId: string;
    gradeState: string;
    criteriaPassed: number;
    criteriaTotal: number;
    evidenceCount: number;
    summary: string;
    submittedAt: string;
  }>;
  progressBySubject: Record<LabSubject, number>;
}

interface StudentDashboardClientProps {
  data: StudentDashboardData;
  locale: Locale;
  displayName: string;
  schoolName: string | null;
}

export function StudentDashboardClient({
  data,
  locale,
  displayName,
  schoolName,
}: StudentDashboardClientProps) {
  const dict = getDictionary(locale);
  const resume = data.activeSessions[0] ?? null;

  const subjectIcon = (subject: LabSubject) =>
    subject === "chemistry" ? (
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#e4f4ff] text-[#0663ab]" aria-hidden="true">
        <FlaskConical className="h-5 w-5" />
      </div>
    ) : subject === "physics" ? (
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#e4f4ff] text-[#0663ab]" aria-hidden="true">
        <Atom className="h-5 w-5" />
      </div>
    ) : (
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#e0f8ee] text-[#046c49]" aria-hidden="true">
        <Leaf className="h-5 w-5" />
      </div>
    );

  return (
    <div className="mx-auto flex w-full max-w-[1480px] flex-1 flex-col lg:flex-row">
      {/* Narrow clean sidebar matching 04_Student_Dashboard.png */}
      <aside
        aria-label={dict.student.sidebarHeading}
        className="border-b border-[#dfebf3] bg-white px-4 py-5 lg:w-[248px] lg:shrink-0 lg:border-b-0 lg:border-r"
      >
        <div className="px-3 pb-4">
          <div className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#007875]">
            {dict.student.workspaceEyebrow}
          </div>
          <h2 className="mt-2 text-lg font-extrabold text-[#0c2444]">
            {dict.student.sidebarHeading}
          </h2>
          {schoolName && (
            <p className="mt-1 text-xs text-[#4b637a]">{schoolName}</p>
          )}
        </div>
        <nav aria-label="Student sections" className="flex flex-wrap gap-1.5 lg:flex-col">
          <a
            href="#top"
            className="flex items-center gap-3 rounded-xl bg-[#e9f8fb] px-3.5 py-3 text-sm font-bold text-[#006d7a]"
          >
            <Home className="h-4 w-4" aria-hidden="true" />
            <span>{dict.nav.dashboard}</span>
          </a>
          <a
            href="#assignments"
            className="flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-bold text-[#3f5d75] hover:bg-[#f2f8fc]"
          >
            <ClipboardList className="h-4 w-4" aria-hidden="true" />
            <span>{dict.nav.assignments}</span>
          </a>
          <a
            href="#progress"
            className="flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-bold text-[#3f5d75] hover:bg-[#f2f8fc]"
          >
            <Clock className="h-4 w-4" aria-hidden="true" />
            <span>{dict.student.progressHeading}</span>
          </a>
          <a
            href="#results"
            className="flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-bold text-[#3f5d75] hover:bg-[#f2f8fc]"
          >
            <BarChart3 className="h-4 w-4" aria-hidden="true" />
            <span>{dict.nav.results}</span>
          </a>
          <Link
            href="/help"
            className="flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-bold text-[#3f5d75] hover:bg-[#f2f8fc]"
          >
            <HelpCircle className="h-4 w-4" aria-hidden="true" />
            <span>{dict.nav.help}</span>
          </Link>
        </nav>
      </aside>

      {/* Main student content */}
      <main id="main-content" className="flex-1 px-4 py-8 sm:px-8 lg:px-10">
        <div id="top" className="g1-eyebrow">{dict.student.workspaceEyebrow}</div>
        <h1 className="mt-2.5 text-3xl font-extrabold tracking-tight text-[#0c2444] sm:text-[38px]">
          {dict.student.welcomeHeading}
        </h1>
        <p className="mt-1.5 text-sm text-[#4b637a]">
          {displayName} · {dict.student.welcomeSub}
        </p>

        {/* Dominant Resume Hero Card matching 04_Student_Dashboard.png */}
        {resume ? (
          <section
            aria-label="Resume practical"
            className="g1-card mt-6 flex flex-col gap-6 overflow-hidden p-5 md:flex-row md:items-center"
            style={{ background: "linear-gradient(106deg, #effaff 0%, #ffffff 70%)" }}
          >
            <div className="h-[180px] w-full shrink-0 overflow-hidden rounded-2xl bg-[#e8f7fc] md:w-[340px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={getExperimentCopy(resume.experimentId, locale).imagePath}
                alt={getExperimentCopy(resume.experimentId, locale).title}
                className="h-full w-full object-contain"
              />
            </div>
            <div className="flex-1">
              <span
                className={`g1-tag ${resume.mode === "experiment" ? "g1-tag-green" : "g1-tag-blue"}`}
              >
                {resume.mode === "experiment"
                  ? dict.student.continueTagExp
                  : dict.student.continueTagSim}
              </span>
              <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-[#0c2444]">
                {getExperimentCopy(resume.experimentId, locale).activityLabel} —{" "}
                {getExperimentCopy(resume.experimentId, locale).shortTitle}
              </h2>
              <p className="mt-1.5 text-sm text-[#4b637a]">
                Step {Math.min(resume.totalSteps, resume.stepIndex + 1)} of {resume.totalSteps} ·{" "}
                {dict.player.savedAtRevision} {resume.revision}
              </p>
              <div className="g1-progress mt-4 max-w-[420px]">
                <span
                  className={`g1-progress-bar ${resume.mode === "experiment" ? "g1-progress-bar-green" : ""}`}
                  style={{
                    width: `${Math.min(100, Math.max(20, Math.round(((resume.stepIndex + 1) / Math.max(1, resume.totalSteps)) * 100)))}%`,
                  }}
                />
              </div>
              <div className="mt-5">
                <Link
                  href={`/player/${resume.sessionId}`}
                  className={`g1-btn ${resume.mode === "experiment" ? "g1-btn-green" : "g1-btn-blue"}`}
                  data-testid="student-resume-cta"
                >
                  <span>{dict.student.resumeCta}</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </section>
        ) : (
          <section className="g1-card mt-6 flex flex-wrap items-center justify-between gap-4 p-6">
            <div>
              <h2 className="text-xl font-extrabold text-[#0c2444]">
                Ready to start a new practical
              </h2>
              <p className="mt-1 text-sm text-[#4b637a]">
                Open an assigned practical below or browse Chemistry, Physics and Biology laboratories.
              </p>
            </div>
            <Link href="/laboratories" className="g1-btn g1-btn-teal">
              <span>{dict.home.exploreLabsCta}</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </section>
        )}

        {/* 2-Column Grid: Upcoming Assignments + My Progress */}
        <div className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-12">
          <section
            id="assignments"
            aria-labelledby="upcoming-heading"
            className="g1-card p-6 xl:col-span-7"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 id="upcoming-heading" className="text-xl font-extrabold text-[#0c2444]">
                {dict.student.upcomingHeading}
              </h2>
              <Link
                href="/laboratories"
                className="inline-flex items-center gap-1 text-xs font-extrabold text-[#007875] hover:underline"
              >
                <span>{dict.home.browseAll}</span>
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </div>

            {data.assignments.length === 0 ? (
              <p className="mt-5 text-sm text-[#4b637a]">No class assignments published yet.</p>
            ) : (
              <ul className="mt-4 divide-y divide-[#e7eff5]">
                {data.assignments.map((asg) => {
                  const copy = getExperimentCopy(asg.experimentId, locale);
                  const statusLabel =
                    asg.status === "submitted"
                      ? dict.student.submitted
                      : asg.status === "in_progress"
                        ? dict.student.inProgress
                        : dict.student.notStarted;
                  const targetHref = asg.activeSessionId
                    ? `/player/${asg.activeSessionId}`
                    : `/experiments/${asg.experimentId}?assignmentId=${asg.assignmentId}`;

                  return (
                    <li
                      key={asg.assignmentId}
                      className="flex flex-col justify-between gap-3 py-4 sm:flex-row sm:items-center"
                    >
                      <div className="flex min-w-0 flex-1 items-center gap-3.5">
                        {subjectIcon(asg.subject)}
                        <div className="min-w-0">
                          <h3 className="truncate text-sm font-extrabold text-[#0c2444]">
                            {copy.shortTitle}
                          </h3>
                          <p className="mt-0.5 text-xs text-[#4b637a]">
                            {dict.subjects[asg.subject].name} · {dict.common.classWord} {asg.grade}
                            {asg.dueAt ? ` · Due ${new Date(asg.dueAt).toLocaleDateString("en-IN")}` : ""}
                          </p>
                        </div>
                      </div>
                      <div className="flex shrink-0 items-center gap-3">
                        <span
                          className={`g1-tag ${
                            asg.status === "submitted"
                              ? "g1-tag-green"
                              : asg.status === "in_progress"
                                ? "g1-tag-blue"
                                : ""
                          }`}
                        >
                          {statusLabel}
                        </span>
                        <Link
                          href={targetHref}
                          className="inline-flex items-center gap-1 text-xs font-extrabold text-[#007875] hover:underline"
                        >
                          <span>{asg.activeSessionId ? dict.student.resumeCta : dict.student.viewAction}</span>
                          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                        </Link>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>

          <section
            id="progress"
            aria-labelledby="progress-heading"
            className="g1-card p-6 xl:col-span-5"
          >
            <h2 id="progress-heading" className="text-xl font-extrabold text-[#0c2444]">
              {dict.student.progressHeading}
            </h2>
            <p className="mt-1 text-xs text-[#4b637a]">{dict.student.progressSub}</p>

            <div className="mt-6 space-y-5">
              {(["chemistry", "physics", "biology"] as const).map((subj) => {
                const pct = data.progressBySubject[subj];
                return (
                  <div key={subj}>
                    <div className="mb-2 flex justify-between text-xs font-bold text-[#0c2444]">
                      <span>{dict.subjects[subj].name}</span>
                      <span>{pct}%</span>
                    </div>
                    <div
                      className="g1-progress"
                      role="progressbar"
                      aria-valuenow={pct}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={`${dict.subjects[subj].name} progress`}
                    >
                      <span
                        className={`g1-progress-bar ${subj === "biology" ? "g1-progress-bar-green" : ""}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        {/* Submitted rubric results section */}
        <section id="results" aria-labelledby="results-heading" className="g1-card mt-6 p-6">
          <h2 id="results-heading" className="text-xl font-extrabold text-[#0c2444]">
            {dict.student.resultsHeading}
          </h2>
          {data.results.length === 0 ? (
            <p className="mt-3 text-sm text-[#4b637a]">
              No submitted assessments yet. Complete a practical and submit your confirmed observations
              to see server-evaluated rubric feedback here.
            </p>
          ) : (
            <div className="mt-4 divide-y divide-[#e8f0f5]">
              {data.results.map((r) => (
                <div key={r.assessmentId} className="flex flex-wrap items-center justify-between gap-4 py-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#046c49]" aria-hidden="true" />
                      <strong className="text-sm text-[#0c2444]">
                        {getExperimentCopy(r.experimentId, locale).shortTitle}
                      </strong>
                      <span className={`g1-tag ${r.mode === "experiment" ? "g1-tag-green" : "g1-tag-blue"}`}>
                        {r.mode === "experiment" ? dict.common.experiment : dict.common.simulation}
                      </span>
                      <span className="g1-tag">{r.rubricId}</span>
                    </div>
                    <p className="mt-1 text-xs text-[#4b637a]">{r.summary}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-extrabold text-[#046c49]">
                      {r.criteriaPassed} / {r.criteriaTotal} criteria
                    </div>
                    <div className="text-xs text-[#4b637a]">
                      {r.evidenceCount} confirmed evidence · {new Date(r.submittedAt).toLocaleDateString("en-IN")}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <p className="mt-6 text-xs text-[#5a7288]">{dict.student.syntheticNotice}</p>
      </main>
    </div>
  );
}
