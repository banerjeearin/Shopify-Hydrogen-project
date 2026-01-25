/**
 * Shopify Storefront API Configuration
 * This file centralizes all Shopify-related configuration
 */

export const shopifyConfig = {
  // Store domain (e.g., liimra.myshopify.com)
  storeDomain: import.meta.env.VITE_SHOPIFY_STORE_DOMAIN || '',

  // Storefront API public access token
  storefrontAccessToken: import.meta.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN || '',

  // API version
  apiVersion: import.meta.env.VITE_SHOPIFY_API_VERSION || '2024-10',

  // Language and currency defaults
  language: 'EN',
  country: 'IN', // India

  // Cart configuration
  cart: {
    expirationDays: 7,
    maxLineItems: 100,
  },

  // Feature flags
  features: {
    enable3DViewer: true,
    enableAR: false, // Augmented Reality (future feature)
    enableReviews: true,
  },
} as const;

/**
 * Validate that required Shopify credentials are configured
 */
export function validateShopifyConfig(): boolean {
  const { storeDomain, storefrontAccessToken } = shopifyConfig;

  if (!storeDomain || storeDomain === 'your-store.myshopify.com') {
    console.warn('⚠️ Shopify store domain not configured. Please update .env file.');
    return false;
  }

  if (!storefrontAccessToken || storefrontAccessToken === 'your_storefront_access_token_here') {
    console.warn('⚠️ Shopify Storefront API token not configured. Please update .env file.');
    return false;
  }

  return true;
}

/**
 * Get the full Shopify Storefront API URL
 */
export function getStorefrontApiUrl(): string {
  const { storeDomain, apiVersion } = shopifyConfig;
  return `https://${storeDomain}/api/${apiVersion}/graphql.json`;
}
