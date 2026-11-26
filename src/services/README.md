# API integration boundary

`apiClient.js` is the shared transport layer for the future backend integration. It sends requests to `NEXT_PUBLIC_API_BASE_URL`, includes cookies for an HttpOnly-cookie authentication setup, parses JSON/text responses, and exposes consistent HTTP errors.

Do not add guessed endpoint paths here. Once the backend team supplies its API documentation, create feature services (for example `authService.js`, `orderService.js`, and `newsletterService.js`) using the exact paths, methods, request fields, and response shapes from that documentation.

Until then, the storefront continues to use its clearly labelled browser-only demo data. `NEXT_PUBLIC_USE_MOCK` is a mode flag for the integration phase; it does not turn the current demo into real authentication, email delivery, payments, or courier tracking.
