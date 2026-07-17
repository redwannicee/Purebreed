"use client";

import { useEffect, useState } from "react";
import { getOrders, updateOrderStatus } from "@/lib/orders";
import { formatBDT, ORDER_STATUSES, STATUS_LABELS, STATUS_STYLES } from "@/lib/utils";

const PAYMENT_LABELS = {
  bkash: "bKash",
  nagad: "Nagad",
  bank_transfer: "Bank Transfer",
  cod: "Cash on Delivery",
};

function OrderRow({ order, onStatusChange }) {
  const [open, setOpen] = useState(false);
  const [updating, setUpdating] = useState(false);

  async function handleStatus(status) {
    setUpdating(true);
    try {
      await updateOrderStatus(order.id, status);
      onStatusChange(order.id, status);
    } finally {
      setUpdating(false);
    }
  }

  return (
    <div className="card overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full flex-wrap items-center justify-between gap-3 p-4 text-left"
      >
        <div>
          <p className="font-mono text-xs text-ink/50">{order.orderNumber}</p>
          <p className="text-sm font-semibold">{order.customer?.name} · {order.customer?.phone}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold">{formatBDT(order.total)}</span>
          <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_STYLES[order.status]}`}>
            {STATUS_LABELS[order.status]}
          </span>
          <span className="text-ink/40">{open ? "▲" : "▼"}</span>
        </div>
      </button>

      {open && (
        <div className="space-y-4 border-t border-forest/10 p-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase text-ink/40">Delivery</p>
              <p className="text-sm">{order.deliveryMethod === "home_delivery" ? "Home delivery" : "Pickup"}</p>
              {order.customer?.address && <p className="text-sm text-ink/60">{order.customer.address} {order.customer.area}</p>}
            </div>
            <div>
              <p className="text-xs font-semibold uppercase text-ink/40">Payment</p>
              <p className="text-sm">{PAYMENT_LABELS[order.payment?.method] || order.payment?.method}</p>
              {order.payment?.transactionId && (
                <p className="font-mono text-xs text-ink/60">
                  TxID: {order.payment.transactionId} · {order.payment.senderPhone}
                </p>
              )}
            </div>
          </div>

          <div>
            <p className="mb-1 text-xs font-semibold uppercase text-ink/40">Items</p>
            <div className="space-y-1">
              {order.items?.map((item, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span>{item.name_en} × {item.qty}</span>
                  <span className="font-semibold">{formatBDT(item.subtotal)}</span>
                </div>
              ))}
            </div>
          </div>

          {order.notes && (
            <div>
              <p className="text-xs font-semibold uppercase text-ink/40">Notes</p>
              <p className="text-sm text-ink/70">{order.notes}</p>
            </div>
          )}

          <div>
            <p className="mb-1 text-xs font-semibold uppercase text-ink/40">Update status</p>
            <div className="flex flex-wrap gap-2">
              {ORDER_STATUSES.map((s) => (
                <button
                  key={s}
                  disabled={updating || order.status === s}
                  onClick={() => handleStatus(s)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors disabled:opacity-40 ${
                    order.status === s ? "border-leaf bg-leaf text-white" : "border-forest/15 hover:border-leaf hover:text-leaf"
                  }`}
                >
                  {STATUS_LABELS[s]}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    let active = true;
    setLoading(true);
    getOrders({ status: statusFilter, pageLimit: 100 })
      .then((data) => active && setOrders(data))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [statusFilter]);

  function handleLocalStatusChange(id, status) {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
  }

  return (
    <div>
      <h1 className="text-2xl font-medium">Orders</h1>
      <p className="text-sm text-ink/50">Track and update incoming customer orders.</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {["all", ...ORDER_STATUSES].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
              statusFilter === s ? "border-leaf bg-leaf text-white" : "border-forest/15 bg-white hover:border-leaf"
            }`}
          >
            {s === "all" ? "All" : STATUS_LABELS[s]}
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-3">
        {loading ? (
          <p className="text-sm text-ink/50">Loading…</p>
        ) : orders.length === 0 ? (
          <p className="text-sm text-ink/50">No orders found.</p>
        ) : (
          orders.map((order) => (
            <OrderRow key={order.id} order={order} onStatusChange={handleLocalStatusChange} />
          ))
        )}
      </div>
    </div>
  );
}
