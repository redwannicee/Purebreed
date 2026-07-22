# Purebreed ecommerce upgrade

## What changed

- Rebuilt the home page around customer trust, product discovery and clear calls to action.
- Added global product search, category filtering, stock filtering and price sorting.
- Added dedicated Pastes and purchasable R&D Products navigation and collections.
- Added a device-local wishlist and a redesigned cart with a free-delivery progress indicator.
- Expanded product pages with ratings, trust signals, delivery guidance and clearer purchase controls.
- Added FAQ, help/contact and device-secure recent-order tracking experiences.
- Redesigned the admin navigation and dashboard with revenue, fulfilment and catalog KPIs.
- Replaced emoji UI symbols with one consistent Lucide icon system.
- Refined the English/Bangla typography and added a dedicated social sharing image.
- Replaced the storefront header logo with the supplied original Purebreed artwork and optimized its transparent canvas for navigation use.
- Added realistic demo products when Firebase is not configured, while preserving the existing Firebase-backed production flows.
- Upgraded Next.js, React, Firebase, Lucide and patched nested dependencies. The final dependency audit reports zero known vulnerabilities.

## Before going live

1. Copy `.env.local.example` to `.env.local` and add the production Firebase values.
2. Set `NEXT_PUBLIC_SITE_URL` to the final HTTPS domain.
3. Deploy the included Firestore rules and indexes.
4. Create the Firebase admin user and verify the checkout payment details, delivery fee and contact information.
5. Replace demo or placeholder catalog entries with real product photography and product data in Firestore.

Without Firebase values the storefront intentionally runs in demo mode. Cart, wishlist and the most recent order work locally on the device; admin login and durable order storage require Firebase.
