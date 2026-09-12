# Motoristo Clone – Frontend (Next.js + TypeScript, App Router)

Yeh sirf **frontend** scaffold hai. Backend baad me alag se add hoga
(data/*.ts files me abhi dummy/static data hai — jab API/backend ready ho
to inhe fetch calls se replace kar dein).

## Setup

```bash
npm install
npm run dev
```

App `http://localhost:3000` par chalega.

## Folder structure

```
src/
  app/                      -> Next.js App Router (routes)
    layout.tsx              -> Root layout (Header + Footer wrap)
    page.tsx                -> "/" home page
    globals.css
    features/
      page.tsx              -> "/features"
      [slug]/page.tsx        -> "/features/:slug"
    guides/
      page.tsx              -> "/guides"
      [slug]/page.tsx        -> "/guides/:slug"
    circuits/
      page.tsx              -> "/circuits"
      [country]/[slug]/page.tsx -> "/circuits/:country/:slug" (e.g. /circuits/uk/silverstone)
    tools/
      page.tsx              -> "/tools"
      [slug]/page.tsx        -> "/tools/:slug" (e.g. /tools/kw-to-hp-calculator)
    contact-us/page.tsx
    terms-and-conditions/page.tsx
    privacy-policy/page.tsx
    not-found.tsx           -> custom 404
    sitemap.ts
    robots.ts

  components/
    layout/                 -> Header, Footer, Navbar
    ui/                     -> generic reusable UI (Button, Card, ...)
    tools/                  -> calculator components (ek component per calculator)
    shared/                 -> baaki shared/reusable components

  lib/                      -> utils, helper functions
  types/                    -> shared TypeScript types
  data/                     -> static/dummy data (backend aane tak)
  hooks/                    -> custom React hooks
  styles/                   -> extra styles agar chahiye

public/
  images/
  icons/
```

## Notes

- Naya calculator add karna ho to:
  1. `src/components/tools/` me component banayein (e.g. `CornerWeightCalculator.tsx`)
  2. `src/data/tools.ts` me entry add karein
  3. `src/app/tools/[slug]/page.tsx` me slug ke hisaab se woh component render karein
- Tailwind pehle se config hai (`tailwind.config.ts`), agar styling Tailwind se karni ho.
- Jab backend ready ho jaye to `src/data/*.ts` ki jagah `fetch()`/API calls use kar lein
  (server components me directly `async function Page()` bana kar fetch kar sakte hain).
