"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Heart, Menu, Search, ShoppingBag, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

const NAV_LINKS = [
  { href: "/products", label: "Shop" },
  { href: "/products?category=spices", label: "Spices" },
  { href: "/products?category=oil", label: "Oils" },
  { href: "/products?category=paste", label: "Pastes" },
  { href: "/products?rnd=1", label: "R&D Products" },
  { href: "/wholesale", label: "Wholesale" },
  { href: "/about", label: "Our story" },
];

export default function Header() {
  const { count } = useCart();
  const { items: wishlist } = useWishlist();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const pathname = usePathname();
  const router = useRouter();

  function submitSearch(event) {
    event.preventDefault();
    if (query.trim()) router.push(`/products?q=${encodeURIComponent(query.trim())}`);
  }

  if (pathname.startsWith("/admin")) return null;

  return (
    <>
      <div className="bg-forest px-4 py-2 text-center text-xs font-semibold text-white">
        Free delivery over ৳1,500 <span className="mx-2 text-mint">•</span> Cash on delivery available
      </div>
      <header className="sticky top-0 z-40 border-b border-forest/10 bg-white/95 backdrop-blur-xl">
        <div className="container-px flex h-20 items-center gap-5">
          <button type="button" className="rounded-full p-2 md:hidden" onClick={() => setOpen(true)} aria-label="Open menu">
            <Menu size={22} />
          </button>
          <Link href="/" className="shrink-0" aria-label="Purebreed home">
            <Image src="/logo-purebreed.png" alt="Purebreed" width={285} height={182} priority className="h-14 w-auto" />
          </Link>

          <nav className="hidden items-center gap-6 lg:flex">
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="text-sm font-bold text-forest-700 transition-colors hover:text-leaf">
                {link.label}
              </Link>
            ))}
          </nav>

          <form onSubmit={submitSearch} className="ml-auto hidden max-w-sm flex-1 md:block">
            <label className="relative block">
              <span className="sr-only">Search products</span>
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/40" size={18} />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search spices, oils, pickles…" className="input-field !rounded-full !pl-11" />
            </label>
          </form>

          <div className="flex items-center gap-1 sm:gap-2">
            <Link href="/wishlist" className="relative rounded-full p-3 text-forest hover:bg-sage-100" aria-label={`Wishlist with ${wishlist.length} items`}>
              <Heart size={21} />
              {wishlist.length > 0 && <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-turmeric px-1 text-[10px] font-bold text-white">{wishlist.length}</span>}
            </Link>
            <Link href="/cart" className="relative rounded-full p-3 text-forest hover:bg-sage-100" aria-label={`Cart with ${count} items`}>
              <ShoppingBag size={22} />
              {count > 0 && <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-leaf px-1 text-[10px] font-bold text-white">{count}</span>}
            </Link>
          </div>
        </div>
      </header>

      {open && (
        <div className="fixed inset-0 z-50 bg-forest/35 backdrop-blur-sm md:hidden" onClick={() => setOpen(false)}>
          <aside className="h-full w-[86%] max-w-sm bg-white p-5 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <Image src="/logo-purebreed.png" alt="Purebreed" width={285} height={182} className="h-14 w-auto" />
              <button type="button" className="rounded-full p-2 hover:bg-sage-100" onClick={() => setOpen(false)} aria-label="Close menu"><X size={22} /></button>
            </div>
            <form onSubmit={submitSearch} className="mt-6"><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search products…" className="input-field" /></form>
            <nav className="mt-6 flex flex-col">
              {NAV_LINKS.map((link) => <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className="border-b border-forest/10 py-4 text-base font-bold text-forest">{link.label}</Link>)}
              <Link href="/track-order" onClick={() => setOpen(false)} className="border-b border-forest/10 py-4 font-bold text-forest">Track order</Link>
              <Link href="/faq" onClick={() => setOpen(false)} className="border-b border-forest/10 py-4 font-bold text-forest">Help &amp; FAQs</Link>
            </nav>
          </aside>
        </div>
      )}
    </>
  );
}
