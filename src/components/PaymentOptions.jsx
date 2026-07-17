const METHODS = [
  { id: "bkash", label: "bKash", icon: "📱", number: "01570-252667 (Personal)" },
  { id: "nagad", label: "Nagad", icon: "📱", number: "01570-252667 (Personal)" },
  { id: "bank_transfer", label: "Bank Transfer", label_bn: "ব্যাংক ট্রান্সফার", icon: "🏦", number: "Purebreed Ltd. — details on request" },
  { id: "cod", label: "Cash on Delivery", label_bn: "ক্যাশ অন ডেলিভারি", icon: "💵", number: null },
];

export default function PaymentOptions({ method, onMethodChange, transactionId, onTransactionIdChange, senderPhone, onSenderPhoneChange }) {
  const selected = METHODS.find((m) => m.id === method);
  const needsManualVerification = method === "bkash" || method === "nagad" || method === "bank_transfer";

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {METHODS.map((m) => (
          <label
            key={m.id}
            className={`card flex cursor-pointer flex-col items-center gap-1 p-3 text-center transition-colors ${
              method === m.id ? "border-leaf ring-1 ring-leaf" : "hover:border-leaf/40"
            }`}
          >
            <span className="text-xl">{m.icon}</span>
            <span className="text-xs font-semibold">{m.label}</span>
            <input
              type="radio"
              name="paymentMethod"
              className="sr-only"
              checked={method === m.id}
              onChange={() => onMethodChange(m.id)}
            />
          </label>
        ))}
      </div>

      {needsManualVerification && selected && (
        <div className="card space-y-3 p-4">
          <p className="font-bangla text-xs text-ink/70">
            <strong>{selected.number}</strong> নম্বরে পেমেন্ট করে নিচের তথ্য দিন। যাচাইয়ের পর অর্ডার নিশ্চিত করা হবে।
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold text-ink/70">Transaction ID</label>
              <input
                type="text"
                className="input-field"
                placeholder="e.g. 8N7K2P1XYZ"
                value={transactionId}
                onChange={(e) => onTransactionIdChange(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-ink/70">Sender phone number</label>
              <input
                type="tel"
                className="input-field"
                placeholder="01XXXXXXXXX"
                value={senderPhone}
                onChange={(e) => onSenderPhoneChange(e.target.value)}
                required
              />
            </div>
          </div>
        </div>
      )}

      {method === "cod" && (
        <p className="font-bangla card p-4 text-xs text-ink/70">
          ডেলিভারির সময় পণ্য গ্রহণ করে নগদ পরিশোধ করুন।
        </p>
      )}
    </div>
  );
}
