import Link from "next/link";
import { getDictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/types";

interface AppFooterProps {
  locale: Locale;
}

export function AppFooter({ locale }: AppFooterProps) {
  const dict = getDictionary(locale);

  return (
    <footer className="mt-auto border-t border-[#e6f0f6]/80 bg-white/60">
      <div className="mx-auto flex max-w-[1480px] flex-col items-start justify-between gap-3 px-4 py-5 text-xs text-[#4b637a] sm:flex-row sm:items-center sm:px-8 lg:px-14">
        <div className="flex flex-wrap items-center gap-4">
          <span className="font-semibold text-[#1f3d59]">{dict.home.footerLeft}</span>
          <Link href="/help" className="font-semibold text-[#007875] hover:underline">
            {dict.nav.help} &amp; WCAG 2.2 AA
          </Link>
        </div>
        <span>{dict.home.footerRight}</span>
      </div>
    </footer>
  );
}
