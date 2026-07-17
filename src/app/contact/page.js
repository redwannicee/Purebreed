import { CONTACT_INFO } from "@/lib/policyContent";

export const metadata = { title: "Contact — Purebreed" };

export default function ContactPage() {
  return (
    <div className="container-px py-14">
      <div className="mx-auto max-w-xl text-center">
        <h1 className="text-3xl font-medium">যোগাযোগ করুন</h1>
        <p className="font-bangla mt-2 text-ink/60">{CONTACT_INFO.tagline}</p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          <a
            href={`https://wa.me/${CONTACT_INFO.whatsapp.replace(/[^0-9]/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="card flex flex-col items-center gap-2 p-6 transition-colors hover:border-leaf"
          >
            <span className="text-2xl">💬</span>
            <span className="font-semibold">WhatsApp</span>
            <span className="text-sm text-ink/60">{CONTACT_INFO.whatsapp}</span>
          </a>
          <a
            href={CONTACT_INFO.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="card flex flex-col items-center gap-2 p-6 transition-colors hover:border-leaf"
          >
            <span className="text-2xl">📘</span>
            <span className="font-semibold">Facebook</span>
            <span className="text-sm text-ink/60">pureebreed</span>
          </a>
        </div>

        <div className="card mt-6 p-6">
          <span className="text-2xl">🏭</span>
          <p className="mt-2 font-semibold">Factory Address</p>
          <a
            href={CONTACT_INFO.factoryMapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 block text-sm text-ink/60 underline decoration-ink/20 underline-offset-2 hover:text-leaf"
          >
            {CONTACT_INFO.factoryAddress}
          </a>
        </div>
      </div>
    </div>
  );
}
