# HardWater Haircare — Next.js storefront

A responsive frontend prototype for the Hard-Water Haircare D2C store. The visual direction uses warm cream, muted peach, sage green, botanical imagery and editorial serif typography.

## Run locally

1. Install Node.js 18.17+.
2. Run `npm install` in this folder.
3. Run `npm run dev` and open http://localhost:3000.
4. For a production build run `npm run build` then `npm start`.

## Included routes

- `/` Home
- `/shop` Product listing, search, category filters and sorting
- `/products/[slug]` Product detail, quantity control, ingredient and usage tabs
- `/cart` Browser-persisted cart, quantity changes, removal, demo discount and totals
- `/checkout` Demo checkout (requires demo login; no payment is collected)
- `/login`, `/signup` Demo-only authentication screens
- `/account/orders`, `/account/orders/[orderId]` Demo order history, details and cancellation while Placed/Processing
- `/account/addresses` Browser-saved address book, reused at checkout
- `/track-order` Local lookup of demo orders by order number and checkout email/phone
- `/hard-water-guide`, `/faq`, `/quiz`
- Custom not-found page

## Demo data and API preparation

Product data, sample reviews, formatting and cart totals are in `src/lib/data.js`. Cart and demo account state are in `src/context/StoreContext.jsx`. Orders, saved addresses and newsletter signups are stored only in browser localStorage. The newsletter form does not send email. Authentication is simulated and does not verify passwords or store them. Order cancellation and tracking only update/read local demo data.

A shared request helper is prepared in `src/services/apiClient.js`. API endpoint paths and request/response shapes are intentionally not guessed: replace mock handlers only after the backend team supplies its API documentation. Create `.env.local` from `.env.example` when the API base URL and contract are available. Never put private keys or secrets in `NEXT_PUBLIC_*` variables.

## Before production launch

- Replace sample product details, prices, images, usage, ingredients and claims with approved brand content.
- Replace sample reviews with verified review data, or remove them.
- Confirm shipping threshold, discount rules, returns, delivery timing and order status rules.
- Connect real authentication, product/order APIs, newsletter provider, transactional email, courier tracking and payment gateway if included in the approved scope.
- Add approved privacy, terms, returns/refund and contact pages; configure production metadata, sitemap and robots rules for the real domain.
- Add server-side validation, order ownership checks, security controls and rate limiting.
- Run a full production build and test keyboard/screen-reader accessibility, mobile layouts, performance and end-to-end checkout flows.

## Important status

This is a frontend demo, not a production-ready commerce system. The frontend includes API integration preparation, but no live backend or payment provider is connected. All local demo data can be cleared by clearing this site's browser storage.
