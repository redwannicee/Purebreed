"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal } from "lucide-react";
import ProductGrid from "@/components/ProductGrid";
import { getActiveProducts, getRnDProducts } from "@/lib/products";
import { CATEGORIES } from "@/lib/utils";

function ProductsInner() {
  const params = useSearchParams();
  const initialCategory = params.get("category") || "all";
  const initialQuery = params.get("q") || "";
  const isRnd = params.get("rnd") === "1";
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(initialCategory);
  const [query, setQuery] = useState(initialQuery);
  const [sort, setSort] = useState("featured");
  const [inStock, setInStock] = useState(false);

  useEffect(() => {
    setLoading(true);
    (isRnd ? getRnDProducts() : getActiveProducts()).then(setProducts).catch(() => setProducts([])).finally(() => setLoading(false));
  }, [isRnd]);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    const list = products.filter((p) => (category === "all" || p.category === category) && (!inStock || p.stock > 0) && (!term || `${p.name_en} ${p.name_bn || ""} ${p.description_en || ""}`.toLowerCase().includes(term)));
    return [...list].sort((a, b) => sort === "price-low" ? (a.discountPrice || a.price) - (b.discountPrice || b.price) : sort === "price-high" ? (b.discountPrice || b.price) - (a.discountPrice || a.price) : 0);
  }, [products, category, query, inStock, sort]);

  return (
    <div className="container-px py-10 sm:py-14">
      <div className="rounded-[2rem] bg-forest px-6 py-10 text-white sm:px-10"><p className="eyebrow !text-mint">{isRnd ? "New ideas, ready to taste" : "Pure food, clear choices"}</p><h1 className="mt-2 text-4xl font-semibold sm:text-5xl">{isRnd ? "R&D Products" : "Shop the pantry"}</h1><p className="font-bangla mt-3 text-white/65">{isRnd ? "আমাদের নতুন পরীক্ষিত পণ্য—এখনই কিনতে পারবেন" : "প্রতিদিনের রান্নার জন্য বিশ্বস্ত ও যত্নে তৈরি পণ্য"}</p></div>
      <div className="mt-8 grid gap-8 lg:grid-cols-[230px_1fr]">
        <aside className="h-fit rounded-2xl border border-forest/10 bg-white p-5 lg:sticky lg:top-28"><div className="flex items-center gap-2 font-bold text-forest"><SlidersHorizontal size={18} /> Filters</div><div className="mt-5 border-t border-forest/10 pt-5"><p className="text-xs font-extrabold uppercase tracking-wider text-ink/40">Category</p><div className="mt-3 space-y-1"><button onClick={() => setCategory("all")} className={`w-full rounded-lg px-3 py-2 text-left text-sm font-semibold ${category === "all" ? "bg-forest text-white" : "hover:bg-sage-100"}`}>All products</button>{CATEGORIES.map((c) => <button key={c.id} onClick={() => setCategory(c.id)} className={`w-full rounded-lg px-3 py-2 text-left text-sm font-semibold ${category === c.id ? "bg-forest text-white" : "hover:bg-sage-100"}`}>{c.label_en}</button>)}</div></div><label className="mt-5 flex items-center gap-2 border-t border-forest/10 pt-5 text-sm font-semibold"><input type="checkbox" checked={inStock} onChange={(e) => setInStock(e.target.checked)} className="h-4 w-4 accent-leaf" /> In stock only</label></aside>
        <div><div className="mb-6 flex flex-col gap-3 sm:flex-row"><label className="relative flex-1"><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/35" size={18} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search this collection" className="input-field !pl-11" /></label><select value={sort} onChange={(e) => setSort(e.target.value)} className="input-field sm:max-w-48" aria-label="Sort products"><option value="featured">Featured</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option></select></div><p className="mb-4 text-xs font-semibold text-ink/45">{loading ? "Loading products…" : `${filtered.length} products found`}</p><ProductGrid products={filtered} loading={loading} emptyMessage="No products match those filters. Try clearing one." /></div>
      </div>
    </div>
  );
}

export default function ProductsPage() { return <Suspense fallback={<div className="container-px py-20 text-center text-sm text-ink/50">Loading products…</div>}><ProductsInner /></Suspense>; }
