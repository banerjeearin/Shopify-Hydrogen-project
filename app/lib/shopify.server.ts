import {createStorefrontClient} from '@shopify/hydrogen-react';

// Validate required environment variables
const requiredEnvVars = {
  storeDomain: process.env.PUBLIC_STORE_DOMAIN,
  publicStorefrontToken: process.env.PUBLIC_STOREFRONT_API_TOKEN,
  storefrontApiVersion: process.env.PUBLIC_STOREFRONT_API_VERSION,
};

// Check for missing environment variables
const missingVars = Object.entries(requiredEnvVars)
  .filter(([_, value]) => !value)
  .map(([key]) => key);

if (missingVars.length > 0) {
  console.warn(
    `Missing Shopify environment variables: ${missingVars.join(', ')}. ` +
    'Please check your .env file. Using fallback configuration for development.'
  );
}

const client = createStorefrontClient({
  storeDomain: requiredEnvVars.storeDomain || '',
  publicStorefrontToken: requiredEnvVars.publicStorefrontToken || '',
  // Use stable API version as fallback
  storefrontApiVersion: requiredEnvVars.storefrontApiVersion || '2024-10',
});

export const getStorefrontApiUrl = () => client.getStorefrontApiUrl();
export const getPublicTokenHeaders = () => client.getPublicTokenHeaders();

// Export a helper to check if Shopify is properly configured
export const isShopifyConfigured = () => {
  return !!(requiredEnvVars.storeDomain && requiredEnvVars.publicStorefrontToken);
};

