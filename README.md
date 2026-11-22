# Trans-Sas web

The company's public website. Built with Vite, React 18, TypeScript and Tailwind v4, using a shadcn-style layout (`src/components/ui`).

It is a catalogue with a request cart, not a payment shop: customers pick products and send a request, and the sales team replies with a proforma invoice.

```
npm install
npm run dev      # http://localhost:5174 (the dashboard uses 5173)
npm run build
```

## Pages

`/` home (3D product stage hero) · `/shop` (category and search live in the URL) · `/shop/:slug` product detail · `/cart` · `/checkout` (send a request) · `/about` · `/services` · `/contact`

## Connection to the management system

The website is the front of [trans-sas-mgt](../trans-sas-mgt). Everything goes through `src/lib/api.ts`, which calls the system's public routes only:

| What | Where it comes from |
| --- | --- |
| Products, photos, categories | Stock Items marked **Show on website** (`GET /public/products`) |
| Product URL | Item code in lower case, e.g. `/shop/closed-infant-incubator` |
| Description, features | The stock item's description: first paragraph is the summary, lines starting `- ` are features |
| A sent request | Becomes a **draft proforma** in the dashboard and notifies the sales team (`POST /public/requests`). The customer sees the proforma number as their reference. |

Prices are never shown. The draft proforma takes them from Stock Items, and staff check it before issuing.

Setup:

1. Copy `.env.example` to `.env` and set `VITE_API_URL` to the API, including `/api/v1`.
2. On the API, list this website's origin in `WEBSITE_ORIGINS` (for example `http://localhost:5174`, or `https://www.trans-sas.com` in production).

Without `VITE_API_URL` the site runs offline from the bundled list in `src/data/catalog.ts`, and a request opens a pre-filled email to sales@trans-sas.com instead.

The contact form still opens an email; it does not reach the dashboard yet.
