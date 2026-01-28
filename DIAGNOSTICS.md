# Blank Screen Diagnostics

## Common Causes of Blank Screen in Hydrogen/Remix Apps

1. **JavaScript Errors in Browser Console**
   - Open browser DevTools (F12)
   - Check Console tab for errors
   - Common errors: Missing imports, undefined components, hydration mismatches

2. **Missing CSS**
   - Check if Tailwind CSS is loading
   - Verify `app/styles/app.css` is imported in `root.tsx`

3. **Client-Side Hydration Errors**
   - Check for mismatches between server and client rendering
   - Look for warnings about "Text content did not match"

4. **Missing Dependencies**
   - Ensure all packages are installed: `npm install`
   - Check for peer dependency warnings

## Quick Fixes

1. **Clear browser cache and hard refresh**: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)

2. **Check server is running**:
   ```bash
   lsof -ti:3000
   # Should return a process ID
   ```

3. **Restart dev server**:
   ```bash
   npm run dev
   ```

4. **Check for TypeScript errors**:
   ```bash
   npm run typecheck
   ```

## Current Status

- React Router version: 7.9.2 (correct for Hydrogen 2025.7.3)
- Remix config removed (not needed for Vite)
- All dependencies installed

