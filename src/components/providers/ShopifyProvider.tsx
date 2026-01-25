/**
 * ShopifyProvider Component
 * Wraps the application with Shopify Hydrogen React context
 * Provides access to Shopify Storefront API throughout the app
 */

import { ShopifyProvider as HydrogenShopifyProvider } from '@shopify/hydrogen-react';
import { ReactNode, useEffect } from 'react';
import { shopifyConfig, validateShopifyConfig } from '@/lib/shopify.config';

interface ShopifyProviderProps {
  children: ReactNode;
}

export function ShopifyProvider({ children }: ShopifyProviderProps) {
  useEffect(() => {
    // Validate configuration on mount
    const isValid = validateShopifyConfig();
    if (!isValid) {
      console.error(
        '❌ Shopify configuration is incomplete. Please configure your .env file with valid credentials.'
      );
    } else {
      console.log('✅ Shopify Storefront API connected successfully');
    }
  }, []);

  return (
    <HydrogenShopifyProvider
      storeDomain={shopifyConfig.storeDomain}
      storefrontToken={shopifyConfig.storefrontAccessToken}
      storefrontApiVersion={shopifyConfig.apiVersion}
      countryIsoCode={shopifyConfig.country}
      languageIsoCode={shopifyConfig.language}
    >
      {children}
    </HydrogenShopifyProvider>
  );
}
