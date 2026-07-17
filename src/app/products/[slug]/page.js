"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getProductBySlug } from "@/lib/products";
import { useCart } from "@/context/CartContext";
import { formatBDT } from "@/lib/utils";

export default function ProductDetailPage() {
  const { slug } = useParams();
  const router = useRouter();
  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    let active = true;
    getProductBySlug(slug)
      .then((p) => active && setProduct(p))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [slug]);

  if (loading) {
    return <div className="container-px py-16 text-center text-sm text-ink/50">Loading…</div>;
  }

  if (!product) {
    return (
      <div className="container-px flex flex-col items-center gap-3 py-20 text-center">
        <p className="text-lg font-semibold">পণ্যটি খুঁজে পাওয়া যায়নি</p>
        <button onClick={() => router.push("/products")} className="btn-primary">
          সব পণ্য দেখুন
        </button>
      </div>
    );
  }

  const hasDiscount = product.discountPrice && product.discountPrice < product.price;

  return (
    <div className="container-px py-10">
      <div className="grid gap-10 md:grid-cols-2">
        <div className="card relative aspect-square overflow-hidden bg-sage-100">
          {product.imageUrl ? (
            <Image src={product.imageUrl} alt={product.name_en} fill className="object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-6xl">🌿</div>
          )}
        </div>

        <div>
          <p className="font-bangla text-sm text-ink/50">{product.name_bn}</p>
          <h1 className="mt-1 text-3xl font-medium">{product.name_en}</h1>
          {product.unit && <p className="mt-1 text-sm text-ink/50">{product.unit}</p>}

          <div className="mt-4 flex items-center gap-3">
            <span className="text-2xl font-bold text-leaf">
              {formatBDT(hasDiscount ? product.discountPrice : product.price)}
            </span>
            {hasDiscount && (
              <span className="text-lg text-ink/40 line-through">{formatBDT(product.price)}</span>
            )}
          </div>

          {(product.description_bn || product.description_en) && (
            <div className="mt-6 space-y-2">
              {product.description_bn && (
                <p className="font-bangla text-sm leading-relaxed text-ink/70">{product.description_bn}</p>
              )}
              {product.description_en && (
                <p className="text-sm leading-relaxed text-ink/60">{product.description_en}</p>
              )}
            </div>
          )}

          <div className="mt-8 flex items-center gap-4">
            <div className="flex items-center rounded-full border border-forest/15">
              <button
                type="button"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="px-4 py-2 text-lg"
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span className="w-8 text-center text-sm font-semibold">{qty}</span>
              <button
                type="button"
                onClick={() => setQty((q) => q + 1)}
                className="px-4 py-2 text-lg"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
            <button
              type="button"
              disabled={product.stock <= 0}
              onClick={() => {
                addItem(product, qty);
                setAdded(true);
                setTimeout(() => setAdded(false), 2000);
              }}
              className="btn-primary flex-1"
            >
              {product.stock > 0 ? (added ? "কার্টে যোগ হয়েছে ✓" : "কার্টে যোগ করুন") : "স্টক নেই"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
