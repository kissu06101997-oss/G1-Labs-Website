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

  const linkClass = (isActive: boolean) =>
    `flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-bold transition-colors ${
      isActive ? "bg-[#e9f8fb] text-[#006d7a]" : "text-[#3f5d75] hover:bg-[#f2f8fc]"
    }`;

  return (
    <aside
      aria-label={dict.teacher.sidebarHeading}
      className="border-b border-[#dfebf3] bg-white px-4 py-5 lg:w-[248px] lg:shrink-0 lg:border-b-0 lg:border-r"
    >
      <div className="px-3 pb-4">
        <div className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#007875]">
          {dict.teacher.workspaceEyebrow}
        </div>
        <h2 className="mt-2 text-lg font-extrabold text-[#0c2444]">
          {dict.teacher.sidebarHeading}
        </h2>
        {schoolName && <p className="mt-1 text-xs text-[#4b637a]">{schoolName}</p>}
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
