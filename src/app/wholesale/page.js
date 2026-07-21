"use client";

import { useState } from "react";
import {
  Package,
  Tag,
  Building2,
  Store,
  UtensilsCrossed,
  Hotel,
} from "lucide-react";
import { createWholesaleRequest } from "@/lib/wholesale";

const OFFERINGS = [
  { icon: Package, title_en: "Bulk Orders", title_bn: "বাল্ক অর্ডার" },
  { icon: Tag, title_en: "Private Label", title_bn: "প্রাইভেট লেবেল" },
  { icon: Building2, title_en: "Distributor Opportunities", title_bn: "ডিস্ট্রিবিউটর সুযোগ" },
  { icon: Store, title_en: "Retail Supply", title_bn: "রিটেইল সরবরাহ" },
  { icon: UtensilsCrossed, title_en: "Restaurant Supply", title_bn: "রেস্তোরাঁ সরবরাহ" },
  { icon: Hotel, title_en: "Hotel Supply", title_bn: "হোটেল সরবরাহ" },
];

const PARTNERSHIP_TYPES = [
  { id: "distributor", label: "Distributor" },
  { id: "retailer", label: "Retailer" },
  { id: "restaurant", label: "Restaurant" },
  { id: "hotel", label: "Hotel" },
  { id: "private_label", label: "Private Label" },
  { id: "other", label: "Other" },
];

export default function WholesalePage() {
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [estimatedQty, setEstimatedQty] = useState("");
  const [partnershipType, setPartnershipType] = useState(PARTNERSHIP_TYPES[0].id);
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!name.trim() || !phone.trim()) {
      setError("নাম ও ফোন নম্বর আবশ্যক।");
      return;
    }

    setSubmitting(true);
    try {
      await createWholesaleRequest({
        name: name.trim(),
        company: company.trim(),
        phone: phone.trim(),
        estimatedQty: estimatedQty.trim(),
        partnershipType,
        notes: notes.trim(),
      });
      setSubmitted(true);
    } catch (err) {
      setError("অনুরোধ পাঠাতে সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="container-px py-14">
      <div className="mx-auto max-w-2xl">
        <span className="inline-block rounded-full bg-sage-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-forest-700">
          B2B
        </span>
        <h1 className="mt-4 font-display text-4xl font-medium leading-tight sm:text-5xl">
          Grow your kitchen or shop with Purebreed.
        </h1>
        <p className="font-bangla mt-2 text-sm text-ink/50">
          পাইকারি ও ব্যবসায়িক অংশীদারিত্বের সুযোগ
        </p>
        <p className="mt-4 text-base leading-relaxed text-ink/70">
          From single restaurants to national distributors, we build reliable supply
          relationships with attractive volume pricing.
        </p>
      </div>

      <div className="mx-auto mt-10 grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {OFFERINGS.map((item) => (
          <div
            key={item.title_en}
            className="card flex flex-col gap-3 p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-forest/10"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-leaf text-white">
              <item.icon size={20} strokeWidth={2} />
            </div>
            <div>
              <p className="font-semibold text-ink">{item.title_en}</p>
              <p className="font-bangla text-xs text-ink/50">{item.title_bn}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mx-auto mt-10 max-w-2xl">
        {submitted ? (
          <div className="card flex flex-col items-center gap-3 p-10 text-center">
            <span className="text-4xl">✅</span>
            <h2 className="text-xl font-semibold">অনুরোধ পাঠানো হয়েছে!</h2>
            <p className="max-w-sm text-sm text-ink/60">
              ধন্যবাদ। আমাদের টিম শীঘ্রই আপনার সাথে যোগাযোগ করে বিস্তারিত আলোচনা করবে।
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="card space-y-4 p-6">
            <h2 className="font-display text-xl font-medium">Request a quotation</h2>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-semibold text-ink/70">Your name *</label>
                <input className="input-field" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-ink/70">Company / Shop</label>
                <input className="input-field" value={company} onChange={(e) => setCompany(e.target.value)} />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-ink/70">Phone *</label>
                <input type="tel" className="input-field" value={phone} onChange={(e) => setPhone(e.target.value)} required />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-ink/70">Estimated monthly quantity</label>
                <input className="input-field" placeholder="e.g. 200 units" value={estimatedQty} onChange={(e) => setEstimatedQty(e.target.value)} />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-ink/70">Type of partnership</label>
              <select className="input-field" value={partnershipType} onChange={(e) => setPartnershipType(e.target.value)}>
                {PARTNERSHIP_TYPES.map((t) => (
                  <option key={t.id} value={t.id}>{t.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-ink/70">Notes</label>
              <textarea className="input-field" rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} />
            </div>

            {error && <p className="font-bangla text-xs text-red-600">{error}</p>}

            <button type="submit" disabled={submitting} className="btn-primary">
              {submitting ? "Submitting…" : "Submit request"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}