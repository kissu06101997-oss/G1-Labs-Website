import Link from "next/link";
import { notFound } from "next/navigation";
import { AppFooter } from "@/components/AppFooter";
import { AppHeader } from "@/components/AppHeader";
import { CatalogueView } from "@/components/CatalogueView";
import { getCurrentSession, getRequestLocale } from "@/lib/auth";
import { listCatalogExperiments } from "@/lib/catalog";
import { resolveEducationStage } from "@/lib/education-stages";
import { getDictionary } from "@/lib/i18n";
import type { LabSubject } from "@/lib/types";

const VALID_SUBJECTS = new Set<LabSubject>(["chemistry", "physics", "biology"]);

const SUBJECT_BANNER_STYLE: Record<LabSubject, { bg: string; img: string }> = {
  chemistry: {
    bg: "linear-gradient(112deg, #ebfaff 0%, #e1f2fb 100%)",
    img: "/assets/labs/chemistry.png",
  },
  physics: {
    bg: "linear-gradient(112deg, #f3f1ff 0%, #e7f3ff 100%)",
    img: "/assets/labs/physics.png",
  },
  biology: {
    bg: "linear-gradient(112deg, #e8fbf0 0%, #f1fff5 100%)",
    img: "/assets/labs/biology.png",
  },
};

export default async function SubjectHubPage(props: {
  params: Promise<{ subject: string }>;
  searchParams: Promise<{ grade?: string; stage?: string; q?: string; availability?: string }>;
}) {
  const [{ subject: rawSubject }, auth, locale, sp] = await Promise.all([
    props.params,
    getCurrentSession(),
    getRequestLocale(),
    props.searchParams,
  ]);

  if (!VALID_SUBJECTS.has(rawSubject as LabSubject)) {
    notFound();
  }

  const subject = rawSubject as LabSubject;
  const dict = getDictionary(locale);
  const resolvedStage = resolveEducationStage(sp.stage ?? sp.grade);
  const grade = resolvedStage ? resolvedStage.grade : undefined;
  const q = sp.q?.trim() || undefined;
  const availability =
    sp.availability === "launchable" || sp.availability === "review_pending"
      ? sp.availability
      : "all";

  const items = await listCatalogExperiments({ subject, grade, q });
  const banner = SUBJECT_BANNER_STYLE[subject];

  return (
    <>
      <AppHeader variant="public" locale={locale} auth={auth} />

      <main
        id="main-content"
        className="mx-auto w-full max-w-[1440px] flex-1 px-4 pb-16 pt-6 sm:px-6 lg:px-12"
      >
        <nav aria-label="Breadcrumb" className="text-xs font-semibold text-[#4b637a]">
          <Link href="/laboratories" className="hover:text-[#007875] hover:underline">
            {dict.nav.laboratories}
          </Link>
          <span className="mx-2" aria-hidden="true">
            ›
          </span>
          <span className="text-[#0c2444]">{dict.subjects[subject].name}</span>
        </nav>

        {/* Subject-specific visual lead banner (W08) */}
        <section
          className="g1-card mt-4 flex flex-col items-start justify-between gap-5 p-6 sm:flex-row sm:items-center sm:p-7"
          style={{ background: banner.bg }}
        >
          <div className="max-w-2xl">
            <div className="g1-eyebrow">{dict.catalogue.eyebrow}</div>
            <h1 className="mt-2.5 text-3xl font-extrabold tracking-tight text-[#0c2444] sm:text-[40px]">
              {dict.subjects[subject].name}
            </h1>
            <p className="mt-2 text-[15px] text-[#38546c]">
              {dict.subjects[subject].hubSubtitle}
            </p>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={banner.img}
            alt=""
            aria-hidden="true"
            className="h-[104px] w-[140px] shrink-0 object-contain mix-blend-multiply drop-shadow-sm sm:h-[120px] sm:w-[164px]"
          />
        </section>

        <CatalogueView
          items={items}
          locale={locale}
          initialSubject={subject}
          initialGrade={grade ? String(grade) : ""}
          initialQuery={q ?? ""}
          initialAvailability={availability}
          lockedSubject={subject}
        />
      </main>

      <AppFooter locale={locale} />
    </>
  );
}
