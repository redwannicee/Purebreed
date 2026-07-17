const OPTIONS = [
  { id: "home_delivery", title_en: "Home Delivery", title_bn: "হোম ডেলিভারি", desc_bn: "১-৫ কার্যদিবসের মধ্যে আপনার ঠিকানায় পৌঁছে যাবে" },
  { id: "pickup", title_en: "Pickup", title_bn: "পিকআপ", desc_bn: "আমাদের ফ্যাক্টরি থেকে সরাসরি সংগ্রহ করুন" },
];

export default function DeliveryOptions({ value, onChange }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {OPTIONS.map((opt) => (
        <label
          key={opt.id}
          className={`card flex cursor-pointer flex-col gap-1 p-4 transition-colors ${
            value === opt.id ? "border-leaf ring-1 ring-leaf" : "hover:border-leaf/40"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-ink">{opt.title_en}</span>
            <input
              type="radio"
              name="deliveryMethod"
              value={opt.id}
              checked={value === opt.id}
              onChange={() => onChange(opt.id)}
              className="h-4 w-4 accent-leaf"
            />
          </div>
          <span className="font-bangla text-xs text-ink/60">{opt.title_bn} — {opt.desc_bn}</span>
        </label>
      ))}
    </div>
  );
}
