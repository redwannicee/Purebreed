"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Leaf, ShoppingBag, Star } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { formatBDT } from "@/lib/utils";

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const { has, toggle } = useWishlist();
  const saved = has(product.id);
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;

  return (
    <article className="card group relative flex flex-col overflow-hidden transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <Link href={`/products/${product.slug}`} className="relative block aspect-[4/4.3] overflow-hidden bg-gradient-to-br from-sage-100 to-[#e5eddf]">
        {product.imageUrl ? <Image src={product.imageUrl} alt={product.name_en} fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover transition-transform duration-500 group-hover:scale-105" /> : <div className="flex h-full items-center justify-center"><Leaf size={56} strokeWidth={1.2} className="text-leaf/30" /></div>}
        {hasDiscount && <span className="absolute left-3 top-3 rounded-full bg-turmeric px-3 py-1 text-[11px] font-extrabold text-white">SAVE {Math.round((1 - product.discountPrice / product.price) * 100)}%</span>}
        {product.isRnD && <span className={`absolute left-3 rounded-full bg-forest px-3 py-1 text-[11px] font-extrabold text-mint ${hasDiscount ? "top-12" : "top-3"}`}>R&amp;D RELEASE</span>}
      </Link>
      <button type="button" onClick={() => toggle(product)} className={`absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 shadow-sm transition ${saved ? "text-red-500" : "text-forest hover:text-red-500"}`} aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}><Heart size={18} fill={saved ? "currentColor" : "none"} /></button>
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center gap-1 text-[11px] font-bold text-turmeric"><Star size={13} fill="currentColor" /><span>4.8</span><span className="font-medium text-ink/35">(24)</span></div>
        <Link href={`/products/${product.slug}`} className="mt-2 line-clamp-2 text-sm font-bold leading-5 text-forest hover:text-leaf">{product.name_en}</Link>
        {product.name_bn && <p className="font-bangla mt-0.5 truncate text-xs text-ink/45">{product.name_bn}</p>}
        <div className="mt-auto flex items-end justify-between gap-2 pt-3"><div><span className="text-base font-extrabold text-leaf">{formatBDT(hasDiscount ? product.discountPrice : product.price)}</span>{hasDiscount && <span className="ml-2 text-xs text-ink/35 line-through">{formatBDT(product.price)}</span>}<p className="text-[11px] text-ink/40">{product.unit || "per pack"}</p></div><button type="button" onClick={() => addItem(product, 1)} disabled={product.stock <= 0} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-forest text-white transition hover:bg-leaf disabled:bg-ink/20" aria-label={`Add ${product.name_en} to cart`}><ShoppingBag size={17} /></button></div>
      </div>
    </article>
  );
}
