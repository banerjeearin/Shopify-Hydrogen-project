import {getStorefrontApiUrl, getPublicTokenHeaders, isShopifyConfigured} from './shopify.server';
import {PRODUCT_QUERY, PRODUCTS_QUERY, COLLECTIONS_QUERY} from './shopify-queries';
import type {
  GraphQLResponse,
  Product,
  ProductConnection,
  CollectionConnection,
} from './shopify.types';

// Configuration for fetch with timeout
const FETCH_TIMEOUT = 10000; // 10 seconds

/**
 * Validate input parameters to prevent injection attacks
 */
function validateHandle(handle: string): void {
  if (!handle || typeof handle !== 'string') {
    throw new Error('Invalid product handle');
  }
  // Shopify handles are lowercase alphanumeric with hyphens
  if (!/^[a-z0-9-]+$/.test(handle)) {
    throw new Error('Invalid product handle format');
  }
}

/**
 * Fetch with timeout and abort controller
 */
async function fetchWithTimeout(
  url: string,
  options: RequestInit,
  timeout: number = FETCH_TIMEOUT
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Request timeout - please try again');
    }
    throw error;
  }
}

/**
 * Fetch product by handle
 * @param handle - Product handle (URL-safe identifier)
 * @returns Product data or null if not found
 */
export async function fetchProduct(handle: string): Promise<Product | null> {
  if (!isShopifyConfigured()) {
    console.warn('Shopify not configured, returning null');
    return null;
  }

  validateHandle(handle);

  try {
    const response = await fetchWithTimeout(
      getStorefrontApiUrl(),
      {
        method: 'POST',
        headers: {
          ...getPublicTokenHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: PRODUCT_QUERY,
          variables: {handle},
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const json: GraphQLResponse<{product: Product | null}> = await response.json();

    if (json.errors && json.errors.length > 0) {
      console.error('GraphQL errors:', json.errors);
      throw new Error(json.errors[0].message);
    }

    return json.data.product;
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
}

/**
 * Fetch products with pagination
 * @param first - Number of products to fetch (max 250)
 * @param after - Cursor for pagination
 * @returns ProductConnection with products and pagination info
 */
export async function fetchProducts(
  first: number = 20,
  after?: string
): Promise<ProductConnection> {
  if (!isShopifyConfigured()) {
    console.warn('Shopify not configured, returning empty products');
    return {edges: [], pageInfo: {hasNextPage: false}};
  }

  // Validate pagination parameters
  if (first < 1 || first > 250) {
    throw new Error('First parameter must be between 1 and 250');
  }

  try {
    const response = await fetchWithTimeout(
      getStorefrontApiUrl(),
      {
        method: 'POST',
        headers: {
          ...getPublicTokenHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: PRODUCTS_QUERY,
          variables: {first, after},
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const json: GraphQLResponse<{products: ProductConnection}> = await response.json();

    if (json.errors && json.errors.length > 0) {
      console.error('GraphQL errors:', json.errors);
      throw new Error(json.errors[0].message);
    }

    return json.data.products;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
}

/**
 * Fetch collections
 * @param first - Number of collections to fetch
 * @returns CollectionConnection with collections
 */
export async function fetchCollections(first: number = 10): Promise<CollectionConnection> {
  if (!isShopifyConfigured()) {
    console.warn('Shopify not configured, returning empty collections');
    return {edges: [], pageInfo: {hasNextPage: false}};
  }

  if (first < 1 || first > 250) {
    throw new Error('First parameter must be between 1 and 250');
  }

  try {
    const response = await fetchWithTimeout(
      getStorefrontApiUrl(),
      {
        method: 'POST',
        headers: {
          ...getPublicTokenHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: COLLECTIONS_QUERY,
          variables: {first},
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const json: GraphQLResponse<{collections: CollectionConnection}> = await response.json();

    if (json.errors && json.errors.length > 0) {
      console.error('GraphQL errors:', json.errors);
      throw new Error(json.errors[0].message);
    }

    return json.data.collections;
  } catch (error) {
    console.error('Error fetching collections:', error);
    throw error;
  }
}

