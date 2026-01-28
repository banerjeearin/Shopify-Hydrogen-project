# Liimra E-Commerce Store

A modern, interactive e-commerce website built with Shopify Hydrogen, featuring advanced 3D product experiences, scroll-triggered animations, and immersive storytelling.

## Features

- **3D Product Viewers**: Interactive 360° product rotation with drag controls
- **Mechanism of Action (MOA) Animations**: 3D cellular-level ingredient interaction visualizations
- **Hover Parallax Effects**: Subtle 3D tilting on interactive elements
- **Scroll-Triggered Animations**: Smooth content reveals using Framer Motion
- **Scrollytelling**: Vertical narrative journey for heritage story
- **Lottie Iconography**: Lightweight animated icons and micro-interactions
- **Cinematic Hero Section**: Floating 3D product animation
- **Responsive Design**: Mobile-optimized with fallback experiences

## Tech Stack

- **Framework**: Shopify Hydrogen (React Router 7)
- **3D Rendering**: Three.js + React Three Fiber
- **Animations**: Framer Motion
- **Icons**: Lottie React
- **Styling**: Tailwind CSS
- **TypeScript**: Full type safety

## Getting Started

### Prerequisites

- Node.js 18.0.0 or higher
- npm (comes with Node.js) or yarn
- A Shopify store with Storefront API access

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Shopify-Hydrogen-project
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your Shopify credentials:
```
PUBLIC_STORE_DOMAIN=your-store.myshopify.com
PUBLIC_STOREFRONT_API_TOKEN=your-storefront-api-token
PUBLIC_STOREFRONT_API_VERSION=2024-10
```

**How to get Shopify API credentials:**
1. Log in to your Shopify Admin panel
2. Navigate to **Settings > Apps and sales channels > Develop apps**
3. Click **Create an app** or select an existing app
4. In the app configuration, go to **API credentials**
5. Under **Storefront API**, click **Configure** and enable the required access scopes
6. Copy the **Storefront API access token** and your store domain

4. Start development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Building for Production

```bash
npm run build
npm run preview
```

### Type Checking

```bash
npm run typecheck
```

## Project Structure

```
Shopify-Hydrogen-project/
├── app/
│   ├── components/           # Reusable React components
│   │   ├── sections/         # Page sections (Hero, HeritageStory)
│   │   ├── Cart.tsx          # Shopping cart UI
│   │   ├── Header.tsx        # Site navigation
│   │   ├── Footer.tsx        # Site footer
│   │   ├── ProductViewer.tsx # 3D product viewer
│   │   ├── MOAAnimation.tsx  # Mechanism of action animations
│   │   ├── HoverParallax.tsx # Parallax hover effects
│   │   ├── ScrollReveal.tsx  # Scroll animations wrapper
│   │   ├── LottieIcon.tsx    # Animated icon component
│   │   └── ...               # Other components
│   ├── routes/               # React Router routes
│   │   ├── index.tsx         # Home page
│   │   ├── products.tsx      # Products listing
│   │   ├── products.$handle.tsx  # Individual product page
│   │   └── about.tsx         # About page
│   ├── lib/                  # Utilities and server functions
│   │   ├── shopify.server.ts # Shopify server configuration
│   │   ├── shopify-queries.ts # GraphQL queries
│   │   ├── shopify-fetcher.ts # API fetching utilities
│   │   └── design-tokens.ts  # Design system tokens
│   ├── styles/               # Global styles
│   │   └── app.css           # Application CSS
│   ├── root.tsx              # Root component
│   ├── entry.client.tsx      # Client entry point
│   └── entry.server.tsx      # Server entry point
├── public/                   # Static assets
├── .env                      # Environment variables (not tracked)
├── .env.example              # Environment variables template
├── package.json              # Dependencies and scripts
├── vite.config.ts            # Vite configuration
├── tailwind.config.js        # Tailwind CSS configuration
├── tsconfig.json             # TypeScript configuration
├── shopify.app.toml          # Shopify app configuration
└── react-router.config.ts    # React Router configuration
```

## Key Components

- **`ProductViewer`**: 360° interactive 3D product viewer with drag controls
- **`MOAAnimation`**: Mechanism of action 3D animation component for visualizing ingredient interactions
- **`HoverParallax`**: 3D parallax effect on hover for interactive elements
- **`ScrollReveal`**: Scroll-triggered animation wrapper using Framer Motion
- **`HeritageStory`**: Vertical scrollytelling section for brand narrative
- **`Hero`**: Cinematic 3D hero section with floating product animation
- **`Cart`**: Shopping cart with add/remove functionality
- **`Header`**: Site navigation with cart integration
- **`Footer`**: Site footer with links and information

