"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import DeliveryOptions from "@/components/DeliveryOptions";
import PaymentOptions from "@/components/PaymentOptions";
import { createOrder } from "@/lib/orders";
import { formatBDT } from "@/lib/utils";

const DELIVERY_FEE_HOME = 80;
const DELIVERY_FEE_PICKUP = 0;

export default function CheckoutPage() {
  const { items, subtotal, clear } = useCart();
  const router = useRouter();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [area, setArea] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState("home_delivery");
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [transactionId, setTransactionId] = useState("");
  const [senderPhone, setSenderPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  const deliveryFee = deliveryMethod === "home_delivery" ? DELIVERY_FEE_HOME : DELIVERY_FEE_PICKUP;
  const total = subtotal + deliveryFee;
  const needsManualVerification = ["bkash", "nagad", "bank_transfer"].includes(paymentMethod);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!name.trim() || !phone.trim()) {
      setError("নাম ও ফোন নম্বর আবশ্যক।");
      return;
    }
    if (deliveryMethod === "home_delivery" && !address.trim()) {
      setError("হোম ডেলিভারির জন্য ঠিকানা আবশ্যক।");
      return;
    }
    if (needsManualVerification && (!transactionId.trim() || !senderPhone.trim())) {
      setError("পেমেন্ট যাচাইয়ের জন্য Transaction ID ও ফোন নম্বর দিন।");
      return;
    }

    setSubmitting(true);
    try {
      const order = await createOrder({
        customer: { name: name.trim(), phone: phone.trim(), address: address.trim(), area: area.trim() },
        deliveryMethod,
        items: items.map((i) => ({
          productId: i.productId,
          name_en: i.name_en,
          name_bn: i.name_bn,
          price: i.price,
          qty: i.qty,
          subtotal: i.price * i.qty,
        })),
        deliveryFee,
        payment: {
          method: paymentMethod,
          transactionId: needsManualVerification ? transactionId.trim() : null,
          senderPhone: needsManualVerification ? senderPhone.trim() : null,
          verified: false,
        },
        notes,
      });
      setConfirmedOrder(order);
      window.localStorage.setItem("purebreed_last_order", JSON.stringify({
        orderNumber: order.orderNumber,
        placedAt: new Date().toISOString(),
        total,
      }));
      clear();
    } catch (err) {
      setError("অর্ডার সাবমিট করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      setSubmitting(false);
    }
  }

  if (confirmedOrder) {
    return (
      <div className="container-px flex flex-col items-center gap-4 py-24 text-center">
        <span className="text-4xl">✅</span>
        <h1 className="text-2xl font-medium">অর্ডার সফল হয়েছে!</h1>
        <p className="text-ink/60">
          Order number: <span className="font-mono font-semibold text-leaf">{confirmedOrder.orderNumber}</span>
        </p>
        <p className="max-w-md text-sm text-ink/50">
          আমরা শীঘ্রই আপনার সাথে যোগাযোগ করে অর্ডারটি নিশ্চিত করব। ধন্যবাদ Purebreed-কে বেছে নেওয়ার জন্য।
        </p>
        <Link href="/products" className="btn-primary">
          আরও কেনাকাটা করুন
        </Link>
        <Link href="/track-order" className="btn-secondary">Track this order</Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container-px flex flex-col items-center gap-4 py-24 text-center">
        <p className="text-ink/60">আপনার কার্ট খালি — চেকআউট করার আগে পণ্য যোগ করুন।</p>
        <Link href="/products" className="btn-primary">কেনাকাটা শুরু করুন</Link>
      </div>
    );
  }

  return (
    <div className="container-px py-10">
      <h1 className="mb-8 text-2xl font-medium">Checkout <span className="font-bangla text-base text-ink/50">· চেকআউট</span></h1>

      <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-[1fr_340px]">
        <div className="space-y-8">
          <section className="card space-y-4 p-5">
            <h2 className="font-semibold">গ্রাহকের তথ্য</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-semibold text-ink/70">Full name *</label>
                <input className="input-field" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-ink/70">Phone number *</label>
                <input className="input-field" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required />
              </div>
            </div>
            {deliveryMethod === "home_delivery" && (
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-xs font-semibold text-ink/70">Address *</label>
                  <input className="input-field" value={address} onChange={(e) => setAddress(e.target.value)} required />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-ink/70">Area / City</label>
                  <input className="input-field" value={area} onChange={(e) => setArea(e.target.value)} />
                </div>
              </div>
            )}
          </section>

          <section className="space-y-3">
            <h2 className="font-semibold">ডেলিভারি অপশন</h2>
            <DeliveryOptions value={deliveryMethod} onChange={setDeliveryMethod} />
          </section>

          <section className="space-y-3">
            <h2 className="font-semibold">পেমেন্ট পদ্ধতি</h2>
            <PaymentOptions
              method={paymentMethod}
              onMethodChange={setPaymentMethod}
              transactionId={transactionId}
              onTransactionIdChange={setTransactionId}
              senderPhone={senderPhone}
              onSenderPhoneChange={setSenderPhone}
            />
          </section>

          <section>
            <label className="mb-1 block text-xs font-semibold text-ink/70">Order notes (optional)</label>
            <textarea className="input-field" rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} />
          </section>
        </div>

        <div className="card h-fit space-y-3 p-5">
          <h2 className="font-semibold">Order summary</h2>
          {items.map((item) => (
            <div key={item.productId} className="flex items-center justify-between text-sm">
              <span className="truncate pr-2 text-ink/70">{item.name_en} × {item.qty}</span>
              <span className="shrink-0 font-semibold">{formatBDT(item.price * item.qty)}</span>
            </div>
          ))}
          <div className="border-t border-forest/10 pt-3 text-sm">
            <div className="flex justify-between text-ink/60">
              <span>Subtotal</span>
              <span>{formatBDT(subtotal)}</span>
            </div>
            <div className="mt-1 flex justify-between text-ink/60">
              <span>Delivery</span>
              <span>{deliveryFee ? formatBDT(deliveryFee) : "Free"}</span>
            </div>
            <div className="mt-2 flex justify-between text-base font-bold">
              <span>Total</span>
              <span className="text-leaf">{formatBDT(total)}</span>
            </div>
          </div>

          {error && <p className="font-bangla text-xs text-red-600">{error}</p>}

          <button type="submit" disabled={submitting} className="btn-primary w-full">
            {submitting ? "সাবমিট হচ্ছে…" : "অর্ডার নিশ্চিত করুন"}
          </button>
        </div>
      </form>
    </div>
  );
}
