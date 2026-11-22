import Link from "next/link";
import { notFound } from "next/navigation";
import { AppFooter } from "@/components/AppFooter";
import { AppHeader } from "@/components/AppHeader";
import { ModeLauncher } from "@/components/ModeLauncher";
import { getCurrentSession, getRequestLocale } from "@/lib/auth";
import { getExperimentById } from "@/lib/catalog";
import { getDictionary, getExperimentCopy } from "@/lib/i18n";

export default async function ExperimentDetailPage(props: {
  params: Promise<{ experimentId: string }>;
  searchParams: Promise<{ assignmentId?: string }>;
}) {
  const [{ experimentId }, auth, locale, sp] = await Promise.all([
    props.params,
    getCurrentSession(),
    getRequestLocale(),
    props.searchParams,
  ]);

  const exp = await getExperimentById(experimentId);
  if (!exp) {
    notFound();
  }

  const dict = getDictionary(locale);
  const copy = getExperimentCopy(exp.experimentId, locale);
  const subjName = dict.subjects[exp.subject].name;
  const courseBadge =
    exp.subject === "biology" ? "AP Biological Science" : "AP Physical Science";

  return (
    <>
      <AppHeader variant="public" locale={locale} auth={auth} />

      <main id="main-content" className="mx-auto w-full max-w-[1480px] flex-1 px-4 pb-14 pt-7 sm:px-8 lg:px-14">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-xs font-semibold text-[#4b637a]">
          <Link href="/laboratories" className="hover:text-[#007875] hover:underline">
            {dict.nav.laboratories}
          </Link>
          <span aria-hidden="true">›</span>
          <Link href={`/laboratories/${exp.subject}`} className="hover:text-[#007875] hover:underline">
            {subjName}
          </Link>
          <span aria-hidden="true">›</span>
          <span className="text-[#0c2444]">{copy.activityLabel}</span>
        </nav>

        {/* Top 2-column hero matching 03_Experiment_Detail.png */}
        <section className="mt-5 grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="g1-eyebrow">
              {dict.common.classWord} {exp.grade} · {subjName}
            </div>
            <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-[#0c2444] sm:text-[41px] sm:leading-[1.12]">
              {copy.title}
            </h1>
            <p className="mt-4 text-[15px] leading-relaxed text-[#4b637a]">
              {copy.subtitle}
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              <span className="g1-tag">{courseBadge}</span>
              <span className="g1-tag">{dict.detail.editionPendingBadge}</span>
              <span className="g1-tag">v{exp.contentVersion}</span>
            </div>

            <div className="g1-hint mt-5">
              {dict.detail.scopeNotice}
            </div>
          </div>

          <div className="lg:col-span-7">
            <div
              className="g1-card flex h-[280px] items-center justify-center overflow-hidden p-3 sm:h-[348px]"
              style={{ background: "linear-gradient(135deg, #eefaff 0%, #dceef9 100%)" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={copy.imagePath}
                alt={`${copy.title} — apparatus concept diagram (not to scale)`}
                className="h-full w-full rounded-2xl object-contain"
              />
            </div>
          </div>
        </section>

        {/* Two-mode chooser (Blue Simulation vs Green Experiment) */}
        <ModeLauncher
          experimentId={exp.experimentId}
          labId={exp.labId}
          contentVersion={exp.contentVersion}
          manifestSha256={exp.manifestSha256}
          engineAbi={exp.engineAbi}
          publicationStatus={exp.publicationStatus}
          locale={locale}
          isSignedIn={Boolean(auth)}
          canLaunch={auth?.role === "student" || auth?.role === "teacher"}
          assignmentId={sp.assignmentId ?? null}
        />

        {/* Bottom 3-column summary card matching 03_Experiment_Detail.png */}
        <section
          aria-label="Experiment summary"
          className="g1-card mt-6 grid grid-cols-1 gap-6 p-6 md:grid-cols-3"
        >
          <div>
            <h2 className="text-sm font-extrabold text-[#0c2444]">{dict.detail.objectiveHeading}</h2>
            <p className="mt-2 text-sm leading-relaxed text-[#4b637a]">
              {exp.learningObjectives.join(" ")}
            </p>
          </div>
          <div>
            <h2 className="text-sm font-extrabold text-[#0c2444]">{dict.detail.apparatusHeading}</h2>
            <p className="mt-2 text-sm leading-relaxed text-[#4b637a]">
              {copy.apparatusText}
            </p>
          </div>
          <div>
            <h2 className="text-sm font-extrabold text-[#0c2444]">{dict.detail.safetyHeading}</h2>
            <p className="mt-2 text-sm leading-relaxed text-[#4b637a]">
              {exp.safetyRules.join(" ")}
            </p>
          </div>
        </section>

        {/* Progressive disclosure for provenance, manifest digest & accessibility */}
        <details className="g1-card mt-4 p-5">
          <summary className="cursor-pointer text-sm font-bold text-[#1a3b59]">
            {dict.detail.provenanceToggle}
          </summary>
          <dl className="mt-4 grid grid-cols-1 gap-4 text-xs sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <dt className="font-bold text-[#4b637a]">Experiment ID</dt>
              <dd className="mt-1 font-mono text-[#0c2444]">{exp.experimentId}</dd>
            </div>
            <div>
              <dt className="font-bold text-[#4b637a]">Science Model ID</dt>
              <dd className="mt-1 font-mono text-[#0c2444]">{exp.scienceModelIds.join(", ")}</dd>
            </div>
            <div>
              <dt className="font-bold text-[#4b637a]">Source Edition Reference</dt>
              <dd className="mt-1 text-[#0c2444]">
                {exp.curriculumReferences.map((r) => `${r.sourceId}: ${r.locator}`).join("; ")}
              </dd>
            </div>
            <div>
              <dt className="font-bold text-[#4b637a]">Pinned Manifest SHA-256</dt>
              <dd className="mt-1 break-all font-mono text-[11px] text-[#0c2444]">
                {exp.manifestSha256}
              </dd>
            </div>
          </dl>
        </details>
      </main>

      <AppFooter locale={locale} />
    </>
  );
}
