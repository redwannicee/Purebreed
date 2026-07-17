# Firestore structure

Two flat, top-level collections — no subcollections. Flat structure means
every list query is a single collection read with no per-document fan-out,
which is what keeps this comfortably inside the Spark plan's 50k reads /
20k writes per day.

## `products/{productId}`

```ts
{
  name_en: string,            // "Organic Mustard Oil"
  name_bn: string,             // "জৈব সরিষার তেল"
  slug: string,                 // "organic-mustard-oil" — used in /products/[slug]
  description_en: string,
  description_bn: string,
  category: string,             // "spices" | "oil" | "pickle" | "drinks" | "grocery"
  price: number,                 // regular price, BDT
  discountPrice: number | null,  // discounted price, or null if not on sale
  unit: string,                   // "500g", "1L", etc.
  imageUrl: string,               // Firebase Storage URL or any public image URL
  stock: number,
  isActive: boolean,              // false = hidden from the storefront
  isFeatured: boolean,            // shown in the homepage "Popular" row
  isRnD: boolean,                 // true = shown only in the "Future / R&D" section
  createdAt: Timestamp,
  updatedAt: Timestamp,
}
```

**Reads this drives:**
- Storefront grid → `where isActive==true, isRnD==false [, where category==X], orderBy createdAt desc`
- R&D section → `where isActive==true, isRnD==true, orderBy createdAt desc`
- Product page → `where slug==X, where isActive==true`

Each of those is **one read per product returned** — nothing per-visit beyond
what's actually rendered on screen.

## `orders/{orderId}`

```ts
{
  orderNumber: string,      // "PB-20260717-4821" — human-friendly, shown to the customer
  status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled",
  customer: {
    name: string,
    phone: string,
    address: string,        // empty string for pickup orders
    area: string,
  },
  deliveryMethod: "pickup" | "home_delivery",
  items: [                  // embedded snapshot at time of order — see below
    {
      productId: string,
      name_en: string,
      name_bn: string,
      price: number,        // price actually charged (already discounted)
      qty: number,
      subtotal: number,
    }
  ],
  subtotal: number,
  deliveryFee: number,
  total: number,
  payment: {
    method: "bkash" | "nagad" | "cod" | "bank_transfer",
    transactionId: string | null,   // manual verification, bKash/Nagad/bank only
    senderPhone: string | null,
    verified: boolean,              // admin flips this after checking the transaction
  },
  notes: string,
  createdAt: Timestamp,
  updatedAt: Timestamp,
}
```

**Why `items` is embedded rather than referencing `products/{id}`:** viewing
an order (or the admin order list) never needs a second read against the
`products` collection. It also freezes the price and product name at the
moment of purchase, so a later price change or product rename doesn't alter
historical orders.

**Reads this drives:**
- Admin order list → `orderBy createdAt desc [, where status==X], limit(N)` — one read per order shown, paginated with `limit()` so an old store doesn't cost more each day.
- Dashboard counts → `getCountFromServer()` (aggregation queries bill at roughly 1 read per 1,000 matched index entries, not one per document — cheap even at scale).

## Why no `users` collection

Customers never create an account (per the guest-checkout requirement), so
there's no user profile to store and no auth writes on the customer side.
The only Firebase Auth user is the admin.

## Security rules summary (`firestore.rules`)

| Collection | Read | Write |
|---|---|---|
| `products` | anyone | admin only |
| `orders` | admin only | **create**: anyone (guest checkout, shape-validated) · **update**: admin only · **delete**: nobody |

Order documents are never publicly readable — customer phone numbers and
addresses stay private, consistent with the privacy policy on the site.

## Staying inside the Spark plan as you grow

- Paginate the admin order list (`limit()` — already wired up, defaults to 50).
- Keep product images in Firebase Storage at reasonable sizes (Spark includes 5GB storage / 1GB/day download) or use an external image CDN if your catalog gets image-heavy.
- Use `getCountFromServer()` for any "how many X" stat instead of fetching every document just to count it — already used on the dashboard.
- If a query in `src/lib/products.js` or `src/lib/orders.js` throws a "the query requires an index" error the first time you run it, Firestore's error message includes a direct link to auto-create that exact index — click it once and the query works from then on. `firestore.indexes.json` already lists the indexes this app needs, so `firebase deploy --only firestore:indexes` provisions them all at once.
