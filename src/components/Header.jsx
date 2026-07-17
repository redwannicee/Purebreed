"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useCart } from "@/context/CartContext";

const NAV_LINKS = [
  { href: "/products", label_en: "Products", label_bn: "পণ্যসমূহ" },
  { href: "/products?rnd=1", label_en: "Coming Soon", label_bn: "আসছে শীঘ্রই" },
  { href: "/about", label_en: "About", label_bn: "আমাদের সম্পর্কে" },
  { href: "/contact", label_en: "Contact", label_bn: "যোগাযোগ" },
];

export default function Header() {
  const { count } = useCart();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-forest/10 bg-sage-50/95 backdrop-blur">
      <div className="container-px flex h-20 items-center justify-between">
        <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <Image src="/logo-purebreed.png" alt="Purebreed" width={140} height={70} priority className="h-12 w-auto" />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-semibold text-forest-700 transition-colors hover:text-leaf"
            >
              {link.label_en}
              <span className="ml-1 font-bangla text-xs font-normal text-forest-700/60">
                {link.label_bn}
              </span>
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/cart" className="btn-secondary relative !px-4">
            <span aria-hidden>🧺</span>
            <span className="hidden sm:inline">কার্ট</span>
            {count > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-turmeric px-1 text-xs font-bold text-white">
                {count}
              </span>
            )}
          </Link>
          <button
            type="button"
            className="rounded-lg border border-forest/15 p-2 md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label="Toggle menu"
          >
            ☰
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-forest/10 bg-sage-50 md:hidden">
          <div className="container-px flex flex-col gap-1 py-3">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-semibold text-forest-700 hover:bg-forest-50"
              >
                {link.label_en} <span className="font-bangla text-forest-700/60">· {link.label_bn}</span>
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