## Development Guidelines

### Code Style
- Use TypeScript for all new files
- Follow React best practices and hooks conventions
- Use Tailwind CSS utility classes for styling
- Prefer functional components over class components
- Keep components small and focused on single responsibilities

### Component Guidelines
- Place reusable components in `app/components/`
- Place page-specific sections in `app/components/sections/`
- Export components as named exports
- Include TypeScript prop types for all components

### File Naming
- Use PascalCase for component files (e.g., `ProductViewer.tsx`)
- Use kebab-case for utility files (e.g., `shopify-fetcher.ts`)
- Use lowercase for route files (e.g., `index.tsx`, `products.tsx`)

## Deployment

### Deploying to Shopify Oxygen

This project is configured for deployment to Shopify Oxygen, Shopify's hosting platform for Hydrogen storefronts.

**Deployment Steps:**

1. Install the Shopify CLI if you haven't already:
```bash
npm install -g @shopify/cli
```

2. Link your project to a Shopify store:
```bash
shopify hydrogen link
```

3. Build the project:
```bash
npm run build
```

4. Deploy to Oxygen:
```bash
shopify hydrogen deploy
```

For more detailed deployment instructions and configuration options, see the [Hydrogen deployment documentation](https://shopify.dev/docs/storefronts/headless/hydrogen/deployment).

### Alternative Deployment Options

Hydrogen storefronts can also be deployed to:
- Vercel
- Netlify
- Docker containers
- Any Node.js hosting platform

## Troubleshooting

### Common Issues

**Issue: `Module not found` errors**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Issue: TypeScript errors**
```bash
# Run type checking to see detailed errors
npm run typecheck
```

**Issue: Environment variables not loading**
- Ensure `.env` file exists in the project root
- Verify all required variables are set (see `.env.example`)
- Restart the development server after changing `.env`
- Environment variables must be prefixed with `PUBLIC_` to be available in the browser

**Issue: Shopify API errors (401 Unauthorized)**
- Verify your `PUBLIC_STOREFRONT_API_TOKEN` is correct
- Check that Storefront API is enabled in your Shopify app settings
- Ensure your store domain is correct (format: `store-name.myshopify.com`)

**Issue: 3D components not rendering**
- Check browser console for WebGL errors
- Ensure your browser supports WebGL 2.0
- Try disabling browser extensions that may interfere with 3D rendering

**Issue: Build fails**
```bash
# Clear build cache and rebuild
rm -rf .react-router build
npm run build
```

**Issue: Port 3000 already in use**
```bash
# Kill process on port 3000
npx kill-port 3000
# Or use a different port
PORT=3001 npm run dev
```

### Getting Help

If you encounter issues not covered here, check these resources:
- [Shopify Hydrogen Documentation](https://shopify.dev/docs/storefronts/headless/hydrogen)
- [React Router Documentation](https://reactrouter.com/)
- [Three.js Documentation](https://threejs.org/docs/)
- Review `DIAGNOSTICS.md`, `FIXES_APPLIED.md`, and `ROUTING_ISSUE.md` for project-specific troubleshooting

## Additional Documentation

This project includes additional documentation files:

- **`SETUP.md`** - Detailed setup instructions and configuration guide
- **`MIGRATION_GUIDE.md`** - Guide for migrating between versions
- **`DIAGNOSTICS.md`** - Diagnostic information for troubleshooting
- **`FIXES_APPLIED.md`** - History of fixes and solutions applied
- **`ROUTING_ISSUE.md`** - React Router specific issue resolutions
- **`QUICK_FIX.md`** - Quick reference for common fixes

## Browser Compatibility

This application is optimized for modern browsers:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

**Note:** 3D features require WebGL 2.0 support. Mobile devices will receive optimized experiences with fallbacks for unsupported features.

## Performance Considerations

- 3D components are lazy-loaded to improve initial page load
- Images should be optimized before uploading to Shopify
- Use Shopify's CDN for product images
- Framer Motion animations use GPU-accelerated transforms
- Code splitting is automatically handled by Vite

## Accessibility

This project includes accessibility features:
- Keyboard navigation support
- ARIA labels for interactive elements
- Skip-to-content links
- Semantic HTML structure
- Color contrast compliance

## Version Compatibility

| Package | Version | Notes |
|---------|---------|-------|
| Node.js | ≥18.0.0 | Required |
| npm | ≥9.0.0 | Recommended |
| React | ^18.3.1 | |
| React Router | ^7.9.2 | |
| TypeScript | ^5.3.3 | |
| Shopify Hydrogen | ^2025.7.3 | |
| Three.js | ^0.160.0 | |

## License

Copyright © 2024 Liimra. All rights reserved.
