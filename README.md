# Myles Luxe starter

This repo now contains a Next.js storefront starter built directly from the `MYLES LUXE WEBSITE DEVELOPMENT BRIEF.pdf`.

## What is included

- Premium black-and-gold homepage
- Shop page with seeded product grid, filters, and quick view
- Dynamic product route with size guide, bundle section, sticky add-to-cart, and WhatsApp ordering
- Cart, checkout, contact, about, and order confirmation pages
- LocalStorage cart behavior across the app
- API routes for products, checkout quoting, Paystack initialization, and payment webhooks
- File-backed order persistence for checkout records and payment status

## Run locally

```bash
npm run dev
```

Then open `http://localhost:3000`.

## Environment

Copy `.env.example` to `.env.local` and add the payment keys you want to use:

```bash
NEXT_PUBLIC_SITE_URL=http://localhost:3000
PAYSTACK_SECRET_KEY=...
```

If the Paystack key is missing, checkout will still work up to initialization and then return a setup error instead of silently failing.

## Recommended next steps

1. Replace placeholder visuals with real brand photography and product images.
2. Replace file-backed order storage with a database-backed model when you want multi-user durability.
3. Replace placeholder visuals with real product imagery and launch copy.
4. Add GA4, Meta Pixel, richer SEO metadata, and structured product data.
