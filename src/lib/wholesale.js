// B2B quote requests are a separate, simple collection: public create only
// (no login for prospective wholesale customers either), admin-only read.
// No composite queries needed yet, so no extra indexes required — the
// admin can browse these directly in the Firestore console for now.
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

const wholesaleRef = collection(db, "wholesale_requests");

export async function createWholesaleRequest({
  name,
  company,
  phone,
  estimatedQty,
  partnershipType,
  notes,
}) {
  return addDoc(wholesaleRef, {
    name,
    company,
    phone,
    estimatedQty: estimatedQty || "",
    partnershipType,
    notes: notes || "",
    status: "new",
    createdAt: serverTimestamp(),
  });
}