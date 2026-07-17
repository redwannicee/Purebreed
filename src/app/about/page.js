import { BRAND_INTRO, CONTACT_INFO } from "@/lib/policyContent";
import TeamSection from "@/components/TeamSection";

export const metadata = { title: "About Us — Purebreed" };

export default function AboutPage() {
  return (
    <div className="container-px py-14">
      <div className="mx-auto max-w-2xl">
        <span className="leaf-badge inline-block bg-mint px-3 py-1 pl-2 text-xs font-bold text-forest">
          আমাদের সম্পর্কে
        </span>
        <h1 className="mt-4 text-3xl font-medium">About Purebreed</h1>
        <p className="font-bangla mt-6 text-sm italic text-leaf">{CONTACT_INFO.tagline}</p>
        <p className="font-bangla mt-4 whitespace-pre-line text-base leading-relaxed text-ink/80">
          {BRAND_INTRO}
        </p>
      </div>

      <div className="mx-auto max-w-5xl">
        <TeamSection />
      </div>
    </div>
  );
}
