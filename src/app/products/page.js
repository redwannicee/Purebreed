"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import ProductGrid from "@/components/ProductGrid";
import { getActiveProducts, getRnDProducts } from "@/lib/products";
import { CATEGORIES } from "@/lib/utils";

function ProductsInner() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category") || "all";
  const isRnd = searchParams.get("rnd") === "1";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    const fetcher = isRnd ? getRnDProducts() : getActiveProducts({ category });
    fetcher
      .then((data) => active && setProducts(data))
      .catch(() => active && setProducts([]))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [category, isRnd]);

  return (
    <div className="container-px py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-medium">
          {isRnd ? "Future / R&D Products" : "All Products"}
        </h1>
        <p className="font-bangla text-sm text-ink/50">
          {isRnd ? "শীঘ্রই আসছে এমন পণ্যসমূহ" : "আমাদের সব পণ্য এখানে দেখুন"}
        </p>
      </div>

      {!isRnd && (
        <div className="mb-8 flex flex-wrap gap-2">
          <a
            href="/products"
            className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
              category === "all"
                ? "border-leaf bg-leaf text-white"
                : "border-forest/15 bg-white text-forest-700 hover:border-leaf hover:text-leaf"
            }`}
          >
            All
          </a>
          {CATEGORIES.map((c) => (
            <a
              key={c.id}
              href={`/products?category=${c.id}`}
              className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                category === c.id
                  ? "border-leaf bg-leaf text-white"
                  : "border-forest/15 bg-white text-forest-700 hover:border-leaf hover:text-leaf"
              }`}
            >
              {c.label_en}
            </a>
          ))}
        </div>
      )}

      <ProductGrid products={products} loading={loading} />
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="container-px py-10 text-sm text-ink/50">Loading…</div>}>
      <ProductsInner />
    </Suspense>
  );
}
