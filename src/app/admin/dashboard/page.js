"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { countProducts } from "@/lib/products";
import { countOrdersByStatus, getOrders } from "@/lib/orders";
import { formatBDT, STATUS_LABELS, STATUS_STYLES } from "@/lib/utils";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    Promise.all([
      countProducts(),
      countProducts({ activeOnly: true }),
      countOrdersByStatus("pending"),
      getOrders({ pageLimit: 6 }),
    ])
      .then(([totalProducts, activeProducts, pendingOrders, orders]) => {
        if (!active) return;
        setStats({ totalProducts, activeProducts, pendingOrders });
        setRecentOrders(orders);
      })
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-medium">Overview</h1>
      <p className="text-sm text-ink/50">Quick snapshot of your store.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="card p-5">
          <p className="text-xs font-semibold uppercase text-ink/40">Total products</p>
          <p className="mt-2 text-3xl font-bold">{loading ? "–" : stats.totalProducts}</p>
        </div>
        <div className="card p-5">
          <p className="text-xs font-semibold uppercase text-ink/40">Active products</p>
          <p className="mt-2 text-3xl font-bold text-leaf">{loading ? "–" : stats.activeProducts}</p>
        </div>
        <div className="card p-5">
          <p className="text-xs font-semibold uppercase text-ink/40">Pending orders</p>
          <p className="mt-2 text-3xl font-bold text-turmeric">{loading ? "–" : stats.pendingOrders}</p>
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between">
        <h2 className="font-semibold">Recent orders</h2>
        <Link href="/admin/orders" className="text-sm font-semibold text-leaf hover:underline">
          View all →
        </Link>
      </div>

      <div className="card mt-3 divide-y divide-forest/10 overflow-hidden">
        {loading ? (
          <p className="p-4 text-sm text-ink/50">Loading…</p>
        ) : recentOrders.length === 0 ? (
          <p className="p-4 text-sm text-ink/50">No orders yet.</p>
        ) : (
          recentOrders.map((order) => (
            <div key={order.id} className="flex items-center justify-between gap-3 p-4">
              <div className="min-w-0">
                <p className="font-mono text-xs text-ink/50">{order.orderNumber}</p>
                <p className="truncate text-sm font-semibold">{order.customer?.name}</p>
              </div>
              <span className="shrink-0 text-sm font-semibold">{formatBDT(order.total)}</span>
              <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_STYLES[order.status]}`}>
                {STATUS_LABELS[order.status]}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
