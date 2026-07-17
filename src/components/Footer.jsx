"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { CONTACT_INFO, POLICY_SECTIONS } from "@/lib/policyContent";

function AccordionItem({ section, isOpen, onToggle }) {
  return (
    <div className="border-b border-white/10">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between py-3 text-left text-sm font-semibold font-bangla text-white/90 hover:text-mint"
        aria-expanded={isOpen}
      >
        {section.title_bn}
        <span className="ml-3 text-mint">{isOpen ? "−" : "+"}</span>
      </button>
      {isOpen && (
        <p className="font-bangla pb-4 text-sm leading-relaxed text-white/60">
          {section.body_bn}
        </p>
      )}
    </div>
  );
}

export default function Footer() {
  const [openId, setOpenId] = useState(null);

  return (
    <footer className="bg-forest text-white">
      <div className="container-px grid gap-10 py-14 lg:grid-cols-[1.1fr_1fr_1.2fr]">
        <div>
          <Image
            src="/logo-purebreed-dark.png"
            alt="Purebreed"
            width={150}
            height={75}
            className="h-12 w-auto"
          />
          <p className="font-bangla mt-4 max-w-xs text-sm leading-relaxed text-white/70">
            {CONTACT_INFO.tagline}
          </p>
          <div className="mt-5 flex items-center gap-3 text-sm">
            <a
              href={CONTACT_INFO.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-white/20 px-4 py-2 font-semibold transition-colors hover:border-mint hover:text-mint"
            >
              Facebook
            </a>
            <a
              href={`https://wa.me/${CONTACT_INFO.whatsapp.replace(/[^0-9]/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-white/20 px-4 py-2 font-semibold transition-colors hover:border-mint hover:text-mint"
            >
              WhatsApp
            </a>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-wide text-mint">Quick links</h3>
          <ul className="mt-4 space-y-2 text-sm text-white/70">
            <li><Link href="/products" className="hover:text-white">Products</Link></li>
            <li><Link href="/about" className="hover:text-white">About Us</Link></li>
            <li><Link href="/terms" className="hover:text-white">Terms &amp; Conditions</Link></li>
            <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
            <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
            <li><Link href="/admin/login" className="hover:text-white">Admin</Link></li>
          </ul>
          <div className="mt-6 text-sm text-white/70">
            <p>WhatsApp: {CONTACT_INFO.whatsapp}</p>
            <p className="mt-1">
              Factory:{" "}
              <a
                href={CONTACT_INFO.factoryMapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-white/30 underline-offset-2 hover:text-mint"
              >
                {CONTACT_INFO.factoryAddress}
              </a>
            </p>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-wide text-mint">নীতিমালা</h3>
          <div className="mt-2">
            {POLICY_SECTIONS.map((section) => (
              <AccordionItem
                key={section.id}
                section={section}
                isOpen={openId === section.id}
                onToggle={() => setOpenId(openId === section.id ? null : section.id)}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 py-5 text-center text-xs text-white/50">
        © {new Date().getFullYear()} Purebreed. All rights reserved.
      </div>
    </footer>
  );
}
