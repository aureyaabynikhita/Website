# AUREYAA — by Nikhita Matania

Luxury fashion e-commerce platform. Next.js 15 (App Router) + Firebase, fully custom
storefront/checkout/admin — no Shopify, no hosted platform dependency.

## Status: Phase 2 — Design System + Homepage ✅

Phase 1 gave you the skeleton. Phase 2 adds the design system (Button, Input,
FadeIn motion wrapper), Header/Footer, and a fully assembled editorial homepage
(Hero, New Arrivals, Shop by Category, Best Sellers, Designer Story, Reviews,
Instagram, Journal, Newsletter). **This now runs with `npm run dev`.**

### Before you run it
- Homepage images point to `/public/images/*.jpg` paths that **don't exist yet**
  (hero-main.jpg, cat-gowns.jpg, designer-portrait.jpg, instagram-1.jpg...6.jpg,
  journal-1.jpg...3.jpg, placeholder-1.jpg...8.jpg). Drop real photography in
  there with matching filenames, or swap the paths in the section components
  under `src/components/storefront/`.
- Product/category data is temporary mock data (`src/lib/mock-data.ts`) —
  gets replaced by real Firestore queries in Phase 4.

## Status: Phase 3 — Authentication ✅

Real auth, not a mockup:
- **Google, Email/Password, Phone/OTP** sign-in and email registration (`src/services/auth.ts`)
- On any successful sign-in, an **httpOnly session cookie** is minted server-side
  (`/api/auth/session`) via `firebase-admin` — this is what actually protects pages,
  not just client-side state
- `/account/*` and `/admin/*` are guarded twice: edge `middleware.ts` does a cheap
  cookie-presence redirect, and each route's `layout.tsx` does the real verification
  via `getServerSession()` (`src/lib/session.ts`), which also checks `role === "admin"`
  for the admin area
- First-time sign-in of any method auto-creates the Firestore `users/{uid}` doc

### Firebase console setup needed for this phase
1. Authentication → Sign-in method → enable **Google**, **Email/Password**, and **Phone**
2. Phone auth needs a real domain or `localhost` added under Authentication →
   Settings → Authorized domains (already includes localhost by default)
3. Phone/OTP uses invisible reCAPTCHA — no extra key needed, Firebase handles it,
   but it only works on `https://` or `localhost`, not on a raw IP
4. To make yourself an admin: manually add a doc at `admin/{your-uid}` in Firestore
   (any fields) — the security rules and admin layout both check for this doc's existence

## Status: Phase 4 — Database Service Layer ✅

Mock data is retired for products/categories. Real Firestore now powers:
- **Products & Categories** (`src/services/products.ts`, `categories.ts`) — server-side
  reads via `firebase-admin`, used directly in the homepage Server Component
- **Cart** (`src/services/cart.ts` + `useCart` hook) — Firestore-backed per signed-in
  user, `localStorage`-backed for guests, with an automatic merge into the account
  cart the moment someone logs in mid-session
- **Wishlist** (`src/services/wishlist.ts` + `useWishlist` hook) — requires an account;
  the heart icon on product cards redirects guests to `/login` instead of silently
  no-op'ing

### To see real data instead of an empty homepage
```bash
npm install        # picks up the new `tsx` dev dependency
npm run seed        # populates 4 categories + 4 sample products via scripts/seed.ts
npm run dev
```
The seed script uses the same `firebase-admin` credentials as the app (`.env.local`),
so set those up first (see Phase 1 setup above).

### Known limitation to fix later
`getNewArrivals`/`getBestSellers` filter on two fields and order by a third —
Firestore will ask you to create a composite index the first time you hit that
query (console gives you a one-click link in the error message the first time
it happens in dev). `searchProducts` is a placeholder `array-contains` match;
real search needs Algolia/Elasticsearch (flagged for a later phase, not forgotten).

## Status: Phase 5 — Admin Panel ✅ · Phase 6 — Storefront ✅

**Admin panel** (`/admin/*`, real `role: "admin"` gated):
- Dashboard with live revenue chart (recharts), stat cards, low-stock alerts —
  all computed from real Firestore data (`src/services/admin/*.ts`)
- Products: list + create/edit form, backed by `/api/admin/products`
- Orders: list with a live status-update dropdown (`/api/admin/orders`)
- Customers: read-only list
- Coupons: list + create form (`/api/admin/coupons`)
- CMS/Lookbook/Reviews/Returns/Support/Newsletter/Shipping/Payments/SEO/Roles are
  **placeholder pages only** — they exist so sidebar links don't 404, but have no
  real functionality yet. Build these out in a later phase as needed.

**Storefront** (real Firestore-backed, not mock data):
- PDP (`/product/[slug]`) — gallery, size selector, add-to-bag, fabric/care/styling
  accordion, related products, Product schema.org JSON-LD
- PLP (`/category/[slug]`) — client-side size/price filters over server-fetched
  products; `new-arrivals`/`best-sellers` handled as virtual collections
