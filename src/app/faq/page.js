"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, MessageCircle } from "lucide-react";

const FAQS = [
  ["How long does delivery take?", "Orders usually arrive within 1–5 business days depending on your location. We contact you if weather, stock or courier conditions affect this."],
  ["Which payment methods do you accept?", "You can pay by cash on delivery, bKash, Nagad or bank transfer. Mobile and bank payments are manually verified before confirmation."],
  ["Can I return a product?", "If an item is incorrect, damaged or expired, contact us with photos within 24 hours of delivery. We will arrange a replacement or eligible refund."],
  ["How should I store Purebreed products?", "Keep packs sealed in a cool, dry place away from direct sunlight. Follow any product-specific instructions shown on its label."],
  ["Do you take wholesale orders?", "Yes. Our wholesale form supports retailers, distributors and food-service partners. We will follow up with pricing and minimum quantities."],
  ["Can I change an order after placing it?", "Contact us as quickly as possible. We can usually help before the order is confirmed or handed to the courier."],
];

export default function FaqPage() {
  const [open, setOpen] = useState(0);
  return <div className="container-px py-12 sm:py-16"><div className="mx-auto max-w-3xl text-center"><p className="eyebrow">Help centre</p><h1 className="section-title mt-2">Questions, answered clearly</h1><p className="mt-4 text-ink/55">Everything you need to shop with confidence.</p></div><div className="mx-auto mt-10 max-w-3xl divide-y divide-forest/10 rounded-2xl border border-forest/10 bg-white px-5 sm:px-7">{FAQS.map(([question, answer], index) => <div key={question}><button type="button" onClick={() => setOpen(open === index ? -1 : index)} className="flex w-full items-center justify-between gap-4 py-5 text-left font-bold text-forest" aria-expanded={open === index}>{question}<ChevronDown size={19} className={`shrink-0 transition ${open === index ? "rotate-180" : ""}`} /></button>{open === index && <p className="pb-5 pr-8 text-sm leading-6 text-ink/60">{answer}</p>}</div>)}</div><div className="mx-auto mt-8 flex max-w-3xl flex-col items-center justify-between gap-4 rounded-2xl bg-sage-100 p-6 text-center sm:flex-row sm:text-left"><div><h2 className="font-bold text-forest">Still need help?</h2><p className="text-sm text-ink/55">Our team is ready on WhatsApp.</p></div><a href="https://wa.me/8801570252667" target="_blank" rel="noreferrer" className="btn-primary"><MessageCircle size={18} /> Chat with us</a></div></div>;
}
