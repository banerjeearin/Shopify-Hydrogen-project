# Server/Client Boundary Issue - Technical Analysis

## The Problem

The build is failing with: **"Server-only module referenced by client"**

### Root Cause

The bundler (Vite) is analyzing the import graph and detecting that client-side code has a path to server-only modules:

```
Client Side (Browser)
  └─> products.tsx (route component)
       └─> loader function
            └─> import('~/lib/shopify-fetcher.ts')
                 └─> imports from './shopify.server.ts'  ❌ Server-only module
```

Even though:
- The import is dynamic (`await import()`)
- It's only used in the `loader` function (which runs server-side)
- We use `.server` naming conventions

The bundler still flags this as a potential security/architecture violation.

## Current Architecture

### Files Involved

1. **`shopify.server.ts`** - Contains environment variables (PUBLIC_STOREFRONT_API_TOKEN)
   - Must remain server-only for security
   - Cannot be bundled for client

2. **`shopify-fetcher.ts`** - Product/collection data fetching
   - Imports from `shopify.server.ts`
   - Used only in route loaders (server-side)

3. **Route files** (`products.tsx`, `products.$handle.tsx`)
   - Export both loader (server) AND component (client)
   - Use dynamic imports for `shopify-fetcher`
   - Bundler still analyzes these files for both contexts

## Attempted Solutions

✅ **What We've Tried:**
1. Added `.server.ts` extension to mark server-only modules
2. Used dynamic imports `await import()` in loaders
3. Renamed API routes to `.server.tsx`
4. Added Vite configuration for manual chunking
5. Added SSR optimizeDeps configuration
6. Removed `.server` extension from fetcher (current attempt)

❌ **Why They Haven't Worked:**
- The bundler performs static analysis before runtime
- Dynamic imports with `.server` modules still get flagged
- Route files that export components are analyzed for client bundling
- Vite/React Router may not fully support `.server` import chains

## Recommended Solutions

### Option 1: Complete API Separation (Recommended)

Split all data fetching into resource routes:

**Structure:**
```
app/routes/
  api.products.server.tsx          # Loader only, returns JSON
  api.product.$handle.server.tsx   # Loader only, returns JSON
  products.tsx                      # Component only, fetches from API client-side
  products.$handle.tsx              # Component only, fetches from API client-side
```

**Pros:**
- Complete separation of concerns
- No server/client boundary confusion
- Easy to understand and maintain

**Cons:**
- Loses SSR benefits (data fetching happens client-side)
- More files to manage
- Slightly worse performance (extra round trip)

### Option 2: Use Shopify's Official Client

Replace custom fetcher with `@shopify/hydrogen` Storefront API client:

```typescript
import {createStorefrontClient} from '@shopify/hydrogen';

// This client is designed to work in both contexts
const client = createStorefrontClient({
  storeDomain: PUBLIC_STORE_DOMAIN,
  publicStorefrontToken: PUBLIC_STOREFRONT_API_TOKEN,
});
```

**Pros:**
- Official Shopify solution
- Properly handles server/client boundaries
- Well-tested and maintained

**Cons:**
- Requires refactoring existing code
- May have different API than our custom fetcher

### Option 3: Split Route Files

Separate loaders and components into different files:

**Structure:**
```
app/routes/
  products/
    _layout.tsx           # Component only
    _loader.server.ts     # Loader only
    route.tsx             # Combines layout + loader
```

**Pros:**
- Clear separation
- Loaders can safely import `.server` modules
- Components never see server imports

**Cons:**
- More complex file structure
- May not be supported by React Router file routing

### Option 4: Configuration Fix (If Possible)

Contact Shopify support or check Hydrogen documentation for proper configuration of `.server` modules with React Router v7.

The issue may be:
- Missing Vite plugin configuration
- React Router dev plugin settings
- Hydrogen plugin options

## Testing

To test if the current approach works:

```bash
npm install
npm run build
```

If it fails with the same error, try Option 1 or Option 2.

## Next Steps

1. **Try building** with current configuration
2. **If it fails**, implement Option 1 (API separation) or Option 2 (Official client)
3. **Document** the chosen solution in README
4. **Consider** filing an issue with Shopify if this is a tooling limitation

## References

- [Remix Route Module](https://remix.run/docs/en/main/guides/routes#route-module)
- [Vite SSR Configuration](https://vitejs.dev/guide/ssr.html)
- [Shopify Hydrogen](https://shopify.dev/docs/custom-storefronts/hydrogen)
