"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import ProductGrid from "@/components/ProductGrid";
import { getActiveProducts, getRnDProducts } from "@/lib/products";
import { CATEGORIES } from "@/lib/utils";

const TRUST_BADGES = [
  { icon: "🍃", title_en: "100% Natural", title_bn: "১০০% প্রাকৃতিক" },
  { icon: "🔬", title_en: "Lab Tested", title_bn: "ল্যাব টেস্টেড" },
  { icon: "🚚", title_en: "1–5 Day Delivery", title_bn: "১-৫ দিনে ডেলিভারি" },
  { icon: "🔒", title_en: "Secure Checkout", title_bn: "নিরাপদ চেকআউট" },
];

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [rndProducts, setRndProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    Promise.all([getActiveProducts(), getRnDProducts()])
      .then(([p, r]) => {
        if (!active) return;
        setProducts(p.slice(0, 8));
        setRndProducts(r.slice(0, 4));
      })
      .catch(() => {})
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-forest text-white">
        <div className="container-px grid gap-10 py-16 md:grid-cols-2 md:items-center md:py-24">
          <div>
            <span className="leaf-badge inline-block bg-mint px-4 py-1.5 pl-3 text-xs font-bold text-forest">
              ১০০% প্রাকৃতিক খাদ্যপণ্য
            </span>
            <h1 className="font-bangla mt-5 max-w-lg text-4xl font-semibold leading-tight sm:text-5xl">
              আপনার সুস্থ ও নিরাপদ জীবনের সঙ্গী
            </h1>
            <p className="mt-4 max-w-md text-white/70">
              Purebreed brings trusted, quality-checked spices, oils, pickles and healthy
              drinks straight from our factory to your door — no account needed.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/products" className="btn-primary">
                শপিং শুরু করুন
              </Link>
              <Link href="/about" className="btn-secondary !border-white/20 !bg-transparent !text-white hover:!border-mint hover:!text-mint">
                আমাদের সম্পর্কে জানুন
              </Link>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-lg">
            <div className="absolute inset-0 rounded-full bg-mint/10 blur-3xl" />
            <div className="relative aspect-video w-full overflow-hidden rounded-xl2 bg-forest-400 shadow-card">
              <video
                className="h-full w-full object-cover"
                src="/hero-showcase.mp4"
                poster="/logo-purebreed-dark.png"
                autoPlay
                muted
                loop
                playsInline
              />
            </div>
          </div>
        </div>
      </section>

      {/* Trust badges */}
      <section className="border-b border-forest/10 bg-white">
        <div className="container-px grid grid-cols-2 gap-6 py-8 sm:grid-cols-4">
          {TRUST_BADGES.map((b) => (
            <div key={b.title_en} className="flex flex-col items-center gap-1 text-center">
              <span className="text-2xl">{b.icon}</span>
              <span className="text-xs font-semibold text-ink">{b.title_en}</span>
              <span className="font-bangla text-xs text-ink/50">{b.title_bn}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Category quick nav */}
      <section className="container-px py-10">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <Link
              key={c.id}
              href={`/products?category=${c.id}`}
              className="rounded-full border border-forest/15 bg-white px-4 py-2 text-sm font-semibold text-forest-700 transition-colors hover:border-leaf hover:text-leaf"
            >
              {c.label_en} <span className="font-bangla text-ink/50">· {c.label_bn}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured products */}
      <section className="container-px pb-14">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-medium">Popular right now</h2>
            <p className="font-bangla text-sm text-ink/50">জনপ্রিয় পণ্যসমূহ</p>
          </div>
          <Link href="/products" className="text-sm font-semibold text-leaf hover:underline">
            সব দেখুন →
          </Link>
        </div>
        <ProductGrid products={products} loading={loading} />
      </section>

      {/* R&D / Future products */}
      {(loading || rndProducts.length > 0) && (
        <section className="bg-sage-100/60 py-14">
          <div className="container-px">
            <div className="mb-6">
              <span className="leaf-badge inline-block bg-turmeric px-3 py-1 pl-2 text-xs font-bold text-white">
                শীঘ্রই আসছে
              </span>
              <h2 className="mt-3 text-2xl font-medium">Future / R&amp;D products</h2>
              <p className="font-bangla text-sm text-ink/50">
                আমরা যেসব নতুন পণ্য নিয়ে কাজ করছি
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {(loading ? Array.from({ length: 4 }) : rndProducts).map((p, i) => (
                <div
                  key={p?.id || i}
                  className="card relative flex flex-col overflow-hidden border-dashed p-4 opacity-90"
                >
                  <span className="absolute right-3 top-3 rounded-full bg-forest px-2 py-0.5 text-[10px] font-bold text-white">
                    Coming soon
                  </span>
                  {loading ? (
                    <div className="aspect-square animate-pulse rounded-lg bg-sage-100" />
                  ) : (
                    <>
                      <div className="flex aspect-square items-center justify-center rounded-lg bg-sage-100 text-3xl">
                        🧪
                      </div>
                      <p className="mt-3 text-sm font-semibold">{p.name_en}</p>
                      <p className="font-bangla text-xs text-ink/50">{p.name_bn}</p>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}