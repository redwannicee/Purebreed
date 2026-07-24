"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Circle, MessageCircle, PackageSearch, XCircle } from "lucide-react";
import { getOrderByNumber } from "@/lib/orders";
import { STATUS_LABELS, STATUS_STYLES } from "@/lib/utils";

// Matches the same progression the admin dashboard uses (see lib/utils.js
// ORDER_STATUSES) so the customer-facing labels never drift out of sync
// with what the admin actually sees and sets.
const TRACKING_STEPS = ["pending", "confirmed", "processing", "shipped", "delivered"];

export default function TrackOrderPage() {
  const [number, setNumber] = useState("");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState("");

  // Convenience only — prefills the box with the last order number placed
  // on this device. The actual status always comes from a live Firestore
  // lookup below, never from this cached value.
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("purebreed_last_order") || "null");
      if (saved?.orderNumber) setNumber(saved.orderNumber);
    } catch {
      // ignore corrupted/absent local data
    }
  }, []);

  async function handleLookup(e) {
    e?.preventDefault();
    const trimmed = number.trim();
    if (!trimmed) return;

    setLoading(true);
    setError("");
    setSearched(true);
    try {
      const found = await getOrderByNumber(trimmed);
      setOrder(found);
      if (!found) setError("We couldn't find an order with that number. Double-check it and try again.");
    } catch (err) {
      setError("Something went wrong looking that up. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const currentStepIndex = order ? TRACKING_STEPS.indexOf(order.status) : -1;
  const isCancelled = order?.status === "cancelled";

  return (
    <div className="container-px py-12 sm:py-16">
      <div className="mx-auto max-w-2xl">
        <div className="text-center">
          <PackageSearch className="mx-auto text-leaf" size={42} />
          <p className="eyebrow mt-4">Order updates</p>
          <h1 className="section-title mt-2">Track your order</h1>
          <p className="mt-3 text-sm text-ink/55">
            Enter your Purebreed order number to see its live status.
          </p>
        </div>

        <form onSubmit={handleLookup} className="card mt-8 p-6">
          <label className="text-xs font-bold uppercase tracking-wider text-ink/45">Order number</label>
          <div className="mt-2 flex gap-2">
            <input
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              placeholder="PB-YYYYMMDD-0000"
              className="input-field font-mono"
            />
            <button type="submit" disabled={loading} className="btn-primary shrink-0 !px-5">
              {loading ? "…" : "Track"}
            </button>
          </div>

          {searched && !loading && error && (
            <p className="mt-3 text-sm text-ink/55">{error}</p>
          )}

          {order && (
            <div className="mt-7 border-t border-forest/10 pt-6">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-mono text-sm font-bold text-forest">{order.orderNumber}</p>
                  {order.createdAt && (
                    <p className="mt-1 text-xs text-ink/45">
                      Placed{" "}
                      {(order.createdAt?.toDate ? order.createdAt.toDate() : new Date(order.createdAt))
                        .toLocaleDateString("en-BD")}
                    </p>
                  )}
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-bold ${STATUS_STYLES[order.status]}`}>
                  {STATUS_LABELS[order.status]}
                </span>
              </div>

              {isCancelled ? (
                <div className="mt-6 flex items-center gap-3 rounded-xl bg-red-50 p-4">
                  <XCircle className="shrink-0 text-red-500" size={22} />
                  <p className="text-sm font-semibold text-red-600">
                    This order was cancelled. Contact us on WhatsApp if you believe this is a mistake.
                  </p>
                </div>
              ) : (
                <div className="mt-7 space-y-4">
                  {TRACKING_STEPS.map((step, i) => {
                    const done = currentStepIndex >= i;
                    return (
                      <div key={step} className="flex items-center gap-3">
                        {done ? (
                          <CheckCircle2 className="shrink-0 text-leaf" size={21} />
                        ) : (
                          <Circle className="shrink-0 text-ink/20" size={21} />
                        )}
                        <span className={`text-sm font-semibold ${done ? "text-forest" : "text-ink/35"}`}>
                          {STATUS_LABELS[step]}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          <a
            href={`https://wa.me/8801570252667?text=${encodeURIComponent(
              `Hello Purebreed, please update me on order ${number || ""}`
            )}`}
            target="_blank"
            rel="noreferrer"
            className="btn-secondary mt-6 w-full"
          >
            <MessageCircle size={17} /> Get a live update on WhatsApp
          </a>
        </form>
      </div>
    </div>
  );
}
