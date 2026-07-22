"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, LogOut, Package, ShoppingCart, Store } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const LINKS = [
  ["/admin/dashboard", "Overview", LayoutDashboard],
  ["/admin/products", "Products", Package],
  ["/admin/orders", "Orders", ShoppingCart],
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, user } = useAuth();
  return <aside className="w-full shrink-0 border-b border-forest/10 bg-forest p-4 text-white md:min-h-screen md:w-64 md:border-b-0 md:p-6"><div className="hidden md:block"><Image src="/logo-purebreed-dark.png" alt="Purebreed" width={145} height={65} className="h-12 w-auto" /><p className="mt-2 text-xs font-bold uppercase tracking-[0.18em] text-mint">Commerce admin</p></div><nav className="flex gap-2 overflow-x-auto md:mt-9 md:flex-col md:overflow-visible">{LINKS.map(([href,label,Icon])=><Link key={href} href={href} className={`flex items-center gap-3 whitespace-nowrap rounded-xl px-3 py-3 text-sm font-bold transition ${pathname === href ? "bg-white text-forest" : "text-white/70 hover:bg-white/10 hover:text-white"}`}><Icon size={18}/>{label}</Link>)}<Link href="/" className="flex items-center gap-3 whitespace-nowrap rounded-xl px-3 py-3 text-sm font-bold text-white/70 hover:bg-white/10 hover:text-white"><Store size={18}/>View store</Link></nav><div className="mt-auto hidden border-t border-white/10 pt-5 md:block md:fixed md:bottom-6 md:w-[13.5rem]"><p className="truncate text-xs text-white/50">{user?.email}</p><button type="button" onClick={async()=>{await logout();router.push("/admin/login");}} className="mt-3 flex items-center gap-2 text-sm font-bold text-white/75 hover:text-white"><LogOut size={16}/>Sign out</button></div></aside>;
}
