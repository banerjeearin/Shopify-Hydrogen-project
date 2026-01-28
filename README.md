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

- Node.js 18+ 
- npm or yarn
- Shopify store with Storefront API access

### Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your Shopify credentials:
```
PUBLIC_STORE_DOMAIN=your-store.myshopify.com
PUBLIC_STOREFRONT_API_TOKEN=your-storefront-api-token
PUBLIC_STOREFRONT_API_VERSION=2024-10
```

3. Start development server:
```bash
npm run dev
```

### Building for Production

```bash
npm run build
npm run preview
```

## Project Structure

```
app/
  components/          # Reusable React components
    sections/          # Page sections (Hero, HeritageStory, etc.)
  routes/              # Remix routes
  lib/                 # Utilities and server functions
  styles/              # Global styles
```

## Key Components

- `ProductViewer`: 360° interactive 3D product viewer
- `MOAAnimation`: Mechanism of action 3D animation component
- `HoverParallax`: 3D parallax effect on hover
- `ScrollReveal`: Scroll-triggered animation wrapper
- `HeritageStory`: Vertical scrollytelling section
- `Hero`: Cinematic 3D hero section

## Deployment

This project is configured for deployment to Shopify Oxygen. See the [Hydrogen documentation](https://shopify.dev/docs/storefronts/headless/hydrogen) for deployment instructions.

## License

Copyright © 2024 Liimra. All rights reserved.

