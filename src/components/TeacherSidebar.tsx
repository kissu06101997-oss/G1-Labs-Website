import Link from "next/link";
import {
  BarChart3,
  ClipboardList,
  FlaskConical,
  HelpCircle,
  LayoutGrid,
} from "lucide-react";
import { getDictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/types";

interface TeacherSidebarProps {
  active: "classes" | "assignments" | "reports";
  locale: Locale;
  schoolName: string | null;
}

export function TeacherSidebar({ active, locale, schoolName }: TeacherSidebarProps) {
  const dict = getDictionary(locale);
  const isTe = locale === "te-IN";

  const linkClass = (isActive: boolean) =>
    `flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-bold transition-colors ${
      isActive
        ? "bg-gradient-to-r from-[#078f9d] to-[#0e7bb5] text-white shadow-sm"
        : "text-[#c2dce9] hover:bg-white/10 hover:text-white"
    }`;

  return (
    <aside
      aria-label={dict.teacher.sidebarHeading}
      className="border-b border-[#1c3d5e] bg-gradient-to-b from-[#0c2742] to-[#103052] px-4 py-5 text-white lg:w-[244px] lg:shrink-0 lg:border-b-0 lg:border-r"
    >
      <div className="px-2 pb-4">
        <div className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#7ed6cf]">
          {dict.teacher.sidebarHeading}
        </div>
        <div className="mt-3 rounded-2xl border border-white/15 bg-white/10 p-3.5">
          <div className="text-[11px] font-semibold text-[#b3cedf]">
            {isTe ? "ప్రస్తుత పాఠశాల పరిధి" : "Current scope"}
          </div>
          <div className="mt-0.5 truncate text-sm font-extrabold text-white">
            {schoolName || (isTe ? "G1 పాఠశాల" : "G1 Partner School")}
          </div>
        </div>
      </div>

      <nav aria-label="Teacher sections" className="flex flex-wrap gap-1.5 lg:flex-col">
        <Link href="/teacher" className={linkClass(active === "classes")}>
          <LayoutGrid className="h-4 w-4" aria-hidden="true" />
          <span>{dict.nav.classes}</span>
        </Link>
        <Link href="/teacher/assignments" className={linkClass(active === "assignments")}>
          <ClipboardList className="h-4 w-4" aria-hidden="true" />
          <span>{dict.nav.assignments}</span>
        </Link>
        <Link href="/teacher/reports" className={linkClass(active === "reports")}>
          <BarChart3 className="h-4 w-4" aria-hidden="true" />
          <span>{dict.nav.reports}</span>
        </Link>
        <Link href="/laboratories" className={linkClass(false)}>
          <FlaskConical className="h-4 w-4" aria-hidden="true" />
          <span>{dict.nav.library}</span>
        </Link>
        <Link href="/help" className={linkClass(false)}>
          <HelpCircle className="h-4 w-4" aria-hidden="true" />
          <span>{dict.nav.help}</span>
        </Link>
      </nav>
    </aside>
  );
}
