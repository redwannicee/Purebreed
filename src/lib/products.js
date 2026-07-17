// All Firestore access for the `products` collection lives here so the
// query shape (and therefore read cost) is defined in exactly one place.
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  getCountFromServer,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";

const productsRef = collection(db, "products");

// Storefront: active, non-R&D products. One read per document returned —
// keep this list small per page (see LIMITATIONS in firestore-structure.md)
// if you outgrow the free tier's 50k reads/day.
export async function getActiveProducts({ category } = {}) {
  const clauses = [where("isActive", "==", true), where("isRnD", "==", false)];
  if (category && category !== "all") {
    clauses.push(where("category", "==", category));
  }
  const q = query(productsRef, ...clauses, orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

// Storefront: "Future / R&D" showcase section.
export async function getRnDProducts() {
  const q = query(
    productsRef,
    where("isActive", "==", true),
    where("isRnD", "==", true),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function getProductBySlug(slug) {
  const q = query(productsRef, where("slug", "==", slug), where("isActive", "==", true));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { id: d.id, ...d.data() };
}

// --- Admin-only below (writes are blocked by Firestore rules unless the
// caller is signed in as the admin — see firestore.rules) ---

export async function getAllProductsAdmin() {
  const q = query(productsRef, orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function createProduct(data) {
  return addDoc(productsRef, {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function updateProduct(id, data) {
  return updateDoc(doc(db, "products", id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteProduct(id) {
  return deleteDoc(doc(db, "products", id));
}

export async function getProductById(id) {
  const snap = await getDoc(doc(db, "products", id));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function countProducts({ activeOnly = false } = {}) {
  const q = activeOnly ? query(productsRef, where("isActive", "==", true)) : productsRef;
  const snap = await getCountFromServer(q);
  return snap.data().count;
}
