import {createStorefrontClient} from '@shopify/hydrogen-react';

// Types for environment variables
export interface ShopifyEnv {
  PUBLIC_STORE_DOMAIN?: string;
  PUBLIC_STOREFRONT_API_TOKEN?: string;
  PRIVATE_STOREFRONT_API_TOKEN?: string;
  PUBLIC_STOREFRONT_API_VERSION?: string;
}

// Module-scoped client and config (lazy initialized)
let client: ReturnType<typeof createStorefrontClient> | null = null;
let isConfigured = false;
let currentEnv: ShopifyEnv = {};

/**
 * Initialize the Shopify client with environment variables from Oxygen context
 * This should be called early in the request lifecycle (e.g., in entry.server.tsx)
 */
export function initializeShopify(env: ShopifyEnv): void {
  // Store the env for reference
  currentEnv = env;

  const storeDomain = env.PUBLIC_STORE_DOMAIN || '';
  // Prefer PRIVATE_STOREFRONT_API_TOKEN (more secure) but fallback to PUBLIC_STOREFRONT_API_TOKEN
  const publicStorefrontToken = env.PRIVATE_STOREFRONT_API_TOKEN || env.PUBLIC_STOREFRONT_API_TOKEN || '';
  const storefrontApiVersion = env.PUBLIC_STOREFRONT_API_VERSION || '2024-10';

  // Log environment variable status (without exposing sensitive tokens)
  const tokenSource = env.PRIVATE_STOREFRONT_API_TOKEN 
    ? 'PRIVATE_STOREFRONT_API_TOKEN' 
    : env.PUBLIC_STOREFRONT_API_TOKEN 
    ? 'PUBLIC_STOREFRONT_API_TOKEN' 
    : 'NONE';
  
  console.log('[Shopify Client] Initializing with:', {
    storeDomain: storeDomain || 'MISSING',
    tokenSource,
    tokenLength: publicStorefrontToken ? `${publicStorefrontToken.length} chars` : '0',
    apiVersion: storefrontApiVersion,
  });

  // Check if properly configured
  isConfigured = !!(storeDomain && publicStorefrontToken);

  if (!isConfigured) {
    const missing = [];
    if (!storeDomain) missing.push('PUBLIC_STORE_DOMAIN');
    if (!publicStorefrontToken) missing.push('PUBLIC_STOREFRONT_API_TOKEN or PRIVATE_STOREFRONT_API_TOKEN');
    console.warn(
      `[Shopify Client] Missing environment variables: ${missing.join(', ')}. ` +
      'Please configure these in your Oxygen deployment settings.'
    );
  }

  // Create the client (even with empty values for dev/fallback)
  try {
    client = createStorefrontClient({
      storeDomain,
      publicStorefrontToken,
      storefrontApiVersion,
    });
    
    if (isConfigured) {
      console.log('[Shopify Client] Successfully initialized:', {
        apiUrl: client.getStorefrontApiUrl(),
        configured: true,
      });
    } else {
      console.warn('[Shopify Client] Initialized with missing configuration - API calls may fail');
    }
  } catch (error) {
    console.error('[Shopify Client] Failed to create client:', error);
    throw error;
  }
}

/**
 * Get the Storefront API URL
 * Throws if not initialized
 */
export function getStorefrontApiUrl(): string {
  if (!client) {
    throw new Error('Shopify client not initialized. Call initializeShopify() first.');
  }
  return client.getStorefrontApiUrl();
}

/**
 * Get the public token headers for API requests
 * Throws if not initialized
 */
export function getPublicTokenHeaders(): Record<string, string> {
  if (!client) {
    throw new Error('Shopify client not initialized. Call initializeShopify() first.');
  }
  return client.getPublicTokenHeaders();
}

/**
 * Check if Shopify is properly configured
 */
export function isShopifyConfigured(): boolean {
  return isConfigured;
}

/**
 * Get the current environment (useful for debugging)
 */
export function getCurrentEnv(): ShopifyEnv {
  return currentEnv;
}

