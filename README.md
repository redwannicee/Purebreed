# Purebreed — e-commerce starter

A guest-checkout grocery/food storefront for Purebreed, built with Next.js
(App Router) + Tailwind CSS on the frontend and Firebase (Firestore + Auth,
Spark free plan) on the backend. Customers browse and check out with no
account; the admin panel is the only part that requires login.

See `firestore-structure.md` for the database design and `firestore.rules`
for the security model — read those before deploying.

---

## 1. Run it locally

```bash
npm install
cp .env.local.example .env.local   # then fill in your Firebase keys (step 2)
npm run dev
```

Open http://localhost:3000. The storefront will render but show empty
product grids until Firebase is connected and you've added a product (step 4).

---

## 2. Create and connect your Firebase project

1. Go to https://console.firebase.google.com → **Add project** → name it
   `purebreed` (or similar) → you can leave Google Analytics off.
2. **Build → Firestore Database → Create database** → start in
   **production mode** → pick a region close to Bangladesh (e.g.
   `asia-south1` or `asia-southeast1`).
3. **Build → Authentication → Get started → Email/Password** → enable it.
   Then **Users → Add user** and create your one admin login (this is the
   only account that will ever exist — customers never sign up).
4. **Project settings (gear icon) → General → Your apps → Web (`</>`)** →
   register an app (nickname anything, no hosting setup needed) → copy the
   `firebaseConfig` values into `.env.local`:

   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=...
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
   NEXT_PUBLIC_FIREBASE_APP_ID=...
   ```

   These are safe to expose in the browser bundle — Firebase's security
   model is enforced by `firestore.rules`, not by hiding these values.

5. Deploy the security rules and indexes so the app's queries actually work:

   ```bash
   npm install -g firebase-tools
   firebase login
   firebase use --add        # pick your project, give it an alias like "default"
   firebase deploy --only firestore:rules,firestore:indexes
   ```

   (If you'd rather not install the CLI: paste the contents of
   `firestore.rules` into **Firestore → Rules** in the console manually, and
   let indexes auto-create themselves the first time each query runs — see
   the note at the bottom of `firestore-structure.md`.)

---

## 3. Add your first products

```bash
npm run dev
```

Go to http://localhost:3000/admin/login, sign in with the admin account
from step 2.3, then **Products → Add product**. Fill in the name, price,
category, and an image URL (upload the photo anywhere public for now — a
Firebase Storage bucket, or even a temporary image host — and paste the
URL; wiring up direct Storage uploads from the form is a natural next
iteration once you're ready). Check **Active** so it shows on the
storefront, or **Future / R&D product** to put it in the "Coming Soon"
section instead.

---

## 4. Push to GitHub

```bash
cd purebreed
git init
git add .
git commit -m "Initial Purebreed storefront"
gh repo create purebreed --private --source=. --push
# or, without the GitHub CLI:
#   create an empty repo on github.com, then:
#   git remote add origin https://github.com/<you>/purebreed.git
#   git branch -M main
#   git push -u origin main
```

`.env.local` is already in `.gitignore` — your Firebase keys won't be
committed. You'll re-enter them as environment variables on your hosting
platform in the next step.

---

## 5. Deploy

### Recommended: Vercel

Vercel is the natural fit for a Next.js app and its free Hobby tier covers
this project comfortably — pair it with Firestore/Auth on the Spark plan
and the whole stack costs nothing at this scale.

1. https://vercel.com → **Add New → Project** → import your GitHub repo.
2. In **Environment Variables**, add the same six `NEXT_PUBLIC_FIREBASE_*`
   keys from your `.env.local`.
3. Deploy. Every push to `main` redeploys automatically from then on.

### Alternative: Netlify

Same idea — import the repo, add the same environment variables, use the
build command `next build` (Netlify's Next.js runtime handles the rest).

### Alternative: Firebase Hosting

⚠️ One important caveat: this app uses dynamic routes (`/products/[slug]`)
rendered per-request, and Firebase Hosting's Next.js/SSR support runs those
requests through **Cloud Functions**, which requires upgrading to the
**Blaze (pay-as-you-go)** plan — Cloud Functions isn't part of the Spark
free tier. If staying entirely on Spark matters more than using Firebase
Hosting specifically, deploy the frontend to Vercel or Netlify (both free)
and keep only Firestore + Auth on Firebase's Spark plan, as recommended
above. If you do want Firebase Hosting anyway:

```bash
firebase init hosting   # choose "Next.js" web framework support when asked
firebase deploy
```

---

## Project structure

```
src/
  app/                    Next.js App Router pages
    page.js                 Home
    products/                Product listing + /products/[slug] detail
    cart/, checkout/          Guest cart & checkout
    about/, terms/, privacy/, contact/   Policy & info pages
    admin/                   login, dashboard, products, orders (auth-gated)
  components/              Header, Footer, ProductCard/Grid, checkout widgets,
                            AdminSidebar, ProtectedRoute
  context/                 CartContext (localStorage-backed guest cart),
                            AuthContext (Firebase Auth session for admin)
  lib/
    firebase.js              Firebase app/Firestore/Auth initialization
    products.js, orders.js   All Firestore reads/writes, one place each
    policyContent.js          The Bangla legal copy, shared by footer + pages
    utils.js                  Formatting + shared constants
firestore.rules             Security rules
firestore.indexes.json      Composite indexes the queries need
firestore-structure.md      Database design notes
```

## Design notes

The palette is drawn from the Purebreed mark: deep forest (`#0B3D22`) and
leaf green (`#178A4C`) as the primary brand colors, a bright mint
(`#4ADE80`) picked up from the logo's gradient highlight, and a
turmeric/spice amber (`#E8A33D`) as the sale/accent color — a nod to the
spices in the product line rather than a generic accent. Bangla copy uses
Hind Siliguri throughout (`font-bangla` utility class); English headings
use Fraunces, body text uses Manrope.

## Known trade-offs / next steps

- **Image uploads**: the admin product form takes an image *URL* rather
  than a direct file upload. Wiring up Firebase Storage uploads from the
  form is the natural next step once you're past the prototype stage.
- **Payment verification**: bKash/Nagad/bank transfers are collected as a
  transaction ID + phone number for the admin to manually verify against
  their bKash/Nagad merchant panel — there's no live payment gateway
  integration (none was in scope for the Spark free tier).
- One correction from the original policy text: the privacy section as
  given read "personal data is protected confidentially and **is** sold to
  third parties," which reads as an accidental drop of "না" (not). It's
  been rendered as "...and is **not** sold to third parties" throughout the
  site — please double-check that's the intended meaning before launch.
