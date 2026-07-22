"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import ProductGrid from "@/components/ProductGrid";
import { useWishlist } from "@/context/WishlistContext";

export default function WishlistPage() {
  const { items } = useWishlist();
  return <div className="container-px py-12"><p className="eyebrow">Saved for later</p><h1 className="section-title mt-2">Your wishlist</h1>{items.length ? <div className="mt-8"><ProductGrid products={items} /></div> : <div className="card mt-8 flex flex-col items-center px-6 py-20 text-center"><Heart size={44} className="text-leaf/35" /><h2 className="mt-4 text-xl font-semibold text-forest">Nothing saved yet</h2><p className="mt-2 max-w-sm text-sm text-ink/50">Tap the heart on any product to keep it here for your next order.</p><Link href="/products" className="btn-primary mt-6">Explore products</Link></div>}</div>;
}
