"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Globe } from "lucide-react";
import type { Locale } from "@/lib/types";

interface LocaleToggleProps {
  locale: Locale;
}

export function LocaleToggle({ locale }: LocaleToggleProps) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const nextLocale: Locale = locale === "en-IN" ? "te-IN" : "en-IN";

  async function handleToggle() {
    if (busy) return;
    setBusy(true);
    try {
      await fetch("/api/locale", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locale: nextLocale }),
      });
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={busy}
      className="inline-flex min-h-[40px] items-center gap-1.5 whitespace-nowrap rounded-xl px-2.5 py-1.5 text-xs font-semibold text-[#1f3d59] transition-colors hover:bg-[#eef6fb] sm:px-3 sm:text-sm"
      aria-label={
        locale === "en-IN"
          ? "Switch language to Telugu (తెలుగు)"
          : "Switch language to English"
      }
      data-testid="locale-toggle"
    >
      <Globe className="h-4 w-4 text-[#007875]" aria-hidden="true" />
      <span>{locale === "en-IN" ? "English / తెలుగు" : "తెలుగు / English"}</span>
    </button>
  );
}
