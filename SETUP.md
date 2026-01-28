# Liimra Store Setup Guide

## Initial Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment Variables**
   
   Create a `.env` file in the root directory:
   ```env
   PUBLIC_STORE_DOMAIN=liimra.myshopify.com
   PUBLIC_STOREFRONT_API_TOKEN=your-storefront-api-token-here
   PUBLIC_STOREFRONT_API_VERSION=2024-10
   ```

   To get your Storefront API token:
   - Go to your Shopify Admin
   - Navigate to Settings > Apps and sales channels > Develop apps
   - Create a new app or use an existing one
   - Enable Storefront API access
   - Copy the Storefront API access token

3. **Start Development Server**
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:3000`

## Project Structure

```
app/
  components/          # Reusable React components
    sections/          # Page sections (Hero, HeritageStory, etc.)
  routes/              # Remix routes (pages)
  lib/                 # Utilities and server functions
    shopify.server.ts  # Shopify API client setup
    shopify-queries.ts # GraphQL queries
    shopify-fetcher.ts # Data fetching functions
    design-tokens.ts   # Design system tokens
  styles/              # Global styles
```

## Key Features Implemented

### ✅ 3D Features
- **360° Product Viewer**: Interactive product rotation with drag controls
- **MOA Animations**: Mechanism of action 3D cellular visualizations
- **Hero 3D Loop**: Cinematic floating product animation
- **Hover Parallax**: 3D tilting effects on interactive elements

### ✅ Animations
- **Scroll-Triggered Reveals**: Content animations on scroll
- **Scrollytelling**: Vertical narrative journey for heritage story
- **Lottie Integration**: Ready for animated icons

### ✅ E-commerce
- **Shopify Integration**: Storefront API connection
- **Product Pages**: Dynamic product routes
- **Cart Component**: Shopping cart UI (API integration pending)

### ✅ Performance & Accessibility
- **Lazy Loading**: 3D models load on demand
- **Responsive Design**: Mobile-optimized with fallbacks
- **WCAG AA Compliance**: Keyboard navigation, ARIA labels, skip links

## Next Steps

1. **Upload 3D Models to Shopify**
   - Upload GLB/GLTF files to Shopify Media Library
   - Add model URLs to product metafields (namespace: `custom`, key: `model_3d`)

2. **Complete Cart Integration**
   - Implement Shopify Cart API calls in `AddToCartButton`
   - Connect cart state management

3. **Add Lottie Animations**
   - Create or source Lottie animation files
   - Use `LottieIcon` component to display them

4. **Customize Content**
   - Update product data in Shopify
   - Add heritage story content
   - Customize color palette in `tailwind.config.js`

5. **Deploy to Oxygen**
   ```bash
   npm run build
   shopify hydrogen deploy
   ```

## Troubleshooting

### 3D Models Not Loading
- Ensure GLB/GLTF files are properly uploaded to Shopify
- Check that metafield namespace and key match (`custom.model_3d`)
- Verify model URLs are accessible

### API Errors
- Verify Storefront API token is correct
- Check that API version matches your Shopify plan
- Ensure store domain is correct (without `https://`)

### Build Errors
- Run `npm install` to ensure all dependencies are installed
- Check Node.js version (requires 18+)
- Clear `.oxygen` directory and rebuild

## Resources

- [Shopify Hydrogen Docs](https://shopify.dev/docs/storefronts/headless/hydrogen)
- [React Three Fiber Docs](https://docs.pmnd.rs/react-three-fiber)
- [Framer Motion Docs](https://www.framer.com/motion/)
- [Lottie Files](https://lottiefiles.com/)

