import Image from "next/image";
import { formatBDT } from "@/lib/utils";
import { CONTACT_INFO } from "@/lib/policyContent";

const PAYMENT_LABELS = {
  bkash: "bKash",
  nagad: "Nagad",
  bank_transfer: "Bank Transfer",
  cod: "Cash on Delivery",
};

function formatDate(timestamp) {
  if (!timestamp) return "—";
  const date = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp);
  return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

// A receipt is "Paid" once the admin has ticked payment.verified — that
// flag already exists in the order schema (set during manual bKash/Nagad/
// bank-transfer verification, or implicitly true once a COD order is
// marked delivered). Nothing new to track, just a clear read of it.
function getPaymentStatus(order) {
  if (order.payment?.verified) return "Paid";
  if (order.status === "cancelled") return "Cancelled";
  return "Pending";
}

const STATUS_BADGE_STYLES = {
  Paid: "bg-mint-soft text-forest-400",
  Pending: "bg-turmeric-soft text-turmeric",
  Cancelled: "bg-red-50 text-red-600",
};

// This is the printable/exportable surface itself — deliberately plain
// inline-friendly Tailwind (no hover/transition classes) since it needs to
// render identically in the live DOM, in the print stylesheet, and inside
// html2canvas's rasterizer for the PDF export.
export default function OrderReceipt({ order }) {
  if (!order) return null;

  const paymentStatus = getPaymentStatus(order);

  return (
    <div
      id="printable-receipt"
      className="relative mx-auto w-full max-w-[210mm] overflow-hidden bg-white p-10 text-ink print:p-0"
    >
      {/* Faint watermark — subtle brand presence, never competes with content */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden"
      >
        <span className="rotate-[-28deg] select-none font-display text-[150px] font-bold text-forest/[0.03]">
          PUREBREED
        </span>
      </div>

      <div className="relative">
        {/* Header */}
        <div className="flex items-start justify-between gap-6 border-b-2 border-forest pb-6">
          <div className="flex items-start gap-3">
            <Image
              src="/logo-purebreed.png"
              alt="Purebreed"
              width={56}
              height={56}
              className="h-14 w-14 object-contain"
            />
            <div>
              <p className="font-display text-xl font-bold text-forest">Purebreed</p>
              {/* Placeholder — replace with your registered business address */}
              <p className="mt-0.5 max-w-[220px] text-xs leading-relaxed text-ink/50">
                Business Address Line 1, Thakurgaon, Rangpur, Bangladesh
              </p>
              <p className="mt-0.5 text-xs text-ink/50">
                {CONTACT_INFO.whatsapp} · {CONTACT_INFO.facebook.replace("https://www.", "")}
              </p>
            </div>
          </div>

          <div className="text-right">
            <p className="eyebrow">Receipt</p>
            <p className="mt-1 font-mono text-lg font-bold text-forest">{order.orderNumber}</p>
            <p className="mt-1 text-xs text-ink/50">{formatDate(order.createdAt)}</p>
            <span
              className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-bold ${STATUS_BADGE_STYLES[paymentStatus]}`}
            >
              {paymentStatus}
            </span>
          </div>
        </div>

        {/* Customer + delivery info */}
        <div className="mt-6 grid grid-cols-2 gap-6">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wide text-ink/40">Billed To</p>
            <p className="mt-1 text-sm font-semibold text-ink">{order.customer?.name}</p>
            <p className="text-sm text-ink/70">{order.customer?.phone}</p>
            {order.customer?.address && (
              <p className="mt-0.5 max-w-[240px] text-sm text-ink/70">
                {order.customer.address}
                {order.customer.area ? `, ${order.customer.area}` : ""}
              </p>
            )}
          </div>
          <div className="text-right">
            <p className="text-[11px] font-bold uppercase tracking-wide text-ink/40">Delivery Method</p>
            <p className="mt-1 text-sm font-semibold text-ink">
              {order.deliveryMethod === "home_delivery" ? "Home Delivery" : "Pickup"}
            </p>
            <p className="mt-3 text-[11px] font-bold uppercase tracking-wide text-ink/40">Order Status</p>
            <p className="mt-1 text-sm font-semibold capitalize text-ink">{order.status}</p>
          </div>
        </div>

        {/* Items table */}
        <table className="mt-8 w-full border-collapse text-sm">
          <thead>
            <tr className="bg-forest text-white print:bg-forest">
              <th className="rounded-l-lg px-3 py-2.5 text-left text-xs font-bold uppercase tracking-wide">
                Item
              </th>
              <th className="px-3 py-2.5 text-center text-xs font-bold uppercase tracking-wide">Qty</th>
              <th className="px-3 py-2.5 text-right text-xs font-bold uppercase tracking-wide">Unit Price</th>
              <th className="rounded-r-lg px-3 py-2.5 text-right text-xs font-bold uppercase tracking-wide">
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            {order.items?.map((item, i) => (
              <tr key={i} className="border-b border-forest/10">
                <td className="px-3 py-3">
                  <p className="font-semibold text-ink">{item.name_en}</p>
                  {item.name_bn && <p className="font-bangla text-xs text-ink/40">{item.name_bn}</p>}
                </td>
                <td className="px-3 py-3 text-center text-ink/70">{item.qty}</td>
                <td className="px-3 py-3 text-right text-ink/70">{formatBDT(item.price)}</td>
                <td className="px-3 py-3 text-right font-semibold text-ink">{formatBDT(item.subtotal)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Summary */}
        <div className="mt-4 flex justify-end">
          <div className="w-64 space-y-1.5">
            <div className="flex justify-between text-sm text-ink/60">
              <span>Subtotal</span>
              <span>{formatBDT(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm text-ink/60">
              <span>Delivery / Handling</span>
              <span>{order.deliveryFee ? formatBDT(order.deliveryFee) : "Free"}</span>
            </div>
            <div className="mt-2 flex justify-between border-t-2 border-forest pt-2 text-base font-bold text-forest">
              <span>Grand Total</span>
              <span>{formatBDT(order.total)}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-10 grid grid-cols-2 gap-6 border-t border-forest/10 pt-6">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wide text-ink/40">Payment Method</p>
            <p className="mt-1 text-sm font-semibold text-ink">
              {PAYMENT_LABELS[order.payment?.method] || order.payment?.method || "—"}
            </p>
            {order.payment?.transactionId && (
              <p className="mt-1 font-mono text-xs text-ink/50">
                Txn ID: {order.payment.transactionId}
              </p>
            )}
          </div>
          <div className="text-right">
            <p className="font-bangla text-sm font-semibold text-leaf">ধন্যবাদ আমাদের সাথে থাকার জন্য</p>
            <p className="mt-1 text-xs text-ink/40">
              Thank you for shopping with Purebreed. For questions about this order, contact us via
              WhatsApp at {CONTACT_INFO.whatsapp}.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
