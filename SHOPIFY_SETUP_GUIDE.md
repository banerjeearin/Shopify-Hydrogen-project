# Shopify Configuration Checklist

## Current Status

### ✅ What's Already Configured

1. **Environment Variable Template** (`.env.example`)
   - Located at: `/home/user/Shopify-Hydrogen-project/.env.example`
   - Contains all required variables
   - Properly documented with comments

2. **API Version**
   - ✅ **Default:** `2024-10` (stable version)
   - ✅ **Fallback:** Configured in `app/lib/shopify.server.ts:26`
   - ✅ **Validation:** Working correctly

3. **Security**
   - ✅ `.env` files are in `.gitignore`
   - ✅ Environment variables won't be committed to git
   - ✅ Server-only code properly separated

### ⚠️ What Needs Configuration

**You need to create a `.env` file with your actual Shopify credentials.**

---

## Step-by-Step Setup Guide

### Step 1: Get Your Shopify Credentials

#### A. Access Shopify Admin
1. Go to your Shopify store admin: `https://admin.shopify.com/store/YOUR-STORE-NAME`
2. Navigate to: **Settings** → **Apps and sales channels**

#### B. Create a Custom App
1. Click **"Develop apps"** (or "App and channel settings" → "App development")
2. If prompted, click **"Allow custom app development"**
3. Click **"Create an app"**
4. Name it: `Hydrogen Storefront` (or any name you prefer)
5. Click **"Create app"**

#### C. Configure Storefront API Access
1. Click **"Configure Storefront API scopes"**
2. Select the following scopes (minimum required):
   - ✅ `unauthenticated_read_product_listings` - Read products
   - ✅ `unauthenticated_write_checkouts` - Create carts/checkouts
   - ✅ `unauthenticated_read_checkouts` - Read cart data
3. Click **"Save"**
4. Click **"Install app"** and confirm

