import Link from "next/link";
import { AppFooter } from "@/components/AppFooter";
import { AppHeader } from "@/components/AppHeader";
import { CatalogueView } from "@/components/CatalogueView";
import { getCurrentSession, getRequestLocale } from "@/lib/auth";
import { listCatalogExperiments } from "@/lib/catalog";
import { getDictionary } from "@/lib/i18n";
import type { LabSubject } from "@/lib/types";

const VALID_SUBJECTS = new Set<LabSubject>(["chemistry", "physics", "biology"]);

export default async function LaboratoriesPage(props: {
  searchParams: Promise<{ subject?: string; grade?: string; q?: string }>;
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
  const gradeNum = sp.grade ? Number(sp.grade) : undefined;
  const grade = gradeNum && Number.isInteger(gradeNum) ? gradeNum : undefined;
  const q = sp.q?.trim() || undefined;

  const items = await listCatalogExperiments({ subject, grade, q });

  return (
    <>
      <AppHeader variant="public" locale={locale} auth={auth} />

      <main id="main-content" className="mx-auto w-full max-w-[1480px] flex-1 px-4 pb-14 pt-9 sm:px-8 lg:px-14">
        <div className="g1-eyebrow">{dict.catalogue.eyebrow}</div>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-[#0c2444] sm:text-[42px]">
          {dict.catalogue.heading}
        </h1>
        <p className="mt-2 max-w-2xl text-[15px] text-[#4b637a]">{dict.catalogue.subtitle}</p>

        {/* Subject hub shortcut pills */}
        <nav aria-label="Subject hubs" className="mt-5 flex flex-wrap gap-2">
          <Link
            href="/laboratories"
            className={`rounded-xl px-3.5 py-2 text-xs font-extrabold ${
              !subject ? "bg-[#0c2444] text-white" : "border border-[#c3d7e5] bg-white text-[#1a3b59] hover:bg-[#f2f8fc]"
            }`}
          >
            {dict.catalogue.all}
          </Link>
          {(["chemistry", "physics", "biology"] as const).map((s) => (
            <Link
              key={s}
              href={`/laboratories/${s}`}
              className={`rounded-xl px-3.5 py-2 text-xs font-extrabold ${
                subject === s
                  ? s === "biology"
                    ? "bg-[#046c49] text-white"
                    : "bg-[#0663ab] text-white"
                  : "border border-[#c3d7e5] bg-white text-[#1a3b59] hover:bg-[#f2f8fc]"
              }`}
            >
              {dict.subjects[s].name}
            </Link>
          ))}
        </nav>

        <CatalogueView
          items={items}
          locale={locale}
          initialSubject={subject ?? ""}
          initialGrade={grade ? String(grade) : ""}
          initialQuery={q ?? ""}
        />
      </main>

      <AppFooter locale={locale} />
    </>
  );
}
