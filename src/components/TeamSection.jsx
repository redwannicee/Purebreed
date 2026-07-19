const TEAM = [
  {
    name: "Md Redwan Rashid Nice",
    name_bn: "নাম",
    role_en: "Founder & CEO",
    role_bn: "প্রতিষ্ঠাতা ও সিইও",
    initials: "RN",
  },
  {
    name: "Team Member Name",
    name_bn: "নাম",
    role_en: "Head of Operations",
    role_bn: "অপারেশন প্রধান",
    initials: "TM",
  },
  {
    name: "Team Member Name",
    name_bn: "নাম",
    role_en: "Quality Assurance Lead",
    role_bn: "মান নিয়ন্ত্রণ প্রধান",
    initials: "TM",
  },
];

// Deterministic color per card so the same name always gets the same
// avatar tint — swap this out once real headshots replace the initials.
const AVATAR_TINTS = [
  "from-leaf to-mint",
  "from-forest-400 to-leaf",
  "from-turmeric to-mint",
  "from-forest to-forest-400",
];

export default function TeamSection() {
  return (
    <section className="mt-16">
      <span className="leaf-badge inline-block bg-mint px-3 py-1 pl-2 text-xs font-bold text-forest">
        আমাদের টিম
      </span>
      <h2 className="mt-3 text-2xl font-medium sm:text-3xl">Meet the Team</h2>
      <p className="font-bangla mt-1 text-sm text-ink/50">
        যাদের হাত ধরে Purebreed আজকের জায়গায়
      </p>

      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {TEAM.map((member, i) => (
          <div
            key={i}
            className="card group flex flex-col items-center gap-3 p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-forest/10"
          >
            {/* Headshot placeholder — swap for a real <Image> once photos are ready */}
            <div
              className={`flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br text-xl font-semibold text-white shadow-card transition-transform duration-300 group-hover:scale-105 ${
                AVATAR_TINTS[i % AVATAR_TINTS.length]
              }`}
            >
              {member.initials}
            </div>

            <div>
              <p className="text-base font-semibold text-ink">{member.name}</p>
              <p className="font-bangla text-xs text-ink/40">{member.name_bn}</p>
            </div>

            <div>
              <p className="text-sm font-semibold text-leaf">{member.role_en}</p>
              <p className="font-bangla text-xs text-ink/50">{member.role_bn}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}