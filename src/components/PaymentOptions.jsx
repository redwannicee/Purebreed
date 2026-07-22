import { Banknote, Building2, Smartphone } from "lucide-react";

const METHODS = [
  { id: "bkash", label: "bKash", Icon: Smartphone, number: "01570-252667 (Personal)" },
  { id: "nagad", label: "Nagad", Icon: Smartphone, number: "01570-252667 (Personal)" },
  { id: "bank_transfer", label: "Bank Transfer", Icon: Building2, number: "Purebreed Ltd. — details on request" },
  { id: "cod", label: "Cash on Delivery", Icon: Banknote, number: null },
];

export default function PaymentOptions({ method, onMethodChange, transactionId, onTransactionIdChange, senderPhone, onSenderPhoneChange }) {
  const selected = METHODS.find((m) => m.id === method);
  const needsManualVerification = ["bkash", "nagad", "bank_transfer"].includes(method);
  return <div className="space-y-4"><div className="grid grid-cols-2 gap-3 sm:grid-cols-4">{METHODS.map(({id,label,Icon})=><label key={id} className={`card flex cursor-pointer flex-col items-center gap-2 p-4 text-center transition ${method===id?"border-leaf ring-2 ring-leaf/15":"hover:border-leaf/40"}`}><Icon size={22} className={method===id?"text-leaf":"text-forest/55"}/><span className="text-xs font-bold">{label}</span><input type="radio" name="paymentMethod" className="sr-only" checked={method===id} onChange={()=>onMethodChange(id)}/></label>)}</div>{needsManualVerification&&selected&&<div className="card space-y-3 p-4"><p className="font-bangla text-xs leading-5 text-ink/70"><strong>{selected.number}</strong> নম্বরে পেমেন্ট করে নিচের তথ্য দিন। যাচাইয়ের পর অর্ডার নিশ্চিত করা হবে।</p><div className="grid gap-3 sm:grid-cols-2"><div><label className="mb-1 block text-xs font-bold text-ink/70">Transaction ID</label><input className="input-field" value={transactionId} onChange={(e)=>onTransactionIdChange(e.target.value)} required/></div><div><label className="mb-1 block text-xs font-bold text-ink/70">Sender phone number</label><input type="tel" className="input-field" value={senderPhone} onChange={(e)=>onSenderPhoneChange(e.target.value)} required/></div></div></div>}{method==="cod"&&<p className="font-bangla card p-4 text-xs text-ink/70">ডেলিভারির সময় পণ্য গ্রহণ করে নগদ পরিশোধ করুন।</p>}</div>;
}
