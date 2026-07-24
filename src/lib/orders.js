// All Firestore access for the `orders` collection. Order items are
// embedded (see firestore-structure.md) so reading an order never needs
// a second read against `products` — important on the Spark plan.
import {
  collection,
  doc,
  setDoc,
  updateDoc,
  getDoc,
  getDocs,
  getCountFromServer,
  query,
  where,
  orderBy,
  limit as fsLimit,
  serverTimestamp,
} from "firebase/firestore";
import { db, isFirebaseConfigured } from "./firebase";

const ordersRef = collection(db, "orders");

function generateOrderNumber() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `PB-${y}${m}${d}-${rand}`;
}

// Guest checkout: anyone may create an order (see firestore.rules), but
// only the admin can browse/list the full collection back — customers
// never need an account to place one.
//
// The order number is used as the actual Firestore document ID (instead
// of an auto-ID) so a customer can later look their order up directly by
// number on /track-order without needing to log in.
export async function createOrder({ customer, deliveryMethod, items, deliveryFee, payment, notes }) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const total = subtotal + (deliveryFee || 0);
  const orderNumber = generateOrderNumber();

  const order = {
    orderNumber,
    status: "pending",
    customer,
    deliveryMethod,
    items,
    subtotal,
    deliveryFee: deliveryFee || 0,
    total,
    payment,
    notes: notes || "",
    createdAt: isFirebaseConfigured ? serverTimestamp() : new Date().toISOString(),
    updatedAt: isFirebaseConfigured ? serverTimestamp() : new Date().toISOString(),
  };

  if (!isFirebaseConfigured) return { id: `local-${Date.now()}`, ...order };

  await setDoc(doc(db, "orders", orderNumber), order);
  return { id: orderNumber, ...order };
}

// Public, customer-facing lookup: fetches a single order by its order
// number. This is a Firestore "get" (single known document), which
// firestore.rules allows publicly — unlike "list" queries (browsing many
// orders at once), which stay admin-only. Knowing the exact order number
// is effectively the access key here, the same trade-off most guest
// order-tracking flows make.
export async function getOrderByNumber(orderNumber) {
  if (!isFirebaseConfigured || !orderNumber) return null;
  const snap = await getDoc(doc(db, "orders", orderNumber.trim().toUpperCase()));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

// --- Admin-only below ---

export async function getOrders({ status, pageLimit = 50 } = {}) {
  if (!isFirebaseConfigured) return [];
  const clauses = [];
  if (status && status !== "all") clauses.push(where("status", "==", status));
  const q = query(ordersRef, ...clauses, orderBy("createdAt", "desc"), fsLimit(pageLimit));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function getOrderById(id) {
  const snap = await getDoc(doc(db, "orders", id));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function updateOrderStatus(id, status) {
  return updateDoc(doc(db, "orders", id), {
    status,
    updatedAt: serverTimestamp(),
  });
}

// Aggregate counts (e.g. for the dashboard overview) are billed as ~1 read
// per 1000 matched index entries, not one read per document — far cheaper
// than fetching every order just to count them.
export async function countOrdersByStatus(status) {
  if (!isFirebaseConfigured) return 0;
  const q = status ? query(ordersRef, where("status", "==", status)) : ordersRef;
  const snap = await getCountFromServer(q);
  return snap.data().count;
}
