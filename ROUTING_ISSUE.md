# Routing Issue - Blank Screen / 404 Errors

## Current Status
- ✅ Server running on port 3000
- ✅ All dependencies installed correctly
- ✅ React Router 7.9.2 configured
- ❌ All routes returning 404 Not Found
- ❌ Blank screen in browser

## Problem
Hydrogen 2025.7.3 with React Router 7 is not recognizing route files in `app/routes/`.

## Routes Created
- `app/routes/index.tsx` - Homepage
- `app/routes/about.tsx` - About page
- `app/routes/products.tsx` - Products listing
- `app/routes/products.$handle.tsx` - Product detail
- `app/routes/test.tsx` - Simple test route

All return 404.

## Possible Causes

1. **Route File Naming Convention**
   - Hydrogen 2025.7.x might require different file naming
   - May need `.tsx` vs `.ts` or different structure

2. **Missing Route Configuration**
   - Hydrogen might need a routes manifest file
   - May require explicit route registration

3. **Entry Point Issues**
   - `entry.server.tsx` or `entry.client.tsx` might need Hydrogen-specific setup
   - React Router 7 integration might be incomplete

4. **Build System Mismatch**
   - Vite config might not be properly scanning routes
   - Hydrogen plugin might need additional configuration

## Next Steps to Debug

1. **Check Browser Console**
   - Open DevTools (F12)
   - Look for JavaScript errors
   - Check Network tab for failed requests

2. **Verify Route Discovery**
   - Check if Hydrogen is scanning the routes directory
   - Look for route manifest or build output

3. **Test with Hydrogen CLI**
   - Try `shopify hydrogen routes` if available
   - Check Hydrogen documentation for route setup

4. **Compare with Hydrogen Template**
   - Create a fresh Hydrogen project with CLI
   - Compare route structure and configuration

## Temporary Workaround

To verify the server is working, check:
- GraphiQL: http://localhost:3000/graphiql
- Subrequest Profiler: http://localhost:3000/subrequest-profiler

If these work, the server is functional but routes aren't configured correctly.

