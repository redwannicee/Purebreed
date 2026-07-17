export function formatBDT(amount) {
  const value = Number(amount || 0);
  return `৳${value.toLocaleString("en-BD")}`;
}

export const CATEGORIES = [
  { id: "spices", label_en: "Spices", label_bn: "মসলা" },
  { id: "oil", label_en: "Oils", label_bn: "তেল" },
  { id: "pickle", label_en: "Pickles", label_bn: "আচার" },
  { id: "drinks", label_en: "Healthy Drinks", label_bn: "স্বাস্থ্যকর পানীয়" },
  { id: "grocery", label_en: "Grocery", label_bn: "মুদি পণ্য" },
];

export const ORDER_STATUSES = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

export const STATUS_LABELS = {
  pending: "Pending",
  confirmed: "Confirmed",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export const STATUS_STYLES = {
  pending: "bg-turmeric-soft text-turmeric",
  confirmed: "bg-mint-soft text-forest-400",
  processing: "bg-sage-100 text-forest-400",
  shipped: "bg-leaf/10 text-leaf",
  delivered: "bg-forest-50 text-forest-700",
  cancelled: "bg-red-50 text-red-600",
};