#### D. Get Your Access Token
1. Go to **"API credentials"** tab
2. Under **"Storefront API access token"**, click **"Reveal token once"**
3. **⚠️ IMPORTANT:** Copy this token immediately - you won't see it again!
4. Save it securely (you'll use it in Step 2)

#### E. Find Your Store Domain
- Your store domain is: `YOUR-STORE-NAME.myshopify.com`
- Example: `liimra-store.myshopify.com`

---

### Step 2: Create Local `.env` File

**In your project root directory**, create a `.env` file:

```bash
# Navigate to project root
cd /home/user/Shopify-Hydrogen-project

# Copy the example file
cp .env.example .env

# Edit the file with your credentials
nano .env  # or use your preferred editor
```

**Add your credentials:**

```env
# Your Shopify store domain (without https://)
PUBLIC_STORE_DOMAIN=your-store-name.myshopify.com

# Storefront API access token (from Step 1D)
PUBLIC_STOREFRONT_API_TOKEN=your_actual_token_here

# API version (keep as is unless Shopify recommends updating)
PUBLIC_STOREFRONT_API_VERSION=2024-10
```

**Replace:**
- `your-store-name.myshopify.com` → Your actual store domain
- `your_actual_token_here` → The token you copied in Step 1D

---

### Step 3: Verify Configuration

#### A. Check Environment Variables
```bash
# Make sure .env file exists and has correct values
cat .env | grep -v "^#" | grep -v "^$"
```

Should show your three variables with real values (not placeholders).

#### B. Test Local Development
```bash
npm install
npm run dev
```

Check the console output:
- ✅ **Good:** No warnings about missing variables
- ❌ **Bad:** Warning: "Missing Shopify environment variables"

#### C. Test API Connection
1. Open browser to: `http://localhost:3000/products`
2. You should see products from your Shopify store
3. If you see errors, check browser console and terminal

---

## Configuration Details

### Environment Variables Explained

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `PUBLIC_STORE_DOMAIN` | ✅ Yes | Your Shopify store URL | `my-store.myshopify.com` |
| `PUBLIC_STOREFRONT_API_TOKEN` | ✅ Yes | Storefront API access token | `shpat_1234abcd...` |
| `PUBLIC_STOREFRONT_API_VERSION` | ⚠️ Recommended | API version to use | `2024-10` |

**Note:** All variables are prefixed with `PUBLIC_` because they're exposed to the client-side code via Vite.

### API Version Information

**Current Version:** `2024-10` (October 2024)

**Why This Version:**
- ✅ Stable and well-tested
- ✅ Supports all cart operations
- ✅ Compatible with current Hydrogen version

**To Update:**
1. Check latest versions: https://shopify.dev/docs/api/release-notes
2. Update `PUBLIC_STOREFRONT_API_VERSION` in `.env`
3. Test thoroughly before deploying

---

## Troubleshooting

### Issue: "Missing Shopify environment variables"

**Cause:** `.env` file not found or variables not set

**Fix:**
```bash
# Check if .env exists
ls -la .env

# If not, create it
cp .env.example .env

# Edit with your credentials
nano .env
```

### Issue: "Failed to load products"

**Possible Causes:**
1. Wrong store domain
2. Invalid access token
3. Missing API scopes

**Fix:**
1. Verify domain format: `store-name.myshopify.com` (no `https://`)
2. Double-check token is correct and hasn't expired
3. Ensure all required scopes are enabled (Step 1C)

### Issue: Cart operations fail

**Cause:** Missing write permissions

**Fix:**
1. Go to Shopify Admin → Your App → Configure Storefront API scopes
2. Ensure these are checked:
   - ✅ `unauthenticated_write_checkouts`
   - ✅ `unauthenticated_read_checkouts`
3. Click Save and reinstall the app

### Issue: "CORS errors" in browser

**Cause:** Storefront API has CORS restrictions

**Fix:** This should not happen with proper Storefront API setup. If it does:
1. Verify you're using the Storefront API token (not Admin API)
2. Check that your app is properly installed in Shopify
3. Ensure you're making requests to the correct endpoint

---

## Security Best Practices

### ✅ DO:
- Keep `.env` file in `.gitignore` (already configured)
- Never commit API tokens to git
- Use separate tokens for development and production
- Rotate tokens periodically

### ❌ DON'T:
- Share your `.env` file
- Commit tokens to version control
- Use production tokens in development
- Share tokens in public channels

---

## Production Deployment

### For Production Environment

When deploying to production (Shopify Oxygen, Vercel, Netlify, etc.):

1. **Don't use `.env` file in production**
2. **Set environment variables in your hosting platform:**

#### Shopify Oxygen:
```bash
# Using Shopify CLI
shopify hydrogen env set PUBLIC_STORE_DOMAIN your-store.myshopify.com
shopify hydrogen env set PUBLIC_STOREFRONT_API_TOKEN your_token
shopify hydrogen env set PUBLIC_STOREFRONT_API_VERSION 2024-10
```

#### Vercel:
- Go to Project Settings → Environment Variables
- Add each variable

#### Netlify:
- Go to Site Settings → Environment Variables
- Add each variable

---

## Quick Reference

### File Locations
```
Project Root
├── .env                    # YOUR LOCAL CONFIG (create this)
├── .env.example            # Template (already exists)
├── app/
│   └── lib/
│       ├── shopify.server.ts     # Server config (reads .env)
│       ├── shopify-fetcher.server.ts  # API calls
│       └── shopify-cart.server.ts     # Cart operations
```

### Validation Code Location
- **File:** `app/lib/shopify.server.ts`
- **Lines:** 3-20 (environment validation)
- **Fallback:** Line 26 (API version fallback)

---

## Next Steps

After setting up `.env`:

1. ✅ Test locally: `npm run dev`
2. ✅ Test products page: `http://localhost:3000/products`
3. ✅ Test cart functionality: Add product to cart
4. ✅ Commit your code (`.env` won't be committed)
5. ✅ Deploy to production with environment variables

---

## Support

- **Shopify API Docs:** https://shopify.dev/docs/api/storefront
- **Hydrogen Docs:** https://shopify.dev/docs/custom-storefronts/hydrogen
- **API Release Notes:** https://shopify.dev/docs/api/release-notes

For help with this project: https://claude.ai/code/session_01XWixC662MhV6CtPVtny5yx
