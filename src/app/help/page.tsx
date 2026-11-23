import Link from "next/link";
import { Accessibility, BookOpen, Keyboard, ShieldAlert } from "lucide-react";
import { AppFooter } from "@/components/AppFooter";
import { AppHeader } from "@/components/AppHeader";
import { DeviceCapabilityPanel } from "@/components/DeviceCapabilityPanel";
import { getCurrentSession, getRequestLocale } from "@/lib/auth";
import { getDictionary } from "@/lib/i18n";

export default async function HelpPage() {
  const [auth, locale] = await Promise.all([getCurrentSession(), getRequestLocale()]);
  const dict = getDictionary(locale);
  const isTe = locale === "te-IN";

  return (
    <>
      <AppHeader variant="public" locale={locale} auth={auth} />

      <main
        id="main-content"
        className="mx-auto w-full max-w-[1440px] flex-1 space-y-6 px-4 py-10 sm:px-8 lg:px-12"
      >
        <div>
          <div className="g1-eyebrow">
            {isTe ? "సహాయం మరియు యాక్సెసిబిలిటీ" : "Support, accessibility & transparency"}
          </div>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-[#0c2444] sm:text-4xl">
            {isTe ? "G1 Virtua Labs సహాయ కేంద్రం" : "Help, Accessibility & System Status"}
          </h1>
          <p className="mt-2 max-w-3xl text-sm text-[#4b637a]">
            {isTe
              ? "ఆంధ్రప్రదేశ్ పాఠశాలల కోసం కీబోర్డ్, స్క్రీన్ రీడర్, తెలుగు లిపి మరియు 4 GB పరికరాల మద్దతుతో WCAG 2.2 AA మరియు GIGW 3.0 లక్ష్యాలతో రూపొందించబడింది."
              : "Designed with WCAG 2.2 AA and GIGW 3.0 as product targets for Andhra Pradesh school classrooms, including keyboard/DOM lab parity and bilingual English/Telugu delivery."}
          </p>
        </div>

        <DeviceCapabilityPanel locale={locale} />

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          <article className="g1-card p-6">
            <Keyboard className="h-6 w-6 text-[#0663ab]" aria-hidden="true" />
            <h2 className="mt-3 text-lg font-extrabold text-[#0c2444]">
              {isTe
                ? "కీబోర్డ్ & 2D DOM ప్లేయర్ సమానత్వం"
                : "Keyboard & 2D DOM Player Parity"}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[#4b637a]">
              {isTe
                ? "ప్రతి ప్రయోగశాల సెషన్‌లో పరికరాల జాబితా మరియు 2D యాక్సెసిబుల్ నియంత్రణలు ఉంటాయి. ఇవి పాయింటర్ చర్యలతో సమానమైన సర్వర్ ఆదేశాలను పంపి అదే రూబ్రిక్ గ్రేడింగ్‌ను అందిస్తాయి."
                : "Every laboratory session includes an Equipment List and 2D Accessible Controls mode that submits the exact same server-validated commands and receives the exact same rubric grading as pointer interaction. No graded task requires dragging or rapid timing."}
            </p>
          </article>

          <article className="g1-card p-6">
            <BookOpen className="h-6 w-6 text-[#046c49]" aria-hidden="true" />
            <h2 className="mt-3 text-lg font-extrabold text-[#0c2444]">
              {isTe
                ? "సిమ్యులేషన్ మోడ్ vs ఎక్స్‌పెరిమెంట్ మోడ్"
                : "Simulation Mode vs Experiment Mode"}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[#4b637a]">
              {isTe ? (
                <>
                  <strong className="text-[#0663ab]">సిమ్యులేషన్ మోడ్ (Blue)</strong> దశలవారీ
                  పాఠ్యపుస్తక మార్గదర్శనం, సూచనలు మరియు చెక్‌పాయింట్‌లను అందిస్తుంది.{" "}
                  <strong className="text-[#046c49]">ఎక్స్‌పెరిమెంట్ మోడ్ (Green)</strong> ఆమోదించిన
                  చరరాశుల పరిధిలో స్వతంత్ర శాస్త్రీయ పరిశోధన మరియు ట్రయల్ పోలికను అందిస్తుంది.
                </>
              ) : (
                <>
                  <strong className="text-[#0663ab]">Simulation Mode (Blue)</strong> provides guided
                  textbook practical steps, hints and checkpoints.{" "}
                  <strong className="text-[#046c49]">Experiment Mode (Green)</strong> enables
                  bounded scientific inquiry within reviewed variable domains, explicitly reporting
                  limits and uncertainty.
                </>
              )}
            </p>
          </article>

          <article className="g1-card p-6">
            <ShieldAlert className="h-6 w-6 text-[#007875]" aria-hidden="true" />
            <h2 className="mt-3 text-lg font-extrabold text-[#0c2444]">
              {isTe
                ? "పాఠ్యప్రణాళిక & శాస్త్రీయ స్థితి వెల్లడి"
                : "Curriculum & Science Status Disclosure"}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[#4b637a]">
              {isTe
                ? "ఈ స్థానిక వెబ్‌సైట్ నిజమైన PostgreSQL సెషన్‌లు మరియు పరిమిత శాస్త్రీయ నమూనాలపై నడుస్తుంది. 2026–27 AP SCERT ఎడిషన్ తుది ఆమోదం, భౌతిక కాలిబ్రేషన్ మరియు మైక్రోగ్రాఫ్ హక్కులు నిపుణుల సమీక్షలో ఉన్నాయి."
                : "This local website foundation runs real PostgreSQL sessions and neutral scientific fixtures. Current 2026–27 AP SCERT edition page bindings, physical slab calibration, and rights-cleared onion micrographs remain gated for subject-expert sign-off."}
            </p>
          </article>
        </div>

        <section className="g1-card flex flex-wrap items-center justify-between gap-4 p-6">
          <div className="flex items-start gap-3">
            <Accessibility
              className="mt-1 h-5 w-5 shrink-0 text-[#007875]"
              aria-hidden="true"
            />
            <div>
              <h2 className="text-base font-extrabold text-[#0c2444]">
                {isTe
                  ? "గోప్యత & విద్యార్థుల డేటా రక్షణ"
                  : "Privacy & Child Data Protection"}
              </h2>
              <p className="mt-1 text-sm text-[#4b637a]">
                {isTe
                  ? "మూడవ పక్ష ట్రాకర్లు లేవు, ప్రకటనలు లేవు మరియు ఐచ్ఛిక AI ట్యూటర్ డిఫాల్ట్‌గా నిలిపివేయబడింది. అధికారిక ప్రభుత్వ మరియు DPDP ఆమోదాలు పూర్తయ్యే వరకు స్థానిక అభివృద్ధిలో సింథటిక్ ఖాతాలు మాత్రమే ఉపయోగించబడతాయి."
                  : "No third-party trackers, no advertising scripts, and optional AI tutoring is disabled by default. Local development uses synthetic accounts only until formal government and DPDP compliance approvals are completed."}
              </p>
            </div>
          </div>
          <Link href="/laboratories" className="g1-btn g1-btn-teal">
            {dict.home.exploreLabsCta}
          </Link>
        </section>
      </main>

      <AppFooter locale={locale} />
    </>
  );
}
