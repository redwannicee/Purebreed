import Image from "next/image";
import { Building2, Link2, Globe, ExternalLink } from "lucide-react";

// Edit this list to add/remove partners. `linkType` just controls which
// icon and label show — set it to "facebook" for a Facebook Page URL,
// or "website" for anything else.
const PARTNERS = [
  {
    name: "কৃষিসম্ভার অর্গানিক ফুড",
    logoUrl: "https://drive.google.com/file/d/1N25dRly16F7uUdzBaSuyol-eEKYyWQnw/view?usp=sharing",
    link: "https://www.facebook.com/BHMVANDER",
    linkType: "facebook",
  },
  {
    name: "Partner Company Name",
    logoUrl: "",
    link: "https://example.com",
    linkType: "website",
  },
  {
    name: "Partner Company Name",
    logoUrl: "",
    link: "https://example.com",
    linkType: "website",
  },
];

export default function PartnersSection() {
  return (
    <section className="container-px py-16 sm:py-20">
      <div className="mx-auto max-w-2xl text-center">
        <p className="eyebrow">Who we work with</p>
        <h2 className="section-title mt-2">Our Partners</h2>
        <p className="font-bangla mt-2 text-sm text-ink/50">আমাদের অংশীদারগণ</p>
        <p className="mt-4 text-sm leading-relaxed text-ink/60">
          Purebreed is proud to work alongside trusted businesses across Bangladesh.
        </p>
      </div>

      <div className="mx-auto mt-10 grid max-w-5xl grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {PARTNERS.map((partner, i) => {
          const LinkIcon = partner.linkType === "facebook" ? Link2 : Globe;
          return (
            <a
              key={i}
              href={partner.link}
              target="_blank"
              rel="noopener noreferrer"
              className="card group flex flex-col items-center gap-3 p-5 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-forest/10"
            >
              <div className="relative flex h-20 w-full items-center justify-center overflow-hidden rounded-lg bg-sage-50">
                {partner.logoUrl ? (
                  <Image
                    src={partner.logoUrl}
                    alt={partner.name}
                    fill
                    sizes="200px"
                    className="object-contain p-3"
                  />
                ) : (
                  <Building2 className="text-ink/20" size={28} />
                )}
              </div>
              <p className="text-sm font-semibold text-ink">{partner.name}</p>
              <span className="flex items-center gap-1 text-xs font-semibold text-leaf">
                <LinkIcon size={13} />
                {partner.linkType === "facebook" ? "Facebook" : "Website"}
                <ExternalLink
                  size={11}
                  className="opacity-50 transition-opacity group-hover:opacity-100"
                />
              </span>
            </a>
          );
        })}
      </div>
    </section>
  );
}
