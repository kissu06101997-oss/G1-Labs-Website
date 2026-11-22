import Link from "next/link";
import { notFound } from "next/navigation";
import { AppFooter } from "@/components/AppFooter";
import { AppHeader } from "@/components/AppHeader";
import { CatalogueView } from "@/components/CatalogueView";
import { getCurrentSession, getRequestLocale } from "@/lib/auth";
import { listCatalogExperiments } from "@/lib/catalog";
import { getDictionary } from "@/lib/i18n";
import type { LabSubject } from "@/lib/types";

const VALID_SUBJECTS = new Set<LabSubject>(["chemistry", "physics", "biology"]);

export default async function SubjectHubPage(props: {
  params: Promise<{ subject: string }>;
  searchParams: Promise<{ grade?: string; q?: string }>;
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
  const gradeNum = sp.grade ? Number(sp.grade) : undefined;
  const grade = gradeNum && Number.isInteger(gradeNum) ? gradeNum : undefined;
  const q = sp.q?.trim() || undefined;

  const items = await listCatalogExperiments({ subject, grade, q });

  return (
    <>
      <AppHeader variant="public" locale={locale} auth={auth} />

      <main id="main-content" className="mx-auto w-full max-w-[1480px] flex-1 px-4 pb-14 pt-8 sm:px-8 lg:px-14">
        <nav aria-label="Breadcrumb" className="text-xs font-semibold text-[#4b637a]">
          <Link href="/laboratories" className="hover:text-[#007875] hover:underline">
            {dict.nav.laboratories}
          </Link>
          <span className="mx-2" aria-hidden="true">›</span>
          <span className="text-[#0c2444]">{dict.subjects[subject].name}</span>
        </nav>

        <div className="g1-eyebrow mt-4">{dict.catalogue.eyebrow}</div>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-[#0c2444] sm:text-[42px]">
          {dict.subjects[subject].name}
        </h1>
        <p className="mt-2 max-w-2xl text-[15px] text-[#4b637a]">
          {dict.subjects[subject].hubSubtitle}
        </p>

        <CatalogueView
          items={items}
          locale={locale}
          initialSubject={subject}
          initialGrade={grade ? String(grade) : ""}
          initialQuery={q ?? ""}
          lockedSubject={subject}
        />
      </main>

      <AppFooter locale={locale} />
    </>
  );
}
