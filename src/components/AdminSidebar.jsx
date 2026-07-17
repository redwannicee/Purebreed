"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const LINKS = [
  { href: "/admin/dashboard", label: "Overview", icon: "📊" },
  { href: "/admin/products", label: "Products", icon: "📦" },
  { href: "/admin/orders", label: "Orders", icon: "🧾" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, user } = useAuth();

  return (
    <aside className="w-full shrink-0 border-b border-forest/10 bg-white p-4 md:w-56 md:border-b-0 md:border-r md:p-6">
      <p className="mb-6 hidden text-xs font-semibold uppercase tracking-wide text-ink/40 md:block">
        Purebreed Admin
      </p>
      <nav className="flex gap-2 overflow-x-auto md:flex-col md:overflow-visible">
        {LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`whitespace-nowrap rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
              pathname === link.href ? "bg-leaf text-white" : "text-ink/70 hover:bg-sage-100"
            }`}
          >
            {link.icon} {link.label}
          </Link>
        ))}
      </nav>
      <div className="mt-6 hidden border-t border-forest/10 pt-4 md:block">
        <p className="truncate text-xs text-ink/50">{user?.email}</p>
        <button
          type="button"
          onClick={async () => {
            await logout();
            router.push("/admin/login");
          }}
          className="btn-secondary mt-2 w-full !py-1.5 text-xs"
        >
          Sign out
        </button>
      </div>
    </aside>
  );
}
