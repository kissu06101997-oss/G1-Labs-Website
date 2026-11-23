import { AppFooter } from "@/components/AppFooter";
import { AppHeader } from "@/components/AppHeader";
import { CatalogueView } from "@/components/CatalogueView";
import { getCurrentSession, getRequestLocale } from "@/lib/auth";
import { listCatalogExperiments } from "@/lib/catalog";
import { resolveEducationStage } from "@/lib/education-stages";
import { getDictionary } from "@/lib/i18n";
import type { LabSubject } from "@/lib/types";

const VALID_SUBJECTS = new Set<LabSubject>(["chemistry", "physics", "biology"]);

export default async function LaboratoriesPage(props: {
  searchParams: Promise<{
    subject?: string;
    grade?: string;
    stage?: string;
    q?: string;
    availability?: string;
  }>;
}) {
  const [auth, locale, sp] = await Promise.all([
    getCurrentSession(),
    getRequestLocale(),
    props.searchParams,
  ]);
  const dict = getDictionary(locale);

  const subject =
    sp.subject && VALID_SUBJECTS.has(sp.subject as LabSubject)
      ? (sp.subject as LabSubject)
      : undefined;
  const resolvedStage = resolveEducationStage(sp.stage ?? sp.grade);
  const grade = resolvedStage ? resolvedStage.grade : undefined;
  const q = sp.q?.trim() || undefined;
  const availability =
    sp.availability === "launchable" || sp.availability === "review_pending"
      ? sp.availability
      : "all";

  const items = await listCatalogExperiments({ subject, grade, q });

  return (
    <>
      <AppHeader variant="public" locale={locale} auth={auth} />

      <main
        id="main-content"
        className="mx-auto w-full max-w-[1440px] flex-1 px-4 pb-16 pt-7 sm:px-6 lg:px-12"
      >
        <div className="g1-eyebrow">{dict.catalogue.eyebrow}</div>
        <h1 className="mt-2.5 text-3xl font-extrabold tracking-tight text-[#0c2444] sm:text-[42px]">
          {dict.catalogue.heading}
        </h1>
        <p className="mt-2 max-w-3xl text-[15px] text-[#38546c]">
          {dict.catalogue.subtitle}
        </p>

        <CatalogueView
          items={items}
          locale={locale}
          initialSubject={subject ?? ""}
          initialGrade={grade ? String(grade) : ""}
          initialQuery={q ?? ""}
          initialAvailability={availability}
        />
      </main>

      <AppFooter locale={locale} />
    </>
  );
}
