# Myles Luxe starter

This repo now contains a Next.js storefront starter built directly from the `MYLES LUXE WEBSITE DEVELOPMENT BRIEF.pdf`.

## What is included

- Premium black-and-gold homepage
- Shop page with seeded product grid, filters, and quick view
- Dynamic product route with size guide, bundle section, sticky add-to-cart, and WhatsApp ordering
- Cart, checkout, contact, about, and order confirmation pages
- LocalStorage cart behavior across the app
- API routes for products, checkout quoting, Paystack initialization, and payment webhooks
- Prisma-based order persistence ready for Neon Postgres

## Run locally

```bash
npm run dev
```

Then open `http://localhost:3000`.

## Environment

Copy `.env.example` to `.env.local` and add your Neon and Paystack values:

```bash
DATABASE_URL=postgresql://...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
PAYSTACK_SECRET_KEY=...
ADMIN_PASSWORD=...
```

If the Paystack key is missing, checkout will still work up to initialization and then return a setup error instead of silently failing.

## Neon setup

1. Create a Neon Postgres project.
2. Copy the pooled Prisma connection string into `DATABASE_URL` in `.env.local`.
3. Run:

```bash
npx prisma db push
```

This will create the order tables used by checkout and webhook updates.

## Recommended next steps

1. Replace placeholder visuals with real brand photography and product images.
2. Add Paystack server-side verification on the confirmation flow, not just webhook-driven status updates.
3. Replace placeholder visuals with real product imagery and launch copy.
4. Add GA4, Meta Pixel, richer SEO metadata, and structured product data.
