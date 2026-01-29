# Server-Client Boundary Issue - Fix Summary

## Problem
The CI build was failing with the error:
```
[commonjs--resolver] Server-only module referenced by client
```

This occurred because React Router v7's file-based routing system was treating `.server.tsx` files in the routes folder as both client and server routes, causing Vite/Rollup to flag a client/server boundary violation.

## Root Cause
- React Router v7 picks up all `.tsx` files in the `app/routes/` folder for file-based routing
- Files with `.server.tsx` extension in the routes folder were being analyzed for both client and server contexts
- This caused the bundler to detect server-only module imports in what it considered potential client code
- The `.server.tsx` naming convention is meant for lib files, not route files

## Solution
1. **Renamed API route files** from `.server.tsx` to `.tsx`:
   - `api.cart.create.server.tsx` → `api.cart.create.tsx`
   - `api.cart.add.server.tsx` → `api.cart.add.tsx`
   - `api.cart.get.server.tsx` → `api.cart.get.tsx`
   - `api.cart.remove.server.tsx` → `api.cart.remove.tsx`
   - `api.cart.update.server.tsx` → `api.cart.update.tsx`

2. **Fixed CSS import** in `app/root.tsx`:
   - Changed: `import stylesheet from '~/styles/app.css';`
   - To: `import stylesheet from '~/styles/app.css?url';`
   - This prevents build errors with Vite's asset handling

## Key Insights
- ✅ `.server.ts` extension should be used for **lib files** that contain server-only logic (e.g., `shopify-fetcher.server.ts`, `shopify.server.ts`)
- ✅ API route files that only export server functions (action/loader) should use regular `.tsx` extension
- ✅ React Router determines whether code runs on server or client based on the export type (loader/action vs component)
- ✅ The vite.config.ts already has proper configuration to handle `.server.` files in the lib folder

## Files Changed
- `app/root.tsx` - Fixed CSS import
- `app/routes/api.cart.*.tsx` - Renamed from `.server.tsx` to `.tsx`

## Files Unchanged (Correctly)
- `app/lib/shopify-fetcher.server.ts` - Remains with `.server.ts` extension
- `app/lib/shopify-cart.server.ts` - Remains with `.server.ts` extension
- `app/lib/shopify.server.ts` - Remains with `.server.ts` extension
- `vite.config.ts` - Already has proper configuration for `.server.` files

## Verification
- ✅ Build completes successfully: `npm run build`
- ✅ No security vulnerabilities found: CodeQL analysis passed
- ✅ Server-only modules properly isolated from client bundle

## References
- [React Router File-based Routing](https://reactrouter.com/en/main/start/framework/routing)
- [Remix Server/Client Code Splitting](https://remix.run/docs/en/main/guides/vite#splitting-up-client-and-server-code)
- [Vite Asset Handling](https://vitejs.dev/guide/assets.html)
