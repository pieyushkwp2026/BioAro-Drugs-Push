# BioAro Frontend

BioAro Frontend is a Vite + React storefront for the BioAro Drugs launch experience. It is structured for Shopify Storefront API commerce, market-aware content for `US`, `CA`, and `UK`, and static deployment on Vercel.

## What is in this repo

- React 19 + TypeScript single-page app
- Shopify Storefront product and cart integration with local preview fallbacks
- Market layer for `US`, `CA`, and `UK`
- New launch pages for policies, support, protocols, quality, FAQ, Living 2.0, and partners
- Docker and Docker Compose setup on port `5173`
- Vercel-ready SPA routing

## Core behavior

- `US` and `CA` share the `NA` experience region
- `GB` maps to the `UK` experience region
- Region resolution order is:
  1. saved manual override
  2. Geo-IP/bootstrap response
  3. browser-language fallback
- Product content is editorially structured so PDPs can show dosage, warnings, supplement facts, ingredients, FAQs, and market-aware disclaimer blocks
- If Shopify env vars are missing, the app falls back to preview catalog/cart behavior instead of crashing

## Requirements

- Node.js 20+ recommended
- npm 10+ recommended

## Environment variables

Use [.env.example](/home/vishant/Videos/bioaro-frontend_2/bioaro-frontend/.env.example) as the source of truth.

Required for live Shopify commerce:

- `VITE_SHOPIFY_DOMAIN`
- `VITE_SHOPIFY_STOREFRONT_TOKEN`

Optional:

- `VITE_SHOPIFY_USE_MOCK_DATA`
  - `true`: use preview catalog/cart fallbacks
  - `false`: use Shopify for live products and cart flow
- `VITE_MARKET_BOOTSTRAP_URL`
  - external endpoint returning initial market context for Geo-IP

## Local development

Install dependencies:

```bash
npm install
```

Start the dev server:

```bash
npm run dev
```

Notes:

- The repo is configured to run Vite with polling because this machine previously hit the Linux inotify watcher limit (`ENOSPC`).
- Default local app URL:
  - `http://127.0.0.1:5173`

## Available scripts

```bash
npm run dev
npm run build
npm run lint
npm run test
npm run preview
```

## Docker

Build the production image:

```bash
docker build -t bioaro-frontend .
```

Run it on port `5173`:

```bash
docker run --rm -p 5173:5173 bioaro-frontend
```

Or use Docker Compose:

```bash
docker compose up --build
```

## Vercel deployment

This repo is ready for Vercel free tier static hosting.

Recommended Vercel settings:

- Framework Preset: `Vite`
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

Also configure the production environment variables in Vercel:

- `VITE_SHOPIFY_DOMAIN`
- `VITE_SHOPIFY_STOREFRONT_TOKEN`
- `VITE_SHOPIFY_USE_MOCK_DATA=false`
- `VITE_MARKET_BOOTSTRAP_URL` if Geo-IP bootstrap is available

SPA routing is handled through [vercel.json](/home/vishant/Videos/bioaro-frontend_2/bioaro-frontend/vercel.json), so direct loads on nested routes continue to work.

## Private Git repo readiness

Before pushing to a private remote:

- keep `.env` out of git
- store production secrets only in Vercel or your deployment platform
- do not commit Shopify private/admin credentials; this frontend only needs the public Storefront token
- review content/proof/legal assets before enabling live claims or quality-document downloads

## Project structure

```text
src/
  components/
  data/
  hooks/
  lib/
    market/
    shopify/
  pages/
tests/
```

## Launch checklist

- Add real Shopify Storefront credentials
- Set `VITE_SHOPIFY_USE_MOCK_DATA=false`
- Confirm Shopify Markets for `US`, `CA`, and `GB`
- Provide live market bootstrap endpoint if Geo-IP is required
- Review all legal/policy/support copy
- Add real quality documents before exposing download cards

## Verification

The repo should pass:

```bash
npm run lint
npm run test
npm run build
```
# bioDrugs
# bioDrugs
