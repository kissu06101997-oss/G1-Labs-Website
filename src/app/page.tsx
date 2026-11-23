import Link from "next/link";
import { ArrowRight, CheckCircle2, MonitorCheck, SlidersHorizontal } from "lucide-react";
import { AppFooter } from "@/components/AppFooter";
import { AppHeader } from "@/components/AppHeader";
import { EducationStageRail } from "@/components/EducationStageRail";
import { getCurrentSession, getRequestLocale } from "@/lib/auth";
import { listCatalogExperiments } from "@/lib/catalog";
import { formatStageLabel } from "@/lib/education-stages";
import { getDictionary, getExperimentCopy } from "@/lib/i18n";

export default async function HomePage() {
  const [auth, locale, allExperiments] = await Promise.all([
    getCurrentSession(),
    getRequestLocale(),
    listCatalogExperiments(),
  ]);

  const dict = getDictionary(locale);
  const isTe = locale === "te-IN";

  // Featured practicals: the 3 locally launchable practicals (Chemistry, Physics, Biology)
  const featured = allExperiments
    .filter((e) => e.publicationStatus !== "review_pending")
    .slice(0, 3);

  return (
    <>
      <AppHeader variant="public" locale={locale} auth={auth} />

      <main
        id="main-content"
        className="mx-auto w-full max-w-[1440px] flex-1 px-4 pb-16 pt-5 sm:px-6 lg:px-12"
      >
        {/* 7-Stage Raised Dimensional Class Selector Rail (Classes 6–10 + Intermediate 1st & 2nd Year) */}
        <EducationStageRail locale={locale} selectedGrade={10} hrefBase="/laboratories" />

        {/* Layered Premium Science Hero matching 00 & 01 Visual Guidance */}
        <section
          aria-labelledby="hero-heading"
          className="mt-6 grid grid-cols-1 overflow-hidden rounded-[28px] border border-[#d6e6f0] shadow-[0_18px_42px_rgba(12,36,68,0.08)] lg:grid-cols-12"
          style={{
            background: "linear-gradient(102deg, #fcffff 0%, #f3fbff 52%, #e3f2f8 100%)",
          }}
        >
          <div className="flex flex-col justify-center p-6 sm:p-9 lg:col-span-5 lg:p-11">
            <div className="g1-eyebrow">{dict.home.eyebrow}</div>
            <h1
              id="hero-heading"
              className="mt-4 text-4xl font-extrabold tracking-tight text-[#0c2444] sm:text-[50px] sm:leading-[1.06]"
            >
              {isTe ? (
                <>
                  అనుభూతి చెందే <span className="text-[#007875]">సైన్స్ ప్రయోగశాల.</span>
                </>
              ) : (
                <>
                  Science you can <span className="text-[#007875]">experience.</span>
                </>
              )}
            </h1>
            <p className="mt-4 max-w-[490px] text-[15px] leading-relaxed text-[#38546c] sm:text-base">
              {dict.home.heroSubtitle}
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link
                href="/laboratories"
                className="g1-btn g1-btn-teal min-h-[48px] px-6 text-[15px]"
                data-testid="hero-explore-cta"
              >
                <span>{dict.home.exploreLabsCta}</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href="/help"
                className="g1-btn g1-btn-outline min-h-[48px] px-5 text-sm"
              >
                <span>{isTe ? "ప్రయోగశాలలు ఎలా పనిచేస్తాయి" : "How the labs work"}</span>
              </Link>
            </div>

            <ul className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-bold text-[#38546c]">
              <li className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#0663ab]" aria-hidden="true" />
                <span>{isTe ? "మార్గదర్శక అభ్యాసం" : "Guided learning"}</span>
              </li>
              <li className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#046c49]" aria-hidden="true" />
                <span>{isTe ? "పరిమిత శాస్త్రీయ పరిశోధన" : "Bounded inquiry"}</span>
              </li>
              <li className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#007875]" aria-hidden="true" />
                <span>{isTe ? "ఇంగ్లీష్ & తెలుగు" : "English & Telugu"}</span>
              </li>
            </ul>
          </div>

          <div className="relative min-h-[260px] bg-[#d8ecf5] sm:min-h-[340px] lg:col-span-7 lg:min-h-[400px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/labs/hero_laboratory.png"
              alt={
                isTe
                  ? "రసాయన ఫ్లాస్క్‌లు, ఆప్టికల్ ప్రిజం, సూక్ష్మదర్శిని మరియు వృక్ష కణ నిర్మాణంతో కూడిన G1 Virtua Labs సైన్స్ వేదిక"
                  : "G1 Virtua Labs interactive science scene featuring chemistry glassware, glass refraction prism, plant cell specimen and compound microscope"
              }
              className="h-full w-full object-cover object-center"
            />
            <span className="absolute bottom-4 right-4 rounded-xl border border-white/80 bg-white/90 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#175c6e] shadow-xs backdrop-blur-xs">
              {isTe
                ? "ఇంటరాక్టివ్ సైన్స్ అనుభవం · నమూనా దృశ్యం"
                : "INTERACTIVE SCIENCE EXPERIENCE · CONCEPT SCENE"}
            </span>
          </div>
        </section>

        {/* Three Subject Discipline Cards matching 00 & 01 Visual Guidance */}
        <section aria-labelledby="subjects-heading" className="mt-9">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <h2
              id="subjects-heading"
              className="text-2xl font-extrabold tracking-tight text-[#0c2444]"
            >
              {isTe ? "సైన్స్ విభాగాలను అన్వేషించండి" : "Explore science disciplines"}
            </h2>
            <Link
              href="/laboratories"
              className="inline-flex items-center gap-1 text-xs font-extrabold text-[#007875] hover:underline"
            >
              <span>
                {isTe ? "రసాయన, భౌతిక & జీవ శాస్త్రాలు" : "Chemistry, Physics & Biology"}
              </span>
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            {/* Chemistry */}
            <Link
              href="/laboratories/chemistry"
              className="g1-card group flex min-h-[152px] items-center justify-between gap-4 overflow-hidden p-5 transition-transform duration-150 hover:-translate-y-0.5"
              style={{ background: "linear-gradient(112deg, #ebfaff 0%, #e4f4fb 100%)" }}
              data-testid="home-subject-chemistry"
            >
              <div className="min-w-0 flex-1">
                <h3 className="text-xl font-extrabold text-[#0c2444]">
                  {dict.subjects.chemistry.name}
                </h3>
                <p className="mt-1 text-sm text-[#38546c]">{dict.subjects.chemistry.shortDesc}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-xs font-extrabold text-[#007875] group-hover:underline">
                  <span>{dict.home.exploreAction}</span>
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </span>
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/labs/chemistry.png"
                alt=""
                aria-hidden="true"
                className="h-[104px] w-[124px] shrink-0 object-contain mix-blend-multiply drop-shadow-sm"
              />
            </Link>

            {/* Physics */}
            <Link
              href="/laboratories/physics"
              className="g1-card group flex min-h-[152px] items-center justify-between gap-4 overflow-hidden p-5 transition-transform duration-150 hover:-translate-y-0.5"
              style={{ background: "linear-gradient(112deg, #f3f1ff 0%, #eaf4ff 100%)" }}
              data-testid="home-subject-physics"
            >
              <div className="min-w-0 flex-1">
                <h3 className="text-xl font-extrabold text-[#0c2444]">
                  {dict.subjects.physics.name}
                </h3>
                <p className="mt-1 text-sm text-[#38546c]">{dict.subjects.physics.shortDesc}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-xs font-extrabold text-[#007875] group-hover:underline">
                  <span>{dict.home.exploreAction}</span>
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </span>
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/labs/physics.png"
                alt=""
                aria-hidden="true"
                className="h-[104px] w-[124px] shrink-0 object-contain mix-blend-multiply drop-shadow-sm"
              />
            </Link>

            {/* Biology */}
            <Link
              href="/laboratories/biology"
              className="g1-card group flex min-h-[152px] items-center justify-between gap-4 overflow-hidden p-5 transition-transform duration-150 hover:-translate-y-0.5"
              style={{ background: "linear-gradient(112deg, #e8fbf0 0%, #f3fff6 100%)" }}
              data-testid="home-subject-biology"
            >
              <div className="min-w-0 flex-1">
                <h3 className="text-xl font-extrabold text-[#0c2444]">
                  {dict.subjects.biology.name}
                </h3>
                <p className="mt-1 text-sm text-[#38546c]">{dict.subjects.biology.shortDesc}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-xs font-extrabold text-[#007875] group-hover:underline">
                  <span>{dict.home.exploreAction}</span>
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </span>
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/labs/biology.png"
                alt=""
                aria-hidden="true"
                className="h-[104px] w-[124px] shrink-0 object-contain mix-blend-multiply drop-shadow-sm"
              />
            </Link>
          </div>
        </section>

        {/* Two Non-Clickable Explanatory Mode Banners (Blue = Simulation, Green = Experiment) */}
        <section
          aria-label={isTe ? "రెండు అభ్యాస మోడ్‌లు" : "Two learning modes explained"}
          className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2"
        >
          <div className="g1-mode-blue flex items-center gap-4 p-5 sm:p-6">
            <div
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-b from-[#2f97e3] to-[#0663ab] text-white shadow-[0_4px_0_#044175]"
              aria-hidden="true"
            >
              <MonitorCheck className="h-7 w-7" strokeWidth={2.2} />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-extrabold text-[#0663ab]">{dict.home.simModeTitle}</h2>
                <span className="g1-tag g1-tag-blue">
                  {isTe ? "మార్గదర్శక మోడ్ · Blue" : "Guided · Blue"}
                </span>
              </div>
              <p className="mt-1 text-sm leading-relaxed text-[#2d4d67]">
                {dict.home.simModeDesc}
              </p>
            </div>
          </div>

          <div className="g1-mode-green flex items-center gap-4 p-5 sm:p-6">
            <div
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-b from-[#25a678] to-[#046c49] text-white shadow-[0_4px_0_#034730]"
              aria-hidden="true"
            >
              <SlidersHorizontal className="h-7 w-7" strokeWidth={2.2} />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-extrabold text-[#046c49]">{dict.home.expModeTitle}</h2>
                <span className="g1-tag g1-tag-green">
                  {isTe ? "పరిశోధనా మోడ్ · Green" : "Inquiry · Green"}
                </span>
              </div>
              <p className="mt-1 text-sm leading-relaxed text-[#2a4f44]">
                {dict.home.expModeDesc}
              </p>
            </div>
          </div>
        </section>

        {/* Explore Practicals Strip matching 00 & 01 Visual Guidance */}
        <section aria-labelledby="explore-practical-heading" className="mt-9">
          <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
            <div>
              <h2
                id="explore-practical-heading"
                className="text-2xl font-extrabold tracking-tight text-[#0c2444]"
              >
                {dict.home.explorePracticalHeading}
              </h2>
              <p className="mt-0.5 text-xs font-medium text-[#4b637a]">
                {isTe
                  ? "ప్రస్తుతం ప్రారంభించగల 3 ఆంధ్రప్రదేశ్ సైన్స్ ప్రయోగాలు (10వ & 9వ తరగతి)"
                  : "Currently launchable Andhra Pradesh neutral practicals (Class 10 & Class 9)"}
              </p>
            </div>
            <Link
              href="/laboratories"
              className="inline-flex items-center gap-1 text-sm font-extrabold text-[#007875] hover:underline"
            >
              <span>{dict.home.browseAll}</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            {featured.map((exp) => {
              const copy = getExperimentCopy(exp.experimentId, locale);
              const subjName = dict.subjects[exp.subject].name;
              const stageLabel = formatStageLabel(exp.grade, locale, true);
              return (
                <Link
                  key={exp.experimentId}
                  href={`/experiments/${exp.experimentId}`}
                  className="g1-card group flex items-center gap-4 overflow-hidden p-3.5 transition-transform duration-150 hover:-translate-y-0.5"
                >
                  <div className="h-[88px] w-[126px] shrink-0 overflow-hidden rounded-xl bg-[#e7f4fa]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={copy.thumbPath}
                      alt={`${copy.shortTitle} — ${copy.mediaQualifier}`}
                      className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span
                      className={`g1-tag text-[11px] ${
                        exp.subject === "biology" ? "g1-tag-green" : "g1-tag-blue"
                      }`}
                    >
                      {subjName.toUpperCase()} · {stageLabel.toUpperCase()}
                    </span>
                    <h3 className="mt-1.5 truncate text-[15px] font-extrabold text-[#0c2444]">
                      {copy.shortTitle}
                    </h3>
                    <div className="mt-1 flex items-center gap-1 text-[11px] font-bold text-[#046c49]">
                      <CheckCircle2 className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                      <span className="truncate">
                        {isTe ? "ప్రారంభించడానికి సిద్ధం" : "Ready in Simulation & Experiment"}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      </main>

      <AppFooter locale={locale} />
    </>
  );
}