- Search (`/search`) — header search icon now opens a real overlay wired to it
- Cart page — real add/update/remove, checkout button intentionally disabled
  (that's Phase 7)
- Wishlist page — resolves saved IDs via `/api/wishlist`, prompts guests to log in

### Known gaps to close in later phases
- `getProductsByIds` uses Firestore `in` (30-id cap) — fine for a wishlist, not
  a scalable pattern elsewhere
- Admin product form doesn't yet manage per-variant size/stock — only base
  product fields. Add a variant editor before relying on this for real inventory.
- Placeholder admin sections listed above need actual builds before launch

## Status: Phases 7–10 — Checkout, Shipping, Payments, SEO/Deploy ✅

**Phase 7 — Checkout** (`/checkout`):
- Address form with live pincode serviceability check
- Coupon apply/remove, re-validated server-side (never trusts client-sent discounts)
- Gift wrap + gift note
- Guest checkout (email only) or logged-in checkout
- Order creation (`src/services/orders.ts`) re-verifies stock/price from Firestore,
  decrements variant stock in a transaction, computes tax/shipping/discount server-side
- Confirmation page acts as a lightweight order summary/invoice

**Phase 8 — Shipping**:
- Shiprocket (`src/services/shipping/shiprocket.ts`) — serviceability, order push, AWB generation, tracking
- Delhivery (`src/services/shipping/delhivery.ts`) — serviceability + shipment creation as an alternate/fallback carrier
- Unified entry point (`src/services/shipping/index.ts`) tries Shiprocket → Delhivery →
  **a generic fallback estimate** so checkout works even before real carrier keys are added
- Admin order detail page (`/admin/orders/[id]`) has a "Push to Shiprocket" button
  that creates the shipment + generates an AWB once payment is confirmed

**Phase 9 — Payments**:
- Razorpay (primary): order creation, checkout.js integration, signature verification
  on both the client callback (`/api/payments/razorpay/verify`) and a **webhook**
  (`/api/payments/webhook`) — the webhook is the real source of truth; register it
  in the Razorpay dashboard once deployed
- Cashfree: order/session creation + drop-in checkout redirect flow
- Stripe: service functions ready (`src/services/payments/stripe.ts`) but not wired
  into the checkout UI yet — add a payment method option if/when international
  cards are needed
- COD: confirms the order immediately, no gateway involved

**Phase 10 — SEO, Analytics, Deployment**:
- `sitemap.xml` (dynamic, includes every published product + category) and `robots.txt`
- Organization JSON-LD in the root layout; Product JSON-LD already on PDPs (Phase 6)
- GA4 / Meta Pixel / GTM — each loads only if its env var is set, otherwise silently skipped
- Deployment checklist below

### Setting up payments & shipping for real
1. **Razorpay**: dashboard.razorpay.com → get `RAZORPAY_KEY_ID`/`RAZORPAY_KEY_SECRET` →
   after deploying, add a webhook at Settings → Webhooks pointing to
   `https://yourdomain.com/api/payments/webhook`, subscribe to `payment.captured`,
   `payment.failed`, `refund.processed`, and copy the webhook secret into
   `RAZORPAY_WEBHOOK_SECRET`
2. **Cashfree**: merchant.cashfree.com → `CASHFREE_APP_ID`/`CASHFREE_SECRET_KEY`,
   start with `CASHFREE_ENV=TEST` / `NEXT_PUBLIC_CASHFREE_ENV=TEST`
3. **Shiprocket**: your existing login email/password go straight into
   `SHIPROCKET_EMAIL`/`SHIPROCKET_PASSWORD` — no separate API key needed, the
   service authenticates with these directly. You'll also need a **pickup
   location named "Primary"** configured in the Shiprocket dashboard (or update
   the `pickup_location` string in `src/services/shipping/shiprocket.ts` to match
   whatever you name it)
4. **Delhivery**: apply for API access, put the token in `DELHIVERY_API_TOKEN`
5. Set `WAREHOUSE_PINCODE` to Essar Bakery/Tofaah's actual dispatch pincode —
   this is used as the "from" pincode in every serviceability check

### Deployment checklist (Vercel)
1. Push the repo to GitHub (as before)
2. Import the repo in Vercel → add **every** var from `.env.example` under
   Project Settings → Environment Variables (both `NEXT_PUBLIC_*` and server-only ones)
3. Set `NEXT_PUBLIC_SITE_URL` to your real production domain — it's used in the
   sitemap, robots.txt, Cashfree return URL, and Organization schema
4. Deploy Firestore/Storage rules separately: `firebase deploy --only firestore:rules,storage:rules`
   (Vercel doesn't do this — it's a separate `firebase-tools` command)
5. After the first deploy, register the Razorpay webhook (see above) — it can only
   point at a live URL, not localhost
6. Switch `CASHFREE_ENV`/`NEXT_PUBLIC_CASHFREE_ENV` from `TEST` to `PROD` once
   Cashfree approves your live account
7. Run `npm run seed` against production Firestore once (or replace with real
   catalog data via the admin panel) so the storefront isn't empty on launch

### Known gaps / honest limitations
- Stock decrement uses a per-item Firestore transaction, not a single atomic
  multi-item transaction — extremely high concurrent purchases of the same
  low-stock item could theoretically still oversell by a unit or two. Fine at
  typical boutique traffic; revisit if this scales to flash-sale volumes.
- Partial COD is accepted as a payment method value but has no split-payment
  logic yet — it currently behaves identically to full COD.
- No automated tests. Given the scope of this build, add at least integration
  tests around `createOrder` and the payment verification routes before
  handling real customer money.
- Admin CMS/Lookbook/Reviews/Returns/Support/Newsletter/Payments-settings/SEO-settings/Roles
  sections are still placeholders (noted since Phase 5) — build these out as
  the business actually needs them rather than speculatively now.

## Roadmap

| Phase | Scope | Status |
|---|---|---|
| 1 | Architecture, types, Firestore schema, security rules | ✅ done |
| 2 | Design system (tokens, UI primitives) + Homepage | ✅ done |
| 3 | Authentication (Google/OTP/Email) | ✅ done |
| 4 | Database service layer (products, cart, wishlist hooks) | ✅ done |
| 5 | Admin Panel | ✅ done (MVP — see gaps above) |
| 6 | Storefront (PLP/PDP/search/filters) | ✅ done |
| 7 | Custom checkout flow | ✅ done |
| 8 | Shipping (Shiprocket/Delhivery) | ✅ done |
| 9 | Payments (Razorpay/Cashfree/Stripe) | ✅ done |
| 10 | SEO, analytics, deployment | ✅ done |

**All 10 phases are now scaffolded and wired together.** The codebase runs
end-to-end once you plug in your own Firebase project + payment/shipping
credentials — the honest gaps are listed above so nothing is a surprise at launch.

## Folder structure

```
src/
  app/
    (storefront)/       product, category, collections, cart, checkout, account, search
    (auth)/              login, register
    admin/               dashboard, products, orders, customers, coupons, cms, ...
    api/                 auth, products, orders, cart, payments/*, shipping/*, ...
  components/
    ui/                  buttons, inputs, modals — design-system primitives
    layout/              header, footer, nav
    storefront/          product cards, filters, PLP/PDP blocks
    checkout/            checkout-step components
    admin/               dashboard widgets, tables
  firebase/              client.ts (browser SDK), admin.ts (server SDK)
  types/                 firestore.ts — full typed schema
  services/              data-access layer (Firestore reads/writes), one file per domain
  hooks/                 useCart, useWishlist, useAuth, etc.
  store/                 Zustand stores (cart, ui state)
  utils/, constants/, config/, lib/, middleware/, styles/, emails/
firestore.rules
storage.rules
.env.example
```

## Setup

### 1. Firebase project
1. Create a project at console.firebase.google.com
2. Enable **Firestore** (production mode), **Authentication** (Email/Password, Google, Phone/OTP), **Storage**
3. Project Settings → General → add a Web App → copy the config into `.env.local` (`NEXT_PUBLIC_FIREBASE_*`)
4. Project Settings → Service Accounts → Generate new private key → copy `project_id`/`client_email`/`private_key` into `.env.local` (`FIREBASE_*`, no `NEXT_PUBLIC_` prefix)
5. Deploy rules: `firebase deploy --only firestore:rules,storage:rules`

### 2. Payments
- **Razorpay**: dashboard.razorpay.com → API Keys → Key/Secret into `.env.local`; set up a webhook pointing at `/api/payments/webhook` once Phase 9 ships
- **Cashfree**: merchant.cashfree.com → API keys (start in `TEST` mode)
- Stripe kept ready for international cards later (`STRIPE_*` optional for now)

### 3. Shipping
- **Shiprocket**: create account at shiprocket.in, note login email/password (used to fetch an auth token per API request)
- **Delhivery**: apply for API access, get client token

### 4. Install & run
```bash
npm install
cp .env.example .env.local   # fill in the values above
npm run dev
```

### 5. Deploy
- Push to GitHub → import repo in Vercel → add all `.env.local` values as Vercel Environment Variables → deploy
- Firebase rules deploy separately via `firebase-tools` (not through Vercel)

## Design tokens
Brand palette/type scale lives in two synced places — keep them identical if edited:
- `tailwind.config.ts` (for all UI)
- `src/config/brand.ts` (for emails/PDFs/non-Tailwind contexts)

## Notes for whoever picks this up
- Firestore security rules assume writes to `orders`, `payments`, `inventory` etc.
  happen through API routes using `firebase-admin` (`src/firebase/admin.ts`), not
  directly from the client — this is what lets rules stay simple and safe.
- `noUncheckedIndexedAccess` is on in `tsconfig.json` — array access is typed as
  possibly-undefined on purpose; don't silence it with `!`, handle the undefined case.
