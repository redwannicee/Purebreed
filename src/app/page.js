"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, BadgeCheck, FlaskConical, Leaf, PackageCheck, ShieldCheck, Star, Truck } from "lucide-react";
import ProductGrid from "@/components/ProductGrid";
import { getActiveProducts } from "@/lib/products";

const CATEGORY_LINKS = [
  ["spices", "Everyday spices", "Freshly ground, deeply aromatic", "from-[#f8e9d3] to-[#f5d9aa]"],
  ["oil", "Cold-pressed oils", "Pure flavour, careful extraction", "from-[#edf1d1] to-[#dce6a4]"],
  ["pickle", "Small-batch pickles", "Bright, bold family recipes", "from-[#f5ded0] to-[#efbfa7]"],
];

const BENEFITS = [
  [Leaf, "Sourced with care", "Ingredients selected from trusted growers."],
  [FlaskConical, "Quality checked", "Every batch follows a careful quality process."],
  [PackageCheck, "Packed fresh", "Sealed to protect aroma, flavour and quality."],
  [Truck, "Delivered fast", "Doorstep delivery across Bangladesh in 1–5 days."],
];

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getActiveProducts().then((items) => setProducts(items.slice(0, 8))).catch(() => setProducts([])).finally(() => setLoading(false));
  }, []);

  return (
    <div className="overflow-hidden">
      <section className="relative bg-[#eef3e9]">
        <div className="absolute -right-20 -top-28 h-80 w-80 rounded-full bg-mint/20 blur-3xl" />
        <div className="container-px grid min-h-[620px] items-center gap-10 py-14 lg:grid-cols-[0.92fr_1.08fr] lg:py-20">
          <div className="relative z-10">
            <p className="eyebrow">From our kitchen to yours</p>
            <h1 className="mt-5 max-w-2xl text-5xl font-semibold leading-[1.02] text-forest sm:text-6xl lg:text-7xl">
              Honest food.<br /><span className="italic text-leaf">Naturally made.</span>
            </h1>
            <p className="font-bangla mt-5 text-xl font-semibold text-forest-700">বিশুদ্ধ স্বাদ, নিশ্চিন্ত প্রতিদিন।</p>
            <p className="mt-4 max-w-lg text-base leading-7 text-ink/65">Traceable spices, cold-pressed oils and small-batch pantry favourites—made without shortcuts and delivered across Bangladesh.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/products" className="btn-primary">Shop the collection <ArrowRight size={17} /></Link>
              <Link href="/about" className="btn-secondary">Why Purebreed</Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-xs font-bold text-forest-700">
              <span className="flex items-center gap-2"><ShieldCheck size={17} className="text-leaf" /> Secure checkout</span>
              <span className="flex items-center gap-2"><BadgeCheck size={17} className="text-leaf" /> Quality checked</span>
              <span className="flex items-center gap-2"><Truck size={17} className="text-leaf" /> Fast delivery</span>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-2xl">
            <div className="overflow-hidden rounded-[2rem] border-[10px] border-white bg-forest shadow-2xl">
              <video className="aspect-[4/3] w-full object-cover" src="/hero-showcase.mp4" poster="/logo-purebreed-dark.png" autoPlay muted loop playsInline />
            </div>
            <div className="absolute -bottom-5 -left-3 rounded-2xl bg-white p-4 shadow-xl sm:-left-8">
              <div className="flex gap-1 text-turmeric">{Array.from({ length: 5 }).map((_, i) => <Star key={i} size={15} fill="currentColor" />)}</div>
              <p className="mt-2 text-sm font-bold text-forest">Loved for real, familiar flavour</p>
              <p className="text-xs text-ink/50">Pure ingredients. Nothing unnecessary.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-forest/10 bg-white">
        <div className="container-px grid grid-cols-2 divide-x divide-y divide-forest/10 py-2 sm:grid-cols-4 sm:divide-y-0">
          {BENEFITS.map(([Icon, title, body]) => (
            <div key={title} className="p-5 text-center sm:p-7"><Icon className="mx-auto text-leaf" size={25} /><h2 className="mt-3 text-sm font-bold text-forest">{title}</h2><p className="mt-1 text-xs leading-5 text-ink/50">{body}</p></div>
          ))}
        </div>
      </section>

      <section className="container-px py-16 sm:py-20">
        <div className="mb-8 flex items-end justify-between gap-4"><div><p className="eyebrow">Shop by pantry need</p><h2 className="section-title mt-2">Everyday essentials, made better</h2></div><Link href="/products" className="hidden items-center gap-1 text-sm font-bold text-leaf hover:underline sm:flex">View all <ArrowRight size={16} /></Link></div>
        <div className="grid gap-5 md:grid-cols-3">
          {CATEGORY_LINKS.map(([id, title, subtitle, color], index) => (
            <Link key={id} href={`/products?category=${id}`} className={`group relative min-h-64 overflow-hidden rounded-[1.75rem] bg-gradient-to-br ${color} p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-xl`}>
              <span className="text-xs font-extrabold uppercase tracking-widest text-forest/50">0{index + 1}</span><h3 className="mt-10 text-3xl font-semibold text-forest">{title}</h3><p className="mt-2 text-sm text-forest/65">{subtitle}</p><span className="absolute bottom-6 right-6 flex h-11 w-11 items-center justify-center rounded-full bg-white text-forest transition group-hover:bg-forest group-hover:text-white"><ArrowRight size={18} /></span>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <div className="container-px"><div className="mb-8 flex items-end justify-between gap-4"><div><p className="eyebrow">Customer favourites</p><h2 className="section-title mt-2">The pantry’s most wanted</h2></div><Link href="/products" className="text-sm font-bold text-leaf hover:underline">Shop all</Link></div><ProductGrid products={products} loading={loading} /></div>
      </section>

      <section className="container-px py-16 sm:py-20">
        <div className="grid overflow-hidden rounded-[2rem] bg-forest text-white lg:grid-cols-2">
          <div className="p-8 sm:p-12"><p className="eyebrow !text-mint">The Purebreed promise</p><h2 className="mt-4 text-4xl font-semibold leading-tight sm:text-5xl">Food should be easy to trust.</h2><p className="mt-5 max-w-lg leading-7 text-white/70">We keep labels clear, source carefully and pack every batch with the same attention we expect for our own families.</p><Link href="/about" className="btn-secondary mt-8 !border-white/20 !bg-white/10 !text-white">Meet Purebreed <ArrowRight size={17} /></Link></div>
          <div className="grid grid-cols-2 border-l border-white/10"><div className="border-b border-r border-white/10 p-8"><p className="text-4xl font-semibold text-mint">100%</p><p className="mt-2 text-sm text-white/60">transparent ingredient focus</p></div><div className="border-b border-white/10 p-8"><p className="text-4xl font-semibold text-mint">1–5</p><p className="mt-2 text-sm text-white/60">business days delivery</p></div><div className="border-r border-white/10 p-8"><p className="text-4xl font-semibold text-mint">24h</p><p className="mt-2 text-sm text-white/60">issue reporting support</p></div><div className="p-8"><p className="text-4xl font-semibold text-mint">COD</p><p className="mt-2 text-sm text-white/60">cash on delivery available</p></div></div>
        </div>
      </section>
    </div>
  );
}
