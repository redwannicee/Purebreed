"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { formatBDT } from "@/lib/utils";

export default function CartPage() {
  const { items, subtotal, removeItem, setQty } = useCart();

  if (items.length === 0) {
    return (
      <div className="container-px flex flex-col items-center gap-4 py-24 text-center">
        <span className="text-4xl">🧺</span>
        <p className="font-bangla text-ink/60">আপনার কার্ট খালি আছে</p>
        <Link href="/products" className="btn-primary">
          কেনাকাটা শুরু করুন
        </Link>
      </div>
    );
  }

  return (
    <div className="container-px py-10">
      <h1 className="mb-6 text-2xl font-medium">Your Cart <span className="font-bangla text-base text-ink/50">· কার্ট</span></h1>

      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.productId} className="card flex items-center gap-4 p-3">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-sage-100">
                {item.imageUrl ? (
                  <Image src={item.imageUrl} alt={item.name_en} fill className="object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-xl">🌿</div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{item.name_en}</p>
                <p className="font-bangla truncate text-xs text-ink/50">{item.name_bn}</p>
                <p className="text-sm font-semibold text-leaf">{formatBDT(item.price)}</p>
              </div>
              <div className="flex items-center rounded-full border border-forest/15">
                <button
                  type="button"
                  onClick={() => setQty(item.productId, item.qty - 1)}
                  className="px-3 py-1 text-base"
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="w-6 text-center text-sm">{item.qty}</span>
                <button
                  type="button"
                  onClick={() => setQty(item.productId, item.qty + 1)}
                  className="px-3 py-1 text-base"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
              <button
                type="button"
                onClick={() => removeItem(item.productId)}
                className="text-ink/40 hover:text-red-500"
                aria-label={`Remove ${item.name_en}`}
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        <div className="card h-fit p-5">
          <h2 className="font-semibold">Order summary</h2>
          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="text-ink/60">Subtotal</span>
            <span className="font-semibold">{formatBDT(subtotal)}</span>
          </div>
          <p className="mt-1 text-xs text-ink/40">Delivery fee calculated at checkout.</p>
          <Link href="/checkout" className="btn-primary mt-5 w-full">
            চেকআউট করুন
          </Link>
        </div>
      </div>
    </div>
  );
}
