import {createStorefrontClient} from '@shopify/hydrogen-react';

const client = createStorefrontClient({
  storeDomain: process.env.PUBLIC_STORE_DOMAIN || '',
  publicStorefrontToken: process.env.PUBLIC_STOREFRONT_API_TOKEN || '',
  storefrontApiVersion: process.env.PUBLIC_STOREFRONT_API_VERSION || '2025-07',
});

export const getStorefrontApiUrl = () => client.getStorefrontApiUrl();
export const getPublicTokenHeaders = () => client.getPublicTokenHeaders();

