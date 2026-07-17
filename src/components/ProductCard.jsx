"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatBDT } from "@/lib/utils";

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;

  return (
    <div className="card group relative flex flex-col overflow-hidden animate-riseIn">
      <Link href={`/products/${product.slug}`} className="relative block aspect-square overflow-hidden bg-sage-100">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name_en}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-4xl">🌿</div>
        )}
        {hasDiscount && (
          <span className="leaf-badge absolute left-0 top-3 bg-turmeric px-3 py-1.5 pl-2 text-xs font-bold text-white">
            SALE
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-1 p-4">
        <p className="font-bangla text-xs text-forest-700/60">{product.name_bn}</p>
        <Link href={`/products/${product.slug}`} className="line-clamp-2 text-sm font-semibold text-ink hover:text-leaf">
          {product.name_en}
        </Link>
        {product.unit && <p className="text-xs text-ink/50">{product.unit}</p>}

        <div className="mt-2 flex items-center gap-2">
          <span className="text-base font-bold text-leaf">
            {formatBDT(hasDiscount ? product.discountPrice : product.price)}
          </span>
          {hasDiscount && (
            <span className="text-sm text-ink/40 line-through">{formatBDT(product.price)}</span>
          )}
        </div>

        <button
          type="button"
          onClick={() => addItem(product, 1)}
          disabled={product.stock <= 0}
          className="btn-primary mt-3 w-full !py-2 text-xs"
        >
          {product.stock > 0 ? "কার্টে যোগ করুন" : "স্টক নেই"}
        </button>
      </div>
    </div>
  );
}
