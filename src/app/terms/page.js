import { BRAND_INTRO, POLICY_SECTIONS } from "@/lib/policyContent";

export const metadata = { title: "Terms & Conditions — Purebreed" };

export default function TermsPage() {
  return (
    <div className="container-px py-14">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-medium">শর্তাবলী ও নীতিমালা</h1>
        <p className="mt-1 text-sm text-ink/50">Terms &amp; Conditions</p>
        <p className="font-bangla mt-6 text-sm leading-relaxed text-ink/70">{BRAND_INTRO}</p>

        <div className="mt-8 space-y-6">
          {POLICY_SECTIONS.map((section) => (
            <div key={section.id} className="card p-5">
              <h2 className="font-bangla font-semibold text-forest-700">{section.title_bn}</h2>
              <p className="font-bangla mt-2 text-sm leading-relaxed text-ink/70">{section.body_bn}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
