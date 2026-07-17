import { POLICY_SECTIONS } from "@/lib/policyContent";

export const metadata = { title: "Privacy Policy — Purebreed" };

export default function PrivacyPage() {
  const privacySection = POLICY_SECTIONS.find((s) => s.id === "privacy");
  const otherSections = POLICY_SECTIONS.filter((s) => s.id !== "privacy");

  return (
    <div className="container-px py-14">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-medium">তথ্যের গোপনীয়তা</h1>
        <p className="mt-1 text-sm text-ink/50">Privacy Policy</p>

        <div className="card mt-8 border-leaf/30 bg-leaf/5 p-5">
          <p className="font-bangla text-sm leading-relaxed text-forest-700">{privacySection.body_bn}</p>
        </div>

        <p className="mt-8 text-xs font-semibold uppercase tracking-wide text-ink/40">
          Related policies
        </p>
        <div className="mt-3 space-y-6">
          {otherSections.map((section) => (
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
